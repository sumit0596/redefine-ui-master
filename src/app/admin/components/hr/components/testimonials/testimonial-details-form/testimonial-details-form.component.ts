import { Component } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable, of } from 'rxjs';
import { TestimonialService } from 'src/app/admin/services/testimonial.service';
import {
  FORM_MODE,
  ROUTE,
  INPUT_ERROR,
  SESSION,
  TESTIMONIAL_FORM,
  PATTERN,
} from 'src/app/models/constants';

import { CommonStoreService } from 'src/app/services/common-store.service';
import { LoaderService } from 'src/app/shared/services/loader/loader.service';

@Component({
  selector: 'app-testimonial-details-form',
  templateUrl: './testimonial-details-form.component.html',
  styleUrls: ['./testimonial-details-form.component.scss'],
})
export class TestimonialDetailsFormComponent {
  formMode: any = FORM_MODE;
  formConfig!: any;
  testimonialDetails: any;
  testimonialForm!: FormGroup;

  type$: Observable<any> = of([
    {
      id: 1,
      label: 'Redefiner Testimonials',
    },
    {
      id: 2,
      label: 'Learnership Testimonials',
    },
  ]);
  type: any;

  constructor(
    private fb: FormBuilder,
    private testimonialService: TestimonialService,
    private loaderService: LoaderService,
    private toasterService: ToastrService,
    private commonStoreService: CommonStoreService,
    private router: Router
  ) {}
  async ngOnInit() {
    this.testimonialForm = this.fb.group({
      JobTitle: [null, [Validators.required, Validators.maxLength(255)]],
      Type: [null, [Validators.required]],
      ReviewerName: [
        '',
        [
          Validators.required,
          Validators.pattern(PATTERN.NAME_PATTERN),
          Validators.maxLength(100),
        ],
      ],
      Testimonial: ['', [Validators.maxLength(700)]],
    });
    await this.configureForm();
  }

  async configureForm() {
    this.formConfig = await this.commonStoreService.getFormConfig();
    switch (this.formConfig.mode) {
      case FORM_MODE.CREATE:
        break;
      case FORM_MODE.EDIT:
        this.getTestimonialById(this.formConfig.id);

        break;
      case FORM_MODE.VIEW:
        this.testimonialForm.disable();
        this.getTestimonialById(this.formConfig.id);

        break;
      default:
        break;
    }
  }
  getTestimonialById(id: number) {
    this.loaderService.show();
    this.testimonialService.getTestimonial(id).subscribe({
      next: (res: any) => {
        this.testimonialDetails = res.data;
        this.fillFormData();
        this.loaderService.hide();
      },
      error: (error: any) => {
        this.loaderService.hide();
        this.toasterService.error(error.error.message);
      },
    });
  }
  editTestimonial() {
    let formConfig = {
      mode: FORM_MODE.EDIT,
      id: this.formConfig.id,
    };
    this.commonStoreService.setFormConfig(formConfig);
    this.router.navigate([`${ROUTE.EDIT_TESTIMONIAL}`]);
  }
  createTestimonial(payload: any) {
    this.loaderService.show();
    this.testimonialService.createTestimonial(payload).subscribe({
      next: (res: any) => {
        this.reset();
        this.loaderService.hide();
        this.goToManage(res.message);
      },
      error: (error) => {
        this.loaderService.hide();
        error.error.errors
          ? this.displayError(error.error.errors)
          : this.toasterService.error(error.error.message);
      },
    });
  }
  updateTestimonial(payload: any) {
    this.loaderService.show();
    this.testimonialService
      .updateTestimonial(payload, this.testimonialDetails.TestimonialsId)
      .subscribe({
        next: (res: any) => {
          this.loaderService.hide();
          this.goToManage(res.message);
        },
        error: (error) => {
          this.loaderService.hide();
          error.error.errors
            ? this.displayError(error.error.errors)
            : this.toasterService.error(error.error.message);
        },
      });
  }

  onSubmit(event: any) {
    event.preventDefault();
    if (this.testimonialForm.value.Type == 2) {
      this.testimonialForm.get('JobTitle')?.clearValidators();
      this.testimonialForm.get('JobTitle')?.updateValueAndValidity();
    }
    this.validateForm();
    if (this.testimonialForm.valid) {
      let payload = this.createPayload();
      if (this.formConfig.mode == FORM_MODE.CREATE) {
        this.createTestimonial(payload);
      } else if (this.formConfig.mode == FORM_MODE.EDIT) {
        this.typeSelect(event);
        this.updateTestimonial(payload);
      }
    }
  }

  fillFormData() {
    Object.keys(this.testimonialForm.controls).forEach((control) => {
      this.testimonialForm
        .get(control)
        ?.setValue(this.testimonialDetails[control]);
    });
  }

  createPayload() {
    let payload = this.testimonialForm.value;
    return payload;
  }

  validateForm() {
    Object.keys(this.testimonialForm.controls).forEach((control: any) => {
      this.setControlError(control);
    });
  }
  checkError(control: string, error: string) {
    return this.testimonialForm.get(control)?.hasError(error);
  }
  setControlError(control: string) {
    if (this.checkError(control, 'required')) {
      this.testimonialForm.get(control)?.setErrors({
        required: true,
        invalid: `${this.getControlLabel(control)} is required`,
      });
    } else if (
      this.checkError(control, 'minlength') ||
      this.checkError(control, 'maxlength')
    ) {
      this.testimonialForm.get(control)?.setErrors({
        required: false,
        invalid: `${INPUT_ERROR.NAME_PATTERN}`,
      });
    } else if (this.checkError(control, 'pattern')) {
      if (control == TESTIMONIAL_FORM.REVIEWER_NAME.NAME) {
        this.testimonialForm.get(control)?.setErrors({
          required: false,
          invalid: INPUT_ERROR.ALPHABETS_PATTERN,
        });
      }
    }
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
    this.testimonialForm.reset();
  }
  goToManage(message? : any) {
    sessionStorage.removeItem(SESSION.FORM_CONFIG);
    (message != undefined)
    ? this.router.navigate([ROUTE.MANAGE_TESTIMONIAL]).then((m) => {
        this.toasterService.success(message);
      })
    : this.router.navigate([ROUTE.MANAGE_TESTIMONIAL]);
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
        required: false,
        invalid: `Minimum ${
          control.getError('minlength')?.requiredLength
        } characters are allowed`,
      });
    } else if (control.hasError('maxlength')) {
      control?.setErrors({
        ...control.errors,
        required: false,
        invalid: `Maximum ${
          control.getError('maxlength')?.requiredLength
        } characters are allowed`,
      });
    } else if (control.hasError('pattern')) {
      control?.setErrors({
        ...control.errors,
        invalid: this.getControlPatternMessage(data.control),
      });
    }
  }
  getControl(form: any, control: string): FormControl {
    return form.get(control) as FormControl;
  }
  getControlLabel(control: string) {
    let result: any = Object.values(TESTIMONIAL_FORM).find(
      (res: any) => res.NAME == control
    );
    return result ? result.LABEL : control;
  }
  getControlPatternMessage(control: string): any {
    let result: any = Object.values(TESTIMONIAL_FORM).find(
      (res: any) => res.NAME == control
    );
    return result
      ? result.PATTERN_MESSAGE
        ? result.PATTERN_MESSAGE
        : `Please provide valid ${control}`
      : `Please provide valid ${control}`;
  }

  typeSelect(event: any) {
    this.type = event.id;
    if (event.id == 1) {
      this.testimonialForm
        .get('JobTitle')
        ?.setValidators([Validators.required, Validators.maxLength(255)]);

      this.testimonialForm.get('JobTitle')?.updateValueAndValidity();
    } else {
      this.testimonialForm.get('JobTitle')?.clearValidators();

      this.testimonialForm.get('JobTitle')?.updateValueAndValidity();
    }

    if (event.id == 2) {
      this.testimonialForm

        .get('')

        ?.setValidators([Validators.required, Validators.maxLength(255)]);

      this.testimonialForm.get('')?.updateValueAndValidity();
    } else {
      this.testimonialForm.get('')?.clearValidators();

      this.testimonialForm.get('')?.updateValueAndValidity();
    }
  }
}
