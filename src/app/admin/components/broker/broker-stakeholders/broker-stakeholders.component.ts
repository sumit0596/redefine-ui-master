import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { MatAccordion } from '@angular/material/expansion';
import { Observable, of } from 'rxjs';
import { DashboardService } from 'src/app/admin/services/dashboard.service';
import { DashboardFilterComponent } from '../dashboard-filter/dashboard-filter.component';
import { map, catchError } from 'rxjs/operators';
@Component({
  selector: 'app-broker-stakeholders',
  templateUrl: './broker-stakeholders.component.html',
  styleUrls: ['./broker-stakeholders.component.scss']
})
export class BrokerStakeholdersComponent {
  @ViewChild(MatAccordion) accordion!: MatAccordion;
  @ViewChild(DashboardFilterComponent) dashboardFilter!: DashboardFilterComponent;
  panelOpenState: boolean[] = [true];
  activeTab: number = 0;
  chartData$!: Observable<any>;
  timeGraphChartData$!: Observable<any>;
  filterAppliedPie: boolean = false;
  filterAppliedTime: boolean = false;
  filterTabChange!: string;
  tabLabel!: string;
  selectedEventDays!: string | undefined;
  selectedEventYears!: string | undefined;
  fromDateForChart: any;
  dateForChart: any;
  cachePieStartDate: any;
  cachePieEndDate: any;
  fromDateForTimeChart: any;
  tillDateForTimeChart: any;
  displaySelectedDay:boolean=true;
  displaySelectedYear:boolean=true;
  filter: any = {
    Days: 30,
    StartDate: '',
    EndDate: '',
    PerPage: 10,
    PageNo: 1,
    Type: 1,
    refresh: false,
    Cache: 1,
    ExcludeStaff: 0
  };
  constructor(private dashboardService: DashboardService,
    public cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.loadStakeholdersSession();
    this.filterTabChange = 'Pie Chart'
  }
  ngAfterContentChecked() {
    this.cdr.detectChanges();
  }
  loadStakeholdersSession() {
    this.chartData$ = of(undefined);
    this.chartData$ = this.dashboardService.getStakeholdersSession(
      this.filter
    ).pipe(map(e => {
        if(e.data.TillDate && e.data.FromDate){
          this.dateForChart = e.data.TillDate;
          this.fromDateForChart = e.data.FromDate;
		  this.cachePieStartDate = e.data.TillDate;
          this.cachePieEndDate = e.data.FromDate;
        }else{
          this.dateForChart = null;
          this.fromDateForChart = null;
        }
          return e;
       }
    ))

	
	
    /*this.dashboardService.getStakeholdersSession(this.filter).subscribe((e:any)=>{
        if(e.data.TillDate && e.data.FromDate){
          this.dateForChart = e.data.TillDate;
          this.fromDateForChart = e.data.FromDate;
        }else{
          this.dateForChart = null;
          this.fromDateForChart = null;
        }
    });*/
    
  }

  loadTimeGraphStakeholdersSession() {
    this.timeGraphChartData$ = of(undefined);
    this.timeGraphChartData$ = this.dashboardService.getStakeholdersSession(
      this.filter
    ).pipe(map(e => {
        if(e.data.TillDate && e.data.FromDate){
           this.fromDateForTimeChart = e.data.FromDate
      this.tillDateForTimeChart = e.data.TillDate
        }
          return e;
       }
    ))
	
   /* this.dashboardService.getStakeholdersSession(this.filter).subscribe((e: any) => {
      this.fromDateForTimeChart = e.data.FromDate
      this.tillDateForTimeChart = e.data.TillDate
    })*/
  }

  filterData(filter: any) {
    if (this.filter.Type == 1) {
      this.filter.Cache = 2;
      if(this.filter.Days === 30){
        this.selectedEventFilter('Last 30 Days')
      }
      this.loadStakeholdersSession();
      this.fromDateForChart = this.filter.StartDate;
      this.dateForChart = this.filter.EndDate;
      if(this.filter.Days === 0){
        this.displaySelectedDay = true;
      }
    } else {
      if (this.filter.ExcludeStaff == 1 || this.filter.StartDate && this.filter.EndDate) {
        this.filter.Cache = 2;
      }
      this.displaySelectedYear = false;
      this.fromDateForTimeChart = this.filter.StartDate;
      this.tillDateForTimeChart = this.filter.EndDate;
      this.loadTimeGraphStakeholdersSession();
    }
  }


  onTabChanges(event: any) {
    this.tabLabel = event.tab.textLabel;
    if (event.tab.textLabel == 'Time Chart') {
      this.filter.Type = 2;
      this.filter.Days = 0;
      let currentyear = new Date().getFullYear();
      this.filter.StartDate = `01-01-${currentyear}`;
      this.filter.EndDate = `31-12-${currentyear}`;
      this.tabLabel = 'Time Chart';
      this.filterTabChange = this.tabLabel;
      this.filter = { ...this.filter, StartDate: null, EndDate: null, Cache: 1, ExcludeStaff: 0 };
      this.filterAppliedTime = false;
      this.loadTimeGraphStakeholdersSession();
    } else if (event.tab.textLabel == 'Pie Chart') {
      this.filter = {
        ...this.filter,
        Days: 30,
        PerPage: 10,
        PageNo: 1,
        Type: 1,
      };
      this.filter.Type = 1;
      this.tabLabel = 'Pie Chart';
	  this.displaySelectedDay = true;
      //this.selectedEventDays = '';
    //  this.selectedEventDays = this.cachePieStartDate+' - '+this.cachePieEndDate;
      this.filterTabChange = this.tabLabel;
      this.filter = { ...this.filter, Days: 30, StartDate: null, EndDate: null, Cache: 1, ExcludeStaff: 0 };
      this.filterAppliedPie = false;
      this.dashboardFilter.resetSelectInput();
      this.loadStakeholdersSession();
    }
  }

  stakeholderSessionRefresh(ev: any) {
    ev.stopPropagation();
    if (this.filter.Type == 2) {
      this.loadTimeGraphStakeholdersSession();
    } else if (this.filter.Type == 1) {
      this.filter = { ...this.filter, };
      this.loadStakeholdersSession();
    }
  }

  pieChartBadgeReset(ev: MouseEvent) {
    ev.stopPropagation();
    this.filter = { ...this.filter, Days: 30, StartDate: null, EndDate: null, Cache: 1, ExcludeStaff: 0 };
    this.selectedEventDays = 'Last 30 days';
    this.filterAppliedPie = false;
    this.displaySelectedDay = true;
    // this.selectedEventDays = '';
    // this.filterAppliedPie = false;
    // this.displaySelectedDay = true;
    this.dashboardFilter.resetSelectInput();
    this.loadStakeholdersSession();
    
  }

  timeChartBadgeReset(ev: MouseEvent) {
    ev.stopPropagation();
    this.filter = { ...this.filter, StartDate: null, EndDate: null, Cache: 1, ExcludeStaff: 0 };
  
    this.filterAppliedTime = false;

    this.displaySelectedYear = true;
    // this.filterAppliedTime = false;
    // this.displaySelectedYear = true;
    this.dashboardFilter.resetSelectInput();
    this.loadTimeGraphStakeholdersSession();
  }

  selectedEventFilter(day: any) {
    if (day !== 'Custom Date') {
      this.displaySelectedDay = false;
      this.selectedEventDays = day
    }
  }

  handleFilterApplied(isApplied: boolean) {
    if (this.filterTabChange === 'Pie Chart') {
      this.filterAppliedPie = isApplied || this.filter.Days !== 30 || this.filter.ExcludeStaff !== 0;
    } else if (this.filterTabChange === 'Time Chart') {
      this.filterAppliedTime = isApplied || !!this.filter.StartDate || !!this.filter.EndDate || this.filter.ExcludeStaff !== 0;
    }
  }

}
