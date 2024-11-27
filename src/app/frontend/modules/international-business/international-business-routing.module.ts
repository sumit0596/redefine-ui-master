import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InternationalBusinessComponent } from './international-business.component';
import { PropertiesPortfolioComponent } from './properties-portfolio/properties-portfolio.component';
import { CONSTANTS } from 'src/app/models/constants';
import { InternationalPropertyDetailsComponent } from './international-property-details/international-property-details.component';

const routes: Routes = [
  {
    path: '',
    component: InternationalBusinessComponent,
    children: [
      {
        path: '',
        component: PropertiesPortfolioComponent,
        runGuardsAndResolvers: 'paramsOrQueryParamsChange',
      },
      {
        path: `:${CONSTANTS.ROUTE_ID}`,
        component: InternationalPropertyDetailsComponent,
        runGuardsAndResolvers: 'paramsOrQueryParamsChange',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InternationalBusinessRoutingModule {}
