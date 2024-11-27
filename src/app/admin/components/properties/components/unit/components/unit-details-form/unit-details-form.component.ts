import { DialogRef } from '@angular/cdk/dialog';
import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable, of } from 'rxjs';
import { PropertyService } from 'src/app/admin/services/property.service';
import { UnitService } from 'src/app/admin/services/unit.service';
import {
  CONSTANTS,
  FORM_MODE,
  ROUTE,
  UNIT_FORM,
} from 'src/app/models/constants';
import { CommonStoreService } from 'src/app/services/common-store.service';
import { DataStoreService } from 'src/app/shared/services/data-store.service';
import { LoaderService } from 'src/app/shared/services/loader/loader.service';
import { StepperService } from '../../../../../../services/stepper.service';
import { UnitComponent } from '../../unit.component';
import { UnitAvailabilityDialogComponent } from '../unit-availability-dialog/unit-availability-dialog.component';
import { CommonService } from 'src/app/shared/services/common.service';

@Component({
  selector: 'app-unit-details-form',
  templateUrl: './unit-details-form.component.html',
  styleUrls: ['./unit-details-form.component.scss'],
})
export class UnitDetailsFormComponent extends UnitComponent {
  rentalEscalations$: Observable<any> = of([
    { Id: 1, Name: '6%' },
    { Id: 2, Name: '6.25%' },
    { Id: 3, Name: '6.75%' },
    { Id: 4, Name: '7%' },
    { Id: 5, Name: '7.25%' },
    { Id: 6, Name: '7.50%' },
    { Id: 7, Name: '7.75%' },
    { Id: 8, Name: '8%' },
    { Id: 9, Name: '8.25%' },
    { Id: 10, Name: '8.50%' },
    { Id: 11, Name: '8.75%' },
    { Id: 12, Name: '9%' },
    { Id: 13, Name: '9.25%' },
    { Id: 14, Name: '9.50%' },
    { Id: 15, Name: '9.75%' },
    { Id: 16, Name: '10%' },
    { Id: 17, Name: '10.25%' },
    { Id: 18, Name: '10.50%' },
    { Id: 19, Name: '10.75%' },
    { Id: 20, Name: '11%' },
    { Id: 21, Name: '11.25%' },
    { Id: 22, Name: '11.50%' },
    { Id: 23, Name: '11.75%' },
    { Id: 24, Name: '12%' },
  ]);

  brokerCommissionIncentives$: Observable<any>;

  //today = new Date();
  constructor(
    router: Router,
    fb: FormBuilder,
    loaderService: LoaderService,
    stepperService: StepperService,
    unitService: UnitService,
    commonStoreService: CommonStoreService,
    private dataStoreService: DataStoreService,
    propertyService: PropertyService,
    toasterService: ToastrService,
    private datePipe: DatePipe,
    private dialog: MatDialog,
    commonService: CommonService
  ) {
    super(
      fb,
      loaderService,
      stepperService,
      unitService,
      commonStoreService,
      router,
      propertyService,
      toasterService,
      commonService
    );
    stepperService.setStep({ label: 'Step 1', active: true });
    super.getPropertyDetails();
    this.brokerCommissionIncentives$ = of(this.dropdownCommissionIncentives());
  }

  type$: Observable<any> = of([
    {
      id: 1,
      label: 'Fitted Out ',
    },
    {
      id: 2,
      label: 'White boxed ',
    },
    {
      id: 3,
      label: 'TBC',
    },
  ]);
  type: any;

  private dropdownCommissionIncentives() {
    const incentives = [];
    for (let i = 1; i <= 60; i++) {
      incentives.push({ Id: i, Name: `${i * 5}%` });
    }
    return incentives;
  }

  onSubmit(event: any) {
    event.preventDefault();
    if (this.showBaseOpsCost == false) {
      this.unitDetailsForm.get('NetRental')?.setErrors(null);
      this.unitDetailsForm.get('OpsRental')?.setErrors(null);
      this.unitDetailsForm.updateValueAndValidity();
    }
    if (this.showBaseOpsCost == true) {
      if (this.unitDetailsForm.get('NetRental')?.value == null) {
        this.unitDetailsForm
          .get('NetRental')
          ?.setValidators([Validators.required]);
      }
      if (this.unitDetailsForm.get('OpsRental')?.value == null) {
        this.unitDetailsForm
          .get('OpsRental')
          ?.setValidators([Validators.required]);
      }
      this.unitDetailsForm.updateValueAndValidity();
    }
    this.validateForm();
    // if (
    //   this.showBaseOpsCost === false &&
    //   this.unitDetailsForm.value.NameAndLocation != '' &&
    //   this.unitDetailsForm.value.UnitSize != '' &&
    //   this.unitDetailsForm.value.BaseRental != 0 &&
    //   this.unitDetailsForm.value.OperationalCost != 0 &&
    //   this.unitDetailsForm.value.Rates != 0 &&
    //   this.unitDetailsForm.value.GrossRental != 0
    // ) {
    //   this.toasterService.error('Please check Offer Space2Spec');
    // }
    if (this.unitDetailsForm.valid) {
      let payload = this.createPayload(this.unitDetailsForm.getRawValue());
      if (
        this.formConfig?.mode == FORM_MODE.CREATE ||
        this.formConfig?.mode == FORM_MODE.ADD_UNIT
      ) {
        this.createUnit(payload);
      } else if (this.formConfig?.mode == FORM_MODE.EDIT) {
        this.updateUnit(payload);
      }
    }
  }
  createPayload(unitDetails: any) {
    if (unitDetails.OpsRental != null && unitDetails.NetRental != null) {
      unitDetails.OpsRental = unitDetails.OpsRental?.replace('%', '');
      unitDetails.NetRental = unitDetails.NetRental?.replace('%', '');
    }
    if (unitDetails.BrokerIncentives != null) {
      unitDetails.BrokerIncentives = unitDetails.BrokerIncentives?.replace(
        '%',
        ''
      );
    }
    unitDetails.UnitAvailableDate = this.datePipe.transform(
      unitDetails.UnitAvailableDate,
      'Y-MM-dd'
    );
    unitDetails.PropertyId = this.propertyId;
    if (unitDetails.PropertyIncentives != '') {
      unitDetails.PropertyIncentives = this.commonService.changeDataFormat(
        unitDetails.PropertyIncentives,
        CONSTANTS.STRING
      );
    }
    return unitDetails;
  }

  updateUnit(payload: any) {
    this.loaderService.show();
    this.unitService.updateUnit(payload).subscribe({
      next: (res: any) => {
        this.loaderService.hide();
        // this.toasterService.success(res.message);
        this.changeStep(ROUTE.CREATE_UNIT_MEDIA, res.message);
      },
      complete: () => {},
      error: (error) => {
        this.loaderService.hide();
        error.error.errors
          ? this.displayError(error.error.errors)
          : this.toasterService.error(error.error.message);
      },
    });
  }

  validateForm() {
    let valid = true;
    Object.keys(this.unitDetailsForm.controls).forEach((control: any) => {
      this.setControlError(control);
    });
  }

  setControlError(control: string) {
    if (this.checkError(control, 'required')) {
      this.unitDetailsForm.get(control)?.setErrors({
        required: true,
        invalid: `${this.getControlLabel(control)} is required`,
      });
    }
  }

  checkError(control: string, error: string) {
    return this.unitDetailsForm.get(control)?.hasError(error);
  }

  createUnit(payload: any) {
    this.loaderService.show();
    this.unitService.createUnit(payload).subscribe({
      next: (res: any) => {
        this.propertyId = res.data.PropertyId;
        this.PropertyUnitId = res.data.PropertyUnitId;
        this.nextStep(ROUTE.CREATE_UNIT_MEDIA, res.message);
        this.loaderService.hide();
        // this.toasterService.success(res.message);
        this.updatePropertyUnitId(res.data.PropertyId, res.data.PropertyUnitId);
      },
      complete: () => {},
      error: (error) => {
        this.loaderService.hide();
        error.error.errors
          ? this.displayError(error.error.errors)
          : this.toasterService.error(error.error.message);
      },
    });
  }

  updatePropertyUnitId(propertyId: number, propertyUnitId: number) {
    super.setFormConfig(propertyUnitId, FORM_MODE.EDIT);
    // super.setStepCompleted(true);
    this.unitDetailsForm.get('PropertyId')?.setValue(propertyId);
    this.unitDetailsForm.get('PropertyUnitId')?.setValue(propertyUnitId);
  }

  onSwitchToggle(event: any) {
    if (event.checked) {
      this.unitDetailsForm.get(event.label)?.enable();
    } else {
      this.unitDetailsForm.get(event.label)?.disable();
    }
  }

  selectTenantAllowance(event: any) {
    if (event.target.checked) {
      this.unitDetailsForm.get('TenentAllowance')?.enable();
      this.unitDetailsForm
        .get('TenentAllowance')
        ?.setValue(
          '1 months gross rental *per year signed based  ON A 3 TO 5 year LEASE'
        );
    } else {
      this.unitDetailsForm.get('TenentAllowance')?.disable();
      this.unitDetailsForm.get('TenentAllowance')?.setValue('');
    }
  }

  selectspace2spec(event: any) {
    this.showBaseOpsCost = event.target.checked ? true : false;
    if (this.showBaseOpsCost == false) {
      this.unitDetailsForm.get('NetRental')?.setValue(null);
      this.unitDetailsForm.get('OpsRental')?.setValue(null);
      this.unitDetailsForm.get('ThreeYearsLease')?.setValue('');
      this.unitDetailsForm.get('FiveYearsLease')?.setValue('');
    }
  }

  accessNoteSelect(event: any) {
    if (event.AccessId === 6) {
      this.unitDetailsForm
        .get('AccessNoteOther')
        ?.setValidators([Validators.required, Validators.maxLength(255)]);
    } else {
      this.unitDetailsForm.get('AccessNoteOther')?.setValue('');
    }
  }

  createNewIncentive() {
    const dialogRef = this.dialog.open(UnitAvailabilityDialogComponent, {
      data: {
        text1: CONSTANTS.INCENTIVE_CREATE_TEXT1,
        text2: CONSTANTS.INCENTIVE_CREATE_TEXT2,
        label: 'Please Note:',
        btn1Text: CONSTANTS.CANCEL,
        btn2Text: CONSTANTS.YES,
        tablename: '',
      },
    });
    dialogRef.afterClosed().subscribe((action: any) => {
      if (action === CONSTANTS.YES) {
        let formConfig = {
          id: undefined,
          mode: FORM_MODE.CREATE,
        };
        this.commonStoreService.setFormConfig(formConfig);
        this.router.navigate([`${ROUTE.CREATE_INCENTIVE}`]);
      }
    });
  }
}
