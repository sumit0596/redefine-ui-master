import { Component, Input, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Observable, of } from 'rxjs';
import { DashboardService } from 'src/app/admin/services/dashboard.service';
import { DashboardFilterComponent } from '../dashboard-filter/dashboard-filter.component';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-dashboard-tables',
  templateUrl: './dashboard-tables.component.html',
  styleUrls: ['./dashboard-tables.component.scss'],
})
export class DashboardTablesComponent {
  @ViewChild(DashboardFilterComponent)
  dashboardFilter!: DashboardFilterComponent;
  @Input('type') type!: any;
  reportsData: any;
  displayPerPage: number = 10;
  filter: any = {
    PageNo: 1,
    PerPage: this.displayPerPage,
    StartDate: '',
    EndDate: '',
    Days: 30,
    ExcludeStaff: 0,
  };
  jobApplicants: any;
  dashboardTablePanelOpenState: boolean = true;
  loading: boolean = false;
  accordianTitle: string = '';

  propertyConversion: any = [];
  downloadReports: any = [];
  propertyeqDatas: any = [];
  selectedEventDays!: string;
  filterApplied: boolean = false;
  moreProperties: boolean = false;
  moredownloadReports: boolean = false;
  refreshPropertyData!: any;
  recentConversionsPageNo: number = 1;
  downloadReportsPageNo: number = 1;
  propertyeqPageNo: number = 1;
  morePropertyeq: boolean = false;

  totalEq: any;
  constructor(
    private dashboardService: DashboardService,
    private toasterService: ToastrService
  ) {}

  ngOnInit() {
    this.loadData();
    this.selectedEventDays = 'Last 30 Days';
  }

  downloadConversionData() {
    // Temporarily set PerPage to a large number for downloading
    this.filter.PerPage = 1000;

    this.dashboardService.getAllPropertyConversions(this.filter).subscribe({
      next: (data) => {
        const completeData: Array<{ [key: string]: any }> = data.res;
        if (completeData.length === 0) {
          this.toasterService.error('No data available to download');
          return;
        }

        const filteredData = completeData.map(({ Url, ...rest }) => {
          // Reorder the keys in each object according to the desired sequence
          return {
            'Property Name': rest['PropertyName'],
            Views: rest['TotalViews'],
            Leads: rest['TotalLead'],
            'Conversion Rate': rest['Conversion'],
            'Gla': rest['Gla'],
          };
        });

        const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(filteredData);
        const wb: XLSX.WorkBook = {
          Sheets: { 'Conversion Data': ws },
          SheetNames: ['Conversion Data'],
        };
        const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });

        saveAs(
          new Blob([wbout], { type: 'application/octet-stream' }),
          'conversion_data.xlsx'
        );
      },
      error: (error) => {
        this.toasterService.error('Error fetching data for download');
      },
      complete: () => {
        // Reset PerPage to the original value after downloading
        this.filter.PerPage = this.displayPerPage;
      },
    });
  }

  loadData() {
    this.loading = true;
    switch (this.type) {
      case 'reports':
        this.accordianTitle = 'Most Viewed Reports';
        this.getReportsData();
        break;
      case 'jobList':
        this.accordianTitle = 'Applications by Job Listing';
        this.getJobApplicants();
        break;
      case 'property':
        this.accordianTitle = 'Views and Leads by Property';
        this.getPropertyData();
        break;
      case 'propertyEq':
        this.accordianTitle = 'PropertyEQ';
        this.getPropertyEqData();
        break;
    }
  }
  //malik
  toScroll(id: any) {
    setTimeout(() => {
      // document.getElementById(id)?.lastElementChild?.scrollIntoView({
      /*document.getElementById(id)?.scrollIntoView({
            behavior: 'smooth', block: 'end',inline: 'nearest',
          });*/
      let scrollableDiv = document.getElementById(id);
      if (scrollableDiv != undefined || scrollableDiv != null) {
        scrollableDiv.scrollTop = scrollableDiv.scrollHeight;
      }
    }, 10);
  }
  getReportsData() {
    this.loading = true;
    this.downloadReports = [];
    this.dashboardService.getReportDownloads(this.filter).subscribe({
      next: (data) => {
        this.loading = false;
        this.downloadReports = data.res;
        this.moredownloadReports =
          this.downloadReports.length > 0 ? false : true;
      },
      error: (error) => {
        this.toasterService.error(error.error.message);
      },
    });
  }

  getPropertyData() {
    this.loading = true;
    this.propertyConversion = [];
    this.dashboardService.getPropertyConversion(this.filter).subscribe({
      next: (data) => {
        this.loading = false;
        this.propertyConversion = data.res;
        this.moreProperties = this.propertyConversion.length > 0 ? false : true;
      },
      error: (error) => {
        this.toasterService.error(error.error.message);
      },
    });
  }

  loadRecentConversions() {
    this.recentConversionsPageNo = this.recentConversionsPageNo + 1;
    this.filter.PageNo = this.recentConversionsPageNo;
    this.loading = true;
    this.dashboardService
      .getPropertyConversion(this.filter)
      .subscribe((data) => {
        if (data.res.length == 0) {
          this.moreProperties = true;
        } else if (this.propertyConversion.length > 0) {
          this.propertyConversion.push(...data.res);
        }
        this.loading = false;
        //malik
        this.toScroll('ViewsandEnquiriesbyProperty');
      });
  }

  loadDownloadReports() {
    this.downloadReportsPageNo = this.downloadReportsPageNo + 1;
    this.filter.PageNo = this.downloadReportsPageNo;
    this.loading = true;
    this.dashboardService.getReportDownloads(this.filter).subscribe((data) => {
      if (data.res.length == 0) {
        this.moredownloadReports = true;
      } else if (this.downloadReports.length > 0) {
        this.downloadReports.push(...data.res);
      }
      this.loading = false;
      //malik
      this.toScroll('MostViewedReports');
    });
  }

  getJobApplicants() {
    this.dashboardService.getJobApplicants(this.filter).subscribe({
      next: (data) => {
        this.loading = false;
        this.jobApplicants = data.res;
      },
      error: (error) => {
        error.error.errors
          ? this.displayError(error.error.errors)
          : this.toasterService.error(error.error.message);
      },
    });
  }

  getPropertyEqData() {
    this.loading = true;
    this.propertyConversion = [];
    this.dashboardService.getPropertyEqPerformance(this.filter).subscribe({
      next: (data) => {
        this.loading = false;
        this.propertyConversion = data.res;
        this.totalEq = data.Total;
        this.morePropertyeq = this.propertyConversion.length > 0 ? false : true;
      },
      error: (error) => {
        this.toasterService.error(error.error.message);
      },
    });
  }

  loadPropertyeq() {
    this.propertyeqPageNo = this.propertyeqPageNo + 1;
    this.filter.PageNo = this.propertyeqPageNo;
    this.loading = true;
    this.dashboardService
      .getPropertyEqPerformance(this.filter)
      .subscribe((data) => {
        if (data.res.length == 0) {
          this.morePropertyeq = true;
        } else if (this.propertyConversion.length > 0) {
          this.propertyConversion.push(...data.res);
        }
        this.loading = false;
        //malik
        this.toScroll('PropertyEQ');
      });
  }

  displayError(error: any) {
    let errors = JSON.parse(error);
    Object.keys(errors).forEach((err: any) => {
      this.toasterService.error(errors[err][0]);
    });
  }
  selectedEventFilter(day: any) {
    if (this.selectedEventDays !== undefined) {
      if (day !== 'Custom Date') {
        this.selectedEventDays = day;
      }
    }
  }
  handleFilterApplied(isApplied: boolean) {
    this.filterApplied = isApplied || this.filter.ExcludeStaff !== 0;
  }

  dateRangeSelect(range: any) {
    if (range.Days === 0) {
      const startDateParts = range.StartDate.split('-');
      const endDateParts = range.EndDate.split('-');
      const formattedStartDate = startDateParts.join('/');
      const formattedEndDate = endDateParts.join('/');
      this.selectedEventDays = formattedStartDate + ' - ' + formattedEndDate;
    }
  }

  filterData(filter: any) {
    if (filter.Days === 0) {
      this.dateRangeSelect(filter);
    } else {
      this.dateRangeSelect(filter);
    }
    if(filter.Days == 30 && filter.ExcludeStaff == 0){
      this.filterApplied = false
    } else {
      this.filterApplied = this.filter.ExcludeStaff !== 0 || Object.values(filter).some(value => value !== 0);
    }

    this.loading = true;
    this.filter = filter;
    this.filter.PageNo = 1;
    this.recentConversionsPageNo = 1;
    this.downloadReportsPageNo = 1;
    this.propertyeqPageNo = 1;
    this.loadData();
  }
  refreshFilter(ev: MouseEvent) {
    ev.stopPropagation();
    this.recentConversionsPageNo = 1;
    this.downloadReportsPageNo = 1;
    this.propertyeqPageNo = 1;
    this.filter = { ...this.filter, PageNo: 1 };
    this.loadData();
  }

  tablebadgereset(ev: MouseEvent) {
    ev.stopPropagation();
    this.filter = {
      ...this.filter,
      PageNo: 1,
      Days: 30,
      StartDate: '',
      EndDate: '',
      ExcludeStaff: 0,
    };
    this.recentConversionsPageNo = 1;
    this.downloadReportsPageNo = 1;
    this.propertyeqPageNo = 1;
    this.selectedEventDays = 'Last 30 Days';
    this.filterApplied = false; // Reset filterApplied to hide the badge
    this.dashboardFilter.resetSelectInput(); // Call resetSelectInput method
    this.loadData();
  }

  sortData(column: any, asc: any) {
    this.filter.SortBy = column;
    this.filter.SortOrder = asc;
    this.loadData();
  }
}
