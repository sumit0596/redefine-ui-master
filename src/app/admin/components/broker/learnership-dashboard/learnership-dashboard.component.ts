import { Component, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { DashboardService } from 'src/app/admin/services/dashboard.service';
import { DashboardFilterComponent } from '../dashboard-filter/dashboard-filter.component';

@Component({
  selector: 'app-learnership-dashboard',
  templateUrl: './learnership-dashboard.component.html',
  styleUrls: ['./learnership-dashboard.component.scss'],
})
export class LearnershipDashboardComponent {
  @ViewChild(DashboardFilterComponent) dashboardFilter!: DashboardFilterComponent;
  filter: any = {
    PageNo: 1,
    PerPage: 10,
    Days: 30,
    StartDate: '',
    EndDate: '',
  };

  loading: boolean = true;
  learnershipResults: any;
  learnershipPanelOpenState: boolean = true;
  selectedEventDays!: string;
  filterApplied: boolean = false;

  constructor(
    private dashboardService: DashboardService,
    private toasterService: ToastrService
  ) {}

  ngOnInit() {
    this.getLearnershipProgram();
    this.selectedEventDays = 'Last 30 Days'
  }

  getLearnershipProgram() {
    this.loading = true;
    this.dashboardService.getLearnershipDashboard(this.filter).subscribe({
      next: (data: any) => {
        this.loading = false;
        this.learnershipResults = data;
      },
      error: (error) => {
        this.toasterService.error(error.error.message);
      },
    });
  }

  filterData(filter: any) {
    
    if(filter.Days === 0) {
      this.dateRangeSelect(filter)
    }else{
      this.dateRangeSelect(filter)
    }
    if(filter.Days == 30 && filter.ExcludeStaff == 0){
      this.filterApplied = false
    } else {
      this.filterApplied = this.filter.ExcludeStaff !== 0 || Object.values(filter).some(value => value !== 0);
    }


    this.loading = true;
    this.filter = filter;
    this.getLearnershipProgram();
  }

  refreshFilter(ev: MouseEvent) {
    ev.stopPropagation();
    // this.filter = { ...this.filter, Days: 30, PageNo: 1, StartDate: null, EndDate: null };
    this.getLearnershipProgram();
  }
  dateRangeSelect(range: any) {
    if(range.Days === 0){
      const startDateParts = range.StartDate.split('-');
      const endDateParts = range.EndDate.split('-'); 
      const formattedStartDate = startDateParts.join('/');
      const formattedEndDate = endDateParts.join('/');
      this.selectedEventDays = formattedStartDate + ' - ' + formattedEndDate;
    }
  }
  selectedEventFilter(day: any) {
    if (this.selectedEventDays !== undefined) {
      if(day !== 'Custom Date'){
        this.selectedEventDays = day
      }
    }
  }
  badgereset(ev: MouseEvent){
    ev.stopPropagation();
    this.filter = { ...this.filter, Days: 30, PageNo: 1, StartDate: null, EndDate: null };
    this.selectedEventDays = 'Last 30 Days'
    this.filterApplied = false; // Reset filterApplied to hide the badge
    this.dashboardFilter.resetSelectInput(); // Call resetSelectInput method  
    this.getLearnershipProgram();
  }
  handleFilterApplied(isApplied: boolean) {
    this.filterApplied = isApplied || this.filter.ExcludeStaff !== 0;
  }
}
