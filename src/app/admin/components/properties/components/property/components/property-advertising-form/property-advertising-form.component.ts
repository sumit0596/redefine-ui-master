import { Component, Inject, OnDestroy } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialog,
} from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { PropertyService } from 'src/app/admin/services/property.service';
import {
  CONSTANTS,
  FORM_MODE,
  INPUT_ERROR,
  PROPERTY_ADVERTISING_FORM,
} from 'src/app/models/constants';
import { LoaderService } from 'src/app/shared/services/loader/loader.service';
import { PropertyComponent } from '../../property.component';
import { Router } from '@angular/router';
import { CommonStoreService } from 'src/app/services/common-store.service';
import { StepperService } from '../../../../../../services/stepper.service';
import { CommonService } from 'src/app/shared/services/common.service';

@Component({
  selector: 'app-property-advertising-form',
  templateUrl: './property-advertising-form.component.html',
  styleUrls: ['./property-advertising-form.component.scss'],
})
export class PropertyAdvertisingFormComponent
  extends PropertyComponent
  implements OnDestroy
{
  advertisingForm!: FormGroup;
  fileList!: any[];
  advertisingTypes$!: Observable<any>;
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
    public advertisingFormModal: MatDialogRef<PropertyAdvertisingFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
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
  }
  override ngOnDestroy(): void {}
  override async ngOnInit() {
    this.advertisingTypes$ = await this.propertyService.getAdvertisementTypes();
    this.setForm();
    this.configureForm();
  }
  get advertisingTypeId() {
    return this.advertisingForm.get('AdvertisingTypeId') as FormControl;
  }
  get descriptionAndLocation() {
    return this.advertisingForm.get('DescriptionAndLocation') as FormControl;
  }
  get rateCard() {
    return this.advertisingForm.get('RateCard') as FormControl;
  }
  override setForm() {
    this.advertisingForm = this.fb.group({
      AdvertisingTypeId: [null, [Validators.required]],
      DescriptionAndLocation: [
        '',
        [Validators.required, Validators.maxLength(255)],
      ],
      RateCard: [''],
    });
  }
  override async configureForm() {
    switch (this.data.mode) {
      case FORM_MODE.CREATE:
        break;
      case FORM_MODE.EDIT:
        this.fillFormData();
        break;
    }
  }
  override fillFormData() {
    Object.keys(this.advertisingForm.controls).forEach((control: any) => {
      if (control != 'RateCard') {
        this.advertisingForm
          .get(control)
          ?.setValue(this.data.advertisingDetails[control]);
      }
    });
  }
  onFileSelect(event: any) {
    this.fileList = [...event];
    this.updateRateCard(event[0]);
  }
  onFileDelete(event: any) {
    this.fileList.splice(event, 1);
  }
  updateRateCard(file: any) {
    this.rateCard.setValue(file);
  }
  onSubmit() {
    this.validateForm();
    if (this.advertisingForm.valid) {
      this.advertisingFormModal.close(this.advertisingForm.value);
    }
  }
  // validateForm() {
  //   Object.keys(this.advertisingForm.controls).forEach((control) => {
  //     let formControl = this.advertisingForm.get(control);
  //     if (formControl?.hasError('required')) {
  //       formControl.setErrors({ invalid: `${control} is required` });
  //     }
  //   });
  // }
  validateForm() {
    Object.keys(this.advertisingForm.controls).forEach((control: any) => {
      this.setControlError(control);
    });
  }

  setControlError(control: string) {
    let formControl = this.getControl(this.advertisingForm, control);
    if (this.checkError(control, 'required')) {
      this.advertisingForm.get(control)?.setErrors({
        ...formControl.errors,
        invalid: `${this.getControlLabel(control)} is required`,
      });
    } else if (this.checkError(control, 'maxlength')) {
      this.advertisingForm.get(control)?.setErrors({
        ...formControl.errors,
        invalid: INPUT_ERROR.ROLE_NAME_LENGTH,
      });
    } else if (this.checkError(control, 'pattern')) {
      this.advertisingForm.get(control)?.setErrors({
        ...formControl.errors,
        invalid: INPUT_ERROR.ALPHABETS_PATTERN,
      });
    }
  }

  checkError(control: string, error: string) {
    return this.advertisingForm.get(control)?.hasError(error);
  }

  override getControlLabel(control: string) {
    let result: any = Object.values(PROPERTY_ADVERTISING_FORM).find(
      (res: any) => res.NAME == control
    );
    return result ? result.LABEL : control;
  }
  close() {
    this.advertisingFormModal.close();
  }
  deleteFile(id: any) {
    const dialogRef = this.commonService.deleteFileConfirmation();
    dialogRef.afterClosed().subscribe((action: any) => {
      if (action) {
        this.loaderService.show();
        this.propertyService.deleteAdvertisementFile(id).subscribe({
          next: (res) => {
            this.data.advertisingDetails.RateCard = null;
            this.rateCard.setValue('');
            this.loaderService.hide();
            this.toasterService.success(res.message);
          },
          error: (error) => {
            this.loaderService.hide();
            this.toasterService.error(error.error.message);
          },
        });
      }
    });
  }
}
