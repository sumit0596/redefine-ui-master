import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ManageEnquiriesComponent } from './components/manage-enquiries/manage-enquiries.component';
import { GenericComponent } from './generic.component';
import { ManagePressReleaseComponent } from '../../components/investors/components/press-release/manage-press-release/manage-press-release.component';
import { PeopleFormComponent } from '../../components/investors/components/people/people-form/people-form.component';
import { ManagePeopleComponent } from '../../components/investors/components/people/manage-people/manage-people.component';
import { EnquiryDetailsFormComponent } from './components/enquiry-details-form/enquiry-details-form.component';
import { PressReleaseFormComponent } from '../../components/investors/components/press-release/press-release-form/press-release-form.component';
import { ManageMediaComponent } from './components/media/manage-media/manage-media.component';
import { MediaFormComponent } from './components/media/media-form/media-form.component';

const routes: Routes = [
  {
    path: '',
    component: GenericComponent,
    children: [
      {
        path: '',
        component: DashboardComponent,
      },
      {
        path: 'view',
        component: EnquiryDetailsFormComponent,
      },
      {
        path: 'manage-enquiries',
        component: ManageEnquiriesComponent,
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
        path: 'leadership',
        component: ManagePeopleComponent,
      },
      {
        path: 'create-leadership',
        component: PeopleFormComponent,
      },
      {
        path: 'view-leadership',
        component: PeopleFormComponent,
      },
      { path: 'edit-leadership', component: PeopleFormComponent },
      {
        path: 'manage-media',
        component: ManageMediaComponent,
      },
      {
        path: 'create-media',
        component: MediaFormComponent,
      },
      {
        path: 'edit-media',
        component: MediaFormComponent,
      },
      {
        path: 'view-media',
        component: MediaFormComponent,
      },
      {
        path: 'custom-pages',
        loadChildren: () =>
          import('../../components/page-builder/page-builder.module').then(
            (m) => m.PageBuilderModule
          ),
        data: { id: 1 },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GenericRoutingModule {}
