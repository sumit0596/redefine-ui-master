import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import { MsalService, MsalBroadcastService } from '@azure/msal-angular';
import { InteractionStatus } from '@azure/msal-browser';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { AdAzureService } from './services/adazure.service';
import { SeoService } from './services/seo.service';
import {
  Router,
  RouterOutlet,
  NavigationEnd,
  ActivatedRoute,
} from '@angular/router';
import { environment } from 'src/environments/environment.dev';
import { TagManagerService } from './shared/services/tag-manager.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { CanonicalService } from './shared/services/canonical.service';
declare function Analytics(domain: any, token: any): any;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnDestroy, AfterViewInit {
  title = 'Redefine Properties';
  isIframe = false;
  private readonly _destroying$ = new Subject<void>();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private adAzureService: AdAzureService,
    private commonService: CommonService,
    private authService: MsalService,
    private seoService: SeoService,
    private msalBroadcastService: MsalBroadcastService,
    private tagManagerService: TagManagerService,
    private canonicalService: CanonicalService
  ) {
    if (environment.ENV_TYPE == 3) {
      //this.tagManagerService.initialize('GTM-PPZNKZ', 'KOI-1FZ71YJH9YU6WG');
    }
  }
  ngAfterViewInit(): void {
    // Analytics(environment.apiBaseUrl, environment.apiToken);
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      let utm_campaign = params?.['utm_campaign'];
      if (utm_campaign) {
        this.commonService.setCompaign(
          utm_campaign,
          params?.['utm_medium'],
          params?.['utm_source'],
          params?.['utm_content'],
          params?.['utm_term'],
          params?.['gclid'] ? params?.['gclid'] : params?.['fbclid']
        );
      }
    });

    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        if (event instanceof NavigationEnd) {
          // Set the canonical URL
          this.canonicalService.setCanonicalURL(
            window.location.origin + window.location.pathname
          );

          let t:any = window.location.pathname?.split('/')?.pop();
          document.querySelector('body')?.setAttribute('id',t?t:'home');
          
          if (
            event.url?.includes('/need-space/') ||
            event.url?.includes('/properties/') 
          ) {
            this.seoService.updatePropertySeo(
              event.url.split('?')[0].replace('/need-space/', '').replace('/properties/', '').replace('/thank-you', '').replace('/enquiry/user-details', '')
            );
          } else if (event.url?.includes('/update-password/')) {
              let pageTitle = 'Update Password';
              this.seoService.updateSeo(
                pageTitle + ' | Redefine Properties',
                '',
                "Redefine is a trusted partner in the property market, with a focus on owning, developing and managing quality property. We're not landlords. We're people."
              );
          } else if (event.url?.includes('/propertyeq/articles/')) {
            this.seoService.updatePropertyEQSeoDetails(
              event.url?.replace('/propertyeq/articles/', ''),
              2
            );    
          } else if (event.url?.includes('/propertyeq/press-office/')) {
            this.seoService.updatePropertyEQSeoDetails(
              event.url?.replace('/propertyeq/press-office/', ''),
              3
            );
          } else if (event.url?.includes('/propertyeq/videos/')) {
            this.seoService.updatePropertyEQSeoDetails(
              event.url?.replace('/propertyeq/videos/', ''),
              1
            );
          } else {
              const urlTree = this.router.parseUrl(this.router.url);

              let urlSegments =
                urlTree?.root?.children && urlTree.root.children['primary']
                  ? [...urlTree.root.children['primary']?.segments]
                  : [];

              let lastUrlSegment = urlSegments[urlSegments.length - 1]?.path;
              let pageTitle = "We're not landlords. We're people";

              if (lastUrlSegment != '' && lastUrlSegment != undefined) {
                pageTitle = lastUrlSegment?.replaceAll('-', ' ');
                pageTitle = pageTitle[0].toUpperCase() + pageTitle.slice(1);
              }

              this.seoService.updateSeo(
                pageTitle + ' | Redefine Properties',
                '',
                "Redefine is a trusted partner in the property market, with a focus on owning, developing and managing quality property. We're not landlords. We're people."
              );
            }
            Analytics(environment.apiBaseUrl, environment.apiToken);
        }
      });

    if (this.authService.instance.getAllAccounts().length == 0) {
      this.isIframe = window !== window.parent && !window.opener;

      this.msalBroadcastService.inProgress$
        .pipe(
          filter(
            (status: InteractionStatus) => status === InteractionStatus.None
          ),
          takeUntil(this._destroying$)
        )
        .subscribe(() => {
          this.setLoginDisplay();
        });
    }
  }

  setLoginDisplay() {
    if (this.authService.instance.getAllAccounts().length > 0) {
      this.adAzureService.webLogin(
        this.authService.instance.getAllAccounts()[0]['username']
      );
    }
  }

  ngOnDestroy(): void {
    this._destroying$.next(undefined);
    this._destroying$.complete();
  }
}
