import { Component, ElementRef, ViewChild } from '@angular/core';
import { DashboardService } from 'src/app/admin/services/dashboard.service';
import { Observable, of } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { DashboardFilterComponent } from '../dashboard-filter/dashboard-filter.component';
import { FormGroup } from '@angular/forms';
import { event } from 'jquery';
@Component({
  selector: 'app-page-views',
  templateUrl: './page-views.component.html',
  styleUrls: ['./page-views.component.scss'],
})
export class PageViewsComponent {
  @ViewChild(DashboardFilterComponent)
  dashboardFilter!: DashboardFilterComponent;
  chartData$!: Observable<any>;

  chart: any;
  root: any;
  type = 'PageViews';

  filter: any = {
    PageNo: 1,
    PerPage: 10,
    Days: 30,
    StartDate: '',
    EndDate: '',
    Search: '',
    ExcludeStaff: 0,
  };
  pageViewsCount: any;
  loading: boolean = false;
  pageViewPanelOpenState: boolean = true;
  filterApplied: boolean = false;
  selectedEventDays!: string;

  filterName: string | undefined;
  constructor(
    private dashboardService: DashboardService,
    private toasterService: ToastrService
  ) {}

  ngOnChanges() {}

  ngOnInit() {
    this.getPageViews();
    this.selectedEventDays = 'Last 30 Days';
  }

  handleFilterApplied(isApplied: boolean) {
    this.filterApplied = isApplied || this.filter.ExcludeStaff !== 0;
    this.filter.Search != '' || undefined;
    this.filterName != '' || undefined ;
  }

  getPageViews() {
    this.loading = true;
    this.dashboardService.getPageViews(this.filter).subscribe({
      next: (data: any) => {
        this.loading = false;
        this.setData(data);
      },
      error: (error) => {
        this.toasterService.error(error.error.message);
      },
    });
  }
  setData(data: any) {
    this.pageViewsCount = data.Total;
    this.chartData$ = of(data.res);
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
    this.getPageViews();
  }

  refreshFilter(ev: MouseEvent) {
    ev.stopPropagation();
    // this.filter = { ...this.filter, Days: 30, PageNo: 1, StartDate: null, EndDate: null };

    this.getPageViews();
  }

  badgereset(ev: MouseEvent) {
    ev.stopPropagation();
    this.filter = {
      ...this.filter,
      Days: 30,
      PageNo: 1,
      StartDate: null,
      EndDate: null,
      Search: '',
      ExcludeStaff: 0,
    };
    this.selectedEventDays = 'Last 30 Days';
    this.filterApplied = false; // Reset filterApplied to hide the badge
    this.dashboardFilter.resetSelectInput(); // Call resetSelectInput method
    this.filter.Search = '';
    this.filterName = '';
    this.getPageViews();
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

  selectedEventFilter(day: any) {
    if (this.selectedEventDays !== undefined) {
      if (day !== 'Custom Date') {
        this.selectedEventDays = day;
      }
    }
  }

  search() {
    var search = this.filterName;
    this.filter.Search = search;
    if (search) {
      this.loading = true;
      this.handleFilterApplied(true);
    } else {
      if (this.filter.ExcludeStaff == 0) {
        this.handleFilterApplied(false);
      }
    }
    if (this.filterName != undefined) {
      this.getPageViews();
    }
  }

  stoppropogation(event: any) {
    event.stopPropagation();
  }
}
