import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PropertiesRoutingModule } from './properties-routing.module';
import { PropertiesComponent } from './properties.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ManageAttributesComponent } from './components/attribute/manage-attributes/manage-attributes.component';
import { ManageIncentiveComponent } from './components/incentive/manage-incentive/manage-incentive.component';
import { AttributeFormComponent } from './components/attribute/attribute-form/attribute-form.component';
import { IncentiveFormComponent } from './components/incentive/incentive-form/incentive-form.component';
import { SeoFormComponent } from './components/property/components/seo-form/seo-form.component';
import { MdaLookupComponent } from './components/property/components/mda-lookup/mda-lookup.component';
import { ManageInternationalPropertiesComponent } from './components/manage-international-properties/manage-international-properties.component';
import { InternationalpropertydialogComponent } from './components/internationalpropertydialog/internationalpropertydialog.component';
import { ManageLeadsComponent } from './components/leads/manage-leads/manage-leads.component';
import { LeadsFormComponent } from './components/leads/leads-form/leads-form.component';
import { MatTabsModule } from '@angular/material/tabs';
import { LeadsDialogComponent } from './components/leads/leads-dialog/leads-dialog.component';
import { FileModule } from 'src/app/shared/modules/file/file.module';
import { SelectModule } from 'src/app/shared/modules/select/select.module';
import { DatatableModule } from 'src/app/shared/modules/datatable/datatable.module';
import { SwitchModule } from 'src/app/shared/modules/switch/switch.module';
import { InputModule } from 'src/app/shared/modules/input/input.module';
import { EditorComponent } from 'src/app/shared/components/form-elements/editor/editor.component';
import { TextareaComponent } from 'src/app/shared/components/form-elements/textarea/textarea.component';
import { PortalComponent } from 'src/app/shared/components/portal/portal.component';
import { IncentivesDialogComponent } from './components/incentive/incentives-dialog/incentives-dialog.component';
import { AttributeDialogComponent } from './components/attribute/attribute-dialog/attribute-dialog.component';

@NgModule({
  declarations: [
    PropertiesComponent,
    DashboardComponent,
    ManageAttributesComponent,
    AttributeFormComponent,
    ManageIncentiveComponent,
    IncentiveFormComponent,
    SeoFormComponent,
    MdaLookupComponent,
    ManageInternationalPropertiesComponent,
    InternationalpropertydialogComponent,
    ManageLeadsComponent,
    LeadsFormComponent,
    LeadsDialogComponent,
    IncentivesDialogComponent,
    AttributeDialogComponent,
  ],
  imports: [
    CommonModule,
    PropertiesRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    MatTabsModule,
    FileModule,
    SelectModule,
    SwitchModule,
    DatatableModule,
    InputModule,
    EditorComponent,
    TextareaComponent,PortalComponent
  ],
})
export class PropertiesModule {}
