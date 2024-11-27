import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HrComponent } from './hr.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { HrRoutingModule } from './hr-routing.module';
import { ManageLearnershipApplicationsComponent } from './components/learnership/manage-learnership-applications/manage-learnership-applications.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { LearnershipDialogComponent } from './components/learnership/learnership-dialog/learnership-dialog.component';
import { ManageJobApplicationComponent } from './components/job-applications/manage-job-application/manage-job-application.component';
import { ApplicantFormComponent } from './components/job-applications/applicant-form/applicant-form.component';
import { ApplicationDetailsFormComponent } from './components/job-applications/application-details-form/application-details-form.component';

import { LearnershipApplicationDetailsFormComponent } from './components/learnership/learnership-application-details-form/learnership-application-details-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatMenuModule } from '@angular/material/menu';
import { MatTabsModule } from '@angular/material/tabs';
import { ManageJobListingsComponent } from './components/job-listing/manage-job-listings/manage-job-listings.component';
import { JobListingDetailsFormComponent } from './components/job-listing/job-listing-details-form/job-listing-details-form.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDividerModule } from '@angular/material/divider';
import { JobListingDialogComponent } from './components/job-listing/job-listing-dialog/job-listing-dialog.component';
import { TestimonialDetailsFormComponent } from './components/testimonials/testimonial-details-form/testimonial-details-form.component';
import { ManageTestimonialsComponent } from './components/testimonials/manage-testimonials/manage-testimonials.component';
import { FileModule } from 'src/app/shared/modules/file/file.module';
import { SelectModule } from 'src/app/shared/modules/select/select.module';
import { DatatableModule } from 'src/app/shared/modules/datatable/datatable.module';
import { SwitchModule } from 'src/app/shared/modules/switch/switch.module';
import { InputModule } from 'src/app/shared/modules/input/input.module';
import { EditorComponent } from 'src/app/shared/components/form-elements/editor/editor.component';
import { TextareaComponent } from 'src/app/shared/components/form-elements/textarea/textarea.component';
import { CalendarComponent } from 'src/app/shared/components/form-elements/calender/calendar.component';
import { PortalComponent } from 'src/app/shared/components/portal/portal.component';

@NgModule({
  declarations: [
    HrComponent,
    DashboardComponent,
    ManageLearnershipApplicationsComponent,
    LearnershipDialogComponent,
    ManageJobApplicationComponent,
    ApplicantFormComponent,
    ApplicationDetailsFormComponent,
    LearnershipApplicationDetailsFormComponent,
    ManageJobListingsComponent,
    JobListingDetailsFormComponent,
    JobListingDialogComponent,
    TestimonialDetailsFormComponent,
    ManageTestimonialsComponent,
  ],
  imports: [
    CommonModule,
    HrRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    MatTabsModule,
    MatButtonModule,
    MatExpansionModule,
    MatMenuModule,
    MatDatepickerModule,
    MatDividerModule,
    FileModule,
    SelectModule,
    SwitchModule,
    DatatableModule,
    InputModule,
    EditorComponent,
    TextareaComponent,
    CalendarComponent,
    PortalComponent
  ],
})
export class HrModule {}
