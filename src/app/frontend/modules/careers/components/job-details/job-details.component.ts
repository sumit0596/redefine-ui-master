import { Component } from '@angular/core';
import { CareerService } from 'src/app/frontend/services/career.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { CommonStoreService } from 'src/app/services/common-store.service';
import { CONSTANTS } from 'src/app/models/constants';

@Component({
  selector: 'app-job-details',
  templateUrl: './job-details.component.html',
  styleUrls: ['./job-details.component.scss'],
})
export class JobDetailsComponent {
  bannerDetails: any;
  recentJobDetails: any;
  jobDetails: any;
  breadcrumbLinks: any;
  bannerText = 'Career Opportunities';
  slug: any;
  urlData: any;

  constructor(
    private careerService: CareerService,
    private toasterService: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
    private commonStoreService: CommonStoreService
  ) {
    this.route.paramMap.subscribe((params) => {
      this.slug = params.get(CONSTANTS.ROUTE_ID);
      this.getJobDetails(this.slug);
      this.getRecentJobs();
    });
  }

  ngOnInit() {
    this.getBanner();
    this.getJobDetails(this.route.snapshot.paramMap.get(CONSTANTS.ROUTE_ID));
    this.getRecentJobs();
  }

  getBanner() {
    this.careerService
      .getBanner('LEARNERSHIP_PAGE_BANNER')
      .subscribe((res: any) => (this.bannerDetails = res.data.Value));
  }

  getHovercolor(index: any) {
    let ele = document.getElementById('sens-data' + index) as HTMLElement;
    ele.style.color = '#fa0a0a';
    ele.style.marginLeft = '20px';
    ele.style.transition = '0.5s';
  }

  getLeavecolor(index: any) {
    let ele = document.getElementById('sens-data' + index) as HTMLElement;
    ele.style.color = '#000000';
    ele.style.marginLeft = '0px';
  }

  getJobDetails(slug: any) {
    this.careerService.getJobDetails(slug).subscribe({
      next: (res: any) => {
        this.jobDetails = res.data;
        this.urlData = {
          url : res.data.Slug,
          replacedUrl : res.data.Title
        };
        this.breadcrumbLinks = this.careerService.getJobApplicationRouterLinks(
          'job-details',
          this.jobDetails.Title
        );
      },
      error: (error: any) => {
        this.toasterService.error(error.error.message);
      },
    });
  }

  getRecentJobs() {
    this.careerService
      .getRecentJobs(this.slug)
      .subscribe((res: any) => {
        res.data.forEach((element: any) => {
          element.show = true;
        });
        this.recentJobDetails = res.data;
      })
    }

  jobDetailsPage(jobDetails: any) {
    let formConfig = {
      id: jobDetails.Slug,
    };
    this.recentJobDetails.forEach((x : any)=>{
      if(x == jobDetails){
        x.show = false;
      }
      else{
        x.show = true;
      }
  });
    this.router.navigate(['/careers/job-details/' + jobDetails.Slug]);
    this.getJobDetails(jobDetails.Slug);
  }

  applyJob(jobDetails: any) {
    let formConfig = {
      id: jobDetails.JobId,
    };
    this.commonStoreService.setFormConfig(formConfig);
    this.router.navigate(['/careers/job-application']);
  }
}
