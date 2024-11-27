import { Component, Input, SimpleChanges } from '@angular/core';
import { DashboardCampaignsService } from 'src/app/admin/services/dashboard-campaigns.service';

@Component({
  selector: 'app-top-ten-content',
  templateUrl: './top-ten-content.component.html',
  styleUrls: ['./top-ten-content.component.scss'],
})
export class TopTenContentComponent {
  @Input() CampaignContent: any;
  @Input() isLoading: any;

  isData = false;
}
