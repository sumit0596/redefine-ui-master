import { Component, Input } from '@angular/core';
import { DashboardCampaignsService } from 'src/app/admin/services/dashboard-campaigns.service';

@Component({
  selector: 'app-top-twenty-properties',
  templateUrl: './top-twenty-properties.component.html',
  styleUrls: ['./top-twenty-properties.component.scss'],
})
export class TopTwentyPropertiesComponent {
  @Input() properties: any;
  @Input() isLoading :any;
  constructor() {}

  ngOnInit() {}
}
