import { NgModule } from '@angular/core';
import {
  RouterModule,
  Routes,
  UrlMatchResult,
  UrlMatcher,
  UrlSegment,
} from '@angular/router';
import { FrontendComponent } from './frontend.component';
import { CONSTANTS } from '../models/constants';
import { PROPERTY_TYPE } from '../models/enum';
import { ShareButtonComponent } from './shared/share-button/share-button.component';
import { PropertyeqPressOfficeComponent } from './components/propertyeq-frontend/propertyeq-press-office/propertyeq-press-office.component';
import { PropertyeqPressOfficeDetailsComponent } from './components/propertyeq-frontend/propertyeq-press-office-details/propertyeq-press-office-details.component';
import { PropertyeqVideoComponent } from './components/propertyeq-frontend/propertyeq-video/propertyeq-video.component';

const userDetailMatcher: UrlMatcher = (
  urlSegments: UrlSegment[]
): UrlMatchResult | null => {
  if (
    urlSegments?.length > 1 &&
    urlSegments.some((segment: UrlSegment) => segment.path == 'user')
  ) {
    let id = urlSegments[urlSegments.length - 1];
    return {
      consumed: urlSegments,
      posParams: {
        id,
      },
    };
  } else {
    return null;
  }
};
const routes: Routes = [
  {
    path: '',
    component: FrontendComponent,
    children: [
      {
        path: 'propertyeq',
        loadComponent: () =>
          import(
            './components/propertyeq-frontend/propertyeq-frontend.component'
          ).then((c) => c.PropertyeqFrontendComponent),
      },
      {
        path: 'propertyeq/articles',
        loadComponent: () =>
          import(
            './components/propertyeq-frontend/propertyeq-article-list/article-list.component'
          ).then((c) => c.ArticleListComponent),
      },
      {
        path: `propertyeq/articles/:${CONSTANTS.ROUTE_ID}`,
        loadComponent: () =>
          import(
            './components/propertyeq-frontend/propertyeq-article-details/article.component'
          ).then((c) => c.ArticleComponent),
      },
      /*{
        path: 'propertyeq/article-list/:id',
        loadComponent: () =>
          import('./components/propertyeq-frontend/article/article.component').then(
            (c) => c.ArticleComponent
          ),
        component: PropertyeqFrontendComponent,
      },*/
      {
        path: 'propertyeq/videos',
        loadComponent: () =>
          import(
            './components/propertyeq-frontend/propertyeq-video/propertyeq-video.component'
          ).then((c) => c.PropertyeqVideoComponent),
      },
      {
        path: `propertyeq/videos/:${CONSTANTS.ROUTE_ID}`,
        loadComponent: () =>
          import('./components/propertyeq-frontend/propertyeq-video-details/propertyeq-video-details.component').then(
            (c) => c.PropertyeqVideoDetailsComponent),
      },
      {
        path: 'propertyeq/press-office',
        component: PropertyeqPressOfficeComponent,
      },
      {
        path: `propertyeq/press-office/:${CONSTANTS.ROUTE_ID}`,
        component: PropertyeqPressOfficeDetailsComponent,
      },

      {
        path: 'iframe',
        loadComponent: () =>
          import('./components/iframe/iframe.component').then(
            (c) => c.IframeComponent
          ),
      },
      {
        path: 'home-page',
        loadComponent: () =>
          import('./components/home-page/home-page.component').then(
            (c) => c.HomePageComponent
          ),
      },
      {
        path: 'need-space',
        loadComponent: () =>
          import('./components/needspace/needspace.component').then(
            (c) => c.NeedspaceComponent
          ),
        runGuardsAndResolvers: 'paramsOrQueryParamsChange',
      },
      {
        path: `need-space/:${CONSTANTS.ROUTE_ID}`,
        loadComponent: () =>
          import('./shared/property-details/property-details.component').then(
            (c) => c.PropertyDetailsComponent
          ),
        runGuardsAndResolvers: 'paramsOrQueryParamsChange',
      },
      {
        path: `need-space/:${CONSTANTS.ROUTE_ID}/enquiry`,
        loadComponent: () =>
          import('./components/manage-enquiry/manage-enquiry.component').then(
            (c) => c.ManageEnquiryComponent
          ),
      },
      {
        path: `need-space/:${CONSTANTS.ROUTE_ID}/enquiry/user-details`,
        loadComponent: () =>
          import('./components/enquiry-form/enquiry-form.component').then(
            (c) => c.EnquiryFormComponent
          ),
      },
      {
        path: 'data-subject-request',
        loadComponent: () =>
          import('./components/form-dsar/form-dsar.component').then(
            (c) => c.FormDsarComponent
          ),
      },
      {
        path: 'search',
        loadComponent: () =>
          import('./components/search/search.component').then(
            (c) => c.SearchComponent
          ),
      },
      {
        path: 'share',
        component: ShareButtonComponent,
      },
      {
        path: 'pre-login',
        loadComponent: () =>
          import('./components/pre-login/pre-login.component').then(
            (c) => c.PreLoginComponent
          ),
      },
      {
        path: 'press-office',
        loadComponent: () =>
          import('./components/press-office/press-office.component').then(
            (c) => c.PressOfficeComponent
          ),
        runGuardsAndResolvers: 'paramsOrQueryParamsChange',
      },
      {
        path: 'press-office/media-enquiries',
        loadChildren: () =>
          import(
            './modules/custom-page-container/custom-page-container.module'
          ).then((m) => m.CustomPageContainerModule),
      },
      {
        path: 'propertyeq/press-office/media-enquiries',
        loadChildren: () =>
          import(
            './modules/custom-page-container/custom-page-container.module'
          ).then((m) => m.CustomPageContainerModule),
      },
      {
        path: 'propertyeq/articles/press-office/media-enquiries',
        loadChildren: () =>
          import(
            './modules/custom-page-container/custom-page-container.module'
          ).then((m) => m.CustomPageContainerModule),
      },
      {
        path: `press-office/:${CONSTANTS.ROUTE_ID}/thank-you`,
        loadComponent: () =>
          import('./shared/thank-you/thank-you.component').then(
            (c) => c.ThankYouComponent
          ),
      },
      {
        path: `press-office/:${CONSTANTS.ROUTE_ID}`,
        loadComponent: () =>
          import(
            './components/press-office-details/press-office-details.component'
          ).then((c) => c.PressOfficeDetailsComponent),
      },
      {
        path: `propertyeq/press-office/:${CONSTANTS.ROUTE_SLUG}`,
        loadComponent: () =>
          import(
            './components/propertyeq-frontend/propertyeq-press-office-details/propertyeq-press-office-details.component'
          ).then((c) => c.PropertyeqPressOfficeDetailsComponent),
      },
      {
        path: ':slug/thank-you',
        loadComponent: () =>
          import('./shared/thank-you/thank-you.component').then(
            (c) => c.ThankYouComponent
          ),
      },
      {
        path: 'need-space/:slug/thank-you',
        loadComponent: () =>
          import('./shared/thank-you/thank-you.component').then(
            (c) => c.ThankYouComponent
          ),
      },
      {
        path: 'properties/:slug/thank-you',
        loadComponent: () =>
          import('./shared/thank-you/thank-you.component').then(
            (c) => c.ThankYouComponent
          ),
      },
      {
        path: 'not-found',
        loadComponent: () =>
          import('./shared/page-not-found/page-not-found.component').then(
            (c) => c.PageNotFoundComponent
          ),
      },
      {
        matcher: userDetailMatcher,
        loadComponent: () =>
          import('./shared/investor-contacts/investor-contacts.component').then(
            (c) => c.InvestorContactsComponent
          ),
      },
      {
        path: 'international-properties',
        loadChildren: () =>
          import(
            './modules/international-business/international-business.module'
          ).then((m) => m.InternationalBusinessModule),
        runGuardsAndResolvers: 'paramsOrQueryParamsChange',
        data: { propertyType: PROPERTY_TYPE.INTERNATIONAL },
      },
      {
        path: 'careers',
        loadChildren: () =>
          import('./modules/careers/careers.module').then(
            (m) => m.CareersModule
          ),
      },
      {
        path: 'properties',
        loadChildren: () =>
          import('./modules/properties/properties.module').then(
            (m) => m.PropertiesModule
          ),
        data: { propertyType: PROPERTY_TYPE.SOUTH_AFRICA },
      },
      {
        path: 'investors',
        loadChildren: () =>
          import('./modules/investors/investors.module').then(
            (m) => m.InvestorsModule
          ),
      },
      {
        path: 'maintenance',
        loadComponent: () =>
          import(
            './shared/maintenance/maintenance.component'
          ).then((c) => c.MaintenanceComponent),
      },
      {
        path: '**',
        loadChildren: () =>
          import(
            './modules/custom-page-container/custom-page-container.module'
          ).then((m) => m.CustomPageContainerModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FrontendRoutingModule {}
