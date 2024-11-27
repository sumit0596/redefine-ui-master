import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { EventService } from 'src/app/admin/services/event.service';
import { PresentationService } from 'src/app/admin/services/presentation.service';
import { CareerService } from 'src/app/frontend/services/career.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { Observable, map, of } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { CONSTANTS } from 'src/app/models/constants';
import { Location } from '@angular/common';

@Component({
  selector: 'app-presentation',
  templateUrl: './presentation.component.html',
  styleUrls: ['./presentation.component.scss'],
})
export class PresentationComponent {
  bannerDetails: any;
  filterForm!: FormGroup;
  presentationDetails: any;
  quickLinks: any;
  bannerText = 'Presentations and webcasts';
  breadcrumbLinks: any;
  totalRowsCount: any;
  pageCnt: any;
  pageIndex: any;
  categoryList$!: Observable<any>;
  categoryList!: any[];
  slugId: any = '';

  webcastDetails: any;

  filters = {
    Year: null,
    CategoryId: null,
    Search: '',
    // PageNo: 1,
    PerPage: 'all',
  };
  searchText: string = '';
  range$!: Observable<any>;

  constructor(
    private careerService: CareerService,
    private fb: FormBuilder,
    private eventService: EventService,
    private presentationService: PresentationService,
    private toasterService: ToastrService,
    private commonService: CommonService,
    private router: Router,
    private route: ActivatedRoute,
    private _location: Location
  ) {}

  ngOnInit() {
    this.breadcrumbLinks =
      this.eventService.getInvestorsRouterLinks('presentation');

    this.resetFilterForm();
    this.getBanner();
    this.quicklinks();
    let slug = '';
    //  let fslug = this.route.snapshot.params[CONSTANTS.ROUTE_ID];
    let fslug = this.route.firstChild?.snapshot?.params[CONSTANTS.ROUTE_ID];
    if (fslug != '' && fslug != undefined) {
      this.slugId = fslug;
      slug = fslug;
    }
    this.getAllPresentations(slug);
    this.getCategory();
    this.getYear();
  }

  getBanner() {
    this.careerService
      .getBanner('ANNOUNCEMENTS_PAGE_BANNER')
      .subscribe((res: any) => (this.bannerDetails = res.data.Value));
  }

  quicklinks() {
    this.presentationService
      .getQuickLinks()
      .subscribe((res: any) => (this.quickLinks = res.data));
  }

  startYear = new Date().getFullYear();
  range: any = [];

  getYear() {
    this.presentationService
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
      // PageNo: event.pageIndex + 1,
    };
    this.getAllPresentations();
    window.scrollTo(0, 0);
  }

  async getCategory() {
    this.categoryList$ = await this.presentationService.getCategories();
    this.categoryList$.subscribe({
      next: (res: any) => {
        this.categoryList = res.data;
      },
      error: (error: any) => {},
    });
  }

  getAllPresentations(slug: any = '') {
    this.presentationService
      .getAllFrontendPresentation(this.filters, slug)
      .subscribe({
        next: (res) => {
          this.presentationData(res, slug);
        },
        error: (error) => {
          this.toasterService.error(error.error.message);
        },
        complete: () => {},
      });
  }

  presentationData(res: any, slug: any = '') {
    if (res) {
      this.totalRowsCount = res.totalCount;
      this.pageCnt = res.pageCount;
      this.presentationDetails = res.presentations;
      this.webcastDetails = res.webcast;
      if (
        (this.presentationDetails != null &&
          this.presentationDetails != '' &&
          this.presentationDetails.length != 0) ||
        (this.webcastDetails != null &&
          this.webcastDetails != '' &&
          this.webcastDetails.length != 0)
      ) {
        this.filterForm
          .get('Year')
          ?.setValue(
            this.presentationDetails[0]?.PublishYear
              ? this.presentationDetails[0]?.PublishYear
              : this.webcastDetails[0]?.PublishYear
          );
        this.filters.Year = this.presentationDetails[0]?.PublishYear
          ? this.presentationDetails[0]?.PublishYear
          : this.webcastDetails[0]?.PublishYear;
        /* this._location.go(
            'investors/announcements-and-webcasts/' +
            (this.presentationDetails[0]?.PublishYear
              ? this.presentationDetails[0]?.PublishYear
              : this.webcastDetails[0]?.PublishYear)
          );*/
        if (this.slugId == '') {
          this.router.navigate(
            [
              'investors/announcements-and-webcasts',
              this.presentationDetails[0]?.PublishYear
                ? this.presentationDetails[0]?.PublishYear
                : this.webcastDetails[0]?.PublishYear,
            ],
            { onSameUrlNavigation: 'reload' }
            // { replaceUrl: true }
          );
          this.slugId = this.filters.Year;
        }
        // this.router.navigate([
        //   'investors/announcements-and-webcasts/' +
        //     (this.presentationDetails[0]?.PublishYear
        //       ? this.presentationDetails[0]?.PublishYear
        //       : this.webcastDetails[0]?.PublishYear),
        // ]);
      } else {
        if (
          (this.slugId == '' && this.filters.Year) ||
          (this.filters.Year &&
            this.filters.Search == '' &&
            this.filters.CategoryId == '')
        ) {
          //  this.location.go('investors/announcements-and-webcasts/' + this.filters.Year);
          /*this.router.navigate([
        'investors/announcements-and-webcasts/' + this.filters.Year
      ]);*/
          this.router.navigate(
            ['investors/announcements-and-webcasts', this.filters.Year],
            { onSameUrlNavigation: 'reload' }
            // { replaceUrl: true }
          );
          this.slugId = this.filters.Year;
        } /*else {
        //this.location.go('investors/announcements-and-webcasts');
       // this.router.navigate(['investors/announcements-and-webcasts']);
	    this.router.navigate(
                [
                  'investors/announcements-and-webcasts',

                ],
                { onSameUrlNavigation: 'reload' }
				// { replaceUrl: true }
              );
      }*/
      }
    } else {
      this.totalRowsCount = 0;
      this.pageCnt = 0;
    }
  }

  tableData(categoryId: any, year: any, page: any) {
    let filterObject = {
      categoryId: categoryId,
      year: year,
      page: page,
    };
    this.getPresentationData(filterObject);
  }

  getPresentationData(event: any): void {
    this.presentationService
      .getAllFrontendPresentation(this.filters)
      .subscribe({
        next: (res) => {
          this.presentationData(res);
        },
        error: (error: ErrorEvent) => {
          this.toasterService.error(error.error.message);
        },
        complete: () => {},
      });
  }

  filter(filterBy: any, event: any): void {
    // this.filters.PageNo = 1;
    if (filterBy == 'Category') {
      this.filters.CategoryId = this.filterForm.get('CategoryId')?.value;
    } else if (filterBy == 'Year') {
      this.filters.Year = this.filterForm.get('Year')?.value;
      this.slugId = '';
    }
    this.getAllPresentations();
  }

  getHovercolor(index: any) {
    let ele = document.getElementById('sens-data' + index) as HTMLElement;
    ele.style.color = '#fa0a0a';
    ele.style.marginLeft = '20px';
    ele.style.cursor = 'pointer';
    ele.style.transition = '0.5s';
  }

  getLeavecolor(index: any) {
    let ele = document.getElementById('sens-data' + index) as HTMLElement;
    ele.style.color = '#000000';
    ele.style.marginLeft = '0px';
    ele.style.cursor = 'pointer';
  }

  getWebcastHovercolor(index: any) {
    let ele = document.getElementById('webcast-data' + index) as HTMLElement;
    ele.style.color = '#fa0a0a';
    ele.style.marginLeft = '20px';
    ele.style.cursor = 'pointer';
    ele.style.transition = '0.5s';
  }

  getWebcastLeavecolor(index: any) {
    let ele = document.getElementById('webcast-data' + index) as HTMLElement;
    ele.style.color = '#000000';
    ele.style.marginLeft = '0px';
    ele.style.cursor = 'pointer';
  }

  search(event: any) {
    if (event.key?.toUpperCase() == 'ENTER') {
      this.filterForm.get('Search')?.setValue(event.target.value);
      this.filters.Search = this.filterForm.get('Search')?.value.toString();
      // this.filters.PageNo = 1;
      this.getAllPresentations();
    }
  }

  searchValue(event: any) {
    this.filterForm.get('Search')?.setValue(this.searchText);
    this.filters.Search = this.searchText;
    //this.filters.PageNo = 1;
    this.getAllPresentations();
  }

  clear() {
    this.searchText = '';
    this.slugId = '';
    this.resetFilterForm();
    //this.filters.PageNo = 1;
    this.filters.PerPage = 'all';
    //this.filters.Year = null;
    this.filters.CategoryId = null;
    this.filters.Search = this.filterForm.get('Search')?.value.toString();
    this.getAllPresentations();
  }

  download(presentation: any) {
    this.commonService.viewPdf(presentation.Pdf);
  }

  webcastOpen(webcast: any) {
    if (webcast.WebCastLink.includes('https')) {
      window.open(webcast.WebCastLink, '_blank');
    } else {
      window.open('https://' + webcast.WebCastLink, '_blank');
    }
  }

  resetFilterForm() {
    this.filterForm = this.fb.group({
      Search: [''],
      Year: [null],
      CategoryId: [null],
    });
  }
}
