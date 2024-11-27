import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
} from '@angular/core';
import { BreadcrumbsComponent } from '../../../shared/breadcrumbs/breadcrumbs.component';
import { BannerBreadcrumbComponent } from '../../../shared/banner-breadcrumb/banner-breadcrumb.component';
import { ActivatedRoute, Route, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { QuickLinksComponent } from 'src/app/frontend/shared/quick-links/quick-links.component';
import { ShareButtonComponent } from 'src/app/frontend/shared/share-button/share-button.component';
import { CONSTANTS } from 'src/app/models/constants';
import { ToastrService } from 'ngx-toastr';
import { CareerService } from 'src/app/frontend/services/career.service';
import { PropertyEqService } from 'src/app/frontend/services/property-eq.service';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SharedModule } from '../../../../shared/shared.module';
import { HttpClient } from '@angular/common/http';
import { HeaderBannerBreadcrumbComponent } from 'src/app/frontend/shared/header-banner-breadcrumb/header-banner-breadcrumb.component';
import html2pdf from 'html2pdf.js';
import { EncryptionService } from 'src/app/services/encryption.service';
@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.scss'],
  standalone: true,
  imports: [
    BreadcrumbsComponent,
    HeaderBannerBreadcrumbComponent,
    BannerBreadcrumbComponent,
    CommonModule,
    QuickLinksComponent,
    ShareButtonComponent,
    RouterModule,
    MatTooltipModule,
    SharedModule,
  ],
})
export class ArticleComponent implements OnInit {
  filter:any;
  bannerDetails: any;
  bannerText = 'Articles';
  breadcrumbLinks: any;
  articleId: string = '';
  bannerFullText: string = '';
  articleDetails: any;
  urlData: any;
  recentArticleDetails: any;
  showShareIcon: boolean = false;
  slug: any;
  imagePlaceholder: string = 'assets/images/property-default-image.jpg';
  imagePlaceholderImage: string = 'assets/images/image-placeholder.png';
  styleString: string = '';
  bannerCss: string = '';
  articleCss: string = '';
  buttonCss: string = '';
  layoutCss: string = '';
  typographyCss: string = '';
  bannerimage: string = '';
  loadingData: boolean = true;

  // filter: any = {
  //   Type: 2,
  //   PropertyEqCategoryId: '',
  // };

  constructor(
    private route: ActivatedRoute,
    private articleService: PropertyEqService,
    private toasterService: ToastrService,
    private careerService: CareerService,
    private router: Router,
    private http: HttpClient,
    private encryptionService: EncryptionService,
    private elementRef: ElementRef
  ) {}

  ngOnInit(): void {
    this.loadingData = true;
    this.route.paramMap.subscribe((params) => {
      this.slug = params.get(CONSTANTS.ROUTE_ID);
      this.getArticleDetails(this.slug);
      this.getRecentArticle();
    });
    
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
    // this.getBanner();
    //this.articleId= this.route.snapshot.paramMap.get("id") || '';
  }

  // getBanner() {
  //   this.careerService
  //     .getBanner('PEQ_ARTICLE_PAGE_BANNER')
  //     .subscribe((res: any) => (this.bannerDetails = res.data.Value));
  // }
  @ViewChild('savePage', { static: true }) savePage!: ElementRef;
  @ViewChild('printit', { static: false }) printit!: ElementRef;

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const clickedInside = this.savePage?.nativeElement.contains(event.target);
    if (!clickedInside) {
      this.onClickedOutside();
    }
  }

  onClickedOutside(): void {
    this.showShareIcon = false;
    this.updateIconStyles();
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
        @media print {
          @page {
            size: auto;
            margin: 20mm;
          }
          body {
            margin: 0;
            -webkit-print-color-adjust: exact;
          }
        }
        </style>
      </head>
      <body onload="window.print()">
        ${printContent}
      </body>
    </html>`);

      printWindow.document.close();
      printWindow.focus();
    }
  }

  printPagePDF() {
    const element = document.getElementById('printit');
    if (element) {
      const options = {
        margin: [0.27, 0.5, 0.9, 0.5],
        filename: 'article.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: [30, 14], orientation: 'portrait' },
      };

      html2pdf().from(element).set(options).save();
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

  generateContentWindow(content: string): Window | null {
    const contentWindow = window.open('', '_blank', 'height=auto,width=1280');

    if (contentWindow) {
      contentWindow.document.write(`
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
          ${content}
        </body>
      </html>`);
      contentWindow.document.close();
      contentWindow.focus();
    }

    return contentWindow;
  }

  getArticleDetails(slug: any) {
    this.articleService.getArticlesDetails(slug).subscribe({
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
        this.bannerDetails = res.data.MediaUrl;
        this.bannerText = res.data.Title;
        this.articleDetails = res.data;
        this.loadingData = false;
      },
      error: (error: any) => {
        this.toasterService.error(error.error.message);
      },
    });
  }

  getRecentArticle() {
    this.articleService.propertyEQgetRecentarticle(this.slug, 2).subscribe({
      next: (res) => {
        this.articleData(res);
        
      },
      error: (error) => {
        this.toasterService.error(error.error.message);
      },
      complete: () => {},
    });
  }

  articleData(res: any) {
    if (res) {
      
      res.data.forEach((element: any) => {
        element.show = true;
      });
      this.recentArticleDetails = res.data;
      
    }
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

  articleDetailsPage(article: any) {
    let formConfig = {
      id: article.Slug,
    };
    this.recentArticleDetails.forEach((x: any) => {
      if (x == article) {
        x.show = false;
      } else {
        x.show = true;
      }
    });
    this.router.navigate(['/propertyeq/articles/' + article.Slug]);
    this.getArticleDetails(article.Slug);
    
  }
  mediaQuery() {
    let data: any = {};
    data['pageName'] = 'aticles-details';
    /*this.router.navigate(['/press-office/media-enquiries'], {
      // relativeTo: this.route,
      state: { data },
    });*/
  }
  onFilterTags(event:MouseEvent, tagid: any, str:any) {
    if(event){
      event.stopPropagation();
    }
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
