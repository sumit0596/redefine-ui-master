import { EventService } from 'src/app/admin/services/event.service';
import { CommonModule } from '@angular/common';
import { Component, AfterViewInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { BannerBreadcrumbComponent } from '../../shared/banner-breadcrumb/banner-breadcrumb.component';
import { CareerService } from '../../services/career.service';

@Component({
  selector: 'app-form-dsar',
  standalone: true,
  templateUrl: './form-dsar.component.html',
  styleUrls: ['./form-dsar.component.scss'],
  imports: [CommonModule, RouterModule, BannerBreadcrumbComponent],
})
export class FormDsarComponent implements AfterViewInit {
  bannerText = 'Data Subject Request';
  breadcrumbLinks: any;
  bannerDetails: any;

  @ViewChild('myname') input: any;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private eventService: EventService,
    private careerService: CareerService
  ) {}

  ngOnInit() {
    this.breadcrumbLinks = this.eventService.getInvestorsRouterLinks(
      'Data-Subject-Request'
    );
    this.getBanner();
  }

  ngAfterViewInit() {
    const script = document.createElement('script');
    script.innerHTML = `(function (w,d,s,o,f,js,fjs) {w['365Compliance']=o;w[o] = w[o] || function () { (w[o].q = w[o].q || []).push(arguments) };js = d.createElement(s), fjs = d.getElementsByTagName(s)[0];js.id = o; js.src = f; js.async = 1; fjs.parentNode.insertBefore(js, fjs);}(window, document, 'script', 'mw', 'https://app.priviq.com/assets/js/365Compliance.min.js'));mw('init',{container:'form-dsar',thankYouUrl:null,key:'ba24f8bb-2421-4624-a45a-cd1d86cca2f0',host:'https://api.priviq.com'});mw('dsar');`;
    document.body.appendChild(script);
  }

  getBanner() {
    this.careerService
      .getBanner('DSAR_PAGE_BANNER')
      .subscribe((res: any) => (this.bannerDetails = res.data.Value));
  }
}
