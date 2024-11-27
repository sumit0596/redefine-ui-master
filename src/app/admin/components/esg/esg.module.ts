import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EsgRoutingModule } from './esg-routing.module';
import { EsgComponent } from './esg.component';
import { ManageEsgComponent } from './components/manage-esg/manage-esg.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { SharedModule } from '../../../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { MatMenuModule } from '@angular/material/menu';
import { esgFormComponent } from './components/esg-form/esg-form.component';
import { FileModule } from 'src/app/shared/modules/file/file.module';
import { DatatableModule } from 'src/app/shared/modules/datatable/datatable.module';
import { InputModule } from 'src/app/shared/modules/input/input.module';
import { EditorComponent } from 'src/app/shared/components/form-elements/editor/editor.component';
import { PortalComponent } from 'src/app/shared/components/portal/portal.component';
import { EsgDialogComponent } from './components/esg-dialog/esg-dialog.component';
import { SelectModule } from 'src/app/shared/modules/select/select.module';

@NgModule({
  declarations: [
    EsgComponent,
    ManageEsgComponent,
    DashboardComponent,
    esgFormComponent,
    EsgDialogComponent,
  ],
  imports: [
    CommonModule,
    EsgRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    MatMenuModule,
    FileModule,
    DatatableModule,
    InputModule,
    EditorComponent,
    PortalComponent,
    SelectModule,
  ],
})
export class EsgModule {}
