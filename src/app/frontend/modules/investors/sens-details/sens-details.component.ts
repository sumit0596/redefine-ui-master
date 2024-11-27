import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { ToastrService } from 'ngx-toastr';
import { EventService } from 'src/app/admin/services/event.service';
import { SensService } from 'src/app/admin/services/sens.service';
import { CareerService } from 'src/app/frontend/services/career.service';
import { CONSTANTS, ROUTE } from 'src/app/models/constants';
import { CommonStoreService } from 'src/app/services/common-store.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { DripDialogComponent } from '../drip-dialog/drip-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-sens-details',
  templateUrl: './sens-details.component.html',
  styleUrls: ['./sens-details.component.scss'],
})
export class SensDetailsComponent implements OnInit {
  formConfig: any;
  sensDetails: any;
  bannerDetails: any;
  recentSensDetails: any;
  quickLinks: any;
  slug!: any;
  breadcrumbLinks: any;
  bannerText = 'SENS Announcements';
  urlData: any;
  constructor(
    private commonStoreService: CommonStoreService,
    private sensService: SensService,
    private toasterService: ToastrService,
    private careerService: CareerService,
    private router: Router,
    private route: ActivatedRoute,
    private commonService: CommonService,
    private eventService: EventService,
    private cookieService: CookieService,
    private dialog: MatDialog
  ) {
    this.route.paramMap.subscribe((params) => {
      this.slug = params.get(CONSTANTS.ROUTE_ID);
      this.getsensDetails(this.slug);
      this.getRecentSens();
    });
  }

  async ngOnInit() {
    this.breadcrumbLinks =
      this.eventService.getInvestorsRouterLinks('sens-announcements');
    this.getBanner();
    this.getRecentSens();
    this.quicklinks();
  }

  getBanner() {
    this.careerService
      .getBanner('SENS_PAGE_BANNER')
      .subscribe((res: any) => (this.bannerDetails = res.data.Value));
  }

  quicklinks() {
    this.sensService
      .getQuickLinks()
      .subscribe((res: any) => (this.quickLinks = res.data));
  }

  sensDetailsPage(sens: any) {
    let formConfig = {
      id: sens.Slug,
    };
    this.commonStoreService.setFormConfig(formConfig);
    if (
      (this.cookieService.get('DRIP_FILTER') == 'Success' &&
        sens.Drip == 'Yes') ||
      sens.Drip == 'No'
    ) {
      this.recentSensDetails.forEach((x: any) => {
        if (x == sens) {
          x.show = false;
        } else {
          x.show = true;
        }
      });
      this.router.navigate([ROUTE.SENS_DETAILS + sens.Slug]);
    } else if (this.cookieService.get('DRIP_FILTER') == '') {
      let data = {
        sens: sens,
        page: 'sens-announcement',
      };
      const dialogRef = this.dialog.open(DripDialogComponent, {
        height: '500px',
        data: data,
      });
      dialogRef.afterClosed().subscribe((result: any) => {
        if (result) {
          this.router.navigate([result]);
        }
      });
    }
  }

  getRecentSens() {
    this.sensService.getRecentSens(this.slug).subscribe({
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
       this.recentSensDetails = res.data;
    }
  }

  async configureForm() {
    //this.formConfig = await this.commonStoreService.getFormConfig();
  }

  getsensDetails(slug: any) {
    this.sensService.FrontendSensDetails(slug).subscribe({
      next: (res: any) => {
        this.urlData = {
          url : res.data.Slug,
          replacedUrl : res.data.Headline
        };
        this.sensDetails = res.data;
      },
      error: (error: any) => {
        this.toasterService.error(error.error.message);
      },
    });
  }

  getHovercolor(index: any) {
    this.commonService.getHovercolor(index, 'sens-data');
  }

  getLeavecolor(index: any) {
    this.commonService.getLeavecolor(index, 'sens-data');
  }
}
