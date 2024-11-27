import { Component } from '@angular/core';
import { PeopleService } from 'src/app/admin/services/people.service';
import { ToastrService } from 'ngx-toastr';
import { EncryptionService } from 'src/app/services/encryption.service';
import { ActivatedRoute, Router, UrlSegment, UrlTree } from '@angular/router';
import { EventService } from 'src/app/admin/services/event.service';
import { CareerService } from '../../services/career.service';
import { CONSTANTS } from 'src/app/models/constants';
import { CommonModule } from '@angular/common';
import { BannerBreadcrumbComponent } from '../banner-breadcrumb/banner-breadcrumb.component';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-investor-contacts',
  standalone: true,
  templateUrl: './investor-contacts.component.html',
  styleUrls: ['./investor-contacts.component.scss'],
  imports: [CommonModule, BannerBreadcrumbComponent, SharedModule],
})
export class InvestorContactsComponent {
  bannerDetails: any;
  quickLinks: any;
  bannerText = '';
  bannerSubText = '';
  breadcrumbLinks: any;

  peopleDetails: any;
  id: any;
  constructor(
    private peopleService: PeopleService,
    private toasterService: ToastrService,
    private encryptionService: EncryptionService,
    private route: ActivatedRoute,
    private router: Router,
    private eventService: EventService,
    private careerService: CareerService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.id = params[CONSTANTS.ROUTE_ID];
    });
    this.getPeopleById();
    this.getBanner();
    this.getQuickLinks();
  }

  getBanner() {
    this.careerService
      .getBanner('INVESTOR_PAGE_BANNER')
      .subscribe((res: any) => (this.bannerDetails = res.data.Value));
  }

  getQuickLinks() {
    this.eventService
      .getQuickLinks()
      .subscribe((res: any) => (this.quickLinks = res.data));
  }

  getPeopleById() {
    if (this.id) {
      let id = this.encryptionService?.decrypt(this.id);
      this.peopleService.viewPeopleFrontEnd(id).subscribe({
        next: (res: any) => {
          this.peopleDetails = res.data;

          this.bannerText = this.peopleDetails.EmployeeName;
          // this.updateBreadcrumb();
        },
        error: (error: any) => {
          if (error.error.message === 'Unable to find') {
            this.toasterService.error('No data found');
          } else {
            this.toasterService.error(error.error.message);
          }
        },
      });
    }
  }
  // updateBreadcrumb() {
  //   let urlTree: UrlTree = this.router.parseUrl(this.router.url);
  //   let urlPaths = urlTree.root.children['primary'].segments.map(
  //     (url: UrlSegment) => url.path
  //   );
  //   let url = urlPaths.join('/');
  //   this.router.navigate([url], {
  //     onSameUrlNavigation: 'reload',
  //     queryParams: urlTree.queryParams,
  //     state: {
  //       replace: urlPaths.at(-1),
  //       with: this.peopleDetails.EmployeeName,
  //     },
  //   });
  // }
}
