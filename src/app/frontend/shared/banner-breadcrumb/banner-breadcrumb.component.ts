import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { BreadcrumbsComponent } from '../breadcrumbs/breadcrumbs.component';

@Component({
  selector: 'app-banner-breadcrumb',
  standalone: true,
  templateUrl: './banner-breadcrumb.component.html',
  styleUrls: ['./banner-breadcrumb.component.scss'],
  imports: [CommonModule, BreadcrumbsComponent],
})
export class BannerBreadcrumbComponent {
  @Input() bannerDetails: any;
  @Input() bannerText: any;
  @Input() bannerSubText: any;
  @Input() breadcrumbLinks: any;
  @Input() urlData: any;
}
