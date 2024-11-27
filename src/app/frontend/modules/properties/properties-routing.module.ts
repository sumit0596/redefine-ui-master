import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PropertyLandingComponent } from './components/property-landing/property-landing.component';
import { CONSTANTS } from 'src/app/models/constants';
import { PropertiesComponent } from './properties.component';

const routes: Routes = [
  {
    path: '',
    component: PropertiesComponent,
    children: [
      {
        path: '',
        component: PropertyLandingComponent,
        runGuardsAndResolvers: 'paramsOrQueryParamsChange',
      },
      {
        path: `:${CONSTANTS.ROUTE_ID}`,
        loadComponent: () =>
          import(
            '../../shared/property-details/property-details.component'
          ).then((c) => c.PropertyDetailsComponent),
      },
      {
        path: `:${CONSTANTS.ROUTE_ID}/thank-you`,
        loadComponent: () =>
          import('src/app/frontend/shared/thank-you/thank-you.component').then(
            (c) => c.ThankYouComponent
          ),
      },
      {
        path: `:${CONSTANTS.ROUTE_ID}/enquiry`,
        loadComponent: () =>
          import(
            '../../components/manage-enquiry/manage-enquiry.component'
          ).then((c) => c.ManageEnquiryComponent),
      },
      {
        path: `:${CONSTANTS.ROUTE_ID}/enquiry/user-details`,
        loadComponent: () =>
          import('../../components/enquiry-form/enquiry-form.component').then(
            (c) => c.EnquiryFormComponent
          ),
      },
    ],
  },
  {
    path: ':slug/thank-you',
    component: PropertyLandingComponent,
  },
  {
    path: '**',
    loadChildren: () =>
      import('../custom-page-container/custom-page-container.module').then(
        (m) => m.CustomPageContainerModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PropertiesRoutingModule {}
