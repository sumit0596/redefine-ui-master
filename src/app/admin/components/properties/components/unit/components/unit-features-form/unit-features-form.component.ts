import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable, of } from 'rxjs';
import { PropertyService } from 'src/app/admin/services/property.service';
import { StepperService } from 'src/app/admin/services/stepper.service';
import { UnitService } from 'src/app/admin/services/unit.service';
import { CONSTANTS, FORM_MODE, ROUTE, UNIT_FEATURES_FORM } from 'src/app/models/constants';
import { CommonStoreService } from 'src/app/services/common-store.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { LoaderService } from 'src/app/shared/services/loader/loader.service';
import { UnitComponent } from '../../unit.component';
import { UnitAvailabilityDialogComponent } from '../unit-availability-dialog/unit-availability-dialog.component';

@Component({
  selector: 'app-unit-features-form',
  templateUrl: './unit-features-form.component.html',
  styleUrls: ['./unit-features-form.component.scss']
})
export class UnitFeaturesFormComponent extends UnitComponent {
  featureAmenities: any;
  featuresForm!: FormGroup;
  toastMessage: any;
  constructor(
    router: Router,
    fb: FormBuilder,
    loaderService: LoaderService,
    stepperService: StepperService,
    unitService: UnitService,
    commonStoreService: CommonStoreService,
    private dialog: MatDialog,
    private dialogRef: MatDialog,
    propertyService: PropertyService,
    toasterService: ToastrService,
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
    this.stepperService.setStep({ label: 'Step 3', active: true });
    this.formConfig=this.commonStoreService.getFormConfig();
  }
 // override ngOnDestroy(): void {}
  toggleSwitch(event: any, i: any) {
    this.mergedFeaturesAmenitiesList[i].Checked =  event.checked;
    if (event.checked) {
      this.unitFeaturesAmenitiesForm.at(i).get('Checked')?.setValue(1);
    } else {
      this.unitFeaturesAmenitiesForm.at(i).get('Checked')?.setValue(0);
      this.unitFeaturesAmenitiesForm.at(i).get('Value')?.setValue(null);
    }
  }
  onSubmit() {
    if (this.unitFeaturesForm.valid) {
      let payload = this.createPayload();
      this.addUpdateFeatures(payload);
    }
  }
  addUpdateFeatures(payload: any) {
    this.loaderService.show();
    this.unitService.addUpdateUnitFeatures(payload).subscribe({
      next: (res) => {
        this.loaderService.hide();
       // this.toasterService.success(res.message);
       this.toastMessage = res.message;
        this.createOtherUnitPopup();
      },
      error: (error) => {
        this.loaderService.hide();
        error.error.errors
          ? this.displayError(error.error.errors)
          : this.toasterService.error(error.error.message);
      },
    });
  }
  createPayload() {
    let payload = this.unitFeaturesForm.value;
    payload = Object.assign(payload, { PropertyId: this.propertyId, PropertyUnitId : this.PropertyUnitId });
    payload.FeaturesAmenitiesSectorId =
      payload.FeaturesAmenitiesSectorId.filter((f: any) => f.Checked);
    return payload;
  }
  validateForm() {}

  setControlError(control: string) {
    if (control == UNIT_FEATURES_FORM.Value.NAME) {
      var sectorIdFormControl = (
        this.unitFeaturesForm.get('FeaturesAmenitiesSectorId') as FormArray
      ).controls as FormControl[];
      sectorIdFormControl.forEach((x: any) => {
        Object.keys(x.controls).forEach((controlName: any) => {
          if (
            x.get(controlName)?.hasError('required') &&
            x.get(controlName).value === ''
          ) {
            x.get(controlName)?.setErrors({
              invalid: `${this.getControlLabel(controlName)} is required`,
            });
          }
        });
      });
    }
  }

  checkError(control: string, error: string) {
    if (this.unitFeaturesForm.get(control)) {
      return this.unitFeaturesForm.get(control)?.hasError(error);
    } else {
      var inValid = false;
      var sectorIdFormControl = (
        this.unitFeaturesForm.get('FeaturesAmenitiesSectorId') as FormArray
      ).controls as FormControl[];
      sectorIdFormControl.forEach((x: any) => {
        Object.keys(x.controls).forEach((control: any) => {
          inValid = x.get(control)?.hasError(error);
        });
      });
      return inValid;
    }
  }

  createOtherUnitPopup(){
    const dialogRef = this.dialog.open(UnitAvailabilityDialogComponent, {
      data: {
        text1: (this.formConfig.mode === FORM_MODE.CREATE)? CONSTANTS.UNIT_CREATE_CONFIRMATION_TEXT1 : CONSTANTS.UNIT_EDIT_CONFIRMATION_TEXT1,
        text2: CONSTANTS.UNIT_CREATE_CONFIRMATION_TEXT2,
        label: 'Unit Created',
        btn1Text: CONSTANTS.NO,
        btn2Text: CONSTANTS.YES,
        tablename: '',
      },      
    });
    dialogRef.afterClosed().subscribe((action: any) => {
          if (action === CONSTANTS.YES) {
            super.setFormConfig(this.propertyId,FORM_MODE.CREATE);
            this.router.navigate([`${ROUTE.CREATE_UNIT_DETAILS}`]).then(m => {
              this.toasterService.success(this.toastMessage);
            });
          }
          else {
            this.goToPropertyConfirmation(this.toastMessage)
          }
        });
  }

  sprinklerSpecChange(event:any, featureForm: any){
    this.sprinklerSpecId = event.Id;
    if(event.Id == 3){
      featureForm.get('Value').setValue('');
    }
    else{
      featureForm.get('Value').setValue(event.Name);
    }
  }

  backUpChange(event: any, featureForm: any) {
    this.backUpGeneratorId = event.Id;
      featureForm.get('Value').setValue(event.Name);
  }

  standByWaterChange(event: any, featureForm: any) {
    this.standByWaterId = event.Id;
      featureForm.get('Value').setValue(event.Name);
  }
}
