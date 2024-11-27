import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DashboardCampaignsRoutingModule } from './dashboard-campaigns-routing.module';
import { DashboardCampaignsComponent } from './dashboard-campaigns.component';
import { CampaignsSessionComponent } from './components/campaigns-session/campaigns-session.component';
import { SharedModule } from 'src/app/shared/shared.module';

import { MatTabsModule } from '@angular/material/tabs';
import { MatMenuModule } from '@angular/material/menu';
import { SelectModule } from 'src/app/shared/modules/select/select.module';
import { DatatableModule } from 'src/app/shared/modules/datatable/datatable.module';
import { SwitchModule } from 'src/app/shared/modules/switch/switch.module';
import { InputModule } from 'src/app/shared/modules/input/input.module';
import { EditorComponent } from 'src/app/shared/components/form-elements/editor/editor.component';
import { TextareaComponent } from 'src/app/shared/components/form-elements/textarea/textarea.component';
import { MatSelectModule } from '@angular/material/select';
import { NgSelectModule } from '@ng-select/ng-select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { DashboardFilterComponent } from './shared/dashboard-filter/dashboard-filter.component';
import { TopTwentyPropertiesComponent } from './components/top-twenty-properties/top-twenty-properties.component';
import { TopTwentyLeasingExecutiveComponent } from './components/top-twenty-leasing-executive/top-twenty-leasing-executive.component';
import { AllLeadsComponent } from './components/all-leads/all-leads.component';
import { CampaignAllLeadsByMediumComponent } from './components/campaign-all-leads-by-medium/campaign-all-leads-by-medium.component';
import { CampaignsQualityLeadsByStatusComponent } from './components/campaigns-quality-leads-by-status/campaigns-quality-leads-by-status.component';
import { CampaignsQualityLeadsComponent } from './components/campaigns-quality-leads/campaigns-quality-leads.component';
import { CampaignsDonutComponent } from './shared/campaigns-donut/campaigns-donut.component';
import { TopTenContentComponent } from './components/top-ten-content/top-ten-content.component';
import { CampaignDataTableComponent } from './components/campaign-data-table/campaign-data-table.component';
import { CampaignLeadsDialogComponent } from './components/campaign-data-table/campaign-leads-dialog/campaign-leads-dialog.component';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { AllLeadsByMechanismComponent } from './components/all-leads-by-mechanism/all-leads-by-mechanism.component';

@NgModule({
  declarations: [
    DashboardCampaignsComponent,
    CampaignsSessionComponent,
    DashboardFilterComponent,
    TopTwentyPropertiesComponent,
    TopTwentyLeasingExecutiveComponent,
    CampaignsQualityLeadsComponent,
    CampaignsDonutComponent,
    CampaignsQualityLeadsByStatusComponent,
    AllLeadsComponent,
    CampaignAllLeadsByMediumComponent, 
    TopTenContentComponent,
    CampaignDataTableComponent,
    CampaignLeadsDialogComponent,
    AllLeadsByMechanismComponent
  ],
  imports: [
    CommonModule,
    MatSelectModule,
    DashboardCampaignsRoutingModule,
    MatMenuModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule,
    MatTabsModule,
    SelectModule,
    SwitchModule,
    DatatableModule,
    InputModule,
    EditorComponent,
    TextareaComponent,
    NgSelectModule,
    MatIconModule,
    MatDatepickerModule,
    SelectModule
  ],
})
export class DashboardCampaignsModule {}
