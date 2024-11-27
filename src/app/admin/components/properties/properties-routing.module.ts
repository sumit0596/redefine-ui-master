import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManageIncentiveComponent } from './components/incentive/manage-incentive/manage-incentive.component';
import { ManageAttributesComponent } from './components/attribute/manage-attributes/manage-attributes.component';
import { AttributeFormComponent } from './components/attribute/attribute-form/attribute-form.component';
import { IncentiveFormComponent } from './components/incentive/incentive-form/incentive-form.component';
import { PropertiesComponent } from './properties.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ManagePropertiesComponent } from './components/manage-properties/manage-properties.component';
import { ManageInternationalPropertiesComponent } from './components/manage-international-properties/manage-international-properties.component';
import { ManageLeadsComponent } from './components/leads/manage-leads/manage-leads.component';
import { LeadsFormComponent } from './components/leads/leads-form/leads-form.component';

const routes: Routes = [
  {
    path: '',
    component: PropertiesComponent,
    children: [
      {
        path: '',
        component: DashboardComponent,
      },
      {
        path: 'manage-properties',
        component: ManagePropertiesComponent,
      },
      {
        path: 'create-property',
        loadChildren: () =>
          import('./components/property/property.module').then(
            (m) => m.PropertyModule
          ),
      },
      {
        path: 'manage-incentives',
        component: ManageIncentiveComponent,
      },
      { path: 'create-incentive', component: IncentiveFormComponent },
      { path: 'edit-incentive', component: IncentiveFormComponent },
      { path: 'view-incentive', component: IncentiveFormComponent },
      {
        path: 'manage-attributes',
        component: ManageAttributesComponent,
      },
      { path: 'create-attribute', component: AttributeFormComponent },
      { path: 'edit-attribute', component: AttributeFormComponent },
      { path: 'view-attribute', component: AttributeFormComponent },
      {
        path: 'create-unit',
        loadChildren: () =>
          import('./components/unit/unit.module').then((m) => m.UnitModule),
      },
      {
        path: 'manage-international-properties',
        component: ManageInternationalPropertiesComponent,
      },
      {
        path: 'lead',
        component: ManageLeadsComponent,
      },
      {
        path: 'view-lead',
        component: LeadsFormComponent,
      },
      {
        path: 'create-lead',
        component: LeadsFormComponent,
      },
      {
        path: 'create-international-property',
        loadChildren: () =>
          import(
            './components/international-property/international.property.module'
          ).then((m) => m.InternationalPropertyModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PropertiesRoutingModule {}
