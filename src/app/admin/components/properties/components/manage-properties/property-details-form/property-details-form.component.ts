import { CommonStoreService } from 'src/app/services/common-store.service';
import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { PropertyService } from 'src/app/admin/services/property.service';
import { StepperService } from '../../../../../services/stepper.service';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { DataStoreService } from 'src/app/shared/services/data-store.service';
import { MatDialog } from '@angular/material/dialog';
import { LoaderService } from 'src/app/shared/services/loader/loader.service';
import {
  FORM_MODE,
  CONSTANTS,
  PROPERTY_FORM,
  ROUTE,
} from 'src/app/models/constants';
import { PropertyComponent } from '../../property/property.component';
import { CommonService } from 'src/app/shared/services/common.service';
import { DomSanitizer } from '@angular/platform-browser';
import { PROPERTY_TYPE } from 'src/app/models/enum';

@Component({
  selector: 'app-property-details-form',
  templateUrl: './property-details-form.component.html',
  styleUrls: [
    './property-details-form.component.scss',
    '../../property/property.component.scss',
  ],
})
export class PropertyDetailsFormComponent extends PropertyComponent {
  hello = 2;
  isChecked = true;
  propertyGrades$!: Observable<any[]>;
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
    private dataStoreService: DataStoreService,
    private domSanitizer: DomSanitizer
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
    this.getProvince();
    this.getCountries();
    this.getPropertyAttributes();
    this.getPropertyGrades();
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
        this.changeStep(ROUTE.CREATE_PROPERTY_MEDIA, res.message);
        this.loaderService.hide();
        // this.toasterService.success(res.message);
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
        this.changeStep(ROUTE.CREATE_PROPERTY_MEDIA, res.message);
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
  async getCountries() {
    this.countries$ = await this.dataStoreService.getCountries();
  }
  async getSector() {
    this.sectors$ = await this.dataStoreService.getSector(
      PROPERTY_TYPE.SOUTH_AFRICA
    );
  }
  async getProvince() {
    this.provinces$ = await this.dataStoreService.getProvince();
  }
  async getPropertyAttributes() {
    this.propertyAttributes$ =
      await this.propertyService.getPropertyAttributes();
  }
  async getPropertyGrades() {
    this.propertyGrades$ = await this.propertyService.getPropertyGrade();
  }
  onSwitchToggle(event: any) {
    if (event.checked) {
      this.propertyDetailsForm.get(event.label)?.enable();
    } else {
      this.propertyDetailsForm.get(event.label)?.disable();
    }
  }
  onDataChange(event: any, key: string) {
    switch (key) {
      case PROPERTY_FORM.SECTOR_ID.LABEL:
        this.sector = event.Name;
        // this.sector = event.Name;
        this.toggleSectorFields(event.Name);
        break;
      default:
        break;
    }
  }

  methodToGetURL() {
    // first lattitude, second- longitude
    let longitude = 28.19479;
    let latitude = -25.746113;
    return this.domSanitizer.bypassSecurityTrustResourceUrl(
      'https://www.google.com/maps/embed/v1/place?q=-25.746113,28.19479&key=AIzaSyCSmWbyMXqS2MWbmh5pHbWk-iWCVm6RlPM'
    );
  }

  getGeolocation = (lat: any, lng: any) => {
    const latlng = lat + ',' + lng;
    const key = 'AIzaSyCSmWbyMXqS2MWbmh5pHbWk-iWCVm6RlPM';
    fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latlng}&key=${key}`
    ).then((res) => res.json());
  };
}
