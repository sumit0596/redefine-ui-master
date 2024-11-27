import { Component, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { DashboardService } from 'src/app/admin/services/dashboard.service';
import { DashboardFilterComponent } from '../dashboard-filter/dashboard-filter.component';

@Component({
  selector: 'app-financial-results-dashboard',
  templateUrl: './financial-results-dashboard.component.html',
  styleUrls: ['./financial-results-dashboard.component.scss'],
})
export class FinancialResultsDashboardComponent {
  @ViewChild(DashboardFilterComponent) dashboardFilter!: DashboardFilterComponent;
  filter: any = {
    PageNo: 1,
    PerPage: 10,
    Year: '',
    ExcludeStaff : 0
  };
  financialResults: any;
  loading: boolean = true;
  financialPanelOpenState: boolean = true;
  selectedEventDays!: string;
  filterApplied: boolean = false;
  columnGrid: boolean = false;
  columnClass: string = 'col-md-6';
  constructor(
    private dashboardService: DashboardService,
    private toasterService: ToastrService
  ) { }

  ngOnInit() {
    this.columnGrid = false;
    this.getFinancialResults();
    this.selectedEventDays = this.dashboardFilter?.maximumYear;
  }

  getFinancialResults() {
    this.loading = true;
    this.dashboardService.getFinancialResultsDashboard(this.filter).subscribe({
      next: (data) => {
        this.loading = false;
        this.financialResults = data.res;
        this.updateColumnClass();
      },
      error: (error) => {
        this.toasterService.error(error.error.message);
      },
    });
  }

  updateColumnClass() {
    const annual = this.financialResults?.AnnualResults;
    const interim = this.financialResults?.InterimResults;
    if (annual > 0 || interim > 0) {
      if (annual > 0 && interim > 0) {
        this.columnClass = 'col-md-6';
      } else if (this.columnGrid) {
        this.columnClass = 'col-md-6';
      } else {
        this.columnClass = 'col-md-12';
      }
    }
  }

  handleFilterApplied(isApplied: boolean) {
    this.filterApplied = isApplied || this.filter.ExcludeStaff !== 0;

  }
  filterData(filter: any) {

    if (filter.Year !== '') {
      this.columnGrid = true
    }
    if(filter.Year == '' && filter.ExcludeStaff == 0){
      this.filterApplied = false
    } else {
      this.filterApplied = this.filter.ExcludeStaff !== 0 || Object.values(filter).some(value => value !== 0);
    }


    // if(filter.Days === 0) {
    //   this.dateRangeSelect(filter)
    // }else{
    //   this.dateRangeSelect(filter)
    // }
    this.loading = true;
    this.filter = filter;
    this.getFinancialResults();
  }
  refreshFilter(ev: MouseEvent) {
    ev.stopPropagation();
    this.getFinancialResults();
  }

  selectedEventFilter(year: any) {
    this.selectedEventDays = year;
  }

  // dateRangeSelect(range: any) {
  //   if(range.Days === 0){
  //     const startDateParts = range.StartDate.split('-');
  //     const endDateParts = range.EndDate.split('-'); 
  //     const formattedStartDate = startDateParts.join('/');
  //     const formattedEndDate = endDateParts.join('/');
  //     this.selectedEventDays = formattedStartDate + ' - ' + formattedEndDate;
  //   }
  // }
  badgereset(ev: MouseEvent) {
    ev.stopPropagation();
    this.filter = { ...this.filter, Year: '' , ExcludeStaff : 0};
    this.filterApplied = false;
    this.columnGrid = false; // Reset filterApplied to hide the badge
    this.selectedEventDays = this.dashboardFilter?.maximumYear;
    // this.dashboardFilter.resetSelectInput(); // Call resetSelectInput method  
    this.getFinancialResults();
  }
}
