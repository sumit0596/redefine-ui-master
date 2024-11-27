import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardCampaignsComponent } from './dashboard-campaigns.component';
import { TopTwentyPropertiesComponent } from './components/top-twenty-properties/top-twenty-properties.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardCampaignsComponent,
    children: [
      {
        path: 'manage-campaign',
        component: DashboardCampaignsComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardCampaignsRoutingModule {}
