import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardService } from 'src/app/admin/services/dashboard.service';
import { Observable, of } from 'rxjs';
import { SharedModule } from 'src/app/shared/shared.module';
import { ToastrService } from 'ngx-toastr';
import { DashboardFilterComponent } from '../dashboard-filter/dashboard-filter.component';
import { CommonService } from 'src/app/shared/services/common.service';

@Component({
  selector: 'app-downloads',
  templateUrl: './downloads.component.html',
  styleUrls: ['./downloads.component.scss'],
})
export class DownloadsComponent {
  @ViewChild(DashboardFilterComponent) dashboardFilter!: DashboardFilterComponent;
  downloads$!: Observable<any>;
  downloadsData$!: Observable<any>;
  filter: any = {
    PageNo: 1,
    PerPage: 10,
    Days: 30,
    StartDate: '',
    EndDate: '',
    ExcludeStaff : 0
  };
  loading: boolean = false;
  downloadsCount: any;
  downloadDashboardPanelOpenState: boolean = true;
  selectedEventDays!: string;
  filterApplied: boolean = false;

  constructor(private dashboardService: DashboardService,
     private toasterService: ToastrService,
     private commonService: CommonService
    ) { }

  ngOnInit() {
    this.getDownloads();
    this.selectedEventDays = 'Last 30 Days'
  }
  handleFilterApplied(isApplied: boolean) {
    this.filterApplied = isApplied || this.filter.ExcludeStaff !== 0;
  }

  getDownloads() {
    this.loading = true;
    this.dashboardService
      .getDownloads(this.filter)
      .subscribe({
        next: (data) => {
          this.loading = false;
          this.setData(data);
        },
        error: (error) => {
          error.error.errors
            ? this.displayError(error.error.errors)
            : this.toasterService.error(error.error.message);
        },
      });
  }

  displayError(error: any) {
    let errors = JSON.parse(error);
    Object.keys(errors).forEach((err: any) => {
      this.toasterService.error(errors[err][0]);
    });
  }

  setData(data: any) {
    this.downloadsCount = data.Total;
    data?.res?.map((x: any) => {
      const file = x.DUrl.split('/');
      x.DUrl = file[file.length - 1];
    });
    this.downloads$ = of(data.res);
  }

  filterData(filter: any) {
    
    if (filter.Days === 0) {
      this.dateRangeSelect(filter)
    } else {
      this.dateRangeSelect(filter)
    }
    if(filter.Days == 30 && filter.ExcludeStaff == 0){
      this.filterApplied = false
    } else {
      this.filterApplied = this.filter.ExcludeStaff !== 0 || Object.values(filter).some(value => value !== 0);
    }
    this.loading = true;
    this.filter = filter;
    this.getDownloads();
  }

  refreshFilter(ev: MouseEvent) {
    ev.stopPropagation();
    // this.filter = { ...this.filter, Days: 30, PageNo: 1, StartDate: null, EndDate: null };
    this.getDownloads();
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
        this.selectedEventDays = day
      }
    }
  }
  badgereset(ev: MouseEvent){
    ev.stopPropagation();
    this.filter = { ...this.filter, Days: 30, PageNo: 1, StartDate: null, EndDate: null , ExcludeStaff : 0 };
    this.selectedEventDays = 'Last 30 Days'
    this.filterApplied = false; // Reset filterApplied to hide the badge
    this.dashboardFilter.resetSelectInput(); // Call resetSelectInput method  
    this.getDownloads();
  }
  downloadFile(DUrl:any){
    let extension = DUrl.split('.').pop();
    if (extension == 'pdf') {
      this.commonService.viewPdf(DUrl);
    } else {
      this.commonService.pdfDownload(DUrl);
    } 
  }
}
