import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ManageEnquiriesComponent } from './components/manage-enquiries/manage-enquiries.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { GenericRoutingModule } from './generic-routing.module';
import { EnquiriesDialogComponent } from './components/enquiries-dialog/enquiries-dialog.component';
import { EnquiryDetailsFormComponent } from './components/enquiry-details-form/enquiry-details-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { FileModule } from 'src/app/shared/modules/file/file.module';
import { SelectModule } from 'src/app/shared/modules/select/select.module';
import { SwitchModule } from 'src/app/shared/modules/switch/switch.module';
import { DatatableModule } from 'src/app/shared/modules/datatable/datatable.module';
import { InputModule } from 'src/app/shared/modules/input/input.module';
import { TextareaComponent } from 'src/app/shared/components/form-elements/textarea/textarea.component';
import { PortalComponent } from 'src/app/shared/components/portal/portal.component';
import { MatNativeDateModule } from '@angular/material/core';
import { CalendarComponent } from 'src/app/shared/components/form-elements/calender/calendar.component';
import { MatDialogModule } from '@angular/material/dialog';
import { EditorComponent } from 'src/app/shared/components/form-elements/editor/editor.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { ManageMediaComponent } from './components/media/manage-media/manage-media.component';
import { MediaFormComponent } from './components/media/media-form/media-form.component';
import { MediaDialogComponent } from './components/media/media-dialog/media-dialog.component';

@NgModule({
  declarations: [
    DashboardComponent,
    ManageEnquiriesComponent,
    EnquiriesDialogComponent,
    EnquiryDetailsFormComponent,
    ManageMediaComponent,
    MediaFormComponent,
    MediaDialogComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    GenericRoutingModule,
    ReactiveFormsModule,
    MatNativeDateModule,
    FileModule,
    MatDialogModule,
    SelectModule,
    SwitchModule,
    DatatableModule,
    InputModule,
    TextareaComponent,
    EditorComponent,
    PortalComponent,
    CalendarComponent,
    MatMenuModule,
    MatChipsModule,
    MatDividerModule,
  ],
})
export class GenericModule {}
