import { FinancialResultService } from 'src/app/admin/services/financial-result.service';
import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Location } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { EventService } from 'src/app/admin/services/event.service';
import { CareerService } from 'src/app/frontend/services/career.service';
import { map, of } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { MatTabGroup } from '@angular/material/tabs';
import { ShareButtonComponent } from 'src/app/frontend/shared/share-button/share-button.component';
import { MatDialog } from '@angular/material/dialog';
import { CONSTANTS } from 'src/app/models/constants';
import { CommonService } from 'src/app/shared/services/common.service';

@Component({
  selector: 'app-financial-results',
  templateUrl: './financial-results.component.html',
  styleUrls: ['./financial-results.component.scss'],
})
export class FinancialResultsComponent {
  quickLinks: any;
  bannerText = 'Financial results';
  bannerSubText = '';
  // Top Investors See Great Strategy
  breadcrumbLinks: any;
  bannerDetails: any;
  tabName: any;
  Type: string = 'Annual';
  filterForm!: FormGroup;
  searchText: string = '';
  currentURL = '';
  tab!: number;
  range: any = [];
  activeTabIndex: any = '';

  range$: any;
  filter = {
    Year: null,
    Search: '',
    Type: '',
  };
  financialResults: any;

  constructor(
    private careerService: CareerService,
    private eventService: EventService,
    private financialService: FinancialResultService,
    private toasterService: ToastrService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private _location: Location,
    private commonService: CommonService
  ) {
    this.currentURL = window.location.origin;
  }

  ngOnInit() {
    this.breadcrumbLinks =
      this.eventService.getInvestorsRouterLinks('financial-results');
    this.getBanner();
    this.quicklinks();
	
    let slug = '';
   // let fslug = this.route.snapshot.params[CONSTANTS.ROUTE_ID];
    let fslug = this.route.firstChild?.snapshot?.params[CONSTANTS.ROUTE_ID];
    if (fslug != '' && fslug != undefined) {
      slug = fslug;
    }
    this.getAllFinancialResults(slug);
    this.getYear();
    this.resetFilterForm();
  }

  getBanner() {
    this.careerService
      .getBanner('FINANCIAL_PAGE_BANNER')
      .subscribe((res: any) => (this.bannerDetails = res.data.Value));
  }

  quicklinks() {
    this.financialService
      .getQuickLinks()
      .subscribe((res: any) => (this.quickLinks = res.data));
  }

  getAllFinancialResults(slug: any = '') {
    this.financialService
      .getAllFinancialResultsFrontend(this.filter, slug)
      .subscribe({
        next: (res: any) => {
          this.financialResults = res;
          if (this.filter.Type == 'Annual') {
            this.activeTab(0);
          }
          if (this.filter.Type != '') {
            this.tab = 0;
          }

          if (
            this.financialResults.financial != null &&
            this.financialResults.financial != ''
          ) {
            this.Type = this.financialResults.financial.Type;
           /* this._location.go(
              'investors/financial-results/' +
                this.financialResults.financial.Slug
            );*/
			 if (this.Type == 'Interim') {
              this.activeTab(1);
            } else {
              this.activeTab(0);
            }
            this.filterForm
              .get('Year')
              ?.setValue(this.financialResults.financial.PublishYear);
            this.filter.Year = this.financialResults.financial.PublishYear;
            if(slug == ''){
			this.router.navigate(
                [
                  'investors/financial-results',
                  this.financialResults.financial.Slug,
                ],
                { onSameUrlNavigation: 'reload' }
				// { replaceUrl: true }
              );
			  }
           
          } else {
           // this._location.go('investors/financial-results');
		   this.router.navigate(
                [
                  'investors/financial-results',
                ],
                { onSameUrlNavigation: 'reload' }
              );
          }
        },
        error: (error) => {
          this.toasterService.error(error.error.message);
        },
        complete: () => {},
      });
  }

  activeTab(ty: any) {
    setTimeout(() => {
      this.activeTabIndex = ty;
    }, 100);
  }
  onTabChange(event: any) {
    this.tabName = event?.tab?.textLabel;

    if (event?.tab?.textLabel == 'Annual') {
      this.Type = this.filter.Type = 'Annual';
      this.activeTabIndex = 0;
    } else if (event?.tab?.textLabel == 'Interim') {
      this.Type = this.filter.Type = 'Interim';
      this.activeTabIndex = 1;
    }
    this.getAllFinancialResults();
  }

  getYear() {
    // var startYear = new Date().getFullYear();
    // var lastYear = new Date('2005-01-01').getFullYear();
    // while (startYear >= lastYear) {
    //   this.range.push(startYear);
    //   startYear = startYear - 1;
    // }
    // this.range$ = of(this.range);
    this.financialService
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

  resetFilterForm() {
    this.filterForm = this.fb.group({
      Search: [''],
      Year: [null],
    });
  }

  filterByYear(filterBy: any, event: any): void {
    this.filter.Year = this.filterForm.get('Year')?.value;
    this.filter.Type = this.Type;
    //this.filter.Type = 'Annual';
    this.getAllFinancialResults();
  }

  clear() {
    this.searchText = '';
    this.resetFilterForm();
    this.filter.Year = null;
    this.filter.Search = this.filterForm.get('Search')?.value.toString();
    this.getAllFinancialResults();
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

  showShareIcon: boolean = false;

  clickedShareIcon(event: Event) {
    this.showShareIcon = !this.showShareIcon;
  }

  download(event: MouseEvent, url: string) {
    event.preventDefault();
    let extension = url.split('.').pop();
    if (extension == 'pdf') {
      this.commonService.viewPdf(url);
    } else {
      this.commonService.pdfDownload(url);
    }
  }
}
