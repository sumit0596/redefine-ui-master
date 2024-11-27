import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { UserComponent } from './user.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { RolesFormComponent } from './components/roles-form/roles-form.component';
import { ManageRolesComponent } from './components/manage-roles/manage-roles.component';
import { ManageUserComponent } from './components/manage-user/manage-user.component';
import { UserFormComponent } from './components/user-form/user-form.component';
import { FileModule } from 'src/app/shared/modules/file/file.module';
import { SelectModule } from 'src/app/shared/modules/select/select.module';
import { SwitchModule } from 'src/app/shared/modules/switch/switch.module';
import { DatatableModule } from 'src/app/shared/modules/datatable/datatable.module';
import { InputModule } from 'src/app/shared/modules/input/input.module';
import { TextareaComponent } from 'src/app/shared/components/form-elements/textarea/textarea.component';
import { CalendarComponent } from 'src/app/shared/components/form-elements/calender/calendar.component';
import { PortalComponent } from 'src/app/shared/components/portal/portal.component';
import { ManageSettingsComponent } from './components/manage-settings/manage-settings.component';
import { SettingsFormComponent } from './components/settings-form/settings-form.component';
import { UserDialogComponent } from './components/user-dialog/user-dialog.component';
import { MatTabsModule } from '@angular/material/tabs';
import { ManageCampaignContactComponent } from './components/campaign-contact/manage-campaign-contact/manage-campaign-contact.component';
import { CampaignContactFormComponent } from './components/campaign-contact/campaign-contact-form/campaign-contact-form.component';

@NgModule({
  declarations: [
    UserComponent,
    DashboardComponent,
    ManageRolesComponent,
    ManageUserComponent,
    UserFormComponent,
    RolesFormComponent,
    ManageSettingsComponent,
    SettingsFormComponent,
    UserDialogComponent,
    ManageCampaignContactComponent,
    CampaignContactFormComponent,
  ],
  imports: [
    CommonModule,
    UserRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    FileModule,
    SelectModule,
    SwitchModule,
    DatatableModule,
    InputModule,
    TextareaComponent,
    CalendarComponent,PortalComponent,
    MatTabsModule
  ],
})
export class UserModule {}
