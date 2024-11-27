import {
  Component,
  ElementRef,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { DashboardCampaignsService } from '../../services/dashboard-campaigns.service';
import { BehaviorSubject, Observable, of, tap } from 'rxjs';
import { DashboardService } from '../../services/dashboard.service';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { DashboardFilterComponent } from './shared/dashboard-filter/dashboard-filter.component';
import { environment } from 'src/environments/environment.dev';
import { LoaderService } from 'src/app/shared/services/loader/loader.service';
import { CampaignDataTableComponent } from './components/campaign-data-table/campaign-data-table.component';

@Component({
  selector: 'app-dashboard-campaigns',
  templateUrl: './dashboard-campaigns.component.html',
  styleUrls: ['./dashboard-campaigns.component.scss'],
})
export class DashboardCampaignsComponent implements OnInit {
  @ViewChild(DashboardFilterComponent)
  dashboardFilter!: DashboardFilterComponent;
  @ViewChild(CampaignDataTableComponent, { static: false })
  CampaignDataTableComponent!: CampaignDataTableComponent;

  pageSize: any = 10;
  pageIndex: any = 0;
  isLoadingDropdown = true;

  filter: any = {
    PageNo: 1,
    PerPage: 10,
    StartDate: '',
    EndDate: '',
    Days: 30,
    Campaign: '',
  };
  environment = environment;
  campCount: number = 0;
  selectedCampaignCount: number = 0;
  dropdownItems$!: Observable<any>;
  displayCampaignName: any;
  campaignList$: any;
  searchText: any = null;
  selectedCampaign: any;
  filter$: any;
  appliedFilter$: any;
  chartData$: any;
  displayContent: boolean = false;
  onSelected: boolean = true;
  selectedEventDays: any;
  selectedEventYears: any;
  isLoading!: boolean;
  isLoadingTop20!: boolean;
  isLoadingContentSource!: boolean;
  isLoadingLeadsByStatusSector!: boolean;
  isLoadingLeadsByMechanismSector!: boolean;
  isLoadingSessionAnalytics!: boolean;
  leasingExecutives: any;
  properties: any;
  isResetAllow: boolean = false;
  resetFilter$: boolean = false;

  filterForm!: FormGroup;

  CampaignContent: any;
  LeadsByMedium: any;
  LeadsBySource: any;
  LeadsBySector: any;

  LeadsByStatus: any;
  LeadsByMechanism: any;
  sessions: any;
  errorMessage: string = '';
  chart: any;
  root: any;

  @ViewChild('chartId') chartId!: ElementRef;
  constructor(
    private renderer: Renderer2,
    private dashboardCampaigns: DashboardCampaignsService,
    private dashboardService: DashboardService,
    private fb: FormBuilder,
    private datePipe: DatePipe,
    private loaderService: LoaderService
  ) { }

  ngOnInit() {
    this.getDropDownList();
    this.chartData$ = of(undefined);
    this.selectedEventDays = 'Last 30 Days';
    this.chartData$ = this.dashboardService.getPropertyCount(1);
    this.filterForm = this.fb.group({
      Name: null,
    });
  }
  onLoadComponents() {
    if (this.filter.Campaign) {
      this.top20();
      this.contentSource();
      this.LeadsByStatusSector();
      this.sessionAnalytics();
    }
  }

  async getDropDownList() {
    this.dropdownItems$ = await this.dashboardCampaigns.getCampaignDropdown().pipe(
      tap(() => {
        this.isLoadingDropdown = false;
      })
    );;
  }

  onChange(event: any) {
    this.filter$ = event.Name;
    this.displayCampaignName = event.Name;
    this.filter.Campaign = event.Name;
    this.filter.Days = 30;

    if (this.filter.Campaign != undefined) {
      this.displayContent = true;
      this.onSelected = false;
      this.sessions = {};
      this.filter.StartDate = '';
      this.filter.EndDate = '';
      this.resetFilterApplied(true);

    }
  }

  captureAndPrintPDF(sectionId: string = '') {
    const printContents = document.querySelectorAll('#content');
    const headerElement = document.getElementById('stickyHeader');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 10; // Define the margin (in mm) on all sides
    const usablePageWidth = pageWidth - margin * 2;
    const usablePageHeight = pageHeight - margin * 2;

    let position = margin;
    let headerImgData: string | null = null;
    let isHeaderAdded = false; // Track if the header has been added

    const replaceClass = (oldClass: string, newClass: string) => {
      document.querySelectorAll(`.${oldClass}`).forEach((el) => {
        (el as HTMLElement).classList.replace(oldClass, newClass);
      });
    };

    const captureHeader = async () => {
      if (headerElement && !headerImgData) {
        try {
          const headerCanvas = await html2canvas(headerElement);
          headerImgData = headerCanvas.toDataURL('image/png');
        } catch (error) {
          console.error('Error capturing header', error);
          throw error;
        }
      }
    };

    const addHeader = () => {
      if (headerImgData && !isHeaderAdded) {
        // Only add header if not already added
        const headerImgProps = pdf.getImageProperties(headerImgData);
        const headerHeight =
          (headerImgProps.height * usablePageWidth) / headerImgProps.width;
        pdf.addImage(
          headerImgData,
          'PNG',
          margin,
          margin,
          usablePageWidth,
          headerHeight
        );
        position += headerHeight;
        isHeaderAdded = true; // Mark header as added
      }
    };

    const captureContent = async (element: HTMLElement) => {
      if (element.tagName.toLowerCase() === 'table') {
        await captureTable(element);
      } else {
        await captureElement(element);
      }
    };

    const captureElement = async (element: HTMLElement) => {
      try {
        const canvas = await html2canvas(element);
        const imgData = canvas.toDataURL('image/png');
        const imgProps = pdf.getImageProperties(imgData);
        const imgHeight = (imgProps.height * usablePageWidth) / imgProps.width;

        if (position + imgHeight > usablePageHeight) {
          pdf.addPage();
          position = margin;
          addHeader();
        }

        pdf.addImage(
          imgData,
          'PNG',
          margin,
          position,
          usablePageWidth,
          imgHeight
        );
        position += imgHeight;
      } catch (error) {
        console.error('Error capturing content', error);
        throw error;
      }
    };

    const captureTable = async (table: HTMLElement) => {
      const rows = table.querySelectorAll('tr');
      let currentRowIndex = 0;
      let currentTableHeight = 0;

      while (currentRowIndex < rows.length) {
        const row = rows[currentRowIndex] as HTMLElement;
        const rowCanvas = await html2canvas(row);
        const rowImgData = rowCanvas.toDataURL('image/png');
        const rowImgProps = pdf.getImageProperties(rowImgData);
        const rowImgHeight =
          (rowImgProps.height * usablePageWidth) / rowImgProps.width;

        // Check if the row fits on the current page
        if (position + rowImgHeight > usablePageHeight) {
          pdf.addPage();
          position = margin;
          addHeader(); // Add header on the new page
        }

        pdf.addImage(
          rowImgData,
          'PNG',
          margin,
          position,
          usablePageWidth,
          rowImgHeight
        );
        position += rowImgHeight;

        currentRowIndex++;
      }
    };

    const addSectionToPDF = async (index: number) => {
      if (index >= printContents.length) {
        pdf.save('document.pdf');
        this.printIt('document.pdf'); // Pass the correct pdfData to printIt
        return;
      }

      const section = printContents[index] as HTMLElement;
      await captureContent(section);
      await addSectionToPDF(index + 1);
    };

    const generatePDF = async () => {
      try {
        this.loaderService.show();

        // Replace the class before starting PDF generation
        replaceClass('height-box-type', 'height-pad-type');
        await captureHeader();
        addHeader();
        await addSectionToPDF(0);
      } catch (error) {
        console.error('Error generating PDF', error);
      } finally {
        // Use a timeout to ensure the class is added back after PDF generation
        setTimeout(() => {
          replaceClass('height-pad-type', 'height-box-type');
        }, 2000); // Adjust timeout as needed based on your content's complexity
        this.loaderService.hide();
      }
    };

    generatePDF();
  }

  printIt(pdfData: string) {
    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = '0';
    document.body.appendChild(iframe);

    iframe.onload = () => {
      const iframeWindow = iframe.contentWindow;
      if (iframeWindow) {
        iframeWindow.document.body.innerHTML = `<embed width="100%" height="100%" src="${pdfData}" type="application/pdf">`;
        // iframeWindow.print();
        setTimeout(() => {
          document.body.removeChild(iframe);
        }, 500); // Adjust the timeout as needed to ensure the print dialog is fully processed
      } else {
        console.error('iframe contentWindow is null');
      }
    };

    iframe.src = 'about:blank'; // Set the source to about:blank to ensure iframe loads
  }

  // captureAndPrintPDF(sectionId: string = '') {
  //   const printContents = document.querySelectorAll('#content');
  //   const headerElement = document.getElementById('stickyHeader');
  //   const pdf = new jsPDF('p', 'mm', 'a4');
  //   const pageWidth = pdf.internal.pageSize.getWidth();
  //   const pageHeight = pdf.internal.pageSize.getHeight();
  //   const margin = 10; // Define the margin (in mm) on all sides
  //   const usablePageWidth = pageWidth - margin * 2;
  //   const usablePageHeight = pageHeight - margin * 2;

  //   let position = margin;
  //   let headerImgData: string | null = null;

  //   const replaceClass = (oldClass: string, newClass: string) => {
  //     document.querySelectorAll(`.${oldClass}`).forEach((el) => {
  //       (el as HTMLElement).classList.replace(oldClass, newClass);
  //     });
  //   };

  //   const captureHeader = async () => {
  //     if (headerElement && !headerImgData) {
  //       try {
  //         const headerCanvas = await html2canvas(headerElement);
  //         headerImgData = headerCanvas.toDataURL('image/png');
  //       } catch (error) {
  //         console.error('Error capturing header', error);
  //         throw error;
  //       }
  //     }
  //   };

  //   const addHeader = () => {
  //     if (headerImgData) {
  //       const headerImgProps = pdf.getImageProperties(headerImgData);
  //       const headerHeight =
  //         (headerImgProps.height * usablePageWidth) / headerImgProps.width;
  //       pdf.addImage(
  //         headerImgData,
  //         'PNG',
  //         margin,
  //         margin,
  //         usablePageWidth,
  //         headerHeight
  //       );
  //       position += headerHeight;
  //     }
  //   };

  //   const captureContent = async (element: HTMLElement) => {
  //     try {
  //       const canvas = await html2canvas(element);
  //       const imgData = canvas.toDataURL('image/png');
  //       const imgProps = pdf.getImageProperties(imgData);
  //       const imgHeight = (imgProps.height * usablePageWidth) / imgProps.width;

  //       if (position + imgHeight > usablePageHeight) {
  //         pdf.addPage();
  //         position = 0;
  //         addHeader();
  //       }

  //       pdf.addImage(
  //         imgData,
  //         'PNG',
  //         margin,
  //         position,
  //         usablePageWidth,
  //         imgHeight
  //       );
  //       position += imgHeight;
  //     } catch (error) {
  //       console.error('Error capturing content', error);
  //       throw error;
  //     }
  //   };

  //   const addSectionToPDF = async (index: number) => {
  //     if (index >= printContents.length) {
  //       pdf.save('document.pdf');
  //       this.printIt('document.pdf'); // Pass the correct pdfData to printIt
  //       return;
  //     }

  //     const section = printContents[index] as HTMLElement;
  //     await captureContent(section);
  //     await addSectionToPDF(index + 1);
  //   };

  //   const generatePDF = async () => {
  //     try {
  //       this.loaderService.show();

  //       // Replace the class before starting PDF generation
  //       replaceClass('height-box-type', 'height-pad-type');
  //       await captureHeader();
  //       addHeader();
  //       await addSectionToPDF(0);
  //     } catch (error) {
  //       console.error('Error generating PDF', error);
  //     } finally {
  //       // Use a timeout to ensure the class is added back after PDF generation
  //       setTimeout(() => {
  //         replaceClass('height-pad-type', 'height-box-type');
  //       }, 2000); // Adjust timeout as needed based on your content's complexity
  //     }
  //     this.loaderService.hide();
  //   };

  //   generatePDF();
  // }

  // printIt(pdfData: string) {
  //   const iframe = document.createElement('iframe');
  //   iframe.style.position = 'fixed';
  //   iframe.style.right = '0';
  //   iframe.style.bottom = '0';
  //   iframe.style.width = '0';
  //   iframe.style.height = '0';
  //   iframe.style.border = '0';
  //   document.body.appendChild(iframe);

  //   iframe.onload = () => {
  //     const iframeWindow = iframe.contentWindow;
  //     if (iframeWindow) {
  //       iframeWindow.document.body.innerHTML = `<embed width="100%" height="100%" src="${pdfData}" type="application/pdf">`;
  //       // iframeWindow.print();
  //       setTimeout(() => {
  //         document.body.removeChild(iframe);
  //       }, 500); // Adjust the timeout as needed to ensure the print dialog is fully processed
  //     } else {
  //       console.error('iframe contentWindow is null');
  //     }
  //   };

  //   iframe.src = 'about:blank'; // Set the source to about:blank to ensure iframe loads
  // }

  captureAndPrintPDF_OLD(sectionId: string) {
    const printContent = document.getElementById(sectionId);
    if (printContent) {
      html2canvas(printContent)
        .then((canvas) => {
          const imgData = canvas.toDataURL('image/png');
          const pdf = new jsPDF('p', 'mm', 'a4');

          // Assuming your content fits a single A4 page
          const imgProps = pdf.getImageProperties(imgData);
          const pdfWidth = pdf.internal.pageSize.getWidth();
          const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

          pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
          pdf.save('document.pdf');
        })
        .catch((error) => {
          console.error('Error generating PDF', error);
        });
    } else {
      console.error(`Element with id ${sectionId} not found`);
    }
  }

  top20() {
    this.isLoading = true;
    this.filter.PerPage = 20;
    this.dashboardCampaigns.getTop20(this.filter).subscribe({
      next: (res: any) => {
        this.properties = res.data.Properties;
        this.leasingExecutives = res.data.LeasingExecutive;
        this.isLoading = false;
      },
      error: (err: any) => {
        this.errorMessage = 'Failed to load data. Please try again later.';
        this.isLoading = false;
      },
    });
  }

  contentSource() {
    this.isLoading = true;
    this.dashboardCampaigns.getContentType(this.filter).subscribe({
      next: (res: any) => {
        this.CampaignContent = res.data.CampaignContent;
        this.LeadsByMedium = res.data.LeadsByMedium;
        this.LeadsBySource = res.data.LeadsBySource;
        this.isLoading = false;
      },
      error: (err: any) => {
        this.isLoading = false;
      },
    });
  }

  LeadsByStatusSector() {
    this.isLoadingLeadsByStatusSector = true;
    this.isLoadingLeadsByMechanismSector = true;
    this.isLoading = true;
    this.dashboardCampaigns
      .getAnalyticsCampaignLeadByStatus(this.filter)
      .subscribe({
        next: (res: any) => {
          this.LeadsBySector = res.data.LeadsBySector;
          this.LeadsByStatus = res.data.LeadsByStatus;
          this.LeadsByMechanism = res.data.LeadsConversion;
          this.isLoadingLeadsByStatusSector = false;
          this.isLoadingLeadsByMechanismSector = false;
        },
        error: (err: any) => {
          this.isLoading = false;
          this.isLoadingLeadsByStatusSector = false;
          this.isLoadingLeadsByMechanismSector = false;
        },
      });
  }

  sessionAnalytics() {
    this.isLoading = true;
    this.dashboardCampaigns.getAnalyticsCampaign(this.filter).subscribe({
      next: (res: any) => {
        this.sessions = res.data;
        this.isLoading = false;
      },
      error: (err: any) => {
        this.isLoading = false;
      },
    });
  }

  dashboarRefresh(ev: MouseEvent) {
    ev.stopPropagation();
    this.appliedFilter$ = { ...this.filter, Refresh: true };
    this.onLoadComponents();
  }

  handleFilterApplied(isApplied: any) {
    isApplied
      ? (this.isResetAllow = true) &&
      this.CampaignDataTableComponent?.triggerClearDataFilter()
      : false;
  }

  resetFilterApplied(reset: any) {
    this.filter.Days = 30;
    this.dashboardFilter.selectedDay = 'Last 30 Days' || undefined;
    this.selectedEventYears = '';
    this.selectedEventDays = 'Last 30 Days';
    this.filter.StartDate = '';
    this.filter.EndDate = '';
    this.isResetAllow = false;
    this.resetFilter$ = true;
    this.dashboardFilter.resetSelectInput();
    this.CampaignDataTableComponent?.triggerClearDataFilter();
    this.filterData(this.filter);
  }

  filterData(filter: any) {
    this.filter = filter;
    this.appliedFilter$ = { ...filter };
    if (filter.StartDate && filter.EndDate) {
      const startDate = this.datePipe.transform(filter.StartDate, 'yyyy/MM/dd');
      const endDate = this.datePipe.transform(filter.EndDate, 'yyyy/MM/dd');
      this.selectedEventYears = `${startDate} - ${endDate}`;
      this.selectedEventDays = '';
    }
    this.onLoadComponents();
  }

  selectedEventFilter(day: any) {
    if (day !== 'Custom Date') {
      this.selectedEventDays = day;
    }
  }

  clearData(e: any) {
    e ? (this.displayContent = false) : true;
    this.resetFilterApplied(true);
    this.onSelected = true;
  }
}
