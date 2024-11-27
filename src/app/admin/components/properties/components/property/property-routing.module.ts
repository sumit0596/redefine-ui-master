import { PropertyConfirmationComponent } from './components/property-confirmation/property-confirmation.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PropertyContactDetailsFormComponent } from './components/property-contact-details-form/property-contact-details-form.component';
import { PropertyDetailsFormComponent } from '../manage-properties/property-details-form/property-details-form.component';
import { PropertyFeaturesFormComponent } from './components/property-features-form/property-features-form.component';
import { PropertyMediaFormComponent } from './components/property-media-form/property-media-form.component';
import { PropertyPreviewComponent } from './components/property-preview/property-preview.component';
import { SeoFormComponent } from './components/seo-form/seo-form.component';
import { PropertyComponent } from './property.component';
import { PropertyEsgFeaturesComponent } from './components/property-esg-features/property-esg-features.component';

const routes: Routes = [
  {
    path: '',
    component: PropertyComponent,
    children: [
      {
        path: '',
        redirectTo: 'property-details',
        pathMatch: 'full',
      },
      {
        path: 'property-details',
        component: PropertyDetailsFormComponent,
      },
      {
        path: 'property-media',
        component: PropertyMediaFormComponent,
      },
      {
        path: 'contact-details',
        component: PropertyContactDetailsFormComponent,
      },

      {
        path: 'property-features',
        component: PropertyFeaturesFormComponent,
      },
      {
        path: 'property-preview',
        component: PropertyPreviewComponent,
      },
      { path: 'edit-seo', component: SeoFormComponent },
      {
        path: 'property-confirmation',
        component: PropertyConfirmationComponent,
      },
      {
        path: 'property-esg-features',
        component: PropertyEsgFeaturesComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PropertyRoutingModule {}
