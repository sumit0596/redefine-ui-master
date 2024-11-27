import {
  ChangeDetectorRef,
  Component,
  ComponentRef,
  OnInit,
  ViewChild,
  ViewContainerRef,
  ViewEncapsulation,
} from '@angular/core';
import { USER_ROLE } from 'src/app/models/user-role';
import { BrokerDashboardComponent } from '../broker/broker-dashboard/broker-dashboard.component';
import { UserStoreService } from 'src/app/services/user-store.service';
import { Observable, of } from 'rxjs';
import { DashboardService } from '../../services/dashboard.service';
import { environment } from 'src/environments/environment.dev';
import { DASHBOARD_ACCESS } from 'src/app/models/enum';
import { DashboardFilterComponent } from '../broker/dashboard-filter/dashboard-filter.component';
import { DashboardCampaignsComponent } from '../dashboard-campaigns/dashboard-campaigns.component';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { Router } from '@angular/router';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DashboardComponent implements OnInit {
  @ViewChild(DashboardFilterComponent) dashboardFilter!: DashboardFilterComponent;
  private dashboardCampaignComponentRef: ComponentRef<any> | undefined;
  userInfo: any;
  images: any[] = [
    'https://www.redefine.co.za/files/images/90-Grayston_1115_lr_031.jpg',
    'https://www.redefine.co.za/files/images/90-Grayston_1115_lr_022.jpg',
    'https://www.redefine.co.za/files/images/REDEFINE-PROPERTIES_Office_90-Grayston-Drive_02.jpg',
    'https://www.redefine.co.za/files/images/REDEFINE-PROPERTIES_Office_90-Grayston-Drive_03.jpg',
  ];
  @ViewChild('dashboardHost', { read: ViewContainerRef })
  dashboardHost!: ViewContainerRef;
  @ViewChild('dashboardCampaign', { read: ViewContainerRef })
  dashboardCampaign!: ViewContainerRef;
  underDevelopment: boolean = false;
  chartData$!: Observable<any>;
  timeGraphChartData$!: Observable<any>;
  panelOpenState: boolean[] = [true, true, true, true,];
  recentEnquiries$: any;
  recentJobs$: any;
  recentEvents$: any;
  recentUnits$: any;
  activeTab: number = 0;
  tabLabel!: string;
  selectedEventDays!: string | undefined;
  selectedEventYears!: string | undefined;
  filterApplied: boolean = false;
  filterAppliedPie: boolean = false;
  filterAppliedTime: boolean = false;
  filterTabChange!: string;
  filter: any = {
    Days: 30,
    StartDate: '',
    EndDate: '',
    PerPage: 10,
    PageNo: 1,
    Type: 1,
    refresh: false,
    ExcludeStaff: 0,

  };

  type: any = 'enquiries';
  environment = environment;
  dashBoardAccess: any = [];
  isAccess = DASHBOARD_ACCESS;
  recentEnquiriesPageNo: number = 1;
  recentUnitsPageNo: number = 1;
  recentJobsPageNo: number = 1;
  recentEventsPageNo: number = 1;
  refreshEnquiries!: any;
  refreshUnits!: any;
  refreshJobs!: any;
  refreshEvents!: any;
  notBrokarDashboard: boolean = true;
  columnHide: boolean = false;
  canShowDashboard: boolean = false
  constructor(
    private userStore: UserStoreService,
    private dashboardService: DashboardService,
    public cdr: ChangeDetectorRef,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.filter.Days = 30;
    this.getUserInfo();
    this.loadStakeholders();
    this.loadRecentEnquiries(0);
    this.loadRecentJobs();
    this.loadRecentEvents();
    this.loadRecentUnits(0);
    this.selectedEventDays = 'Last 30 Days'
    this.filterTabChange = 'Pie Chart'
  }
  ngAfterContentChecked() {
    this.cdr.detectChanges();
  }

  async getUserInfo() {
    let userInfo$ = await this.userStore.getUser();
    userInfo$.subscribe((res) => {
      this.userInfo = res;
      this.dashBoardAccess = this.userInfo.DashboardPer;
      if (this.dashBoardAccess?.length == 1) {
        this.columnHide = true;
      }
      if (this.dashBoardAccess.length > 0) {
        if (this.dashBoardAccess[0] == this.isAccess.DASHBOARD_CAMPAIGN) {
          this.canShowDashboard = false;
        } else {
          this.canShowDashboard = true;
        }
      }
      this.loadComponent();
    });
  }

  loadComponent() {
    if (this.dashboardHost) {
      this.dashboardHost?.clear();
      let componentRef: any;
      switch (this.userInfo.RoleName) {
        case USER_ROLE.BROKER:
          componentRef = this.dashboardHost.createComponent(
            BrokerDashboardComponent
          );
          this.notBrokarDashboard = false;
          this.underDevelopment = false;
          break;
        // case USER_ROLE.LEASING_EXECUTIVE:
        // componentRef = this.dashboardHost.createComponent(
        //   LeasingExecutiveDashboardComponent
        // );
        // this.underDevelopment = false;

        // break;
        default:
          // componentRef = this.dashboardHost.createComponent(
          //   DashboardComponent
          // );
          this.underDevelopment = true;
          break;
      }
    }

  }

  viewDashboardCampaign() {
    if (this.dashboardCampaign && environment.DASHBOARD_TAB_VIEW) {
      if (!this.dashboardCampaignComponentRef) {
        this.dashboardCampaignComponentRef = this.dashboardCampaign.createComponent(DashboardCampaignsComponent);
      } else {

      }
    }
  }

  loadStakeholders() {
    this.chartData$ = of(undefined);
    this.chartData$ = this.dashboardService.getStakeholders(
      this.filter,
      'Total User'
    );
  }

  loadRecentEnquiries(i: number = 0, refresh?: boolean) {
    this.refreshEnquiries = refresh ? refresh : false;
    if (i) {
      this.recentEnquiriesPageNo = i + 1;
      this.filter.PageNo = this.recentEnquiriesPageNo;
    }
    else if (refresh) {
      this.recentEnquiriesPageNo = 1;
      this.filter.PageNo = 1;
      this.filter.PerPage = 10;
    }

    //  this.filter.Days = 7;
    this.recentEnquiries$ = this.dashboardService.getRecentEnquiries(this.getFilterWithDays(14));
  }

  loadRecentJobs(i: number = 0, refresh?: boolean) {
    this.refreshJobs = refresh ? refresh : false;
    if (i) {
      this.recentJobsPageNo = i + 1;
      this.filter.PageNo = this.recentJobsPageNo;
    }
    else if (refresh) {
      this.recentJobsPageNo = 1;
      this.filter.PageNo = 1;
      this.filter.PerPage = 10;
    }

    //  this.filter.Days = 7;
    this.recentJobs$ = this.dashboardService.getRecentJobs(this.getFilterWithDays(14));
  }

  loadRecentEvents(i: number = 0, refresh?: boolean) {
    this.refreshEvents = refresh ? refresh : false;
    if (i) {
      this.recentEventsPageNo = i + 1;
      this.filter.PageNo = this.recentEventsPageNo;
    }
    else if (refresh) {
      this.recentEventsPageNo = 1;
      this.filter.PageNo = 1;
      this.filter.PerPage = 10;
    }

    //  this.filter.Days = 7;
    this.recentEvents$ = this.dashboardService.getRecentEvents(this.getFilterWithDays(14));
  }

  loadRecentUnits(i: number = 0, refresh?: boolean) {
    this.refreshUnits = refresh ? refresh : false;
    if (i) {
      this.recentUnitsPageNo = i + 1;
      this.filter.PageNo = this.recentUnitsPageNo;
    }
    else if (refresh) {
      this.recentUnitsPageNo = 1;
      this.filter.PageNo = 1;
      this.filter.PerPage = 10;
    }

    //  this.filter.Days = 7;
    this.recentUnits$ = this.dashboardService.getRecentUnits(this.getFilterWithDays(14));
  }

  getFilterWithDays(days: number): any {
    return {
      ...this.filter,
      Days: days,
    };
  }

  filterData(filter: any) {
    if (filter.Days === 0 && filter.Type === 1) {
      this.dateRangeSelect(filter)
    } else {
      setTimeout(() => {
        this.dateRangeSelect(filter)
      });
    }
    this.filter = filter;
    if (this.filter.Type == 1) {
      this.loadStakeholders();
    } else {
      this.loadTimeGraphStakeholders();
    }
    let currentyear = new Date().getFullYear();
    if (filter.Days == 30 && filter.ExcludeStaff == 0) {
      this.filterAppliedPie = false;
      // this.filterAppliedTime = false;
    } else {
      this.filterAppliedPie = this.filter.ExcludeStaff !== 0 || Object.values(filter).some(value => value !== 0);
      // this.filterAppliedTime = this.filter.ExcludeStaff !== 0 || Object.values(filter).some(value => value !== 0 );
    }

  }

  selectedEventFilter(day: any) {
    if (this.selectedEventDays !== undefined) {
      if (day !== 'Custom Date') {
        this.selectedEventDays = day
      }
    }
  }

  dateRangeSelect(range: any) {
    if (range.Days === 0 && range.Type === 1) {
      const startDateParts = range.StartDate.split('-');
      const endDateParts = range.EndDate.split('-');
      const formattedStartDate = startDateParts.join('/');
      const formattedEndDate = endDateParts.join('/');
      this.selectedEventDays = formattedStartDate + ' - ' + formattedEndDate;
    } else if (range.Days === 0 && range.Type === 2) {
      const startDateParts = range.StartDate.split('-');
      const endDateParts = range.EndDate.split('-');
      const formattedStartDate = startDateParts.join('/');
      const formattedEndDate = endDateParts.join('/');
      this.selectedEventYears = formattedStartDate + ' - ' + formattedEndDate;
    }
  }

  onTabChange(event: any) {
    this.tabLabel = event.tab.textLabel;
    if (event.tab.textLabel == 'Time Chart') {
      this.filter.Type = 2;
      this.filter.Days = 0;
      let currentyear = new Date().getFullYear();
      this.filter.StartDate = `01-01-${currentyear}`;
      this.filter.EndDate = `31-12-${currentyear}`;
      // this.loadTimeGraphStakeholders();
      this.tabLabel = 'Time Chart';
      this.filterTabChange = this.tabLabel;
      this.filter = { ...this.filter, StartDate: null, EndDate: null, ExcludeStaff: 0 };
      this.filterAppliedTime = false;
      this.dashboardFilter.resetSelectInput();
      this.loadTimeGraphStakeholders();
      this.selectedEventYears = this.filter.StartDate + ' - ' + this.filter.EndDate;
    } else if (event.tab.textLabel == 'Pie Chart') {
      this.filter = {
        ...this.filter,
        Days: 30,
        PerPage: 3,
        PageNo: 1,
        Type: 1,
      };
      this.filter.Type = 1;
      // this.loadStakeholders();      
      this.tabLabel = 'Pie Chart';
      this.filterTabChange = this.tabLabel;
      this.filter = { ...this.filter, Days: 30, StartDate: null, EndDate: null, ExcludeStaff: 0 };
      this.selectedEventDays = 'Last 30 Days'
      this.filterAppliedPie = false;
      this.dashboardFilter.resetSelectInput();
      this.loadStakeholders();
    }
  }

  loadTimeGraphStakeholders() {
    this.timeGraphChartData$ = of(undefined);
    this.timeGraphChartData$ = this.dashboardService.getStakeholders(
      this.filter,
      'Total User'
    );
  }

  dashboardStakeholderReset(ev: MouseEvent) {
    ev.stopPropagation();
    if (this.filter.Type == 2) {
      // this.filter = { ...this.filter, StartDate: null, EndDate: null };
      this.loadTimeGraphStakeholders();
    } else if (this.filter.Type == 1) {
      this.filter = { ...this.filter, };
      this.loadStakeholders();
    }
  }

  pieChartBadgeReset(ev: MouseEvent) {
    ev.stopPropagation();
    this.filter = { ...this.filter, Days: 30, StartDate: null, EndDate: null, ExcludeStaff: 0 };
    this.selectedEventDays = 'Last 30 Days'
    this.filterAppliedPie = false;
    this.dashboardFilter.resetSelectInput();
    this.loadStakeholders();
  }

  timeChartBadgeReset(ev: MouseEvent) {
    ev.stopPropagation();
    this.filter = { ...this.filter, StartDate: null, EndDate: null, ExcludeStaff: 0 };
    this.filterAppliedTime = false;
    this.dashboardFilter.resetSelectInput();
    this.loadTimeGraphStakeholders();
  }


  handleFilterApplied(isApplied: boolean) {
    if (this.filterTabChange === 'Pie Chart') {
      this.filterAppliedPie = isApplied || this.filter.ExcludeStaff !== 0;
    } else if (this.filterTabChange === 'Time Chart') {
      this.filterAppliedTime = isApplied || this.filter.ExcludeStaff !== 0;
    }
  }

  onChangeDashboards(event: MatTabChangeEvent) {
    if (event.index === 1) {
      this.viewDashboardCampaign();
    } else {
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.router.navigate(['admin/dashboard']);
      });
    }
  }
}
