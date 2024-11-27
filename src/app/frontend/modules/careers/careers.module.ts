import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CareersRoutingModule } from './careers-routing.module';
import { CareerLandingPageComponent } from './components/career-landing-page/career-landing-page.component';
import { CareerLearnershipComponent } from './components/career-learnership/career-learnership.component';
import { CareersComponent } from './careers.component';
import { ApplicationComponent } from './components/application/application.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { JobAppliedComponent } from './components/job-applied/job-applied.component';
import { LearnershipApplicationFormComponent } from './components/learnership-application-form/learnership-application-form.component';
import { JobDetailsComponent } from './components/job-details/job-details.component';
import { JobListComponent } from './components/job-list/job-list.component';
import { FileModule } from 'src/app/shared/modules/file/file.module';
import { SelectModule } from 'src/app/shared/modules/select/select.module';
import { SwitchModule } from 'src/app/shared/modules/switch/switch.module';
import { InputModule } from 'src/app/shared/modules/input/input.module';
import { TextareaComponent } from 'src/app/shared/components/form-elements/textarea/textarea.component';
import { CaptchaComponent } from '../../shared/captcha/captcha.component';
import { CalendarComponent } from 'src/app/shared/components/form-elements/calender/calendar.component';
import { BannerBreadcrumbComponent } from '../../shared/banner-breadcrumb/banner-breadcrumb.component';
import { MatTabsModule } from '@angular/material/tabs';

@NgModule({
  declarations: [
    CareerLandingPageComponent,
    CareerLearnershipComponent,
    CareersComponent,
    ApplicationComponent,
    JobAppliedComponent,
    LearnershipApplicationFormComponent,
    JobDetailsComponent,
    JobListComponent,
  ],
  imports: [
    CommonModule,
    CareersRoutingModule,
    ReactiveFormsModule,
    SharedModule,
    FileModule,
    SelectModule,
    SwitchModule,
    InputModule,
    TextareaComponent,
    CaptchaComponent,
    CalendarComponent,
    BannerBreadcrumbComponent,
    MatTabsModule
  ],
})
export class CareersModule {}
