import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { map, of } from 'rxjs';
import { EventService } from 'src/app/admin/services/event.service';
import { InvestorService } from 'src/app/admin/services/investor.service';
import { CareerService } from 'src/app/frontend/services/career.service';
import { CONSTANTS } from 'src/app/models/constants';
import { CommonService } from 'src/app/shared/services/common.service';

@Component({
  selector: 'app-integrated-reports',
  templateUrl: './integrated-reports.component.html',
  styleUrls: ['./integrated-reports.component.scss'],
})
export class IntegratedReportsComponent {
  bannerText = 'Integrated reporting suite';
  breadcrumbLinks: any;
  tabName: any;
  bannerDetails: any;
  quickLinks: any;
  type: number = 1;
  range$: any;
  filter = {
    Year: null,
    Search: '',
  };
  filterForm!: FormGroup;
  searchText: string = '';
  integratedReports: any;
  integratedReport: any;
  integratedReportsData: any;
  integratedreportsdocuments: any;
  demo1TabIndex: any = '';

  constructor(
    private careerService: CareerService,
    private eventService: EventService,
    private toasterService: ToastrService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private investorService: InvestorService,
    private dialog: MatDialog,
    private http: HttpClient,
    private _location: Location,
    private commonService: CommonService
  ) {
    //this.test();
  }

  ngOnInit() {
    this.breadcrumbLinks =
      this.eventService.getInvestorsRouterLinks('integrated-reports');
    this.resetFilterForm();
    this.getBanner();
    this.getQuickLinks();
    let slug = '';
    //let fslug = this.route.snapshot.params[CONSTANTS.ROUTE_ID];
	let fslug = this.route.firstChild?.snapshot?.params[CONSTANTS.ROUTE_ID];
    if (fslug != '' && fslug != undefined) {
      slug = fslug;
    }
    this.getAllIntegratedReports(slug);
    this.getYear();
  }

  range: any = [];

  getYear() {
    this.investorService
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

  activeTab(ty: any) {
    setTimeout(() => {
      this.demo1TabIndex = ty;
    }, 100);
  }

  resetFilterForm() {
    this.filterForm = this.fb.group({
      Search: [''],
      Year: [null],
    });
  }

  getBanner() {
    this.careerService
      .getBanner('INTEGRATED_PAGE_BANNER')
      .subscribe((res: any) => (this.bannerDetails = res.data.Value));
  }

  getQuickLinks() {
    this.investorService
      .getQuickLinks()
      .subscribe((res: any) => (this.quickLinks = res.data));
  }

  getAllIntegratedReports(slug: any = '') {
    this.investorService
      .getIntegratedReportsFrontend(this.filter, this.type, slug)
      .subscribe({
        next: (res: any) => {
          if (res) {
            this.integratedReportsData = res;
            this.integratedReport = res?.interatedreport;
            this.integratedreportsdocuments =
              res?.integratedreports?.integratedreportsdocuments;
          }
          if (
            this.integratedReportsData != null &&
            this.integratedReportsData != ''
          ) {
            if (this.integratedReport.Status == 2) {
              this.activeTab(1);
              this.type = 2;
            } else {
              this.activeTab(0);
            }
            this.filterForm.get('Year')?.setValue(this.integratedReport?.Year);
            this.filter.Year = this.integratedReport?.Year;
             if(slug == ''){
			this.router.navigate(
                [
                  'investors/integrated-reports',
                  this.integratedReport.Slug,
                ],
                { onSameUrlNavigation: 'reload' }
				// { replaceUrl: true }
              );
			  }
            /*this._location.go(
              'investors/integrated-reports/' + this.integratedReport.Slug
            );*/        
            // this.router.navigateByUrl(
            //   'investors/integrated-reports/' + this.integratedReport.Slug,
            //   { replaceUrl: true }
            // );
          } else {
		  this.router.navigate(
                [
                  'investors/integrated-reports',
                
                ],
                { onSameUrlNavigation: 'reload' }
				// { replaceUrl: true }
              );
           // this._location.go('investors/integrated-reports');
            // this.filter.Year != null
            //   ? this.router.navigate([
            //       'investors/integrated-reports/' + this.filter?.Year,
            //     ])
            //   : this.router.navigate(['investors/integrated-reports']);
            // this.activeTab(0);
          }
        },
        error: (error) => {
          this.toasterService.error(error.error.message);
        },
        complete: () => {},
      });
  }

  onTabChange(event: any) {
    this.searchText = '';
    this.resetFilterForm();
    this.filter.Year = null;
    this.filter.Search = this.filterForm.get('Search')?.value.toString();
    this.tabName = event.tab.textLabel;
    if (event.tab.textLabel == 'CurrentReport') {
      this.type = 1;
    } else if (event.tab.textLabel == 'ArchivedReport') {
      this.type = 2;
    }
    this.getAllIntegratedReports();
  }

  filterByYear(event: any): void {
    this.filter.Year = this.filterForm.get('Year')?.value;
    this.getAllIntegratedReports();
  }

  search(event: any) {
    this.filterForm.get('Search')?.setValue(event.target.value);
    this.filter.Search = this.filterForm.get('Search')?.value.toString();
    if (event.key?.toUpperCase() == 'ENTER') {
      this.getAllIntegratedReports();
    }
  }

  searchValue(event: any) {
    this.getAllIntegratedReports();
  }

  clear() {
    this.searchText = '';
    this.resetFilterForm();
    this.filter.Year = null;
    this.filter.Search = this.filterForm.get('Search')?.value.toString();
    this.getAllIntegratedReports();
  }

  download(event: MouseEvent, url: string) {
    event.preventDefault();
    this.commonService.pdfDownload(url);
  }

  // share() {
  //   const dialogRef = this.dialog.open(ShareButtonComponent, {
  //     data: {},
  //     position: {
  //       top: '37.3%',
  //       left: '75%',
  //     },
  //   });
  //   dialogRef.afterClosed().subscribe((action: any) => {});
  // }

  viewPdf(name: any) {
    this.commonService.viewPdf(name);
  }

  // test() {
  //   setTimeout(() => {
  //     var al = Array.from(
  //       document.getElementsByTagName(
  //         'share-button'
  //       ) as HTMLCollectionOf<HTMLElement>
  //     );
  //     for (var i = 0; i < al.length; i++) {
  //       al[i].style.background = 'black';
  //       al[i].style.margin = '0px 0px 0px 1px';
  //       al[i].style.cursor = 'pointer';
  //     }
  //   }, 100);
  // }

  showShareIcon: boolean = false;

  clickedShareIcon(event: Event) {
    this.showShareIcon = !this.showShareIcon;
  }
}
