import { map, Observable, of } from 'rxjs';
import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { DashboardService } from 'src/app/admin/services/dashboard.service';
import { DashboardFilterComponent } from '../../../broker/dashboard-filter/dashboard-filter.component';

@Component({
  selector: 'app-source-analytics',
  templateUrl: './source-analytics.component.html',
  styleUrls: ['./source-analytics.component.scss']
})
export class SourceAnalyticsComponent {
  @ViewChild(DashboardFilterComponent) dashboardFilter!: DashboardFilterComponent;
  chartData$!: Observable<any>;
  filter: any = {
    Days: 30,
    StartDate: '',
    EndDate: '',
    ExcludeStaff: 0
  };

  filterApplied: boolean = false;
  panelOpenState: boolean[] = [true];
  activeTab: number = 0;
  tillDateForChart: any;
  fromDateForChart: any;
  displaySelectedDay: any;
  selectedEventDays: any;

  constructor(private dashboardService: DashboardService, public cdr: ChangeDetectorRef) { }

  ngOnInit() {
    this.getSourceAnalyticsData();
    this.selectedEventDays = 'Last 30 Days';
  }

  ngAfterContentChecked() {
    this.cdr.detectChanges();
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


  badgereset(ev: MouseEvent) {
    ev.stopPropagation();
    this.filter = {
      ...this.filter,
      Days: 30,
      PageNo: 1,
      StartDate: null,
      EndDate: null,
      ExcludeStaff: 0,
    };
    this.selectedEventDays = 'Last 30 Days';
    this.filterApplied = false; // Reset filterApplied to hide the badge
    this.dashboardFilter.resetSelectInput(); // Call resetSelectInput method
    this.getSourceAnalyticsData();
  }


  selectedEventFilter(day: any) {
    if (day !== 'Custom Date') {
      this.displaySelectedDay = false;
      this.selectedEventDays = day
    }
  }

  handleFilterApplied(isApplied: boolean) {
    this.filterApplied = isApplied || this.filter.ExcludeStaff !== 0;
  }

  refresh(ev: any) {
    ev.stopPropagation();
    if (this.filter.Type == 2) {
    } else if (this.filter.Type == 1) {
      this.filter = { ...this.filter, };
    }
    this.getSourceAnalyticsData();
  }

  filterData(filter: any) {
    this.dateRangeSelect(filter);
    if (filter.Days == 30 && filter.ExcludeStaff == 0) {
      this.filterApplied = false
    } else {
      this.filterApplied = this.filter.ExcludeStaff !== 0 || Object.values(filter).some(value => value !== 0);
    }
    this.getSourceAnalyticsData();
    this.fromDateForChart = this.filter.StartDate;
    this.tillDateForChart = this.filter.EndDate;
    if (this.filter.Days === 0) {
      this.displaySelectedDay = true;
    }
  }

  getSourceAnalyticsData() {

    this.chartData$ = of(undefined);
    this.chartData$ = this.dashboardService.getSourceSplit(
      this.filter
    ).pipe(map(e => {
      return e;
    }
    ))

  }
  tabLabel: string = "Page";
  filterTabChange!: string;
  filterAppliedPage: boolean = false;
  filterAppliedLead: boolean = false;


  onTabChanges(event: any) {
    this.tabLabel = event.tab.textLabel;
    if (event.tab.textLabel == 'Lead') {
      this.filter.Type = 2;
      this.tabLabel = 'Lead';
      this.filterTabChange = this.tabLabel;
      this.filterAppliedPage = false;
      this.filterAppliedLead = false;
      this.selectedEventDays = 'Last 30 Days';
      this.filterApplied = false;
    } else if (event.tab.textLabel == 'Page') {
      this.filter.Type = 1;
      this.tabLabel = 'Page';
      this.displaySelectedDay = true;
      this.filterTabChange = this.tabLabel;
      this.filterAppliedLead = false;
      this.filterAppliedPage = false;
      this.filterApplied = false;
      this.selectedEventDays = 'Last 30 Days';
    }
    this.dashboardFilter.resetSelectInput();
    this.filter = { ...this.filter, Days: 30, StartDate: null, EndDate: null, ExcludeStaff: 0 };
    this.getSourceAnalyticsData();
  }
}

