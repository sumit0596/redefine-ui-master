import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PropertyService } from 'src/app/admin/services/property.service';
import { CommonStoreService } from 'src/app/services/common-store.service';
import {
  FORM_MODE,
  INPUT_ERROR,
  MDA_LOOKUP_FORM,
  PATTERN,
  ROUTE,
} from 'src/app/models/constants';
import { LoaderService } from 'src/app/shared/services/loader/loader.service';

@Component({
  selector: 'app-mda-lookup',
  templateUrl: './mda-lookup.component.html',
  styleUrls: ['./mda-lookup.component.scss'],
})
export class MdaLookupComponent {
  mdaLookupFormGroup!: any;
  errorMessage!: string;
  constructor(
    public dialogRef: MatDialogRef<MdaLookupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private propertyService: PropertyService,
    private loaderService: LoaderService,
    private toasterService: ToastrService,
    private router: Router,
    private commonStoreService: CommonStoreService
  ) {}

  ngOnInit() {
    this.mdaLookupFormGroup = this.fb.group({
      BuildingCode: [
        '',
        [
          Validators.required,
          Validators.pattern(PATTERN.NUMERIC.PATTERN),
          Validators.maxLength(4),
        ],
      ],
    });
  }
  get buildingCode() {
    return this.mdaLookupFormGroup.get('BuildingCode') as FormControl;
  }

  cancel() {
    this.dialogRef.close();
  }

  closeModal() {
    this.dialogRef.close();
  }
  onSubmit() {
    this.errorMessage = '';
    this.validateForm();
    if (this.mdaLookupFormGroup.valid) {
      this.getPropertyDetails();
    }
  }
  getPropertyDetails() {
    this.loaderService.show();
    this.propertyService
      .mdaLookupPropertyDetails(this.buildingCode.value)
      .subscribe({
        next: (res) => {
          this.commonStoreService.setFormConfig({
            id: this.buildingCode.value,
            mode: FORM_MODE.CREATE,
          });
          // this.propertyService.setPropertyDetails(res.data);
          // this.router.navigate([ROUTE.CREATE_PROPERTY_DETAILS]);
          this.reset();
          this.loaderService.hide();
          //this.toasterService.success(res.message);
          this.dialogRef.close({ data: res.data, message: res.message });
        },
        error: (error) => {
          this.loaderService.hide();
          this.errorMessage = error.error.message;
          error.error.errors ? this.displayError(error.error.errors) : '';
        },
      });
  }
  displayError(error: any) {
    if (error) {
      let errors = JSON.parse(error);
      Object.keys(errors).forEach((err: any) => {
        this.toasterService.error(errors[err][0]);
      });
    }
  }
  reset() {
    this.mdaLookupFormGroup.reset();
  }

  validateForm() {
    Object.keys(this.mdaLookupFormGroup.controls).forEach((control) => {
      let formControl = this.mdaLookupFormGroup.get(control);
      if (formControl?.hasError('required')) {
        formControl.setErrors({ invalid: `Property Code is required` });
      } else if (formControl?.hasError('pattern')) {
        this.mdaLookupFormGroup.get(control)?.setErrors({
          required: false,
          invalid: INPUT_ERROR.NUMERIC_PATTERM,
        });
      } else if (formControl?.hasError('maxlength')) {
        this.mdaLookupFormGroup.get(control)?.setErrors({
          required: false,
          invalid: INPUT_ERROR.MDA_PROPERTY_CODE_LENGTH,
        });
      }
    });
  }
  setFormConfig(id: any, mode: string) {
    let formConfig = {
      id: id,
      mode: mode,
    };
    this.commonStoreService.setFormConfig(formConfig);
  }

  getControlLabel(control: string) {
    let result: any = Object.values(MDA_LOOKUP_FORM).find(
      (res: any) => res.NAME == control
    );
    return result ? result.LABEL : control;
  }
}
