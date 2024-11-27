import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { NgModule } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AdminComponent } from './admin.component';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { HeaderComponent } from './components/header/header.component';
import { SharedModule } from '../shared/shared.module';
// Material
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { ManagePropertiesComponent } from './components/properties/components/manage-properties/manage-properties.component';
import { HelpComponent } from './components/help/help.component';

import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDialogModule } from '@angular/material/dialog';

import { MatNativeDateModule } from '@angular/material/core';
import { BrokerProfileFormComponent } from './components/broker/broker-profile-form/broker-profile-form.component';
import { UnitPreviewComponent } from './components/unit-preview/unit-preview.component';
import { DonutChartComponent } from './components/dashboard/donut-chart/donut-chart.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatChipsModule } from '@angular/material/chips';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSliderModule } from '@angular/material/slider';
import { MatSelectModule } from '@angular/material/select';
import { SpaceSpecCalculatorComponent } from './components/space-spec-calculator/space-spec-calculator.component';
import { BrokerDashboardComponent } from './components/broker/broker-dashboard/broker-dashboard.component';
import { LeasingExecutiveDashboardComponent } from './components/leasing-executive/leasing-executive-dashboard/leasing-executive-dashboard.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { UnitCardComponent } from './components/broker/unit-card/unit-card.component';
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { RecentUpdatesComponent } from './components/recent-updates/recent-updates.component';
import { TestComponent } from './components/Test/components/test/test.component';
import { GenericComponent } from './modules/generic/generic.component';
import { FileModule } from '../shared/modules/file/file.module';
import { AutocompleteModule } from '../shared/modules/autocomplete/autocomplete.module';
import { SwitchModule } from '../shared/modules/switch/switch.module';
import { SelectModule } from '../shared/modules/select/select.module';
import { DatatableModule } from '../shared/modules/datatable/datatable.module';
import { InputModule } from '../shared/modules/input/input.module';
import { DisclaimerComponent } from '../shared/components/disclaimer/disclaimer.component';
import { CustomMatPaginatorDirective } from '../shared/directives/custom-mat-paginator/custom-mat-paginator.directive';
import { SessionGraphComponent } from './components/broker/session-graph/session-graph.component';
import { PageViewsComponent } from './components/broker/page-views/page-views.component';
import { DownloadsComponent } from './components/broker/downloads/downloads.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { NativeDateAdapter } from '@angular/material/core';
import { FinancialResultsDashboardComponent } from './components/broker/financial-results-dashboard/financial-results-dashboard.component';
import { LearnershipDashboardComponent } from './components/broker/learnership-dashboard/learnership-dashboard.component';
import { DashboardTablesComponent } from './components/broker/dashboard-tables/dashboard-tables.component';
import { JobViewsComponent } from './components/broker/job-views/job-views.component';
import { StackBarChartComponent } from './components/broker/stack-bar-chart/stack-bar-chart.component';
import { DashboardFilterComponent } from './components/broker/dashboard-filter/dashboard-filter.component';
import { TimeChartComponent } from './components/broker/time-chart/time-chart.component';
import { AllLocationDropdownComponent } from './components/location/all-location-dropdown/all-location-dropdown.component';
import { BrokerStakeholdersComponent } from './components/broker/broker-stakeholders/broker-stakeholders.component';
import { DeviceAnalyticsComponent } from './components/dashboard/components/device-analytics/device-analytics.component';
import { OsAnalyticsComponent } from './components/dashboard/components/os-analytics/os-analytics.component';
import { BrowserAnalyticsComponent } from './components/dashboard/components/browser-analytics/browser-analytics.component';
import { SourceAnalyticsComponent } from './components/dashboard/components/source-analytics/source-analytics.component';
import { InsightAnalyticsComponent } from './components/dashboard/components/insight-analytics/insight-analytics.component';

@NgModule({
  declarations: [
    DashboardComponent,
    AdminComponent,
    SidenavComponent,
    HeaderComponent,
    ManagePropertiesComponent,
    HelpComponent,
    BrokerProfileFormComponent,
    UnitPreviewComponent,
    DonutChartComponent,
    SpaceSpecCalculatorComponent,
    BrokerDashboardComponent,
    LeasingExecutiveDashboardComponent,
    UnitCardComponent,
    RecentUpdatesComponent,
    TestComponent,
    GenericComponent,
    SessionGraphComponent,
    PageViewsComponent,
    DownloadsComponent,
    FinancialResultsDashboardComponent,
    LearnershipDashboardComponent,
    DashboardTablesComponent,
    JobViewsComponent,
    StackBarChartComponent,
    DashboardFilterComponent,
    TimeChartComponent,
    BrokerStakeholdersComponent,
    DeviceAnalyticsComponent,
    OsAnalyticsComponent,
    BrowserAnalyticsComponent,
    SourceAnalyticsComponent,
    InsightAnalyticsComponent
  ],
  providers: [DecimalPipe, NativeDateAdapter],
  imports: [
    CommonModule,
    FormsModule,
    AdminRoutingModule,
    MatSidenavModule,
    MatCheckboxModule,
    MatListModule,
    MatSidenavModule,
    MatToolbarModule,
    MatMenuModule,
    MatIconModule,
    MatDividerModule,
    MatTableModule,
    SharedModule,
    ReactiveFormsModule,
    MatSlideToggleModule,
    MatDialogModule,
    MatNativeDateModule,
    MatGridListModule,
    MatFormFieldModule,
    MatInputModule,
    MatExpansionModule,
    MatChipsModule,
    MatAutocompleteModule,
    MatSliderModule,
    MatSelectModule,
    MatPaginatorModule,
    NgxSliderModule,
    FileModule,
    AutocompleteModule,
    SelectModule,
    SwitchModule,
    DatatableModule,
    InputModule,
    DisclaimerComponent,
    CustomMatPaginatorDirective,
    NgSelectModule,
    MatTabsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatButtonModule,
    AllLocationDropdownComponent,
  ],
})
export class AdminModule {}
