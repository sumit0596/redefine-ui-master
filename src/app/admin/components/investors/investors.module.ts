import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InvestorsRoutingModule } from './investors-routing.module';
import { InvestorsComponent } from './investors.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { IntegratedReportFormComponent } from './components/integrated-report/integrated-report-form/integrated-report-form.component';
import { ManageIntegratedReportComponent } from './components/integrated-report/manage-integrated-report/manage-integrated-report.component';
import { IntegratedReportDetailsFormComponent } from './components/integrated-report/integrated-report-details-form/integrated-report-details-form.component';
import { CircularFormComponent } from './components/circular/circular-form/circular-form.component';
import { ManageCircularsComponent } from './components/circular/manage-circulars/manage-circulars.component';
import { SharedModule } from '../../../shared/shared.module';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { FinancialResultComponent } from './components/financial-result/financial-result.component';
import { FinancialResultFormComponent } from './components/financial-result/financial-result-form/financial-result-form.component';
import { MatTabsModule } from '@angular/material/tabs';
import { ManageDebtProgrammeComponent } from './components/debt-programme/manage-debt-programme/manage-debt-programme.component';
import { ManageSensComponent } from './components/sens/manage-sens/manage-sens.component';
import { DebtProgrammeFormComponent } from './components/debt-programme/debt-programme-form/debt-programme-form.component';
import { IntegratedReportDialogComponent } from './components/integrated-report/integrated-report-dialog/integrated-report-dialog.component';
import { ManagePresentationsComponent } from './components/presentation/manage-presentations/manage-presentations.component';
import { PresentationFormComponent } from './components/presentation/presentation-form/presentation-form.component';
import { SensFormComponent } from './components/sens/sens-form/sens-form.component';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatMenuModule } from '@angular/material/menu';
import { FinancialResultDialogComponent } from './components/financial-result/financial-result-dialog/financial-result-dialog.component';
import { PreviewIntegratedReportComponent } from './components/integrated-report/preview-integrated-report/preview-integrated-report.component';
import { ManagePressReleaseComponent } from './components/press-release/manage-press-release/manage-press-release.component';
import { PressReleaseFormComponent } from './components/press-release/press-release-form/press-release-form.component';
import { PressReleaseDialogComponent } from './components/press-release/press-release-dialog/press-release-dialog.component';
import { EventFormComponent } from './components/event/event-form/event-form.component';
import { ManageEventsComponent } from './components/event/manage-events/manage-events.component';
import { PeopleFormComponent } from './components/people/people-form/people-form.component';
import { ManagePeopleComponent } from './components/people/manage-people/manage-people.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { SensAnnouncementsDialogComponent } from './components/sens/sens-announcements-dialog/sens-announcements-dialog.component';
import { CircularDialogComponent } from './components/circular/circular-dialog/circular-dialog.component';
import { FileModule } from 'src/app/shared/modules/file/file.module';
import { SelectModule } from 'src/app/shared/modules/select/select.module';
import { DatatableModule } from 'src/app/shared/modules/datatable/datatable.module';
import { SwitchModule } from 'src/app/shared/modules/switch/switch.module';
import { InputModule } from 'src/app/shared/modules/input/input.module';
import { EditorComponent } from 'src/app/shared/components/form-elements/editor/editor.component';
import { TimepickerComponent } from 'src/app/shared/components/form-elements/timepicker/timepicker.component';
import { TextareaComponent } from 'src/app/shared/components/form-elements/textarea/textarea.component';
import { CalendarComponent } from 'src/app/shared/components/form-elements/calender/calendar.component';
import { PortalComponent } from 'src/app/shared/components/portal/portal.component';
import { EventsDialogComponent } from './components/event/events-dialog/events-dialog.component';
import { PeopleDialogComponent } from './components/people/people-dialog/people-dialog.component';
import { DebtProgrammeDialogComponent } from './components/debt-programme/debt-programme-dialog/debt-programme-dialog.component';

@NgModule({
  declarations: [
    InvestorsComponent,
    DashboardComponent,
    ManageIntegratedReportComponent,
    IntegratedReportFormComponent,
    IntegratedReportDetailsFormComponent,
    IntegratedReportDialogComponent,
    CircularFormComponent,
    ManageCircularsComponent,
    FinancialResultComponent,
    FinancialResultFormComponent,
    PresentationFormComponent,
    ManagePresentationsComponent,
    DebtProgrammeFormComponent,
    ManageDebtProgrammeComponent,
    ManageSensComponent,
    SensFormComponent,
    FinancialResultDialogComponent,
    PreviewIntegratedReportComponent,
    ManagePressReleaseComponent,
    PressReleaseFormComponent,
    PressReleaseDialogComponent,
    EventFormComponent,
    ManageEventsComponent,
    PeopleFormComponent,
    ManagePeopleComponent,
    SensAnnouncementsDialogComponent,
    CircularDialogComponent,
    EventsDialogComponent,
    PeopleDialogComponent,
    DebtProgrammeDialogComponent,
  ],
  imports: [
    CommonModule,
    InvestorsRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    InvestorsRoutingModule,
    MatNativeDateModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatTabsModule,
    MatButtonModule,
    MatExpansionModule,
    MatMenuModule,
    MatDatepickerModule,
    FileModule,
    SelectModule,
    SwitchModule,
    DatatableModule,
    InputModule,
    EditorComponent,
    TimepickerComponent,
    TextareaComponent,
    CalendarComponent,
    PortalComponent
  ],
})
export class InvestorsModule {}
