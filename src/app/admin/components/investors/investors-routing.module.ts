import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InvestorsComponent } from './investors.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ManageIntegratedReportComponent } from './components/integrated-report/manage-integrated-report/manage-integrated-report.component';
import { ManageCircularsComponent } from './components/circular/manage-circulars/manage-circulars.component';
import { CircularFormComponent } from './components/circular/circular-form/circular-form.component';
import { FinancialResultComponent } from './components/financial-result/financial-result.component';
import { FinancialResultFormComponent } from './components/financial-result/financial-result-form/financial-result-form.component';
import { ManagePresentationsComponent } from './components/presentation/manage-presentations/manage-presentations.component';
import { PresentationFormComponent } from './components/presentation/presentation-form/presentation-form.component';
import { ManageDebtProgrammeComponent } from './components/debt-programme/manage-debt-programme/manage-debt-programme.component';
import { DebtProgrammeFormComponent } from './components/debt-programme/debt-programme-form/debt-programme-form.component';
import { ManageSensComponent } from './components/sens/manage-sens/manage-sens.component';
import { SensFormComponent } from './components/sens/sens-form/sens-form.component';
import { IntegratedReportDetailsFormComponent } from './components/integrated-report/integrated-report-details-form/integrated-report-details-form.component';
import { PreviewIntegratedReportComponent } from './components/integrated-report/preview-integrated-report/preview-integrated-report.component';
import { ManagePressReleaseComponent } from './components/press-release/manage-press-release/manage-press-release.component';
import { PressReleaseFormComponent } from './components/press-release/press-release-form/press-release-form.component';
import { ManageEventsComponent } from './components/event/manage-events/manage-events.component';
import { EventFormComponent } from './components/event/event-form/event-form.component';
import { ManagePeopleComponent } from './components/people/manage-people/manage-people.component';
import { PeopleFormComponent } from './components/people/people-form/people-form.component';
import { BuilderComponent } from 'src/app/admin/components/page-builder/components/builder/builder.component';

const routes: Routes = [
  {
    path: '',
    component: InvestorsComponent,
    children: [
      {
        path: '',
        component: DashboardComponent,
      },
      {
        path: 'manage-financial-results',
        component: FinancialResultComponent,
      },
      {
        path: 'create-financial-result',
        component: FinancialResultFormComponent,
      },
      {
        path: 'edit-financial-result',
        component: FinancialResultFormComponent,
      },
      {
        path: 'view-financial-result',
        component: FinancialResultFormComponent,
      },
      {
        path: 'manage-integrated-reports',
        component: ManageIntegratedReportComponent,
      },
      {
        path: 'integrated-report/create',
        component: IntegratedReportDetailsFormComponent,
      },
      {
        path: 'integrated-report/edit',
        component: IntegratedReportDetailsFormComponent,
      },
      {
        path: 'integrated-report/view',
        component: IntegratedReportDetailsFormComponent,
      },
      // {
      //   path: 'integrated-report/preview',
      //   component: PreviewIntegratedReportComponent,
      // },
      {
        path: 'manage-circulars',
        component: ManageCircularsComponent,
      },
      {
        path: 'create-circular',
        component: CircularFormComponent,
      },
      {
        path: 'view-circular',
        component: CircularFormComponent,
      },
      { path: 'edit-circular', component: CircularFormComponent },
      {
        path: 'manage-presentations',
        component: ManagePresentationsComponent,
      },
      {
        path: 'create-presentation',
        component: PresentationFormComponent,
      },
      {
        path: 'view-presentation',
        component: PresentationFormComponent,
      },
      { path: 'edit-presentation', component: PresentationFormComponent },
      {
        path: 'manage-debt-programme',
        component: ManageDebtProgrammeComponent,
      },
      {
        path: 'create-debt-programme',
        component: DebtProgrammeFormComponent,
      },
      {
        path: 'view-debt-programme',
        component: DebtProgrammeFormComponent,
      },
      { path: 'edit-debt-programme', component: DebtProgrammeFormComponent },
      {
        path: 'manage-sens',
        component: ManageSensComponent,
      },
      {
        path: 'sens/view',
        component: SensFormComponent,
      },
      {
        path: 'manage-press-release',
        component: ManagePressReleaseComponent,
      },
      {
        path: 'press-release/create',
        component: PressReleaseFormComponent,
      },
      {
        path: 'press-release/edit',
        component: PressReleaseFormComponent,
      },
      {
        path: 'press-release/view',
        component: PressReleaseFormComponent,
      },
      {
        path: 'manage-events',
        component: ManageEventsComponent,
      },
      {
        path: 'create-event',
        component: EventFormComponent,
      },
      {
        path: 'view-event',
        component: EventFormComponent,
      },
      { path: 'edit-event', component: EventFormComponent },
      {
        path: 'manage-investor-contacts',
        component: ManagePeopleComponent,
      },
      {
        path: 'create-investor-contacts',
        component: PeopleFormComponent,
      },
      {
        path: 'view-investor-contacts',
        component: PeopleFormComponent,
      },
      { path: 'edit-investor-contacts', component: PeopleFormComponent },
      {
        path: 'custom-pages',
        loadChildren: () =>
          import('../page-builder/page-builder.module').then(
            (m) => m.PageBuilderModule
          ),
        data: { id: 2 },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InvestorsRoutingModule {}
