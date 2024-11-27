import { ChangeDetectorRef, Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { map, Observable, of } from 'rxjs';
import { DashboardService } from 'src/app/admin/services/dashboard.service';
import { DashboardFilterComponent } from '../../../broker/dashboard-filter/dashboard-filter.component';

@Component({
  selector: 'app-device-analytics',
  templateUrl: './device-analytics.component.html',
  styleUrls: ['./device-analytics.component.scss']
})
export class DeviceAnalyticsComponent {
  @ViewChild(DashboardFilterComponent) dashboardFilter!: DashboardFilterComponent;
  chartData$!: Observable<any>;
  filter: any = {
    Days: 30,
    StartDate: '',
    EndDate: '',
    Type: 1,
    ExcludeStaff: 0
  };
  tabLabel: string = "Page"; 
  filterAppliedPage: boolean = false;
  filterAppliedLead: boolean = false;
  filterTabChange!: string;
  panelOpenState: boolean[] = [true];
  activeTab: number = 0;
  tillDateForChart: any;
  fromDateForChart: any;
  displaySelectedDay: any;
  selectedEventDays: any;
  
  constructor(private dashboardService : DashboardService, public cdr: ChangeDetectorRef){}

  ngOnInit(){
    this.getDeviceAnalyticsData();
    this.filterTabChange = 'Page'
  }

  ngAfterContentChecked() {
    this.cdr.detectChanges();
  }

  onTabChanges(event: any) {
    this.tabLabel = event.tab.textLabel;
    if (event.tab.textLabel == 'Lead') {
      this.filter.Type = 2;
      this.tabLabel = 'Lead';
      this.filterTabChange = this.tabLabel;
      this.filterAppliedPage = false;
      this.filterAppliedLead = false;
    } else if (event.tab.textLabel == 'Page') {
      this.filter.Type = 1;
      this.tabLabel = 'Page';
	    this.displaySelectedDay = true;
      this.filterTabChange = this.tabLabel;
      this.filterAppliedLead = false;
      this.filterAppliedPage = false;
    }
    this.dashboardFilter.resetSelectInput();
    this.filter = { ...this.filter, Days: 30, StartDate: null, EndDate: null, ExcludeStaff: 0 };
    this.getDeviceAnalyticsData();
  }

 
  badgeReset(ev: MouseEvent,type:number) {
    ev.stopPropagation();
    this.filter = { ...this.filter, Days: 30, StartDate: null, EndDate: null, ExcludeStaff: 0 };
    this.selectedEventDays = '';
    if(type==1){
      this.filterAppliedPage = false;
      this.filter.Type = 1;
    }else{
      this.filterAppliedLead = false;
      this.filter.Type = 2;
    }
    this.displaySelectedDay = true;
    this.dashboardFilter.resetSelectInput();
    this.getDeviceAnalyticsData();
    
  }

 
  selectedEventFilter(day: any) {
    if (day !== 'Custom Date') {
      this.displaySelectedDay = false;
      this.selectedEventDays = day
    }
  }

  handleFilterApplied(isApplied: boolean) {
    
    if (this.filterTabChange === 'Page') {
      this.filterAppliedPage = isApplied || this.filter.ExcludeStaff !== 0;;
    } else if (this.filterTabChange === 'Lead') {
      this.filterAppliedLead = isApplied || this.filter.ExcludeStaff !== 0;;
    }
  }

  refresh(ev: any) {
    ev.stopPropagation();
    if (this.filter.Type == 2) {
    } else if (this.filter.Type == 1) {
      this.filter = { ...this.filter, };
    }
    this.getDeviceAnalyticsData();
  }

  filterData(filter: any) {
    if(this.filter.Days === 30){
        this.selectedEventFilter('Last 30 Days')
    }
    if(filter.Days == 30 && filter.ExcludeStaff == 0){
      this.filterAppliedPage = false
    } else {
      this.filterAppliedPage = this.filter.ExcludeStaff !== 0 || Object.values(filter).some(value => value !== 0);
    }
    this.getDeviceAnalyticsData();
    this.fromDateForChart = this.filter.StartDate;
    this.tillDateForChart = this.filter.EndDate;
    if(this.filter.Days === 0){
      this.displaySelectedDay = true;
    }
  }

  getDeviceAnalyticsData(){

    this.chartData$ = of(undefined);
    this.chartData$ = this.dashboardService.getDeviceSplit(
      this.filter
    ).pipe(map(e => {
        return e;
      }
    ))
    if(this.filter.Days === 30){
      this.selectedEventFilter('Last 30 Days')
    }
  }
}