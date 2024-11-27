import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
  ReactiveFormsModule,
} from '@angular/forms';
import { ActivatedRoute, Router, UrlTree } from '@angular/router';
// import { RecaptchaErrorParameters } from 'ng-recaptcha';
import { ToastrService } from 'ngx-toastr';
import { map, take } from 'rxjs';
import { EnquiriesService } from 'src/app/admin/services/enquiries.service';
import {
  PATTERN,
  USER_FORM,
  INPUT_ERROR,
  CONSTANTS,
} from 'src/app/models/constants';
import { CommonStoreService } from 'src/app/services/common-store.service';
import { LoaderService } from 'src/app/shared/services/loader/loader.service';
import { environment } from 'src/environments/environment.dev';
import { BreadcrumbsComponent } from '../../shared/breadcrumbs/breadcrumbs.component';
import { InputModule } from 'src/app/shared/modules/input/input.module';
import { TextareaComponent } from 'src/app/shared/components/form-elements/textarea/textarea.component';
import { CaptchaComponent } from '../../shared/captcha/captcha.component';
import { GoogleAnalyticsService } from 'src/app/shared/services/google-analytics.service';

@Component({
  selector: 'app-enquiry-form',
  standalone: true,
  templateUrl: './enquiry-form.component.html',
  styleUrls: ['./enquiry-form.component.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    BreadcrumbsComponent,
    InputModule,
    TextareaComponent,
    CaptchaComponent,
  ],
})
export class EnquiryFormComponent {
  personalDetailsForm!: FormGroup;
  slug!: any;
  selectedUnits: any;
  propertyId: any;
  propertyName: any;
  formConfig: any;
  urlData: any;

  constructor(
    private fb: FormBuilder,
    private enquiryService: EnquiriesService,
    private loaderService: LoaderService,
    public toasterService: ToastrService,
    private route: ActivatedRoute,
    private router: Router,
    private googleAnalyticsService: GoogleAnalyticsService,
    private commonStoreService: CommonStoreService // private recaptchaV3Service: ReCaptchaV3Service
  ) {
    this.route.paramMap.subscribe((params) => {
      this.slug = params.get(CONSTANTS.ROUTE_ID);
    });
    this.route.paramMap
      .pipe(
        take(1), //take(1) is for unsubscribe
        map(() => window.history.state)
      )
      .subscribe((res) => {
        // this.selectedUnits = res.data?.selectedUnits;
        // this.propertyId = res.data?.propertyDetails.PropertyId;
        // this.propertyName = res.data?.propertyDetails.PropertyName;
      });
  }

  async ngOnInit() {
    this.personalDetailsForm = this.fb.group({
      FirstName: [
        '',
        [
          Validators.required,
          Validators.pattern(PATTERN.NAME_PATTERN),
          Validators.maxLength(100),
        ],
      ],
      LastName: [
        '',
        [
          Validators.required,
          Validators.pattern(PATTERN.NAME_PATTERN),
          Validators.maxLength(100),
        ],
      ],
      Email: [
        '',
        [
          Validators.required,
          Validators.pattern(PATTERN.EMAIL_PATTERN),
          Validators.maxLength(255),
        ],
      ],
      Mobile: [
        '',
        [
          Validators.required,
          Validators.pattern(PATTERN.NUMERIC.PATTERN),
          Validators.minLength(10),
          Validators.maxLength(10),
        ],
      ],
      CompanyName: ['', [Validators.required, Validators.maxLength(100)]],
      CompanyDescription: [''],
      Recaptcha: [
        { value: '', disabled: !environment.RECAPTCHA.enabled },
        [Validators.required],
      ],
    });
    this.formConfig = await this.commonStoreService.getFormConfig();
    this.urlData = {
      url: this.slug,
      replacedUrl: this.formConfig?.propertyDetails?.PropertyName,
    };
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

  onSubmit(event: any) {
    event.preventDefault();
    this.validateForm();
    if (this.personalDetailsForm.valid) {
      let payload = this.createPayload();
      this.uploadUserInfo(payload);
    }
  }

  onPropertyFormSuccess() {
    if (environment.CUSTOM_GTAG) {
      this.googleAnalyticsService.trackEvent(
        'property_form_success',
        'Property',
        'Property Form Success'
      );
    }
  }

  createPayload() {
    let payload: any = {
      FirstName: this.personalDetailsForm.value.FirstName,
      LastName: this.personalDetailsForm.value.LastName,
      Email: this.personalDetailsForm.value.Email,
      Mobile: this.personalDetailsForm.value.Mobile,
      CompanyName: this.personalDetailsForm.value.CompanyName,
      CompanyDescription: this.personalDetailsForm.value.CompanyDescription,
      PropertyId: this.formConfig?.propertyDetails.PropertyId,
    };
    if (this.formConfig?.selectedUnits) {
      payload['PropertyUnitsId'] = this.formConfig?.selectedUnits
        .map((x: any) => x.PropertyUnitId)
        .toString();
    }
    return payload;
  }

  uploadUserInfo(payload: any) {
    this.loaderService.show();
    this.enquiryService.uploadUserInfo(payload).subscribe({
      next: (res: any) => {
        this.personalDetailsForm.reset();
        this.loaderService.hide();
        // this.toasterService.success(res.message);
 
        const currentUrl = this.router.url;
        const needSpaceActive = currentUrl.includes(`need-space/${this.slug}`);
        const propertiesActive = currentUrl.includes(`properties/${this.slug}`);
        this.onPropertyFormSuccess();
        if (needSpaceActive || propertiesActive) {
          const targetRoute = needSpaceActive
            ? ['need-space', this.slug, 'thank-you']
            : ['properties', this.slug, 'thank-you'];
 
          this.router.navigate(targetRoute, {
            state: {
              message:
                'Your message has been successfully submitted. We will get back to you as soon as possible.',
              prevRoute: this.router.url,
            },
          }).then((m)=>{
            this.toasterService.success(res.message);
          });
        }
      },
      error: (error: any) => {
        this.loaderService.hide();
        error.error.errors
          ? this.displayError(error.error.errors)
          : this.toasterService.error(error.error.message);
      },
    });
  }

  isCaptchaResolved: boolean = false;

  handleCaptchaResolved(response: any) {
    this.isCaptchaResolved = true;
  }

  // public onError(errorDetails: RecaptchaErrorParameters): void {}

  displayError(error: any) {
    if (error) {
      let errors = JSON.parse(error);
      Object.keys(errors).forEach((err: any) => {
        this.toasterService.error(errors[err][0]);
      });
    }
  }

  validateForm() {
    Object.keys(this.personalDetailsForm.controls).forEach((control: any) => {
      this.setControlError(control);
    });
  }
  setControlError(control: string) {
    let formControl = this.getControl(this.personalDetailsForm, control);
    if (this.checkError(control, 'required')) {
      this.personalDetailsForm.get(control)?.setErrors({
        ...formControl.errors,
        invalid: `${this.getControlLabel(control)} is required`,
      });
    } else if (this.checkError(control, 'minlength')) {
      this.personalDetailsForm.get(control)?.setErrors({
        ...formControl.errors,
        invalid: `Minimum ${
          this.personalDetailsForm.get(control)?.getError('minlength')
            ?.requiredLength
        } characters are allowed`,
      });
    } else if (this.checkError(control, 'maxlength')) {
      this.personalDetailsForm.get(control)?.setErrors({
        ...formControl.errors,
        invalid: `Maximum ${
          this.personalDetailsForm.get(control)?.getError('maxlength')
            ?.requiredLength
        } characters are allowed`,
      });
    }
  }
  checkError(control: string, error: string) {
    return this.personalDetailsForm.get(control)?.hasError(error);
  }

  getControlLabel(control: string) {
    let result: any = Object.values(USER_FORM).find(
      (res: any) => res.NAME == control
    );
    return result ? result.LABEL : control;
  }
  getControlPatternMessage(control: string): any {
    let result: any = Object.values(USER_FORM).find(
      (res: any) => res.NAME == control
    );
    return result
      ? result.PATTERN_MESSAGE
        ? result.PATTERN_MESSAGE
        : `Please provide valid ${control}`
      : `Please provide valid ${control}`;
  }
}
