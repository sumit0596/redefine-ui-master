import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PropertyEqRoutingModule } from './property-eq-routing.module';
import { PropertyEqComponent } from './property-eq.component';
import { DatatableModule } from 'src/app/shared/modules/datatable/datatable.module';
import { PropertyEqDialogComponent } from './components/property-eq-dialog/property-eq-dialog.component';
import { ManagePropertyEqComponent } from './components/manage-property-eq/manage-property-eq.component';
import { PropertyEqDropdownDialogComponent } from './components/property-eq-dropdown-dialog/property-eq-dropdown-dialog.component';
import { PropertyEqFormComponent } from './components/property-eq-form/property-eq-form.component';
import { PropertyEqPreviewComponent } from './components/property-eq-preview/property-eq-preview.component';
import { ManagePropertyEqTagComponent } from './components/property-eq-tag/manage-property-eq-tag/manage-property-eq-tag.component';
import { PropertyEqTagDialogComponent } from './components/property-eq-tag/property-eq-tag-dialog/property-eq-tag-dialog.component';
import { PropertyEqTagFormComponent } from './components/property-eq-tag/property-eq-tag-form/property-eq-tag-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatChipsModule } from '@angular/material/chips';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatMenuModule } from '@angular/material/menu';
import { CalendarComponent } from 'src/app/shared/components/form-elements/calender/calendar.component';
import { EditorComponent } from 'src/app/shared/components/form-elements/editor/editor.component';
import { TextareaComponent } from 'src/app/shared/components/form-elements/textarea/textarea.component';
import { PortalComponent } from 'src/app/shared/components/portal/portal.component';
import { FileModule } from 'src/app/shared/modules/file/file.module';
import { InputModule } from 'src/app/shared/modules/input/input.module';
import { SelectModule } from 'src/app/shared/modules/select/select.module';
import { SwitchModule } from 'src/app/shared/modules/switch/switch.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { GenericRoutingModule } from '../generic/generic-routing.module';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { HeaderBannerBreadcrumbComponent } from 'src/app/frontend/shared/header-banner-breadcrumb/header-banner-breadcrumb.component';

@NgModule({
  declarations: [
    PropertyEqComponent,
    ManagePropertyEqComponent,
    PropertyEqFormComponent,
    PropertyEqDialogComponent,
    PropertyEqPreviewComponent,
    ManagePropertyEqTagComponent,
    PropertyEqTagFormComponent,
    PropertyEqDropdownDialogComponent,
    PropertyEqTagDialogComponent,
    DashboardComponent
  ],
  imports: [
    CommonModule,
    PropertyEqRoutingModule,
    SharedModule,
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
    HeaderBannerBreadcrumbComponent
  ],
})
export class PropertyEqModule {}
