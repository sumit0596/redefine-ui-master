import { Component, Inject } from '@angular/core';
import { FormBuilder, Validators, FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PropertyService } from 'src/app/admin/services/property.service';
import {
  PATTERN,
  FORM_MODE,
  ROUTE,
  INPUT_ERROR,
  MDA_LOOKUP_FORM,
  VACANCY_FORM,
  SEO_FORM,
} from 'src/app/models/constants';
import { CommonStoreService } from 'src/app/services/common-store.service';
import { LoaderService } from 'src/app/shared/services/loader/loader.service';
import { MdaLookupComponent } from '../mda-lookup/mda-lookup.component';

@Component({
  selector: 'app-vacancy-schedule-content',
  templateUrl: './vacancy-schedule-content.component.html',
  styleUrls: ['./vacancy-schedule-content.component.scss'],
})
export class VacancyScheduleContentComponent {
  mdaLookupFormGroup!: any;
  errorMessage!: string;
  vacancyData: any;
  formConfig: any;
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

  async ngOnInit() {
    this.mdaLookupFormGroup = this.fb.group({
      Name: ['', [Validators.required]],
      Value: ['', [Validators.required]],
    });
    await this.configureForm();
  }

  async configureForm() {
    this.formConfig = await this.commonStoreService.getFormConfig();

    this.getVacancy();
  }

  // get buildingCode() {
  //   return this.mdaLookupFormGroup.get('BuildingCode') as FormControl;
  // }

  cancel() {
    this.dialogRef.close();
  }

  closeModal() {
    this.dialogRef.close();
  }
  // onSubmit() {
  //   this.errorMessage = '';
  //   this.validateForm();
  //   if (this.mdaLookupFormGroup.valid) {
  //     this.getPropertyDetails();
  //   }
  // }

  reset() {
    this.mdaLookupFormGroup.reset();
  }

  setFormConfig(id: any, mode: string) {
    let formConfig = {
      id: id,
      mode: mode,
    };
    this.commonStoreService.setFormConfig(formConfig);
  }

  getVacancy() {
    this.loaderService.show();
    this.propertyService.getVacancydata().subscribe({
      next: (res) => {
        this.vacancyData = res.data;
        this.fillFormData();
        this.loaderService.hide();
      },
      error: (error) => {
        this.loaderService.hide();
        this.toasterService.error(error.error.message);
      },
    });
  }

  fillFormData() {
    Object.keys(this.mdaLookupFormGroup.controls).forEach((control) => {
      this.mdaLookupFormGroup.get(control)?.setValue(this.vacancyData[control]);
    });
  }

  onSubmit(event: any) {
    event.preventDefault();
    this.validateForm();
    if (this.mdaLookupFormGroup.valid) {
      let payload = this.createPayload();
      this.updateVacancy(payload);
      this.dialogRef.close();
    }
  }

  createPayload() {
    let payload = this.mdaLookupFormGroup.value;
    return payload;
  }

  validateForm() {
    Object.keys(this.mdaLookupFormGroup.controls).forEach((control: any) => {
      this.setControlError(control);
    });
  }

  setControlError(control: string) {
    if (this.checkError(control, 'required')) {
      this.mdaLookupFormGroup.get(control)?.setErrors({
        required: true,
        invalid: `${this.getControlLabel(control)} is required`,
      });
    } else if (
      this.checkError(control, 'minlength') ||
      this.checkError(control, 'maxlength')
    ) {
      // if (control == SEO_FORM.META_TITLE.NAME) {
      //   this.mdaLookupFormGroup.get(control)?.setErrors({
      //     required: false,
      //     invalid: `${INPUT_ERROR.NAME_PATTERN}`,
      //   });
      // }
      // if (control == SEO_FORM.META_KEYWORDS.NAME) {
      //   this.mdaLookupFormGroup.get(control)?.setErrors({
      //     required: false,
      //     invalid: INPUT_ERROR.SEOMETAKEYWORD_LENGTH,
      //   });
      // }
      // if (control == SEO_FORM.META_DESCRIPTION.NAME) {
      //   this.mdaLookupFormGroup.get(control)?.setErrors({
      //     required: false,
      //     invalid: INPUT_ERROR.SEODESCRIPTION_LENGTH,
      //   });
      // }
    }
  }

  getControlLabel(control: string) {
    let result: any = Object.values(VACANCY_FORM).find(
      (res: any) => res.NAME == control
    );
    return result ? result.LABEL : control;
  }

  checkError(control: string, error: string) {
    return this.mdaLookupFormGroup.get(control)?.hasError(error);
  }

  updateVacancy(payload: any) {
    this.loaderService.show();
    this.propertyService.updateVacancy(this.formConfig.id, payload).subscribe({
      next: (res) => {
        this.loaderService.hide();
        this.toasterService.success(res.message);
        //this.goToManage();
      },
      error: (error) => {
        this.loaderService.hide();
        error.error.errors
          ? this.displayError(error.error.errors)
          : this.toasterService.error(error.error.message);
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

  // goToManage() {
  //   sessionStorage.removeItem(SESSION.FORM_CONFIG);
  //   this.router.navigate([`${ROUTE.MANAGE_PROPERTY}`]);
  // }

  // closeModal() {
  //   this.dialogRef.close();
  // }

  onChange(event: any) {
    this.validateFormField(event);
  }
  validateFormField(data: any) {
    let control: FormControl = this.getControl(data.form, data.control);
    if (control.hasError('required')) {
      control?.setErrors({
        ...control.errors,
        invalid: `${this.getControlLabel(data.control)} is required`,
      });
    } else if (control.hasError('minlength')) {
      control?.setErrors({
        ...control.errors,
        invalid: `Minimum ${
          control.getError('minlength')?.requiredLength
        } characters are allowed`,
      });
    } else if (control.hasError('maxlength')) {
      control?.setErrors({
        ...control.errors,
        invalid: `Maximum ${
          control.getError('maxlength')?.requiredLength
        } characters are allowed`,
      });
    }
  }

  getControl(form: any, control: string): FormControl {
    return form.get(control) as FormControl;
  }
}
