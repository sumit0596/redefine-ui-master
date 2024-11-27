import { Component, ViewChild } from '@angular/core';
import { DashboardService } from 'src/app/admin/services/dashboard.service';
import { DashboardFilterComponent } from '../../../broker/dashboard-filter/dashboard-filter.component';

@Component({
  selector: 'app-insight-analytics',
  templateUrl: './insight-analytics.component.html',
  styleUrls: ['./insight-analytics.component.scss']
})
export class InsightAnalyticsComponent {
  @ViewChild(DashboardFilterComponent) dashboardFilter!: DashboardFilterComponent;

  panelOpenState: boolean[] = [true];
  filterApplied: boolean = false;
  insightsData:any;
  selectedEventDays: any;
  displaySelectedDay:any;
  filter: any = {
    Days: 30,
    StartDate: '',
    EndDate: '',
    PerPage: 10,
    PageNo: 1,
    refresh: false,
    ExcludeStaff: 0
  };
  loading: boolean = false;

  constructor(private dashboardService : DashboardService){}

  ngOnInit(){
    this.getInsightsAnalyticsData();
    this.selectedEventDays = 'Last 30 Days';
  }

  getInsightsAnalyticsData(){
    this.loading = true;
    this.dashboardService.getInsightsAnalytics(this.filter).subscribe((res:any)=>{
    this.loading = false;
      this.insightsData = res.data.res;
    })
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
    this.dateRangeSelect(filter);
    if(filter.Days == 30 && filter.ExcludeStaff == 0){
      this.filterApplied = false
    } else {
      this.filterApplied = this.filter.ExcludeStaff !== 0 || Object.values(filter).some(value => value !== 0);
    }
    this.getInsightsAnalyticsData();
    if(this.filter.Days === 0){
      this.displaySelectedDay = true;
    }
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
    this.filter = { ...this.filter };    
    this.getInsightsAnalyticsData();
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
    this.getInsightsAnalyticsData();
  }
}
