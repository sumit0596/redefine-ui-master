import { JobListingDetailsFormComponent } from './components/job-listing/job-listing-details-form/job-listing-details-form.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ManageLearnershipApplicationsComponent } from './components/learnership/manage-learnership-applications/manage-learnership-applications.component';
import { HrComponent } from './hr.component';
import { ManageJobApplicationComponent } from './components/job-applications/manage-job-application/manage-job-application.component';
import { ApplicantFormComponent } from './components/job-applications/applicant-form/applicant-form.component';
import { ApplicationDetailsFormComponent } from './components/job-applications/application-details-form/application-details-form.component';
import { LearnershipApplicationDetailsFormComponent } from './components/learnership/learnership-application-details-form/learnership-application-details-form.component';
import { ManageJobListingsComponent } from './components/job-listing/manage-job-listings/manage-job-listings.component';
import { ManageTestimonialsComponent } from './components/testimonials/manage-testimonials/manage-testimonials.component';
import { TestimonialDetailsFormComponent } from './components/testimonials/testimonial-details-form/testimonial-details-form.component';

const routes: Routes = [
  {
    path: '',
    component: HrComponent,
    children: [
      {
        path: '',
        component: DashboardComponent,
      },
      {
        path: 'manage-learnership-applications',
        component: ManageLearnershipApplicationsComponent,
      },
      {
        path: 'manage-job-applications',
        component: ManageJobApplicationComponent,
      },
      {
        path: 'view-applicant-details',
        component: ApplicantFormComponent,
      },
      {
        path: 'view-application-details',
        component: ApplicationDetailsFormComponent,
      },
      {
        path: 'manage-learnership-applications',
        component: ManageLearnershipApplicationsComponent,
      },
      {
        path: 'learnership-application/view',
        component: LearnershipApplicationDetailsFormComponent,
      },
      {
        path: 'manage-job',
        component: ManageJobListingsComponent,
      },
      {
        path: 'create-job-listing',
        component: JobListingDetailsFormComponent,
      },
      {
        path: 'view-job-listing',
        component: JobListingDetailsFormComponent,
      },
      { path: 'edit-job-listing', component: JobListingDetailsFormComponent },
      {
        path: 'manage-testimonials',
        component: ManageTestimonialsComponent,
      },
      {
        path: 'create-testimonial',
        component: TestimonialDetailsFormComponent,
      },
      {
        path: 'view-testimonial',
        component: TestimonialDetailsFormComponent,
      },
      { path: 'edit-testimonial', component: TestimonialDetailsFormComponent },
      {
        path: 'custom-pages',
        loadChildren: () =>
          import('../page-builder/page-builder.module').then(
            (m) => m.PageBuilderModule
          ),
        data: { id: 3 },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HrRoutingModule {}
