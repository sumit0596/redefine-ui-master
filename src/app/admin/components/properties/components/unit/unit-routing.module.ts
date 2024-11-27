import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UnitDetailsFormComponent } from './components/unit-details-form/unit-details-form.component';
import { UnitFeaturesFormComponent } from './components/unit-features-form/unit-features-form.component';
import { UnitMediaFormComponent } from './components/unit-media-form/unit-media-form.component';
import { UnitComponent } from './unit.component';

const routes: Routes = [
  {
    path: '',
    component: UnitComponent,
    children: [
      {
        path: 'unit-details',
        component: UnitDetailsFormComponent,
      },
      {
        path: 'unit-media',
        component: UnitMediaFormComponent,
      },
      {
        path: 'unit-features',
        component: UnitFeaturesFormComponent,
      },
      {
        path: '',
        redirectTo: 'unit-details',
        pathMatch: 'full',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UnitRoutingModule {}
