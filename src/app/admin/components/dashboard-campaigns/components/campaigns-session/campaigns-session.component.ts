import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { DashboardCampaignsService } from 'src/app/admin/services/dashboard-campaigns.service';

@Component({
  selector: 'app-campaigns-session',
  templateUrl: './campaigns-session.component.html',
  styleUrls: ['./campaigns-session.component.scss'],
})
export class CampaignsSessionComponent {
  @Input() sessions: any;
  @Input() isLoading: any;
  results:any=[];
  ngOnChanges(changes: SimpleChanges) {
    if (changes['sessions']) {
      this.results = this.sessions;
    }
  }

}
