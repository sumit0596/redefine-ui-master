import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { CONSTANTS } from './models/constants';
import { oldroutes } from './redirect-routing';

const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./shared/modules/login/login.component').then(
        (m) => m.LoginComponent
      ),
    data: { id: 1 },
  },
  {
    path: 'forgot-password',
    loadComponent: () =>
      import('./shared/modules/login/login.component').then(
        (m) => m.LoginComponent
      ),
    data: { id: 2 },
  },
  {
    path: 'update-password/:token',
    loadComponent: () =>
      import('./shared/modules/login/login.component').then(
        (m) => m.LoginComponent
      ),
    data: { id: 3 },
  },
  {
    path: 'admin',
    loadChildren: () =>
      import('./admin/admin.module').then((m) => m.AdminModule),
    data: { preload: false, delay: true, isAuthenticated: false },
    canActivate: [AuthGuard],
  },
  {
    path: 'view-file/:slug',
    loadComponent: () =>
      import('./shared/components/view-file/view-file.component').then(
        (c) => c.ViewFileComponent
      ),
    data: { id: 4 },
  },
  {
    path: `error/:${CONSTANTS.ROUTE_ID}`,
    loadComponent: () =>
      import('./shared/components/information/information.component').then(
        (c) => c.InformationComponent
      ),
  },
  {
    path: '',
    loadChildren: () =>
      import('./frontend/frontend.module').then((m) => m.FrontendModule),
  },
  {
    path: '**',
    redirectTo: '',
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot([...oldroutes, ...routes], {
      scrollPositionRestoration: 'top',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
