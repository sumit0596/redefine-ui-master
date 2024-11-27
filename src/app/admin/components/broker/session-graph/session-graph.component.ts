import { Component, Input, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardService } from 'src/app/admin/services/dashboard.service';
import { ToastrService } from 'ngx-toastr';
import { Observable, of } from 'rxjs';
import { DashboardFilterComponent } from '../dashboard-filter/dashboard-filter.component';

@Component({
  selector: 'app-session-graph',
  templateUrl: './session-graph.component.html',
  styleUrls: ['./session-graph.component.scss'],
})
export class SessionGraphComponent {
  @ViewChild(DashboardFilterComponent)
  dashboardFilter!: DashboardFilterComponent;
  sessionData: any;
  totalSessions: any;
  chartData$!: Observable<any>;
  type = 'Sessions';
  filter: any = {
    PageNo: 1,
    PerPage: 10,
    Days: 30,
    StartDate: '',
    EndDate: '',
    ExcludeStaff: 0,
  };
  loading: boolean = false;
  sessionGraphPanelOpenState: boolean = true;
  filterApplied: boolean = false;
  selectedEventDays!: string;

  constructor(
    private dashboardService: DashboardService,
    private toasterService: ToastrService
  ) {}

  ngOnInit() {
    this.getSessions();
    this.selectedEventDays = 'Last 30 Days';
  }

  handleFilterApplied(isApplied: boolean) {
    this.filterApplied = isApplied || this.filter.ExcludeStaff !== 0;
  }

  getSessions() {
    this.loading = true;
    this.dashboardService.getSessions(this.filter).subscribe({
      next: (data: any) => {
        if (data) {
          this.loading = false;
          this.sessionData = data.res;
          this.totalSessions = data.Total;
          this.chartData$ = of(data.res);
        }
      },
      error: (error) => {
        this.toasterService.error(error.error.message);
      },
      complete: () => {},
    });
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
    this.getSessions();
  }

  refreshFilter(ev: MouseEvent) {
    ev.stopPropagation();
    // this.filter = { ...this.filter, Days: 30, PageNo: 1, StartDate: null, EndDate: null };
    this.getSessions();
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
    this.getSessions();
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

  sortData(column: any, asc: any) {
    this.filter.SortBy = column;
    this.filter.SortOrder = asc;
    this.getSessions();
  }
}
