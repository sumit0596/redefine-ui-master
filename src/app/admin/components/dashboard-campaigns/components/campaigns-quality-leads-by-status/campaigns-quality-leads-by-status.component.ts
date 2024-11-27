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
import * as am5 from '@amcharts/amcharts5';
import * as am5percent from '@amcharts/amcharts5/percent';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';

@Component({
  selector: 'app-campaigns-quality-leads-by-status',
  templateUrl: './campaigns-quality-leads-by-status.component.html',
  styleUrls: ['./campaigns-quality-leads-by-status.component.scss'],
})
export class CampaignsQualityLeadsByStatusComponent {

  @Input() isLoadingLeadsByStatusSector: any;
  @Input() LeadsByStatus: any;
  @Input() isLoading: any;
 
  label : string = "Total";
  ngOnChanges(changes: SimpleChanges) {
    if (changes['LeadsByStatus']) {
        let result :any = [];
        this.LeadsByStatus?.forEach((val: any) => {
            result.push({
              label: val.LeadName,
              value: val.Count ? val.Count : 0,
            });
        });
        this.LeadsByStatus = result;
    }
  }

  
  
  
}
