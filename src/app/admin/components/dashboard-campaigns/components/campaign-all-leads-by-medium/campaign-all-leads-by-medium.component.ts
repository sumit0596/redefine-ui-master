import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { Observable } from 'rxjs';
import { DashboardCampaignsService } from 'src/app/admin/services/dashboard-campaigns.service';

@Component({
  selector: 'app-campaign-all-leads-by-medium',
  templateUrl: './campaign-all-leads-by-medium.component.html',
  styleUrls: ['./campaign-all-leads-by-medium.component.scss'],
})
export class CampaignAllLeadsByMediumComponent {
  
  @Input() LeadsByMedium: any;
  @Input() isLoading: any;
  label : string = "Total";
  id: string = 'chartDivAllLeadsByMedium';
  
  ngOnChanges(changes: SimpleChanges) {
    if (changes['LeadsByMedium'] && this.LeadsByMedium) {
      let result: any = [];
      this.LeadsByMedium.forEach((val: any, key: any) => {
            result.push({
              label: val.Medium,
              value: val.Count ? val.Count : 0,
            });
      });
      this.LeadsByMedium = result;
    }
  }

}
