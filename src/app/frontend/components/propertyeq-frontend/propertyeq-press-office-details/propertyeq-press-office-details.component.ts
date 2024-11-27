import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CONSTANTS } from 'src/app/models/constants';
import { CareerService } from '../../../services/career.service';
import { PropertyEqService } from '../../../services/property-eq.service';
import { CommonModule } from '@angular/common';
import { BannerBreadcrumbComponent } from '../../../shared/banner-breadcrumb/banner-breadcrumb.component';
import { QuickLinksComponent } from '../../../shared/quick-links/quick-links.component';
import { ShareButtonComponent } from '../../../shared/share-button/share-button.component';
import jsPDF from 'jspdf';
import { SharedModule } from '../../../../shared/shared.module';
import { HttpClient } from '@angular/common/http';
import { HeaderBannerBreadcrumbComponent } from 'src/app/frontend/shared/header-banner-breadcrumb/header-banner-breadcrumb.component';
import html2pdf from 'html2pdf.js';
import { EncryptionService } from 'src/app/services/encryption.service';

@Component({
  selector: 'app-propertyeq-press-office-details',
  templateUrl: './propertyeq-press-office-details.component.html',
  styleUrls: ['./propertyeq-press-office-details.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    QuickLinksComponent,
    BannerBreadcrumbComponent,
    ShareButtonComponent,
    RouterModule,
    SharedModule,
    HeaderBannerBreadcrumbComponent,
  ],
})
export class PropertyeqPressOfficeDetailsComponent {
  @ViewChild('pageContainer', { static: true }) pageContainer!: ElementRef;
  @ViewChild('printit', { static: false }) printit!: ElementRef;

  filter:any;
  formConfig: any;
  pressDetails: any;
  bannerDetails: any;
  recentPressDetails: any;
  bannerText = 'Press Office';
  bannerFullText = '';
  slug: any;
  urlData: any;
  typographyCss: string = '';
  articleCss: string = '';
  showShareIcon: boolean = false;
  loadingData: boolean = true;
  constructor(
    private pressService: PropertyEqService,
    private toasterService: ToastrService,
    private careerService: CareerService,
    private route: ActivatedRoute,
    private http: HttpClient,
    private encryptionService: EncryptionService,
    private router: Router
  ) {
    this.route.paramMap.subscribe((params) => {
      this.slug = params.get(CONSTANTS.ROUTE_ID);
      this.getPressDetails(this.slug);
      this.getRecentPress();
    });
  }

  async ngOnInit() {
    this.loadingData = true;
    this.getRecentPress();
    this.http
      .get('../../../../../assets/styles/typography.css', {
        responseType: 'text',
      })
      .subscribe((stylesheet) => {
        this.typographyCss = stylesheet;
      });
    this.http
      .get('../../../../../assets/styles/pdfStyles/pdfStyle.css', {
        responseType: 'text',
      })
      .subscribe((stylesheet) => {
        this.articleCss = stylesheet;
      });
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const clickedInside = this.pageContainer?.nativeElement.contains(
      event.target
    );
    if (!clickedInside) {
      this.onClickedOutside();
    }
  }

  onClickedOutside(): void {
    this.showShareIcon = false;
    this.updateIconStyles();
  }

  getBanner() {
    this.careerService
      .getBanner('PRESS_OFFICE_PAGE_BANNER')
      .subscribe((res: any) => {
        this.bannerDetails = res.data.Value;
      });
  }

  pressDetailsPage(press: any) {
    
    let formConfig = {
      id: press.Slug,
    };
    this.recentPressDetails.forEach((x: any) => {
      if (x == press) {
        x.show = false;
      } else {
        x.show = true;
      }
    });
    this.router.navigate(['/propertyeq/press-office/' + press.Slug]);
    this.getPressDetails(press.Slug);
    this.loadingData = false;
  }

  getRecentPress() {
    this.pressService.propertyEQgetRecentPress(this.slug, 3).subscribe({
      next: (res) => {
        this.sensData(res);
        this.loadingData = false; // Ensure loadingData is set to false after data is loaded
      },
      error: (error) => {
        this.toasterService.error(error.error.message);
      },
      complete: () => {
        this.loadingData = false; // Ensure loadingData is set to false after data is loaded
      },
    });
  }

  sensData(res: any) {
    if (res) {
      res.data.forEach((element: any) => {
        element.show = true;
      });
      this.recentPressDetails = res.data;
      
    }
  }

  getPressDetails(slug: any) {
    this.pressService.propertyEQPressDetails(slug, 3).subscribe({
      next: (res: any) => {
        this.urlData = {
          url: res.data.Slug,
          replacedUrl: res.data.Title,
        };
        // const el = document.createElement('div');
        // el.innerHTML = res.data.Content;
        // const allImg = el.querySelectorAll('img');
        // const alla = el.querySelectorAll('a');
        // allImg.forEach(img => {
        //     img.setAttribute('alt','press')
        // });
        // alla.forEach(a => {
        //   if(a.attributes.length==0){
        //     // Create a new span element
        //     const spanElement = document.createElement('span');
        //     // Copy the inner content from the anchor to the span
        //     spanElement.innerHTML = a.innerHTML;
        //     // Replace the anchor element with the span element in the DOM
        //     a.parentNode?.replaceChild(spanElement, a);
        //   }
        // });
        // res.data.Content = el.outerHTML; 
        this.pressDetails = res.data;
        if (res.data.MediaUrl != null) {
          this.bannerDetails = res.data.MediaUrl;
        } else {
          this.getBanner();
        }
        this.bannerText = res.data.Title ? res.data.Title : 'Press Office';
         // Ensure loadingData is set to false after data is loaded
      },
      error: (error: any) => {
        this.toasterService.error(error.error.message);
      },
      complete: () => {
        this.loadingData = false; // Ensure loadingData is set to false after data is loaded
      },
    });
  }

  getHovercolor(index: any) {
    let ele = document.getElementById('sens-data' + index) as HTMLElement;
    ele.style.color = '#fa0a0a';
    ele.style.marginLeft = '10px';
    ele.style.transition = '0.5s';
  }

  getLeavecolor(index: any) {
    let ele = document.getElementById('sens-data' + index) as HTMLElement;
    ele.style.color = '#000000';
    ele.style.marginLeft = '0px';
  }

  mediaQuery() {
    let data: any = {};
    data['pageName'] = 'press-office-details';
    /*this.router.navigate(['/press-office/media-enquiries'], {
      // relativeTo: this.route,
      state: { data },
    });*/
  }
  truncateWithEllipsis(text: string, maxLength: number): string {
    if (text.length > maxLength) {
      return text.substring(0, maxLength - 3) + '...';
    }
    return text;
  }
  clickedShareIcon(
    event: Event,
    buttonClicked: 'print' | 'download' | 'share'
  ) {
    event.stopPropagation(); // Stop the event from bubbling up

    if (buttonClicked === 'share') {
      this.showShareIcon = !this.showShareIcon;
      this.updateIconStyles();
    } else if (buttonClicked === 'print' || buttonClicked === 'download') {
      if (this.showShareIcon) {
        // If the share button is open, close it
        this.showShareIcon = false;
        this.updateIconStyles();
      }

      // Execute the respective function
      if (buttonClicked === 'print') {
        this.printPage();
      } else if (buttonClicked === 'download') {
        this.downloadPDF();
      }
    }
  }

  updateIconStyles() {
    const printIconContainer = document.querySelector(
      '.print-icon'
    ) as HTMLElement;
    const downloadIconContainer = document.querySelector(
      '.download-icon'
    ) as HTMLElement;

    if (printIconContainer && downloadIconContainer) {
      if (this.showShareIcon) {
        printIconContainer.style.opacity = '0.5';
        downloadIconContainer.style.opacity = '0.5';
      } else {
        printIconContainer.style.opacity = '1';
        downloadIconContainer.style.opacity = '1';
      }
    }
  }

  printPage() {
    const printContent = document.getElementById('printit')?.innerHTML;

    const printWindow = window.open('', 'PRINT', 'height=auto,width=1280');
    if (printWindow) {
      printWindow.document.write(`<html>
    <head>
      <title>${this.bannerText}</title>
      <style rel="stylesheet">${this.articleCss}</style>
      <style rel="stylesheet">${this.typographyCss}</style>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.3/css/bootstrap.min.css">
      <style>
        body {
          -webkit-print-color-adjust: exact;
        }
        .d-md-flex {
          display: flex!important;
          align-items: center !important;
        }
        .rd-indicator-content.rd-indicator-primary {
            border-bottom-color: #e6001c !important;
        }
        .rd-text-grey-mid, .rd-text-light {
          color: #999999 !important;
          font-size: 16px;
      }
      </style>

    </head>
    <body onload="window.print();window.close()">
      ${printContent}
    </body>
  </html>`);

      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 1000);
    }
  }

  downloadPDF() {
    const saveContent = document.getElementById('printit')?.innerHTML;
    if (saveContent) {
      const iframe = document.createElement('iframe');
      iframe.style.position = 'fixed';
      iframe.style.right = '0';
      iframe.style.bottom = '0';
      iframe.style.width = '0';
      iframe.style.height = '0';
      iframe.style.border = '0';

      document.body.appendChild(iframe);

      const doc = iframe.contentWindow?.document;
      if (doc) {
        doc.open();
        doc.write(`
          <html>
            <head>
              <title>${this.bannerText}</title>
              <style rel="stylesheet">${this.articleCss}</style>
              <style rel="stylesheet">${this.typographyCss}</style>
              <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.3/css/bootstrap.min.css">
              <style>
                body {
                  -webkit-print-color-adjust: exact;
                }
                .d-md-flex {
                  display: flex!important;
                  align-items: center !important;
                }
                .rd-indicator-content.rd-indicator-primary {
                    border-bottom-color: #e6001c !important;
                }
                .rd-text-grey-mid, .rd-text-light {
                  color: #999999 !important;
                  font-size: 16px;
                }
              </style>
            </head>
            <body>
              ${saveContent}
            </body>
          </html>`);
        doc.close();

        iframe.contentWindow?.focus();
        setTimeout(() => {
          iframe.contentWindow?.print();
          setTimeout(() => {
            document.body.removeChild(iframe);
          }, 1000);
        }, 1000);
      } else {
        console.error('Failed to create document in iframe');
      }
    } else {
      console.error('Save content not found');
    }
  }

  printPagePDF() {
    const element = document.getElementById('printit');
    if (element) {
      const options = {
        margin: [0.27, 0.5, 0.9, 0.5],
        filename: 'press release.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: [30, 14], orientation: 'portrait' },
      };

      html2pdf().from(element).set(options).save();
    }
  }

  onFilterTags(tagid: any, str:any) {
    this.filter = {...this.filter,
      Type: 2,
      PropertyEqCategoryId: str == 'EqCategoryId' ? tagid : null,
      Author: str == 'Author' ? tagid : null,
      PropertyEqTagId: str == 'PropertyEqTag' ? tagid : null,
    }
    const encryptedTagId = this.encryptionService.encrypt(this.filter);
    this.router.navigate(['/propertyeq'], { queryParams: { f: encryptedTagId } });
  }

}
