import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { BreadcrumbsComponent } from '../breadcrumbs/breadcrumbs.component';


@Component({
  selector: 'header-banner-breadcrumb',
  templateUrl: './header-banner-breadcrumb.component.html',
  styleUrls: ['./header-banner-breadcrumb.component.scss'],
  standalone: true,
  imports: [CommonModule, BreadcrumbsComponent],
})
export class HeaderBannerBreadcrumbComponent {
  @Input() bannerDetails: any;
  @Input() bannerText: any;
  @Input() bannerSubText: any;
  @Input() breadcrumbLinks: any;
  @Input() urlData: any;
}
