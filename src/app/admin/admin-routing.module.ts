import { EsgModule } from './components/esg/esg.module';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin.component';
import { BrokerProfileFormComponent } from './components/broker/broker-profile-form/broker-profile-form.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { HelpComponent } from './components/help/help.component';
import { PageBuilderComponent } from './components/page-builder/page-builder.component';
import { SpaceSpecCalculatorComponent } from './components/space-spec-calculator/space-spec-calculator.component';
import { UnitPreviewComponent } from './components/unit-preview/unit-preview.component';
import { BrokerDashboardComponent } from './components/broker/broker-dashboard/broker-dashboard.component';
import { LeasingExecutiveDashboardComponent } from './components/leasing-executive/leasing-executive-dashboard/leasing-executive-dashboard.component';
import { SessionGraphComponent } from './components/broker/session-graph/session-graph.component';
import { DownloadsComponent } from './components/broker/downloads/downloads.component';
import { PageViewsComponent } from './components/broker/page-views/page-views.component';
import { DashboardCampaignsComponent } from './components/dashboard-campaigns/dashboard-campaigns.component';
import { TopTwentyPropertiesComponent } from './components/dashboard-campaigns/components/top-twenty-properties/top-twenty-properties.component';

const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        component: DashboardComponent,
        children: [
          {
            path: 'dashboard',
            outlet: 'Broker',
            pathMatch: 'full',
            component: BrokerDashboardComponent,
          },
          {
            path: 'dashboard',
            outlet: 'LeasingExecutive',
            pathMatch: 'full',
            component: LeasingExecutiveDashboardComponent,
          },
        ],
      },
      {
        path: 'dashboard-campaign',
        loadChildren: () =>
          import(
            './components/dashboard-campaigns/dashboard-campaigns.module'
          ).then((m) => m.DashboardCampaignsModule),
      },
      { path: 'page-builder', component: PageBuilderComponent },
      { path: 'help', component: HelpComponent },
      { path: 'profile', component: BrokerProfileFormComponent },
      { path: 'unit-preview', component: UnitPreviewComponent },
      { path: 'space-spec', component: SpaceSpecCalculatorComponent },
      {
        path: 'properties',
        loadChildren: () =>
          import('./components/properties/properties.module').then(
            (m) => m.PropertiesModule
          ),
      },
      {
        path: 'users',
        loadChildren: () =>
          import('./components/user/user.module').then((m) => m.UserModule),
      },
      {
        path: 'investors',
        loadChildren: () =>
          import('./components/investors/investors.module').then(
            (m) => m.InvestorsModule
          ),
      },
      {
        path: 'hr-portal',
        loadChildren: () =>
          import('./components/hr/hr.module').then((m) => m.HrModule),
      },
      {
        path: 'generic-portal',
        loadChildren: () =>
          import('./modules/generic/generic.module').then(
            (m) => m.GenericModule
          ),
      },

      {
        path: 'esg-portal',
        loadChildren: () =>
          import('./components/esg/esg.module').then((m) => m.EsgModule),
      },
      {
        path: 'propertyeq',
        loadChildren: () =>
          import('./modules/property-eq/property-eq.module').then(
            (m) => m.PropertyEqModule
          ),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
