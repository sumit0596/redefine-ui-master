import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { EventService } from 'src/app/admin/services/event.service';
import { CareerService } from 'src/app/frontend/services/career.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { Observable, map, of } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { CircularService } from 'src/app/admin/services/circular.service';
import { DripDialogComponent } from '../drip-dialog/drip-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { CookieService } from 'ngx-cookie-service';
import { Location } from '@angular/common';
import { groupBy } from 'lodash-es';
import { CONSTANTS } from 'src/app/models/constants';

@Component({
  selector: 'app-circulars',
  templateUrl: './circulars.component.html',
  styleUrls: ['./circulars.component.scss'],
})
export class CircularsComponent {
  bannerDetails: any;
  filterForm!: FormGroup;
  circularDetails: any;
  quickLinks: any;
  bannerText = 'Circulars';
  breadcrumbLinks: any;
  totalRowsCount: any;
  pageCnt: any;
  pageNumber = 1;
  pageSize = 3;
  pageIndex: any;
  categoryList$!: Observable<any>;
  categoryList!: any[];
  slugId:any='';

  webcastDetails: any;

  filters = {
    Year: null,
    PageNo: 1,
    PerPage: 3,
  };
  searchText: string = '';
  range$!: Observable<any>;
  dripFilterStatus: any;
  latestYear: any;

  constructor(
    private careerService: CareerService,
    private fb: FormBuilder,
    private eventService: EventService,
    private circularService: CircularService,
    private toasterService: ToastrService,
    private route: ActivatedRoute,
    private router: Router,
    private commonService: CommonService,
    private dialog: MatDialog,
    private cookieService: CookieService,
    private location: Location
  ) {}

  ngOnInit() {
    this.breadcrumbLinks =
      this.eventService.getInvestorsRouterLinks('circulars');
    this.resetFilterForm();
    this.getBanner();
    this.quicklinks();
    let slug = '';
    //let fslug = this.route.snapshot.params['id'];
	 let fslug = this.route.firstChild?.snapshot?.params[CONSTANTS.ROUTE_ID];
    if (fslug != '' && fslug != undefined) {
	this.slugId = fslug;
      this.filters.Year = fslug;
    }
    this.getAllCirculars();
    this.getYear();
  }

  getBanner() {
    this.careerService
      .getBanner('CIRCULAR_PAGE_BANNER')
      .subscribe((res: any) => (this.bannerDetails = res.data.Value));
  }

  quicklinks() {
    this.eventService
      .getQuickLinks()
      .subscribe((res: any) => (this.quickLinks = res.data));
  }

  startYear = new Date().getFullYear();
  range: any = [];

  getYear() {
    // var startYear = year;
    // var currentYear = new Date('2005-01-01').getFullYear();
    // while (startYear >= currentYear) {
    //   this.range.push(startYear);
    //   startYear = startYear - 1;
    // }
    // this.range$ = of(this.range);
    this.circularService
      .getFilterYears()
      .pipe(
        map((res: any) => {
          let arr = [];
          for (const key in res.data) {
            if (res.data.hasOwnProperty(key)) {
              arr.push({ ...res.data[key], id: key });
            }
          }
          while (arr[0].YearStart <= arr[0].YearEnd) {
            this.range.push(arr[0].YearEnd);
            arr[0].YearEnd = arr[0].YearEnd - 1;
          }
          this.range$ = of(this.range);
        })
      )
      .subscribe();
  }

  paginate(event: any) {
    this.pageIndex = event.pageIndex;
    this.filters = {
      ...this.filters,
      PerPage: event.pageSize,
      PageNo: event.pageIndex + 1,
    };
    this.getAllCirculars();
    window.scrollTo(0, 0);
  }

  getAllCirculars(pageSize?: any, pageNumber?: any) {
    this.circularService.getAllFrontendCirculars(this.filters).subscribe({
      next: (res) => {
        this.circularData(res);
      },
      error: (error) => {
        this.toasterService.error(error.error.message);
      },
      complete: () => {},
    });
  }

  circularData(res: any) {
    if (res.circulars.length > 0) {
      this.latestYear = new Date(res.circulars[0]?.PublishDate).getFullYear();
      this.filterForm.get('Year')?.setValue(this.latestYear);
      //this.getYear(this.latestYear);
      res.circulars.forEach((element: any) => {
        element.Date =
          this.commonService.getFullMonth(element.Month) +
          ' ' +
          this.latestYear;
      });
      res.circulars = Object.entries(
        groupBy(res.circulars, (circular) => circular.Date)
      );
    //  this.location;
    //  this.location.go('investors/circulars/' + res.circulars[0][1][0].Year);
   /* this.router.navigate([
      'investors/circulars/' + res.circulars[0][1][0].Year,
    ]);*/
	  if(this.slugId == ''){
			this.router.navigate(
                [
                  'investors/circulars',
                  res.circulars[0][1][0].Year,
                ],
                { onSameUrlNavigation: 'reload' }
				// { replaceUrl: true }
              );
			  }
    } else {
      this.latestYear = this.filters.Year;
      if (this.filters.Year) {
      //  this.location.go('investors/circulars/' + this.filters.Year);
      /*this.router.navigate([
        'investors/circulars/' + this.filters.Year
      ]);*/
	  this.router.navigate(
                [
                  'investors/circulars',
                  this.filters.Year,
                ],
                { onSameUrlNavigation: 'reload' }
				// { replaceUrl: true }
              );
      } /*else {
        //this.location.go('investors/circulars');
       // this.router.navigate(['investors/circulars']);
	    this.router.navigate(
                [
                  'investors/circulars',
                 
                ],
                { onSameUrlNavigation: 'reload' }
				// { replaceUrl: true }
              );
      }*/
    }
    this.circularDetails = res.circulars;
  }

  getCircularData(event: any): void {
    this.circularService.getAllFrontendCirculars(this.filters).subscribe({
      next: (res) => {
        this.circularData(res);
      },
      error: (error: ErrorEvent) => {
        this.toasterService.error(error.error.message);
      },
      complete: () => {},
    });
  }

  filter(filterBy: any, event: any): void {
    this.filters.PageNo = 1;
    this.filters.Year = this.filterForm.get('Year')?.value;
	this.slugId='';
    this.getAllCirculars();
  }

  getHovercolor(index: any, month: any) {
    let ele = document.getElementById(
      'sens-data' + month + index
    ) as HTMLElement;
    ele.style.color = '#fa0a0a';
    ele.style.marginLeft = '20px';
    ele.style.transition = '0.5s';
    //ele.style.cursor = 'pointer';
  }

  getLeavecolor(index: any, month: any) {
    let ele = document.getElementById(
      'sens-data' + month + index
    ) as HTMLElement;
    ele.style.color = '#000000';
    ele.style.marginLeft = '0px';
  }

  clear() {
    this.resetFilterForm();
    this.filters.PageNo = 1;
    this.filters.PerPage = 3;
    this.filters.Year = null;
    this.getAllCirculars();
  }

  download(circular: any) {
    if (circular.Drip == 0) {
      if (circular.Pdf.includes('http')) {
        window.open(circular.Pdf, '_blank');
      } else {
        window.open('https://' + circular.Pdf, '_blank');
      }
    } else if (circular.Drip == 1) {
      this.dripFilterStatus = this.cookieService.get('DRIP_FILTER');
      if (this.dripFilterStatus == '') {
        const dialogRef = this.dialog.open(DripDialogComponent, {
          data: circular,
          height: '500px',
        });
        dialogRef.afterClosed().subscribe((result: any) => {});
      } else {
        if (circular.Pdf.includes('https')) {
          window.open(circular.Url, '_blank');
        } else {
          window.open('https://' + circular.Pdf, '_blank');
        }
      }
    }
  }

  resetFilterForm() {
    this.filterForm = this.fb.group({
      Year: [null],
    });
  }

  downloadPdf(item: any) {
    if (item.Drip == 0) {
      this.commonService.pdfDownload(item.Pdf);
      //this.openPdf(item);
    } else if (item.Drip == 1) {
      this.dripFilterStatus = this.cookieService.get('DRIP_FILTER');
      if (this.dripFilterStatus == '') {
        const dialogRef = this.dialog.open(DripDialogComponent, {
          minHeight: '500px',
          maxHeight: '80vh',
          data: item,
        });
        dialogRef.afterClosed().subscribe((result: any) => {
          if (result) {
            this.commonService.pdfDownload(item.Pdf);
            //this.openPdf(item);
          }
        });
      } else {
        this.commonService.pdfDownload(item.Pdf);
        //this.openPdf(item);
      }
    }
  }

  openPdf(item: any) {
    this.commonService.viewPdf(item.Pdf);
  }
  showShareIcon: boolean = false;

  clickedShareIcon(event: Event) {
    this.showShareIcon = !this.showShareIcon;
  }
}