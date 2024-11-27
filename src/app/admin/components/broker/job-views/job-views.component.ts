import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Observable, of } from 'rxjs';
import { DashboardService } from 'src/app/admin/services/dashboard.service';

@Component({
  selector: 'app-job-views',
  templateUrl: './job-views.component.html',
  styleUrls: ['./job-views.component.scss'],
})
export class JobViewsComponent {
  jobViews$!: Observable<any>;
  jobViewsData$!: Observable<any>;
  filter: any = {
    PageNo: 1,
    PerPage: 10,
    Days: 30,
    StartDate: '',
    EndDate: '',
  };
  jobViewsCount: number = 0;
  loading : boolean = false;

  constructor(
    private dashboardService: DashboardService,
    private toasterService: ToastrService
  ) {}

  ngOnInit() {
    this.getJobViews();
  }

  getJobViews() {
    this.dashboardService.getJobViews(this.filter).subscribe({
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
    this.jobViewsCount = data.Total;
    this.jobViews$ = of(data.res);
  }

  filterData(filter: any) {
    this.loading = true;
    this.filter = filter;
    this.getJobViews();
  }
}
