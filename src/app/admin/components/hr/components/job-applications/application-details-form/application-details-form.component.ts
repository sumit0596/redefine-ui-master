import { Component } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { JobApplicationsService } from 'src/app/admin/services/job-applications.service';
import { ContextContainer } from 'src/app/core/context/context-container';
import {
  FORM_MODE,
  SESSION,
  ROUTE,
  INPUT_ERROR,
  APPLICATION_STATUS_FORM,
  CONSTANTS,
} from 'src/app/models/constants';
import { CommonStoreService } from 'src/app/services/common-store.service';

@Component({
  selector: 'app-application-details-form',
  templateUrl: './application-details-form.component.html',
  styleUrls: ['./application-details-form.component.scss'],
})
export class ApplicationDetailsFormComponent {
  formMode: any = FORM_MODE;
  formConfig!: any;
  applicationDetails!: any;
  applicationID!: any;
  applicationStatusForm!: FormGroup;
  statusList!: any[];
  statusList$!: Observable<any[]>;
  historyFormConfig!: any;
  ApplicantJobId!: any;

  constructor(
    private jobApplicationsService: JobApplicationsService,
    private context: ContextContainer,
    private router: Router,
    private fb: FormBuilder,
    private commonStoreService: CommonStoreService
  ) {}

  async ngOnInit() {
    this.setForm();
    this.configureForm();
  }

  goToManage(message?: any) {
    if (this.formConfig.label === CONSTANTS.JOB_LIST) {
      sessionStorage.removeItem(SESSION.FORM_CONFIG);
      message != undefined
        ? this.router.navigate([`${ROUTE.VIEW_JOB_LIST}`]).then((m) => {
            this.context.toasterService.success(message);
          })
        : this.router.navigate([`${ROUTE.VIEW_JOB_LIST}`]);
    } else if (this.formConfig.label === CONSTANTS.APPLICATION_LIST) {
      sessionStorage.removeItem(SESSION.FORM_CONFIG);
      message != undefined
        ? this.router.navigate([`${ROUTE.VIEW_APPLICANT}`]).then((m) => {
            this.context.toasterService.success(message);
          })
        : this.router.navigate([`${ROUTE.VIEW_APPLICANT}`]);
    }
  }

  navigateToApplicant() {
    sessionStorage.removeItem(SESSION.APP_HISTORY_CONFIG);
    this.router.navigate([`${ROUTE.VIEW_APPLICANT}`]);
  }

  setForm() {
    this.applicationStatusForm = this.fb.group({
      ApplicantStatusId: [null, [Validators.required]],
      //ApplicantStatusId: [''],
      StatusNote: ['', [Validators.maxLength(700)]],
    });
  }

  fillFormData() {
    Object.keys(this.applicationStatusForm.controls).forEach((control: any) => {
      this.getControl(this.applicationStatusForm, control)?.setValue(
        this.applicationDetails[control]
      );
    });
  }

  async configureForm() {
    //this.formConfig = await this.jobApplicationsService.getFormConfig();
    this.formConfig = await this.commonStoreService.getFormConfig();
    this.applicationID = this.formConfig.data.id;
    switch (this.formConfig.mode) {
      case FORM_MODE.VIEW:
        this.getApplicationStatus();
        this.getApplicationDetails(this.applicationID);
        break;
      default:
        break;
    }
  }

  getApplicationDetails(Id: any) {
    this.context.loaderService.show();
    this.jobApplicationsService.getApplicationDetails(Id).subscribe({
      next: (res: any) => {
        this.context.loaderService.hide();
        this.applicationDetails = res.data;
        this.ApplicantJobId = res.data.ApplicantJobId;
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
    this.jobApplicationsService
      .updateApplicationStatus(payload, this.ApplicantJobId)
      .subscribe({
        next: (res: any) => {
          this.context.loaderService.hide();
          this.goToManage(res.message);
        },
        complete: () => {},
        error: (error: any) => {
          this.context.loaderService.hide();
          error.error.errors;

          this.context.toasterService.error(error.error.message);
        },
      });
  }

  onSubmit(event: any) {
    event.preventDefault();
    this.validateForm();
    if (this.applicationStatusForm.valid) {
      let payload = this.createPayload();
      if (this.formConfig.mode == FORM_MODE.VIEW) {
        this.updateStatus(payload);
      }
    }
  }

  createPayload() {
    let payload = {
      ApplicantStatusId: this.applicationStatusForm.value.ApplicantStatusId,
      StatusNote: this.applicationStatusForm.value.StatusNote,
      //LearnerShipId: this.formConfig.id
    };
    return payload;
  }

  async getApplicationStatus() {
    this.statusList$ = await this.jobApplicationsService.getApplicationStatus();
    this.statusList$.subscribe({
      next: (res: any) => {
        this.statusList = res.data;
      },
      error: (error: any) => {
        error.error.errors
          ? this.displayError(error.error.errors)
          : this.context.toasterService.error(error.error.message);
      },
    });
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
    Object.keys(this.applicationStatusForm.controls).forEach((control: any) => {
      this.setControlError(control);
    });
  }

  checkError(control: string, error: string) {
    return this.applicationStatusForm.get(control)?.hasError(error);
  }

  setControlError(control: string) {
    if (this.checkError(control, 'required')) {
      this.applicationStatusForm.get(control)?.setErrors({
        required: true,
        invalid: `${this.getControlLabel(control)} is required`,
      });
    } else if (
      this.checkError(control, 'minlength') ||
      this.checkError(control, 'maxlength')
    ) {
      this.applicationStatusForm.get(control)?.setErrors({
        required: false,
        invalid: `${INPUT_ERROR.NAME_PATTERN}`,
      });
    }
  }

  getControlLabel(control: string) {
    let result: any = Object.values(APPLICATION_STATUS_FORM).find(
      (res: any) => res.NAME == control
    );
    return result ? result.LABEL : control;
  }
  getControlPatternMessage(control: string): any {
    let result: any = Object.values(APPLICATION_STATUS_FORM).find(
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
}
