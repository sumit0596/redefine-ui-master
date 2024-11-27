import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageBuilderComponent } from './page-builder.component';
import { ManagePagesComponent } from './components/manage-pages/manage-pages.component';
import { BuilderComponent } from './components/builder/builder.component';

const routes: Routes = [
  {
    path: '',
    component: PageBuilderComponent,
    children: [
      {
        path: '',
        redirectTo: 'manage-pages',
        pathMatch: 'full',
      },
      {
        path: 'manage-pages',
        component: ManagePagesComponent,
      },
      {
        path: 'builder',
        loadComponent: () =>
          import('./components/builder/builder.component').then(
            (c) => c.BuilderComponent
          ),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PageBuilderRoutingModule {}
