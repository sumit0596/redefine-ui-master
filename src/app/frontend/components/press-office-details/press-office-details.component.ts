import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonStoreService } from 'src/app/services/common-store.service';
import { CareerService } from '../../services/career.service';
import { PressReleaseService } from 'src/app/admin/services/press-release.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { EventService } from 'src/app/admin/services/event.service';
import { CONSTANTS } from 'src/app/models/constants';
import { CommonModule } from '@angular/common';
import { QuickLinksComponent } from '../../shared/quick-links/quick-links.component';
import { BannerBreadcrumbComponent } from '../../shared/banner-breadcrumb/banner-breadcrumb.component';

@Component({
  selector: 'app-press-office-details',
  standalone: true,
  templateUrl: './press-office-details.component.html',
  styleUrls: ['./press-office-details.component.scss'],
  imports: [CommonModule, QuickLinksComponent, BannerBreadcrumbComponent],
})
export class PressOfficeDetailsComponent {
  formConfig: any;
  pressDetails: any;
  bannerDetails: any;
  recentPressDetails: any;
  bannerText = 'Press Office';
  slug: any;
  urlData: any;

  constructor(
    private commonStoreService: CommonStoreService,
    private pressService: PressReleaseService,
    private toasterService: ToastrService,
    private careerService: CareerService,
    private router: Router,
    private route: ActivatedRoute,
    private commonService: CommonService,
    private eventService: EventService
  ) {
    this.route.paramMap.subscribe((params) => {
      this.slug = params.get(CONSTANTS.ROUTE_ID);
      this.getPressDetails(this.slug);
      this.getRecentPress();
    });
  }

  async ngOnInit() {
    this.getBanner();
    this.getRecentPress();
  }

  getBanner() {
    this.careerService
      .getBanner('PRESS_OFFICE_PAGE_BANNER')
      .subscribe((res: any) => (this.bannerDetails = res.data.Value));
  }

  pressDetailsPage(press: any) {
    let formConfig = {
      id: press.Slug,
    };
    this.recentPressDetails.forEach((x: any) => {
      if (x == press) {
        x.show = false;
      } else {
        x.show = true;
      }
    });
    this.router.navigate(['/press-office/' + press.Slug]);
    this.getPressDetails(press.Slug);
  }

  getRecentPress() {
    this.pressService.getRecentPress(this.slug).subscribe({
      next: (res) => {
        this.sensData(res);
      },
      error: (error) => {
        this.toasterService.error(error.error.message);
      },
      complete: () => {},
    });
  }

  sensData(res: any) {
    if (res) {
      res.data.forEach((element: any) => {
      element.show = true;
    });
      this.recentPressDetails = res.data;
    }
  }

  getPressDetails(slug: any) {
    this.pressService.FrontendPressDetails(slug).subscribe({
      next: (res: any) => {
        this.urlData = {
          url: res.data.Slug,
          replacedUrl: res.data.Title,
        };
        this.pressDetails = res.data;
      },
      error: (error: any) => {
        this.toasterService.error(error.error.message);
      },
    });
  }

  getHovercolor(index: any) {
    let ele = document.getElementById('sens-data' + index) as HTMLElement;
    ele.style.color = '#fa0a0a';
    ele.style.marginLeft = '10px';
    ele.style.transition = '0.5s';
  }

  getLeavecolor(index: any) {
    let ele = document.getElementById('sens-data' + index) as HTMLElement;
    ele.style.color = '#000000';
    ele.style.marginLeft = '0px';
  }

  mediaQuery() {
    let data: any = {};
    data['pageName'] = 'press-office-details';
    this.router.navigate(['/press-office/media-enquiries'], {
      // relativeTo: this.route,
      state: { data },
    });
  }
}
