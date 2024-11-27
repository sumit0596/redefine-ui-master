import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CareerService } from 'src/app/frontend/services/career.service';

@Component({
  selector: 'app-job-applied',
  templateUrl: './job-applied.component.html',
  styleUrls: ['./job-applied.component.scss']
})
export class JobAppliedComponent {
  bannerDetails: any;
  breadcrumbLinks :any;
  bannerText ='Application';

  constructor(private careerService: CareerService, private router : Router){

  }

  ngOnInit(){
    this.breadcrumbLinks = this.careerService.getJobApplicationRouterLinks('job-application');
     this.getBanner();
  }

  getBanner(){
    this.careerService.getBanner('LEARNERSHIP_PAGE_BANNER').subscribe((res:any) => 
      this.bannerDetails = res.data.Value)
  }

  navigateTo(){
    this.router.navigate(['/']);
  }
}
