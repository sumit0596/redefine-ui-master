import { CommonStoreService } from 'src/app/services/common-store.service';
import { Component } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { StepperService } from '../../../../../../services/stepper.service';
import { PropertyService } from 'src/app/admin/services/property.service';
import { ToastrService } from 'ngx-toastr';
import { PropertyComponent } from '../../property.component';
import { Observable, of } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ROUTE, PROPERTY_FEATURES_FORM } from 'src/app/models/constants';
import { LoaderService } from 'src/app/shared/services/loader/loader.service';
import { CommonService } from 'src/app/shared/services/common.service';

@Component({
  selector: 'app-property-features-form',
  templateUrl: './property-features-form.component.html',
  styleUrls: [
    './property-features-form.component.scss',
    '../../property.component.scss',
  ],
})
export class PropertyFeaturesFormComponent extends PropertyComponent {
  featureAmenities: any;
  featuresForm!: FormGroup;
  constructor(
    router: Router,
    fb: FormBuilder,
    loaderService: LoaderService,
    stepperService: StepperService,
    propertyService: PropertyService,
    commonStoreService: CommonStoreService,
    toasterService: ToastrService,
    dialog: MatDialog,
    commonService: CommonService
  ) {
    super(
      fb,
      loaderService,
      stepperService,
      propertyService,
      commonStoreService,
      router,
      toasterService,
      dialog,
      commonService
    );
    this.stepperService.setStep({ label: 'Step 4', active: true });
  }
  override ngOnDestroy(): void {}
  toggleSwitch(event: any, i: any) {
    this.mergedFeaturesAmenitiesList[i].Checked = event.checked;
    if (event.checked) {
      this.propertyFeaturesAmenitiesForm.at(i).get('Checked')?.setValue(1);
    } else {
      this.propertyFeaturesAmenitiesForm.at(i).get('Checked')?.setValue(0);
      this.propertyFeaturesAmenitiesForm.at(i).get('Value')?.setValue(null);
    }
  }
  onSubmit() {
    if (this.propertyFeaturesForm.valid) {
      let payload = this.createPayload();
      this.addUpdateFeatures(payload);
    }
  }
  addUpdateFeatures(payload: any) {
    this.loaderService.show();
    this.propertyService.addUpdatePropertyFeatures(payload).subscribe({
      next: (res) => {
        this.loaderService.hide();
        this.changeStep(ROUTE.PROPERTY_ESG_FEATURES, res.message);
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
    let payload = this.propertyFeaturesForm.value;
    payload = Object.assign(payload, { PropertyId: this.propertyId });
    payload.FeaturesAmenitiesSectorId =
      payload.FeaturesAmenitiesSectorId.filter((f: any) => f.Checked);
    return payload;
  }
  validateForm() {}

  setControlError(control: string) {
    if (control == PROPERTY_FEATURES_FORM.Value.NAME) {
      var sectorIdFormControl = (
        this.propertyFeaturesForm.get('FeaturesAmenitiesSectorId') as FormArray
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
    if (this.propertyFeaturesForm.get(control)) {
      return this.propertyFeaturesForm.get(control)?.hasError(error);
    } else {
      var inValid = false;
      var sectorIdFormControl = (
        this.propertyFeaturesForm.get('FeaturesAmenitiesSectorId') as FormArray
      ).controls as FormControl[];
      sectorIdFormControl.forEach((x: any) => {
        Object.keys(x.controls).forEach((control: any) => {
          inValid = x.get(control)?.hasError(error);
        });
      });
      return inValid;
    }
  }

  sprinklerSpecChange(event: any, featureForm: any) {
    this.sprinklerSpecId = event.Id;
    if (event.Id == 3) {
      featureForm.get('Value').setValue('');
    } else {
      featureForm.get('Value').setValue(event.Name);
    }
  }

  standByWaterChange(event: any, featureForm: any) {
    this.standByWaterId = event.Id;
    // if (event.Id == 1) {
    //   featureForm.get('Value').setValue('');
    // } else {
      featureForm.get('Value').setValue(event.Name);
  }

  backUpChange(event: any, featureForm: any) {
    this.backUpGeneratorId = event.Id;
    // if (event.Id == 1) {
    //   featureForm.get('Value').setValue('');
    // } else {
      featureForm.get('Value').setValue(event.Name);
   // }
  }
}
