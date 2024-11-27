import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { PropertyService } from 'src/app/admin/services/property.service';
import { StepperService } from 'src/app/admin/services/stepper.service';
import { CONSTANTS, FORM_MODE, PROPERTY_FORM, ROUTE } from 'src/app/models/constants';
import { CommonStoreService } from 'src/app/services/common-store.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { DataStoreService } from 'src/app/shared/services/data-store.service';
import { LoaderService } from 'src/app/shared/services/loader/loader.service';
import { InternationalPropertyComponent } from '../../international-property.component';
import { PROPERTY_TYPE } from 'src/app/models/enum';

@Component({
  selector: 'app-international-property-details-form',
  templateUrl: './international-property-details-form.component.html',
  styleUrls: ['./international-property-details-form.component.scss',
  '../../international-property.component.scss']
})
export class InternationalPropertyDetailsFormComponent extends InternationalPropertyComponent {

  propertyAttributes$!: Observable<any[]>;
  constructor(
    router: Router,
    fb: FormBuilder,
    loaderService: LoaderService,
    stepperService: StepperService,
    propertyService: PropertyService,
    commonStoreService: CommonStoreService,
    toasterService: ToastrService,
    dialog: MatDialog,
    commonService: CommonService,
    private dataStoreService: DataStoreService
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
    this.getSector();
   // this.getProvince();
    //this.getCountries();
    this.getPropertyAttributes();
    stepperService.setStep({ label: 'Step 1', active: true });
  }

  override ngOnDestroy(): void {}
  get buildingCode() {
    return this.propertyDetailsForm.get('BuildingCode');
  }
  get propertyName() {
    return this.propertyDetailsForm.get('PropertyName');
  }
  onSubmit(event: any) {
    event.preventDefault();
    this.validateForm();

    if (this.propertyDetailsForm.valid) {
      let payload = this.createPayload(this.propertyDetailsForm.getRawValue());
      if (this.formConfig?.mode == FORM_MODE.CREATE) {
        this.createProperty(payload);
      } else if (this.formConfig?.mode == FORM_MODE.EDIT) {
        this.updateProperty(payload);
      }
    }
  }
  createPayload(propertyDetails: any) {
    if (propertyDetails.PropertyAttributes != '') {
      propertyDetails.PropertyAttributes = this.commonService.changeDataFormat(
        propertyDetails.PropertyAttributes,
        CONSTANTS.STRING
      );
    }
    return Object.assign(propertyDetails, {
      BuildingCode: this.buildingCode?.value,
      SectorId: this.getControl(
        this.propertyDetailsForm,
        PROPERTY_FORM.SECTOR_ID.NAME
      ).value,
      Latitude: this.getControl(
        this.propertyDetailsForm,
        PROPERTY_FORM.LATITUDE.NAME
      ).value,
      Longitude: this.getControl(
        this.propertyDetailsForm,
        PROPERTY_FORM.LONGITUDE.NAME
      ).value,
    });
  }

  validateForm() {
    let valid = true;
    Object.keys(this.propertyDetailsForm.controls).forEach((control: any) => {
      this.setControlError(control);
    });
  }
  setControlError(control: string) {
    if (this.checkError(control, 'required')) {
      this.propertyDetailsForm.get(control)?.setErrors({
        required: true,
        invalid: `${this.getControlLabel(control)} is required`,
      });
    }
  }
  checkError(control: string, error: string) {
    return this.propertyDetailsForm.get(control)?.hasError(error);
  }
  createProperty(payload: any) {
    this.loaderService.show();
    this.propertyService.createProperty(payload).subscribe({
      next: (res: any) => {
        this.propertyId = res.data.PropertyId;
        this.changeStep(ROUTE.CREATE_INTERNATIONAL_PROPERTY_MEDIA, res.message);
        this.loaderService.hide();
        this.updatePropertyId(res.data.PropertyId);
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

  updateProperty(payload: any) {
    this.loaderService.show();
    this.propertyService.updateProperty(payload).subscribe({
      next: (res: any) => {
        this.loaderService.hide();
        //this.toasterService.success(res.message);
        this.changeStep(ROUTE.CREATE_INTERNATIONAL_PROPERTY_MEDIA, res.message);
      },
      complete: () => {
      },
      error: (error) => {
        this.loaderService.hide();
        error.error.errors
          ? this.displayError(error.error.errors)
          : this.toasterService.error(error.error.message);
      },
    });
  }
  updatePropertyId(propertyId: number) {
    super.setFormConfig(propertyId, FORM_MODE.EDIT);
    this.propertyDetailsForm.get('PropertyId')?.setValue(propertyId);
  }

  async getSector() {
    this.sectors$ = await this.dataStoreService.getSector(PROPERTY_TYPE.INTERNATIONAL);
  }

  async getPropertyAttributes() {
    this.propertyAttributes$ =
      await this.propertyService.getPropertyAttributes();
  }

  onSwitchToggle(event: any) {
    if (event.checked) {
      this.propertyDetailsForm.get(event.label)?.enable();
    } else {
      this.propertyDetailsForm.get(event.label)?.disable();
    }
  }
}
