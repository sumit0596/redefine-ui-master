import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { map, take } from 'rxjs';
import { CareerService } from 'src/app/frontend/services/career.service';
import { BannerBreadcrumbComponent } from 'src/app/frontend/shared/banner-breadcrumb/banner-breadcrumb.component';
import { ROUTE } from 'src/app/models/constants';

@Component({
  selector: 'app-thank-you',
  standalone: true,
  templateUrl: './thank-you.component.html',
  styleUrls: ['./thank-you.component.scss'],
  imports: [BannerBreadcrumbComponent],
})
export class ThankYouComponent {
  bannerDetails: any;
  slug: any;
  breadcrumbLinks: any;
  bannerText = 'Application';

  constructor(
    private careerService: CareerService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.route.paramMap
      .pipe(
        take(1), //take(1) is for unsubscribe
        map(() => window.history.state)
      )
      .subscribe((res) => {
        this.slug = res.data;
      });
  }

  ngOnInit() {
    if (this.slug == 'job-application') {
      this.breadcrumbLinks =
        this.careerService.getJobApplicationRouterLinks('job-application');
    } else if (this.slug == 'learnership-application') {
      this.breadcrumbLinks = this.careerService.getJobApplicationRouterLinks(
        'learnership-application'
      );
    }
    window.scroll(0, 0);
    this.getBanner();
  }

  getBanner() {
    this.careerService
      .getBanner('LEARNERSHIP_PAGE_BANNER')
      .subscribe((res: any) => (this.bannerDetails = res.data.Value));
  }

  manage() {
    this.router.navigate([ROUTE.FRONTEND_CAREERS_OPPORTUNITIES]);
  }
}
