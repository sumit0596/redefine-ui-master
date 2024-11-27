import { CommonModule, TitleCasePipe } from '@angular/common';
import { Component, Input, OnDestroy, OnChanges, OnInit } from '@angular/core';
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterModule,
  UrlSegment,
  UrlTree,
} from '@angular/router';
import { Subscription } from 'rxjs';
import { CONSTANTS } from 'src/app/models/constants';

@Component({
  selector: 'app-breadcrumbs',
  standalone: true,
  templateUrl: './breadcrumbs.component.html',
  styleUrls: ['./breadcrumbs.component.scss'],
  imports: [CommonModule, RouterModule],
})
export class BreadcrumbsComponent implements OnDestroy, OnChanges, OnInit {
  @Input() urlData: any;
  url!: string;
  splittedRoutes: any;
  routes: any = [];
  queryParams: any;
  routeSubscription!: Subscription;
  disabledRoutes: string[] = ['user', 'investor-information', 'stakeholders'];

  constructor(private router: Router, private titleCasePipe: TitleCasePipe) {}

  ngOnDestroy(): void {
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
  }

  ngOnChanges() {
    this.createBreadcrumbs();
  }

  ngOnInit() {
    this.routeSubscription = this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationEnd) {
        this.createBreadcrumbs();
      }
    });
    if (!this.routeSubscription.closed) {
      this.createBreadcrumbs();
    }
  }

  createBreadcrumbs() {
    this.routes = [];
    this.url = this.router?.url;
    const urlSegment = this.router.parseUrl(this.router.url);
    this.queryParams = Object.keys(urlSegment.queryParams)
      .map((key) => {
        return (
          encodeURIComponent(key) +
          '=' +
          encodeURIComponent(urlSegment.queryParams[key])
        );
      })
      .join('&');
    this.splittedRoutes = [...urlSegment.root.children['primary'].segments].map(
      (url: UrlSegment) => url.path
    );
    let basePath: string = '';
    this.routes = this.splittedRoutes.map((element: string, index: number) => {
      basePath = basePath ? `${basePath}/${element}` : element;
      const url = this.customizeBreadcrumb(basePath, element, index);
      return {
        name:
          history.state.replace === element
            ? history.state.with
            : this.titleCasePipe.transform(element.replaceAll('-', ' ')),
        url: url,
        active: !this.disabledRoutes.includes(element),
        isCurrent: index === this.splittedRoutes.length - 1,
      };
    });
    this.updateBreadcrumbs();
  }

  customizeBreadcrumb(basePath: string, element: any, index: number) {
    if (this.disabledRoutes.includes(element)) {
      return `${basePath}/${this.splittedRoutes[index + 1]}`;
    } else if (
      element == CONSTANTS.USER_ROUTE ||
      (basePath.includes(CONSTANTS.USER_ROUTE) &&
        this.splittedRoutes?.length - 1 == index)
    ) {
      return this.splittedRoutes?.length - 1 == index
        ? `${basePath}?${this.queryParams}`
        : `${basePath}/${this.splittedRoutes[this.splittedRoutes.length - 1]}?${
            this.queryParams
          }`;
    }
    return basePath;
  }

  updateBreadcrumbs() {
    if (this.urlData != undefined && this.routes.length > 0) {
      this.routes.forEach((x: any, i: any) => {
        if (
          x.name.split('/')[0]?.trim().toUpperCase() ==
          this.urlData.url.replaceAll('-', ' ')?.trim()?.toUpperCase()
        ) {
          x.name = this.urlData.replacedUrl;
        }
      });
    }
  }

  navigate(event: MouseEvent, route: any) {
    event?.preventDefault();
    const urlTree: UrlTree = this.router.parseUrl(route.url || '');
    const url: string = route.url.includes('?')
      ? route.url.split('?')[0]
      : route.url;
    if (route.url.includes('?')) {
      this.router.navigate([url], { queryParams: urlTree.queryParams });
    } else {
      this.router.navigate([url]);
    }
  }
}
