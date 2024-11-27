import { Component } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormArray,
  FormControl,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { EnquiriesService } from 'src/app/admin/services/enquiries.service';
import { ContextContainer } from 'src/app/core/context/context-container';
import {
  FORM_MODE,
  SESSION,
  ROUTE,
  INPUT_ERROR,
  ENQUIRY_FORM,
} from 'src/app/models/constants';
import { CommonStoreService } from 'src/app/services/common-store.service';
import { EmailDialogComponent } from 'src/app/shared/components/email-dialog/email-dialog.component';

@Component({
  selector: 'app-enquiry-details-form',
  templateUrl: './enquiry-details-form.component.html',
  styleUrls: ['./enquiry-details-form.component.scss'],
})
export class EnquiryDetailsFormComponent {
  formMode: any = FORM_MODE;
  formConfig!: any;
  enquiryDetails!: any;
  enquiryID!: any;
  enquiryStatusForm!: FormGroup;
  // @ViewChild('response') response!: ElementRef;
  enquiryStatus$: Observable<any[]> = of([
    {
      Id: 0,
      Name: 'Pending',
    },
    {
      Id: 1,
      Name: 'Resolved',
    },
  ]);

  constructor(
    private enquiriesService: EnquiriesService,
    private context: ContextContainer,
    private router: Router,
    private fb: FormBuilder,
    private commonStoreService: CommonStoreService,
    private dialogRef: MatDialog
  ) {}

  async ngOnInit() {
    this.setForm();
    this.configureForm();
  }

  goToManage(message?: any) {
    sessionStorage.removeItem(SESSION.FORM_CONFIG);
    message != undefined
      ? this.router.navigate([ROUTE.MANAGE_ENQUIRY]).then((m) => {
          this.context.toasterService.success(message);
        })
      : this.router.navigate([ROUTE.MANAGE_ENQUIRY]);
  }

  setForm() {
    this.enquiryStatusForm = this.fb.group({
      Status: [null],
      Note: ['', [Validators.maxLength(700)]],
    });
  }

  fillFormData() {
    Object.keys(this.enquiryStatusForm.controls).forEach((control: any) => {
      this.getControl(this.enquiryStatusForm, control)?.setValue(
        this.enquiryDetails[control]
      );
    });
  }

  async configureForm() {
    this.formConfig = await this.commonStoreService.getFormConfig();
    this.enquiryID = this.formConfig.id;
    switch (this.formConfig.mode) {
      case FORM_MODE.RESPOND:
        this.getEnquiryDetails(this.enquiryID);
        break;
      case FORM_MODE.VIEW:
        this.getEnquiryDetails(this.enquiryID);
        break;

      default:
        break;
    }
  }

  getEnquiryDetails(id: any) {
    this.context.loaderService.show();
    this.enquiriesService.getEnquiryDetails(id).subscribe({
      next: (res: any) => {
        this.context.loaderService.hide();
        this.enquiryDetails = res.data;
        this.fillFormData();
      },
      error: (error: any) => {
        this.context.loaderService.hide();
        error.error.errors
          ? this.displayError(error.error.errors)
          : this.context.toasterService.error(error.error.message);
      },
    });
  }

  updateStatus(payload: any) {
    this.context.loaderService.show();
    this.enquiriesService
      .updateEnquiryStatus(payload, this.enquiryID)
      .subscribe({
        next: (res: any) => {
          this.context.loaderService.hide();
          this.goToManage(res.message);
        },
        complete: () => {},
        error: (error: any) => {
          this.context.loaderService.hide();
          // error.error.errors;

          this.context.toasterService.error(error.error.message);
        },
      });
  }

  onSubmit(event: any) {
    event.preventDefault();
    this.validateForm();
    if (this.enquiryStatusForm.valid) {
      let payload = this.createPayload();
      if (this.formConfig.mode == FORM_MODE.RESPOND) {
        this.updateStatus(payload);
      }
    }
  }

  createPayload() {
    let payload = {
      Status: this.enquiryStatusForm.value.Status,
      Note: this.enquiryStatusForm.value.Note,
    };
    return payload;
  }

  getControl(
    form: FormGroup | FormArray,
    control: string,
    i: number = 0
  ): FormGroup | FormArray | FormControl | undefined {
    if (form instanceof FormGroup) {
      return form.get(control) as FormControl;
    } else if (form instanceof FormArray) {
      return form.at(i).get(control) as FormControl;
    } else {
      return undefined;
    }
  }

  validateForm() {
    Object.keys(this.enquiryStatusForm.controls).forEach((control: any) => {
      this.setControlError(control);
    });
  }

  checkError(control: string, error: string) {
    return this.enquiryStatusForm.get(control)?.hasError(error);
  }

  setControlError(control: string) {
    if (this.checkError(control, 'required')) {
      this.enquiryStatusForm.get(control)?.setErrors({
        required: true,
        invalid: `${this.getControlLabel(control)} is required`,
      });
    } else if (
      this.checkError(control, 'minlength') ||
      this.checkError(control, 'maxlength')
    ) {
      this.enquiryStatusForm.get(control)?.setErrors({
        required: false,
        invalid: `${INPUT_ERROR.NAME_PATTERN}`,
      });
    }
  }

  getControlLabel(control: string) {
    let result: any = Object.values(ENQUIRY_FORM).find(
      (res: any) => res.NAME == control
    );
    return result ? result.LABEL : control;
  }
  getControlPatternMessage(control: string): any {
    let result: any = Object.values(ENQUIRY_FORM).find(
      (res: any) => res.NAME == control
    );
    return result
      ? result.PATTERN_MESSAGE
        ? result.PATTERN_MESSAGE
        : `Please provide valid ${control}`
      : `Please provide valid ${control}`;
  }

  displayError(error: any) {
    let errors = JSON.parse(error);
    Object.keys(errors).forEach((err: any) => {
      this.context.toasterService.error(errors[err][0]);
    });
  }

  respondToEnquiry() {
    const dialogRef = this.dialogRef.open(EmailDialogComponent, {
      data: {
        Id: this.enquiryID,
        Type: 2,
        EnquiryType: this.enquiryDetails.EnquiryType,
      },
    });
    dialogRef.afterClosed().subscribe((action: any) => {
      if (action === 'send') {
        this.getEnquiryDetails(this.enquiryID);
      }
    });
  }
}
