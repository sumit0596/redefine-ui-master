import {
  Component,
  Input,
  SimpleChanges,
} from '@angular/core';

@Component({
  selector: 'app-campaigns-quality-leads',
  templateUrl: './campaigns-quality-leads.component.html',
  styleUrls: ['./campaigns-quality-leads.component.scss'],
})

export class CampaignsQualityLeadsComponent {
  @Input() isLoadingLeadsByStatusSector: any;
  @Input() LeadsBySector: any = [];
  result :any = [];
  label : string ="Total";
  chartSetting = {
    'layout' : 'verticalLayout'
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['LeadsBySector']) {
      this.result = [];
      if (this.LeadsBySector && this.LeadsBySector.length > 0) {
        this.LeadsBySector.forEach((val: any) => {
          this.result.push({
            label: val.SectorName,
            value: val.Count ? val.Count : 0,
          });
        });
      }
      this.LeadsBySector = this.result;
    }
  }

  
  // ngOnInit(): void {
  //   let result :any = [];
  //   this.LeadsBySector?.forEach((val: any, key: any) => {
  //       result.push({
  //         label: val.SectorName,
  //         value: val.Count ? val.Count : 0,
  //       });
  //   });
  //   this.LeadsBySector = result;
  // }
}
