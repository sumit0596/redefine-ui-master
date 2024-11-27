import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserComponent } from './user.component';
import { ManageUserComponent } from './components/manage-user/manage-user.component';
import { ManageRolesComponent } from './components/manage-roles/manage-roles.component';
import { UserFormComponent } from './components/user-form/user-form.component';
import { RolesFormComponent } from './components/roles-form/roles-form.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ManageSettingsComponent } from './components/manage-settings/manage-settings.component';
import { SettingsFormComponent } from './components/settings-form/settings-form.component';
import { ManageCampaignContactComponent } from './components/campaign-contact/manage-campaign-contact/manage-campaign-contact.component';
import { CampaignContactFormComponent } from './components/campaign-contact/campaign-contact-form/campaign-contact-form.component';

const routes: Routes = [
  {
    path: '',
    component: UserComponent,
    children: [
      {
        path: '',
        component: DashboardComponent,
      },
      {
        path: 'manage-settings',
        component: ManageSettingsComponent,
      },
      {
        path: 'manage-users',
        component: ManageUserComponent,
      },
      {
        path: 'manage-roles',
        component: ManageRolesComponent,
      },
      { path: 'create-user', component: UserFormComponent },
      { path: 'edit-user', component: UserFormComponent },
      { path: 'view-user', component: UserFormComponent },
      { path: 'create-role', component: RolesFormComponent },
      { path: 'edit-role', component: RolesFormComponent },
      { path: 'manage-settings/edit-settings', component: SettingsFormComponent },
      { path: 'manage-campaign-settings', component: ManageCampaignContactComponent },
      
      { path: 'view-campaign-contact', component: CampaignContactFormComponent },
      { path: 'create-campaign-contact', component: CampaignContactFormComponent },
      { path: 'delete-campaign-contact', component : CampaignContactFormComponent },
      { path: 'edit-campaign-settings', component: CampaignContactFormComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserRoutingModule { }
