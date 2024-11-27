import { JobDetailsComponent } from './components/job-details/job-details.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ApplicationComponent } from './components/application/application.component';
import { JobAppliedComponent } from './components/job-applied/job-applied.component';
import { LearnershipApplicationFormComponent } from './components/learnership-application-form/learnership-application-form.component';
import { CONSTANTS } from 'src/app/models/constants';

const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('../custom-page-container/custom-page-container.module').then(
        (m) => m.CustomPageContainerModule
      ),
  },
  {
    path: 'job-application',
    component: ApplicationComponent,
  },
  {
    path: 'thank-you',
    loadComponent: () =>
      import('./components/thank-you/thank-you.component').then(
        (c) => c.ThankYouComponent
      ),
  },
  {
    path: 'job-applied',
    component: JobAppliedComponent,
  },
  {
    path: 'learnership-application',
    component: LearnershipApplicationFormComponent,
  },
  {
    path: `job-details/:${CONSTANTS.ROUTE_ID}`,
    component: JobDetailsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CareersRoutingModule {}
