import {
  Component,
  Input,
  SimpleChanges,
} from '@angular/core';

@Component({
  selector: 'app-all-leads',
  templateUrl: './all-leads.component.html',
  styleUrls: ['./all-leads.component.scss'],
})
export class AllLeadsComponent {

  @Input() LeadsBySource: any;
  @Input() isLoading: any;
  label : string = "Total";
  id: string = 'chartDivAllLeadsBySource';

  ngOnChanges(changes: SimpleChanges) {
    if (changes['LeadsBySource'] && this.LeadsBySource) {
      let result: any = [];
      this.LeadsBySource.forEach((val: any, key: any) => {
            result.push({
              label: val.Source,
              value: val.Count ? val.Count : 0,
            });
      });
      this.LeadsBySource = result;
    }
  }
  
}
