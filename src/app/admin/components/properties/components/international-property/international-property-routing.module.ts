import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InternationalPropertyConfirmationComponent } from './components/international-property-confirmation/international-property-confirmation.component';
import { InternationalPropertyDetailsFormComponent } from './components/international-property-details-form/international-property-details-form.component';
import { InternationalPropertyFeaturesFormComponent } from './components/international-property-features-form/international-property-features-form.component';
import { InternationalPropertyMediaFormComponent } from './components/international-property-media-form/international-property-media-form.component';
import { InternationalPropertyPreviewComponent } from './components/international-property-preview/international-property-preview.component';
import { InternationalPropertyComponent } from './international-property.component';

const routes: Routes = [
  {
    path: '',
    component: InternationalPropertyComponent,
    children: [
      {
        path: '',
        redirectTo: 'international-property-details',
        pathMatch: 'full',
      },
      {
        path: 'international-property-details',
        component: InternationalPropertyDetailsFormComponent,
      },
      {
        path: 'international-property-media',
        component: InternationalPropertyMediaFormComponent,
      },

      {
        path: 'international-property-features',
        component: InternationalPropertyFeaturesFormComponent,
      },
      {
        path: 'international-property-preview',
        component: InternationalPropertyPreviewComponent,
      },
       {
        path: 'international-property-confirmation',
        component: InternationalPropertyConfirmationComponent,
      }
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InternationalPropertyRoutingModule {}
