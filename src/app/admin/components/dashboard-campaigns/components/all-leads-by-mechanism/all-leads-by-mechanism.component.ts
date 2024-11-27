import { Component, Input, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-all-leads-by-mechanism',
  templateUrl: './all-leads-by-mechanism.component.html',
  styleUrls: ['./all-leads-by-mechanism.component.scss']
})
export class AllLeadsByMechanismComponent {
  @Input() isLoadingLeadsByMechanismSector: any;
  @Input() LeadsByMechanism: any;
  label : string = "Total";
  id: string = 'chartDivAllLeadsByMechanism';
  
  ngOnChanges(changes: SimpleChanges) {
    if (changes['LeadsByMechanism'] && this.LeadsByMechanism) {
      let result: any = [];
      this.LeadsByMechanism?.forEach((val: any, key: any) => {
            result.push({
              label: val.Source,
              value: val.Count ? val.Count : 0,
            });
            
          });
          this.LeadsByMechanism = result;
    }
  }
}
