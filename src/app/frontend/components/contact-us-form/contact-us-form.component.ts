import { Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { FrontendService } from '../../services/frontend.service';
import { CONTACT_US_FORM, PATTERN } from 'src/app/models/constants';
import { FormBase } from 'src/app/utilities/form-base';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { CustomDialogComponent } from 'src/app/shared/components/custom-dialog/custom-dialog.component';
import { environment } from 'src/environments/environment.dev';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CaptchaComponent } from '../../shared/captcha/captcha.component';
import { InputModule } from 'src/app/shared/modules/input/input.module';
import { TextareaComponent } from 'src/app/shared/components/form-elements/textarea/textarea.component';
import { SelectModule } from 'src/app/shared/modules/select/select.module';
import { GoogleAnalyticsService } from 'src/app/shared/services/google-analytics.service';

@Component({
  selector: 'app-contact-us-form',
  standalone: true,
  templateUrl: './contact-us-form.component.html',
  styleUrls: ['./contact-us-form.component.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CaptchaComponent,
    InputModule,
    TextareaComponent,
    SelectModule,
  ],
})
export class ContactUsFormComponent extends FormBase implements OnInit {
  enquiryTypes$!: Observable<any[]>;
  pageName: any;
  constructor(
    fb: FormBuilder,
    private frontendService: FrontendService,
    private toasterService: ToastrService,
    private dialog: MatDialog,
    private router: Router,
    private googleAnalyticsService: GoogleAnalyticsService
  ) {
    super(fb);
  }
  ngOnInit(): void {
    this.form = this.fb.group({
      FirstName: [
        null,
        [
          Validators.required,
          Validators.pattern(PATTERN.ALPHABETS.PATTERN),
          Validators.maxLength(100),
        ],
      ],
      LastName: [
        null,
        [
          Validators.required,
          Validators.pattern(PATTERN.ALPHABETS.PATTERN),
          Validators.maxLength(100),
        ],
      ],
      Email: [
        null,
        [Validators.required, Validators.pattern(PATTERN.EMAIL_PATTERN)],
      ],
      Mobile: [
        null,
        [
          // Validators.required,
          Validators.pattern(PATTERN.MOBILE_NUMBER_PATTERN),
        ],
      ],
      EnquiryTypeId: [null, [Validators.required]],
      Message: [null, [Validators.required]],
      Recaptcha: [
        { value: '', disabled: !environment.RECAPTCHA.enabled },
        Validators.required,
      ],
    });
    this.getEnquiryTypes();
  }
  getEnquiryTypes() {
    this.enquiryTypes$ = this.frontendService.getEnquiryTypes();
  }
  onSubmit(event: SubmitEvent) {
    event?.preventDefault();
    if (this.form?.valid) {
      this.frontendService.addEnquiry(this.form.value).subscribe({
        next: (res: any) => {
          this.form.reset();
          this.onContactFormSuccess();
          this.router.navigate([this.router.url, 'thank-you'], {
            state: {
              message:
                'Your message has been successfully submitted. We will get back to you as soon as possible.',
              prevRoute: this.router.url,
            },
          });
          // this.openModel();
        },
        error: (error: HttpErrorResponse) => {
          this.displayError(error.error.errors);
        },
      });
    } else {
      this.validateForm(CONTACT_US_FORM);
    }
  }
  displayError(error: any) {
    let errors = JSON.parse(error);
    Object.keys(errors).forEach((err: any) => {
      this.toasterService.error(errors[err][0]);
    });
  }
  openModel() {
    let dialogRef = this.dialog.open(CustomDialogComponent, {
      data: {
        text: `<h6 class="rd-heading rd-heading-xs">Thank you!</h6><p>Your message has been successfully submitted. We will get back to you as soon as possible.<p>`,
        btn2Text: 'Ok',
      },
      width: '500px',
      height: '200px',
    });
  }

  onContactFormSuccess() {
    if (environment.CUSTOM_GTAG) {
      this.googleAnalyticsService.trackEvent(
       'contact_form_success',
        'Contact Us',
        'Contact Us Form Success'
      );
    }
  }
}
