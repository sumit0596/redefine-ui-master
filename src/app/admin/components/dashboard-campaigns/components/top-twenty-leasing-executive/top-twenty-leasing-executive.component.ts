import { Component, Input } from '@angular/core';
import { DashboardCampaignsService } from 'src/app/admin/services/dashboard-campaigns.service';

@Component({
  selector: 'app-top-twenty-leasing-executive',
  templateUrl: './top-twenty-leasing-executive.component.html',
  styleUrls: ['./top-twenty-leasing-executive.component.scss'],
})
export class TopTwentyLeasingExecutiveComponent {
  @Input() leasingExecutives: any;
  @Input() isLoading: any;
  
}
