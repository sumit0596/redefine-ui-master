import { Component, Inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PropertyService } from 'src/app/admin/services/property.service';
import {
  FORM_MODE,
  INPUT_ERROR,
  ROUTE,
  SEO_FORM,
  SESSION,
} from 'src/app/models/constants';
import { CommonStoreService } from 'src/app/services/common-store.service';
import { LoaderService } from 'src/app/shared/services/loader/loader.service';

@Component({
  selector: 'app-international-seo-form',
  templateUrl: './international-seo-form.component.html',
  styleUrls: ['./international-seo-form.component.scss'],
})
export class InternationalSeoFormComponent {
  formConfig: any;
  seoForm!: FormGroup;
  seoData: any;

  constructor(
    public dialogRef: MatDialogRef<InternationalSeoFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private loaderService: LoaderService,
    private router: Router,
    private commonStoreService: CommonStoreService,
    private propertyService: PropertyService,
    private toasterService: ToastrService
  ) {}

  async ngOnInit() {
    this.seoForm = this.fb.group({
      MetaTitle: ['', [Validators.required, Validators.maxLength(100)]],
      MetaKeywords: ['', [Validators.required, Validators.maxLength(255)]],
      MetaDescription: ['', [Validators.required, Validators.maxLength(800)]],
    });
    await this.configureForm();
  }

  async configureForm() {
    this.formConfig = await this.commonStoreService.getFormConfig();
    switch (this.formConfig.mode) {
      case FORM_MODE.EDITSEO:
        this.getSeoDetailsByPropertyId(this.formConfig.id);
        break;
      default:
        break;
    }
  }

  getSeoDetailsByPropertyId(propertyId: any) {
    this.loaderService.show();
    this.propertyService.getPropertySeodata(propertyId).subscribe({
      next: (res: any) => {
        this.seoData = res.data;
        this.fillFormData();
        this.loaderService.hide();
      },
      error: (error: any) => {
        this.loaderService.hide();
        this.toasterService.error(error.error.message);
      },
    });
  }

  fillFormData() {
    Object.keys(this.seoForm.controls).forEach((control) => {
      this.seoForm.get(control)?.setValue(this.seoData[control]);
    });
  }

  onSubmit(event: any) {
    event.preventDefault();
    this.validateForm();
    if (this.seoForm.valid) {
      let payload = this.createPayload();
      this.updateSEO(payload);
      this.dialogRef.close();
    }
  }

  createPayload() {
    let payload = this.seoForm.value;
    return payload;
  }

  validateForm() {
    Object.keys(this.seoForm.controls).forEach((control: any) => {
      this.setControlError(control);
    });
  }

  setControlError(control: string) {
    if (this.checkError(control, 'required')) {
      this.seoForm.get(control)?.setErrors({
        required: true,
        invalid: `${this.getControlLabel(control)} is required`,
      });
    } else if (
      this.checkError(control, 'minlength') ||
      this.checkError(control, 'maxlength')
    ) {
      if (control == SEO_FORM.META_TITLE.NAME) {
        this.seoForm.get(control)?.setErrors({
          required: false,
          invalid: `${INPUT_ERROR.NAME_PATTERN}`,
        });
      }
      if (control == SEO_FORM.META_KEYWORDS.NAME) {
        this.seoForm.get(control)?.setErrors({
          required: false,
          invalid: INPUT_ERROR.SEOMETAKEYWORD_LENGTH,
        });
      }
      if (control == SEO_FORM.META_DESCRIPTION.NAME) {
        this.seoForm.get(control)?.setErrors({
          required: false,
          invalid: INPUT_ERROR.SEODESCRIPTION_LENGTH,
        });
      }
    }
  }

  getControlLabel(control: string) {
    let result: any = Object.values(SEO_FORM).find(
      (res: any) => res.NAME == control
    );
    return result ? result.LABEL : control;
  }

  checkError(control: string, error: string) {
    return this.seoForm.get(control)?.hasError(error);
  }

  updateSEO(payload: any) {
    this.loaderService.show();
    this.propertyService.updateSeo(this.formConfig.id, payload).subscribe({
      next: (res: any) => {
        this.loaderService.hide();
        // this.toasterService.success(res.message);
        // this.goToManage();
        sessionStorage.removeItem(SESSION.FORM_CONFIG);
        this.router
          .navigate([`${ROUTE.MANAGE_INTERNATIONAL_PROPERTY}`])
          .then((m) => {
            this.toasterService.success(res.message);
          });
      },
      error: (error: any) => {
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
  //   this.router.navigate([`${ROUTE.MANAGE_INTERNATIONAL_PROPERTY}`]);
  // }

  closeModal() {
    this.dialogRef.close();
  }

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
