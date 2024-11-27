import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { UnitService } from 'src/app/admin/services/unit.service';
import { FORM_MODE, ROUTE } from 'src/app/models/constants';
import { CommonStoreService } from 'src/app/services/common-store.service';
import { LoaderService } from 'src/app/shared/services/loader/loader.service';

@Component({
  selector: 'app-tenant-incentives-form',
  templateUrl: './tenant-incentives-form.component.html',
  styleUrls: ['./tenant-incentives-form.component.scss']
})
export class TenantIncentivesFormComponent {
  tenantIncentiveForm!: FormGroup;
  tenantIncentivesList!: any[];
  tenantIncentivesList$!: Observable<any>;
  incentives: any;

  constructor(private router: Router,
    private fb: FormBuilder,
    private loaderService: LoaderService,
    private toasterService: ToastrService,
    private unitService: UnitService,
    private commonStoreService: CommonStoreService,
    public dialogRef: MatDialogRef<TenantIncentivesFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {

  }

  async ngOnInit() {
    this.tenantIncentiveForm = this.fb.group({
      PropertyId: this.data.PropertyId,
      Incentives: [],
      Units: []
    });
    await this.getTenantIncentives();
    if (typeof (this.data.row) === 'object' && this.data.row.IncentiveStatus === 'Yes')
      this.getUnitDetails();
  }

  getUnitDetails() {
    this.unitService.getUnitDetailsById(this.data.row.PropertyUnitId).subscribe(res => {
      this.incentives = res.data.PropertyIncentives.map((x: any) => x.Id);
      this.tenantIncentiveForm.get('Incentives')?.setValue(this.incentives);
    })
  }

  async getTenantIncentives() {
    this.tenantIncentivesList$ = await this.unitService.getTenantIncentives();
    this.tenantIncentivesList$.subscribe({
      next: (res) => {
        this.tenantIncentivesList = res.data;
      },
      error: (error) => { },
    });
  }

  close() {
    this.dialogRef.close();
  }

  onSubmit() {
    var units = [];
    if (this.data.row.rowData instanceof Array) {
      units = (this.data.row.rowData.map((x: any) => x.PropertyUnitId));
    }
    else {
      units.push(this.data.row.PropertyUnitId);
    }
    this.tenantIncentiveForm.value.Units = units;
    if (this.tenantIncentiveForm.value.Incentives === null) {
      this.dialogRef.close();
    }
    else {
      this.loaderService.show();
      this.unitService
        .unittenantIncentiveUpdate(this.tenantIncentiveForm.value)
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

  createNewIncentive() {
    this.dialogRef.close(); let formConfig = {
      id: 0,
      mode: FORM_MODE.CREATE,
    };
    this.commonStoreService.setFormConfig(formConfig);
    this.router.navigate([`${ROUTE.CREATE_INCENTIVE}`]);
  }

}
