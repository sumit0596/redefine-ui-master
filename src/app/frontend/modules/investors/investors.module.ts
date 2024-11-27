import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InvestorsRoutingModule } from './investors-routing.module';
import { InvestorsComponent } from './investors.component';
import { InvestorsLandingPageComponent } from './investors-landing-page/investors-landing-page.component';
import { EventsCalenderComponent } from './events-calender/events-calender.component';
import { SensAnnouncementsComponent } from './sens-announcements/sens-announcements.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatPaginatorModule } from '@angular/material/paginator';
import { SensDetailsComponent } from './sens-details/sens-details.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PresentationComponent } from './presentation/presentation.component';
import { PresentationDetailsComponent } from './presentation-details/presentation-details.component';
import { DebtProgrammeComponent } from './debt-programme/debt-programme.component';
import { FinancialResultsComponent } from './financial-results/financial-results.component';
import { IntegratedReportsComponent } from './integrated-reports/integrated-reports.component';
import { HighlighterPipe } from '../../highlighter.pipe';
import { CircularsComponent } from './circulars/circulars.component';
import { DripDialogComponent } from './drip-dialog/drip-dialog.component';
import { FileModule } from 'src/app/shared/modules/file/file.module';
import { SelectModule } from 'src/app/shared/modules/select/select.module';
import { SwitchModule } from 'src/app/shared/modules/switch/switch.module';
import { InputModule } from 'src/app/shared/modules/input/input.module';
import { CalendarComponent } from 'src/app/shared/components/form-elements/calender/calendar.component';
import { QuickLinksComponent } from '../../shared/quick-links/quick-links.component';
import { BannerBreadcrumbComponent } from '../../shared/banner-breadcrumb/banner-breadcrumb.component';
import { ShareButtonComponent } from '../../shared/share-button/share-button.component';
import { CustomMatPaginatorDirective } from 'src/app/shared/directives/custom-mat-paginator/custom-mat-paginator.directive';
import { MatTabsModule } from '@angular/material/tabs';
import { InvestorContactsContainerComponent } from './investor-contacts-container/investor-contacts-container.component';

@NgModule({
  declarations: [
    InvestorsComponent,
    InvestorsLandingPageComponent,
    EventsCalenderComponent,
    SensAnnouncementsComponent,
    SensDetailsComponent,
    PresentationComponent,
    PresentationDetailsComponent,
    DebtProgrammeComponent,
    FinancialResultsComponent,
    IntegratedReportsComponent,
    HighlighterPipe,
    CircularsComponent,
    InvestorContactsContainerComponent,
  ],
  imports: [
    CommonModule,
    InvestorsRoutingModule,
    SharedModule,
    MatPaginatorModule,
    FormsModule,
    ReactiveFormsModule,
    FileModule,
    SelectModule,
    SwitchModule,
    InputModule,
    CalendarComponent,
    QuickLinksComponent,
    BannerBreadcrumbComponent,
    ShareButtonComponent,
    CustomMatPaginatorDirective,
    MatTabsModule,
  ],
})
export class InvestorsModule {}
