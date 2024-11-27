import { EsgComponent } from './esg.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManageEsgComponent } from './components/manage-esg/manage-esg.component';

import { DashboardComponent } from '../esg/components/dashboard/dashboard.component';
import { esgFormComponent } from './components/esg-form/esg-form.component';

const routes: Routes = [
  {
    path: '',
    component: EsgComponent,
    children: [
      {
        path: '',
        component: DashboardComponent,
      },
      {
        path: 'manage-esg-contacts',
        component: ManageEsgComponent,
      },
      {
        path: 'create-esg-contacts',
        component: esgFormComponent,
      },
      {
        path: 'view-esg-contacts',
        component: esgFormComponent,
      },
      { path: 'edit-esg-contacts', component: esgFormComponent },
      {
        path: 'custom-pages',
        loadChildren: () =>
          import('../page-builder/page-builder.module').then(
            (m) => m.PageBuilderModule
          ),
        data: { id: 4 },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EsgRoutingModule {}
