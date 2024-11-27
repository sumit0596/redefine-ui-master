import { ToastrService } from 'ngx-toastr';
import { StepperService } from '../../../../../../services/stepper.service';
import { MatDialog } from '@angular/material/dialog';
import { PropertyComponent } from './../../property.component';
import { Component, OnDestroy } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { HttpEventType } from '@angular/common/http';
import { CONSTANTS, ROUTE } from 'src/app/models/constants';
import { PropertyService } from 'src/app/admin/services/property.service';
import { CommonStoreService } from 'src/app/services/common-store.service';
import { LoaderService } from 'src/app/shared/services/loader/loader.service';
import { CommonService } from 'src/app/shared/services/common.service';

@Component({
  selector: 'app-property-esg-features',
  templateUrl: './property-esg-features.component.html',
  styleUrls: [
    './property-esg-features.component.scss',
    '../../property.component.scss',
  ],
})
export class PropertyEsgFeaturesComponent
  extends PropertyComponent
  implements OnDestroy
{
  netZeroCarbon$: Observable<any[]> = of([
    {
      Id: 'Base Building Emissions',
      Name: 'Level 1 - Base Building Emissions',
    },
    {
      Id: 'Occupant Emissions',
      Name: 'Level 2 - Occupant Emissions',
    },
    {
      Id: 'Embodied Emissions ',
      Name: 'Level 3 - Embodied Emissions ',
    },
    {
      Id: 'Renovation Emissions',
      Name: 'Level 4 - Renovation Emissions',
    },
    {
      Id: 'Deconstruction Emissions',
      Name: 'Level 5 - Deconstruction Emissions',
    },
  ]);

  CarbonLevelType$: Observable<any[]> = of([
    { Id: 'Modelled', Name: 'Modelled' },
    {
      Id: 'Measured',
      Name: 'Measured',
    },
  ]);

  netZeroWater$: Observable<any[]> = of([
    {
      Id: 'Occupant Consumption',
      Name: 'Level 2 - Occupant Consumption',
    },

    {
      Id: 'Embodied Consumption',
      Name: 'Level 3 - Embodied Consumption',
    },
    {
      Id: 'Renovation Consumption',
      Name: 'Level 4 - Renovation Consumption',
    },
    {
      Id: 'Deconstruction Consumption',
      Name: 'Level 5 - Deconstruction Consumption',
    },
  ]);
  netZeroWaste$: Observable<any[]> = of([
    {
      Id: 'Construction Waste',
      Name: 'Level 1 - Construction Waste',
    },
    {
      Id: 'Operational Waste',
      Name: 'Level 2 - Operational Waste',
    },
    {
      Id: 'Embodied Waste',
      Name: 'Level 3 - Embodied Waste',
    },
    {
      Id: 'Renovation Waste',
      Name: 'Level 4 - Renovation Waste',
    },
    {
      Id: 'Deconstruction Waste',
      Name: 'Level 5 - Deconstruction Waste',
    },
  ]);
  netZeroEcology$: Observable<any[]> = of([
    {
      Id: 'Development Ecology',
      Name: 'Level 1 - Development Ecology',
    },
    {
      Id: 'Operational Ecology',
      Name: 'Level 2 - Operational Ecology',
    },
  ]);

  performanceRating$: Observable<any[]> = of([
    { Id: 1, Name: '1 Star' },
    { Id: 2, Name: '2 Star' },
    { Id: 3, Name: '3 Star' },
    { Id: 4, Name: '4 Star' },
    { Id: 5, Name: '5 Star' },
    { Id: 6, Name: '6 Star' },
  ]);

  officeRating$: Observable<any[]> = of([
    { Id: 4, Name: '4 Star' },
    { Id: 5, Name: '5 Star' },
    { Id: 6, Name: '6 Star' },
  ]);

  EPC$: Observable<any[]> = of([
    { Id: 1, Name: 'A' },
    { Id: 2, Name: 'B' },
    { Id: 3, Name: 'C' },
    { Id: 4, Name: 'D' },
    { Id: 5, Name: 'E' },
    { Id: 6, Name: 'F' },
    { Id: 7, Name: 'G' },
  ]);

  // officeBuiltRating$: Observable<any[]> = of([
  //   { Id: 4, Name: 'Level 4' },
  //   { Id: 5, Name: 'Level 5' },
  //   { Id: 6, Name: 'Level 6' },
  // ]);

  // netZeroDropdownValues$: Observable<any> = this.netZeroDropdown;

  MEDIA_CONSTANTS = {
    BROCHURE: 'Brochure',
    RATE_CARD: 'RateCard',
    VIDEO: 'Video',
    FLOOR_PLAN: 'FloorPlan',
    MALL_MAP: 'MallMap',
  };

  //minDate: Date;

  constructor(
    router: Router,
    fb: FormBuilder,
    dialog: MatDialog,
    loaderService: LoaderService,
    stepperService: StepperService,
    propertyService: PropertyService,
    commonStoreService: CommonStoreService,
    toasterService: ToastrService,
    private dialogRef: MatDialog,
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
    this.stepperService.setStep({ label: 'Step 5', active: true });
    //this.minDate = new Date();
  }
  override ngOnDestroy(): void {}
  onSwitchToggle(event: any, form: any) {
    form.get('Checked')?.setValue(event.checked);
    switch (event.label) {
      case 'Existing Building Performance':
        if (form.value.Rating === null && event.checked) {
          form.get('Rating').setValue('1 Star');
        }
        break;
      case 'Carbon':
        if (
          form.value.Rating === null &&
          event.checked &&
          form.value.LevelType === null
        ) {
          form.get('Rating').setValue('Level 1 - Base Building Emissions');
          form.get('LevelType').setValue('Modelled');
        }
        break;
      case 'Water':
        if (
          form.value.Rating === null &&
          event.checked &&
          form.value.LevelType === null
        ) {
          form.get('Rating').setValue('Level 2 - Occupant Consumption');
          form.get('LevelType').setValue('Modelled');
        }
        break;
      case 'Waste':
        if (
          form.value.Rating === null &&
          event.checked &&
          form.value.LevelType === null
        ) {
          form.get('Rating').setValue('Level 1 - Construction Waste');
          form.get('LevelType').setValue('Modelled');
        }
        break;
      case 'Ecology':
        if (
          form.value.Rating === null &&
          event.checked &&
          form.value.LevelType === null
        ) {
          form.get('Rating').setValue('Level 1 - Development Ecology');
          form.get('LevelType').setValue('Modelled');
        }
        break;
      case 'Energy Performance Certificate':
        if (form.value.Rating === null && event.checked) {
          form.get('Rating').setValue('A');
        }
        break;
      default:
        if (form.value.Rating === null && event.checked) {
          form.get('Rating').setValue('4');
        }
        break;
    }
  }
  rate(event: any, form: any) {
    this.getControl(form, 'Rating').setValue(event);
  }
  onFileSelect(fileInfo: any, form: any) {
    this.loaderService.show();
    this.media = {
      File: fileInfo[0],
      Type: 'Esg',
    };
    this.propertyService
      .uploadPropertyMedia(this.media, this.propertyId)
      .subscribe({
        next: (event: any) => {
          if (event.type == HttpEventType.Response) {
            this.getControl(form, 'File').setValue({
              Id: event.body.data.PropertyMediaId,
              Name: event.body.data.Name,
              Url: event.body.data.Url,
              CreatedOn: event.body.data.CreatedOn,
            });
          }
        },
        complete: () => {
          this.loaderService.hide();
        },
        error: (error) => {
          this.loaderService.hide();
          this.toasterService.error(
            `Could not upload the file ${fileInfo[0].name}`
          );
        },
      });
  }
  onFileDelete(event: any) {}
  deleteFile(fileInfo: any, form: any) {
    const dialogRef = this.commonService.deleteFileConfirmation();
    dialogRef.afterClosed().subscribe((action: any) => {
      if (action) {
        this.loaderService.show();
        this.propertyService.deletePropertyMedia(fileInfo.Id).subscribe({
          next: (res) => {
            this.loaderService.hide();
            this.toasterService.success(res.message);
            this.getControl(form, 'File').setValue(null);
          },
          error: (error) => {
            this.loaderService.hide();
            this.toasterService.error(error.error.message);
          },
        });
      }
    });
  }
  onSubmit(event: any) {
    event.preventDefault();
    let payload = this.createPayload(this.esgFeaturesForm.value);
    this.addUpdatePropertyEsgFeatures(payload);
  }
  addUpdatePropertyEsgFeatures(payload: any) {
    this.loaderService.show();
    this.propertyService.addUpdatePropertyEsgFeatures(payload).subscribe({
      next: (res: any) => {
        //  this.toasterService.success(res.message);
        this.changeStep(ROUTE.PROPERTY_CONFIRMATION, res.message);
      },
      complete: () => {
        this.loaderService.hide();
      },
      error: (error: any) => {
        this.loaderService.hide();
        error.error.errors
          ? this.displayError(error.error.errors)
          : this.toasterService.error(error.error.message);
      },
    });
  }
  createPayload(result: any) {
    let payload: {
      PropertyId: any;
      EsgFeatures: any[];
    };
    let selectedFeatures: any[] = [];
    result.forEach((feature: any) => {
      feature.Features.forEach((subFeature: any) => {
        if (feature.Checked && subFeature.Checked) {
          let featureData = {
            EsgFeaturesId: subFeature.EsgFeaturesId,
            Rating: subFeature.Rating,
            OffsetPercentage: subFeature.OffsetPercentage,
            ValidityStartDate: subFeature.ValidityStartDate,
            ValidityEndDate: subFeature.ValidityEndDate,
            AdditionalInformation: subFeature.AdditionalInformation,
            LevelType: subFeature.LevelType,
          };
          if (subFeature.File != null && subFeature.File != undefined) {
            featureData = Object.assign(featureData, {
              PropertyMediaId: subFeature.File.Id,
            });
          }
          selectedFeatures.push(featureData);
        }
      });
    });
    payload = {
      PropertyId: this.formConfig.id,
      EsgFeatures: selectedFeatures,
    };
    return payload;
  }
  subFeatureForm(index: number): FormArray {
    return this.esgFeaturesForm.at(index).get('Features') as FormArray;
  }
}
