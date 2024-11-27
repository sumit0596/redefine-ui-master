import { Component, Inject } from '@angular/core';
import { Form, FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable, of } from 'rxjs';
import { UnitService } from 'src/app/admin/services/unit.service';
import { CommonStoreService } from 'src/app/services/common-store.service';
import { LoaderService } from 'src/app/shared/services/loader/loader.service';

@Component({
  selector: 'app-broker-commission-incentives-form',
  templateUrl: './broker-commission-incentives-form.component.html',
  styleUrls: ['./broker-commission-incentives-form.component.scss']
})
export class BrokerCommissionIncentivesFormComponent {
  brokerCommissionIncentiveForm!: FormGroup;
  errorMessage: string = '';
  brokerCommissionIncentives$: Observable<any>;


  constructor(private router: Router,
    private fb: FormBuilder,
    private loaderService: LoaderService,
    private toasterService: ToastrService,
    private unitService: UnitService,
    private commonStoreService: CommonStoreService,

    public dialogRef: MatDialogRef<BrokerCommissionIncentivesFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.brokerCommissionIncentives$ = of(this.dropdownCommissionIncentives());
  }

  ngOnInit() {
    this.brokerCommissionIncentiveForm = this.fb.group({
      PropertyId: this.data.PropertyId,
      BrokerIncentives: [null],
      CommentDisclaimers: [''],
      Units: []
    });
    if (this.data.row.BrokerIncentives != null) {
      let brokerIncentives =this.data.row.BrokerIncentives.toString();
      this.data.row.BrokerIncentives = !brokerIncentives.includes('%') ? brokerIncentives.concat('%'): brokerIncentives;
      this.brokerCommissionIncentiveForm.get('BrokerIncentives')?.setValue(this.data.row.BrokerIncentives);
      this.brokerCommissionIncentiveForm.get('CommentDisclaimers')?.setValue(this.data.row.CommentDisclaimers);
    }
  }

  private dropdownCommissionIncentives() {
    const incentives = [];
    for (let i = 1; i <= 60; i++) {
      incentives.push({ Id: i, Name: `${i * 5}%` });
    }
    return incentives;
  }

  close() {
    this.dialogRef.close();
  }
  onSubmit() {
    var units = [];
    if (this.data.row instanceof Array) {
      units = (this.data.row.map((x: any) => x.PropertyUnitId));
    }
    else {
      units.push(this.data.row.PropertyUnitId);
    }
    this.brokerCommissionIncentiveForm.value.Units = units;
    if (this.brokerCommissionIncentiveForm.value.BrokerIncentives == '' && this.brokerCommissionIncentiveForm.value.CommentDisclaimers == '') {
      this.dialogRef.close();
    }
   else if ((this.brokerCommissionIncentiveForm.value.BrokerIncentives == '' || this.brokerCommissionIncentiveForm.value.BrokerIncentives === null) && this.brokerCommissionIncentiveForm.value.CommentDisclaimers != '') {
      this.errorMessage = 'Please select Commission Incentive';
    }
    else {
      this.loaderService.show();
      this.unitService
        .unitBrokerCommissionIncentiveUpdate(this.brokerCommissionIncentiveForm.value)
        .subscribe({
          next: (res) => {
            this.toasterService.success(res.message);
            this.loaderService.hide();
            this.dialogRef.close('Yes');    
          },
          error: (error) => {
            this.loaderService.hide();
            this.toasterService.error(error.error.message);
          },
        });
    }
  }

  onDataChange(event:any){
   if(event.Id !== null || event.Id != '')
   {
    this.errorMessage ='';
   }
  }

}
