import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CareerService } from 'src/app/frontend/services/career.service';
import { HomePageService } from 'src/app/frontend/services/home-page.service';
import { BannerBreadcrumbComponent } from 'src/app/frontend/shared/banner-breadcrumb/banner-breadcrumb.component';
import { ROUTE } from 'src/app/models/constants';
import { CommonStoreService } from 'src/app/services/common-store.service';

@Component({
  selector: 'app-thank-you',
  standalone: true,
  templateUrl: './thank-you.component.html',
  styleUrls: ['./thank-you.component.scss'],
  imports: [BannerBreadcrumbComponent, RouterModule],
})
export class ThankYouComponent {
  bannerDetails: any;
  bannerText = 'Thank you';
  breadcrumbLinks: any;
  slug: any;
  propertyName: any;
  formConfig: any;

  constructor(
    private careerService: CareerService,
    private homePageService: HomePageService,
    private route: ActivatedRoute,
    private router: Router,
    private commonStoreService: CommonStoreService
  ) {
    this.route.paramMap.subscribe((params) => {
      this.slug = params.get('slug');
    });

    this.configreForm();
  }

  async configreForm() {
    this.formConfig = await this.commonStoreService.getFormConfig();
  }

  ngOnInit() {
    // this.breadcrumbLinks = this.homePageService.getThankyouRouterLinks('properties', this.propertyName);
    this.getBanner();
  }
  getBanner() {
    this.careerService
      .getBanner('THANKU_PAGE_BANNER')
      .subscribe((res: any) => (this.bannerDetails = res.data.Value));
  }

  gotoProperties() {
    this.router.navigate([ROUTE.FRONTEND_SA_PROPERTIES]);
  }
}
