import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InvestorsComponent } from './investors.component';
import { EventsCalenderComponent } from './events-calender/events-calender.component';
import { SensAnnouncementsComponent } from './sens-announcements/sens-announcements.component';
import { SensDetailsComponent } from './sens-details/sens-details.component';
import { PresentationComponent } from './presentation/presentation.component';
import { PresentationDetailsComponent } from './presentation-details/presentation-details.component';
import { DebtProgrammeComponent } from './debt-programme/debt-programme.component';
import { FinancialResultsComponent } from './financial-results/financial-results.component';
import { IntegratedReportsComponent } from './integrated-reports/integrated-reports.component';
import { CircularsComponent } from './circulars/circulars.component';
import { CONSTANTS } from 'src/app/models/constants';

const routes: Routes = [
  {
    path: '',
    component: InvestorsComponent,
    children: [
      {
        path: 'events-calendar',
        component: EventsCalenderComponent,
      },
	   {
        path: 'announcements-and-webcasts',
        component: PresentationComponent,
        children: [
          {
            path: `:${CONSTANTS.ROUTE_ID}`,
            component: PresentationComponent,
          },
        ],
      },
      /*{
        path: 'announcements-and-webcasts',
        component: PresentationComponent,
      },
      {
        path: `announcements-and-webcasts/:${CONSTANTS.ROUTE_ID}`,
        component: PresentationComponent,
      },*/
     /* {
        path: 'financial-results',
        component: FinancialResultsComponent,
      },
      {
        path: `financial-results/:${CONSTANTS.ROUTE_ID}`,
        component: FinancialResultsComponent,
      },*/
	   {
        path: 'financial-results',
        component: FinancialResultsComponent,
        children: [
          {
            path: `:${CONSTANTS.ROUTE_ID}`,
            component: FinancialResultsComponent,
          },
        ],
      },
      /*{
        path: 'integrated-reports',
        component: IntegratedReportsComponent,
      },
      {
        path: `integrated-reports/:${CONSTANTS.ROUTE_ID}`,
        component: IntegratedReportsComponent,
      },*/
	    {
        path: 'integrated-reports',
        component: IntegratedReportsComponent,
        children: [
          {
            path: `:${CONSTANTS.ROUTE_ID}`,
            component: IntegratedReportsComponent,
          },
        ],
      },
      {
        path: 'sens-announcements',
        redirectTo: 'investor-information/sens-announcements',
      },
      {
        path: 'investor-information/sens-announcements',
        component: SensAnnouncementsComponent,
        runGuardsAndResolvers : 'paramsOrQueryParamsChange'
      },
      {
        path: `investor-information/sens-announcements/:${CONSTANTS.ROUTE_ID}`,
        component: SensDetailsComponent,
      },
      {
        path: 'debt-programme',
        redirectTo: 'investor-information/debt-programme',
      },
      {
        path: `investor-information/debt-programme/:${CONSTANTS.ROUTE_ID}`,
        component: DebtProgrammeComponent,
      },
      {
        path: 'investor-information/debt-programme',
        component: DebtProgrammeComponent,
      },

      /*{
        path: 'circulars',
        component: CircularsComponent,
      },
      {
        path: `circulars/:${CONSTANTS.ROUTE_ID}`,
        component: CircularsComponent,
      },*/
	  {
        path: 'circulars',
        component: CircularsComponent,
        children: [
          {
            path: `:${CONSTANTS.ROUTE_ID}`,
            component: CircularsComponent,
          },
        ],
      },
      {
        path: '**',
        loadChildren: () =>
          import('../custom-page-container/custom-page-container.module').then(
            (m) => m.CustomPageContainerModule
          ),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InvestorsRoutingModule {}
