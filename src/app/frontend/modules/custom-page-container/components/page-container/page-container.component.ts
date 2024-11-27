import {
  AfterViewInit,
  Component,
  ComponentRef,
  EmbeddedViewRef,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewContainerRef,
} from '@angular/core';
import { ContactUsFormComponent } from 'src/app/frontend/components/contact-us-form/contact-us-form.component';
import { OurOfficesComponent } from 'src/app/frontend/components/our-offices/our-offices.component';
import { COMPONENT } from 'src/app/models/custom-components';
import { JobListComponent } from '../../../careers/components/job-list/job-list.component';
import { HomeContentCarousalComponent } from 'src/app/frontend/components/home-content-carousal/home-content-carousal.component';
import { BannerCarouselComponent } from 'src/app/frontend/components/banner-carousel/banner-carousel.component';
import { FeaturedPropertiesCarouselComponent } from 'src/app/frontend/shared/featured-properties-carousel/featured-properties-carousel.component';
import { TabsComponent } from 'src/app/frontend/components/tabs/tabs.component';
import { IngerestingFactComponent } from 'src/app/frontend/components/ingeresting-fact/ingeresting-fact.component';
import { InterestingFactsCardComponent } from 'src/app/frontend/components/interesting-facts-card/interesting-facts-card.component';
import { MediaEnquiryFormComponent } from 'src/app/frontend/components/media-enquiry-form/media-enquiry-form.component';
import { QuickLinksComponent } from 'src/app/frontend/shared/quick-links/quick-links.component';
import { BreadcrumbsComponent } from 'src/app/frontend/shared/breadcrumbs/breadcrumbs.component';
import { DOCUMENT } from '@angular/common';
import { Router, UrlTree } from '@angular/router';
import { CONSTANTS } from 'src/app/models/constants';
import {
  animate,
  query,
  sequence,
  stagger,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { CustomCarouselComponent } from 'src/app/frontend/components/custom-carousel/custom-carousel.component';
import { InvestorContactsContainerComponent } from '../../../investors/investor-contacts-container/investor-contacts-container.component';

export interface IComponentConfig {
  placeholderId: string;
  path: string;
  component: any;
  dependencies?: any[];
}

@Component({
  selector: 'app-page-container',
  templateUrl: './page-container.component.html',
  styleUrls: ['./page-container.component.scss'],
  animations: [
    trigger('fadeInAnimation', [
      transition('* => *', [
        query(
          ':enter',
          [
            style({ opacity: 0 }),
            stagger(100, [
              sequence([animate('400ms 500ms', style({ opacity: 1 }))]),
            ]),
          ],
          { optional: true }
        ),
      ]),
    ]),
  ],
})
export class PageContainerComponent
  implements OnInit, OnDestroy, AfterViewInit
{
  @Input() page!: any;
  @Input() isReplace: boolean = true;
  queryParams: any;
  componentsIds = COMPONENT;
  propertyUnits: any;
  dynamicComponent: IComponentConfig[] = [
    {
      placeholderId: COMPONENT.HOME_BANNER,
      path: '../../../../components/banner-carousel/banner-carousel.component', //src/app/frontend/components/banner-carousel/banner-carousel.component
      component: BannerCarouselComponent,
    },
    {
      placeholderId: COMPONENT.HOME_BANNER_CAROUSEL,
      path: '/src/app/frontend/components/banner-carousel/banner-carousel.component.ts',
      component: BannerCarouselComponent,
    },
    {
      placeholderId: COMPONENT.CUSTOM_CAROUSEL,
      path: '/src/app/frontend/components/custom-carousel/custom-carousel.component.ts',
      component: CustomCarouselComponent,
    },
    {
      placeholderId: COMPONENT.QUICK_LINKS,
      path: 'src/app/frontend/shared/quick-links/quick-links.component',
      component: QuickLinksComponent,
    },
    {
      placeholderId: COMPONENT.INVESTOR_CONTACTS,
      path: 'src/app/frontend/modules/investors/investor-contacts-container/investor-contacts-container.component',
      component: InvestorContactsContainerComponent,
    },
    {
      placeholderId: COMPONENT.BREADCRUMBS,
      path: 'src/app/frontend/shared/breadcrumbs/breadcrumbs.component',
      component: BreadcrumbsComponent,
    },
    {
      placeholderId: COMPONENT.CONTACT_US_FORM,
      path: 'src/app/frontend/components/contact-us-form/contact-us-form.component',
      component: ContactUsFormComponent,
    },
    {
      placeholderId: COMPONENT.MEDIA_ENQUIRY_FORM,
      path: 'src/app/frontend/components/media-enquiry-form/media-enquiry-form.component',
      component: MediaEnquiryFormComponent,
    },
    {
      placeholderId: COMPONENT.OUR_OFFICES,
      path: 'src/app/frontend/components/our-offices/our-offices.component',
      component: OurOfficesComponent,
    },
    {
      placeholderId: COMPONENT.JOB_VACANCIES,
      path: '../../../careers/components/job-list/job-list.component',
      component: JobListComponent,
    },
    {
      placeholderId: COMPONENT.CONTENT_CAROUSEL,
      path: 'src/app/frontend/components/home-content-carousal/home-content-carousal.component',
      component: HomeContentCarousalComponent,
    },
    {
      placeholderId: COMPONENT.TABS,
      path: 'src/app/frontend/components/tabs/tabs.component',
      component: TabsComponent,
    },
    {
      placeholderId: COMPONENT.FEATURED_PROPERTIES,
      path: 'src/app/frontend/shared/featured-properties-carousel/featured-properties-carousel.component',
      component: FeaturedPropertiesCarouselComponent,
    },
    {
      placeholderId: COMPONENT.INTERESTING_FACTS_CARD,
      path: 'src/app/frontend/components/interesting-facts-card/interesting-facts-card.component',
      component: InterestingFactsCardComponent,
    },
    {
      placeholderId: COMPONENT.INFO_NO_GRAPH,
      path: 'src/app/frontend/components/ingeresting-fact/ingeresting-fact.component',
      component: IngerestingFactComponent,
    },
  ];

  componentRefs: ComponentRef<any>[] = [];
  constructor(
    private viewContainerRef: ViewContainerRef,
    private renderer: Renderer2,
    private router: Router,
    @Inject(DOCUMENT) private document: Document
  ) {}
  ngOnInit(): void {
    this.applyStyle();
    setTimeout(() => {
      this.replacePlaceholders();
    }, 0);
  }
  ngAfterViewInit(): void {
    this.navigateUsingRouter();
  }
  ngOnDestroy() {
    this.componentRefs.forEach((componentRef: any) => {
      componentRef.destroy();
    });
  }
  applyStyle() {
    const styleElements = document.querySelectorAll('style');
    let hasStyleWithAttribute = false;
    let styleElement!: HTMLStyleElement;

    const el = document.createElement('div');
    el.innerHTML = this.page.details.Html; 
    const allImg = el.querySelectorAll('img');
    allImg.forEach((img,i) => {
      if(!img.hasAttribute('alt')){
        img.setAttribute('alt',this.page.details.Title ? this.page.details.Title + "-" + i : "Redefine" + "-" + i);
      }
    });
    this.page.details.Html = el.outerHTML; 

    styleElements.forEach((el: HTMLStyleElement) => {
      if (el.getAttribute('name') === this.page.details?.Route) {
        hasStyleWithAttribute = true;
        styleElement = el;
        return;
      }
    });
    const newStyleElement = document.createElement('style');
    newStyleElement.setAttribute('name', this.page.details?.Route || '');
    newStyleElement.textContent = this.page.details?.Css || '';
    if (hasStyleWithAttribute && styleElement && styleElement.parentNode) {
      styleElement.remove();
      document.head.appendChild(newStyleElement);
    } else {
      document.head.appendChild(newStyleElement);
    }
  }

  replacePlaceholders() {
    if (this.isReplace) {
      this.dynamicComponent.forEach((component: IComponentConfig) => {
        this.replacePlaceholder(component);
      });
    }
  }

  async replacePlaceholder(component: IComponentConfig) {
    // const placeholderEle = document.getElementById(
    //   component.placeholderId
    // ) as HTMLElement;
    const placeholderEles = document.querySelectorAll(
      `[id^="${component.placeholderId}"]`
    )as NodeListOf<Element>;
    
    if (placeholderEles?.length != 0) {
      const parent = placeholderEles[0].parentElement;
     placeholderEles.forEach(element => {
      const placeholderEle = element as HTMLElement;
      
        const componentRef = this.viewContainerRef.createComponent(
          component.component
        );
        if (component.placeholderId === COMPONENT.CUSTOM_CAROUSEL) {
          componentRef.setInput('id', component.placeholderId);
        }

        if (component.placeholderId === COMPONENT.INVESTOR_CONTACTS) {
          let contactIds = Array.from(placeholderEle.children).map((child) =>
            child.getAttribute('data-people-id')
          );
          componentRef.setInput('contactIds', contactIds);
        }

        this.componentRefs.push(componentRef);
        const domElement = (componentRef.hostView as EmbeddedViewRef<any>)
          .rootNodes[0] as HTMLElement;
        this.renderer.insertBefore(parent, domElement, placeholderEle);
        this.renderer.removeChild(parent, placeholderEle);
     });
      
    }
    // if (placeholderEle) {
    //   const parent = placeholderEle.parentElement;

    //   const componentRef = this.viewContainerRef.createComponent(
    //     component.component
    //   );
    //   if (component.placeholderId === COMPONENT.CUSTOM_CAROUSEL) {
    //     componentRef.setInput('id', component.placeholderId);
    //   }

    //   if (component.placeholderId === COMPONENT.INVESTOR_CONTACTS) {
    //     let contactIds = Array.from(placeholderEle.children).map((child) =>
    //       child.getAttribute('data-people-id')
    //     );
    //     componentRef.setInput('contactIds', contactIds);
    //   }

    //   this.componentRefs.push(componentRef);
    //   const domElement = (componentRef.hostView as EmbeddedViewRef<any>)
    //     .rootNodes[0] as HTMLElement;
    //   this.renderer.insertBefore(parent, domElement, placeholderEle);
    //   this.renderer.removeChild(parent, placeholderEle);
    // }
  }

  navigateUsingRouter() {
    const links = this.document?.querySelectorAll(
      'a[data-type-id="rd-link-button"], a[data-custom-page="true"]'
    );
    if (links?.length) {
      links.forEach((el: any) => {
        el.addEventListener('click', (e: MouseEvent) => {
          let ele = e?.currentTarget as HTMLAnchorElement;
          let href = ele?.getAttribute('href');

          if (href?.includes('http')) {
            e.preventDefault();
            // 1. if https then open in new tab
            window.open(href ? href : '', '_blank');
          } else if (href?.indexOf('.pdf') != -1) {
            e.preventDefault();
            // 2. if .pdf open in new tab with view-file
            window.open(href ? href : '', '_blank');
          } else if (href?.includes('mailto:') || href?.includes('tel:')) {
          } else {
            e.preventDefault();
            // 3. neither of them, then navigate through router
            const urlTree: UrlTree = this.router.parseUrl(href || '');
            this.queryParams = urlTree.queryParams;
            href = href?.includes('?') ? href.split('?')[0] : href;
            if (href?.includes(`${CONSTANTS.USER_ROUTE}/`)) {
              href = `${this.router.url}/${href}`;
            }
            this.router.navigate([href], { queryParams: this.queryParams });
          }
        });
      });
    }
  }
}
