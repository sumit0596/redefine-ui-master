import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from '@angular/forms';
import {
  FORM_MODE,
  ROUTE,
  INPUT_ERROR,
  SESSION,
  LEARNERSHIP_FORM,
} from 'src/app/models/constants';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { LearnershipService } from 'src/app/admin/services/learnership.service';
import { ContextContainer } from 'src/app/core/context/context-container';

@Component({
  selector: 'app-learnership-application-details-form',
  templateUrl: './learnership-application-details-form.component.html',
  styleUrls: ['./learnership-application-details-form.component.scss'],
})
export class LearnershipApplicationDetailsFormComponent implements OnInit {
  formConfig: any;
  formMode: any = FORM_MODE;
  learnerShipId!: number;
  learnershipDetails: any;
  learnershipForm!: FormGroup;
  statusList$!: Observable<any>;
  statusList!: any[];
  ApplicantStatusId!: number;

  constructor(
    private router: Router,
    private learnershipService: LearnershipService,
    private context: ContextContainer,
    private fb: FormBuilder
  ) {}
  ngOnInit(): void {
    this.setForm();
    this.configureForm();
  }

  setForm() {
    this.learnershipForm = this.fb.group({
      ApplicantStatusId: [null, [Validators.required]],
      //ApplicantStatusId: [''],
      StatusNote: ['', [Validators.maxLength(700)]],
    });
  }

  async configureForm() {
    this.formConfig = await this.context.commonStoreService.getFormConfig();
    this.learnerShipId = this.formConfig?.id;

    switch (this.formConfig.mode) {
      case FORM_MODE.VIEW:
        // this.learnershipForm.disable();
        this.getStatus();
        this.getLearnershipDetails();

        //this.updateLearnershipStatus();
        break;
    }
  }

  async getStatus() {
    this.statusList$ = await this.learnershipService.getStatus();
    this.statusList$.subscribe({
      next: (res: any) => {
        this.statusList = res.data;
      },
      error: (error: any) => {
      },
    });
  }

  getLearnershipDetails() {
    this.context.loaderService.show();
    this.learnershipService
      .getLearnershipDetails(this.learnerShipId)
      .subscribe({
        next: (res: any) => {
          this.context.loaderService.hide();
          this.learnershipDetails = res.data;
          this.learnershipForm = new FormGroup({
            ApplicantStatusId: new FormControl(
              this.learnershipDetails.ApplicantStatusId
            ),
            StatusNote: new FormControl(this.learnershipDetails.StatusNote),
          });
        },
        error: (error: any) => {
          this.context.loaderService.hide();
          this.context.toasterService.error(error.error.message);
        },
      });
  }

  updateLearnershipStatus(Id: any) {
    if (this.learnershipForm.value.ApplicantStatusId == null) {
      this.learnershipForm
        .get('ApplicantStatusId')
        ?.setValidators([Validators.required]);

      this.learnershipForm.get('ApplicantStatusId')?.updateValueAndValidity();
    }
    this.validateForm();
    if (this.learnershipForm.valid) {
      this.context.loaderService.show();
      this.learnershipService.updateStatus(Id).subscribe({
        next: (res: any) => {
          this.context.loaderService.hide();
          this.goToManage(res.message);
        },
        complete: () => {
        },
        error: (error: any) => {
          this.context.loaderService.hide();
          error.error.errors;

          this.context.toasterService.error(error.error.message);
        },
      });
    }
  }
  goToManage(message? : any) {
    sessionStorage.removeItem(SESSION.FORM_CONFIG);
    (message != undefined)
    ? this.router.navigate([ROUTE.MANAGE_LEARNERSHIP_APPLICATIONS]).then((m) => {
        this.context.toasterService.success(message);
      })
    : this.router.navigate([ROUTE.MANAGE_LEARNERSHIP_APPLICATIONS]);
  }

  validateForm() {
    Object.keys(this.learnershipForm.controls).forEach((control: any) => {
      this.setControlError(control);
    });
  }

  checkError(control: string, error: string) {
    return this.learnershipForm.get(control)?.hasError(error);
  }

  setControlError(control: string) {
    if (this.checkError(control, 'required')) {
      this.learnershipForm.get(control)?.setErrors({
        required: true,
        invalid: `${this.getControlLabel(control)} is required`,
      });
    } else if (
      this.checkError(control, 'minlength') ||
      this.checkError(control, 'maxlength')
    ) {
      this.learnershipForm.get(control)?.setErrors({
        required: false,
        invalid: `${INPUT_ERROR.NAME_PATTERN}`,
      });
    }
  }

  getControl(form: any, control: string): FormControl {
    return form.get(control) as FormControl;
  }
  getControlLabel(control: string) {
    let result: any = Object.values(LEARNERSHIP_FORM).find(
      (res: any) => res.NAME == control
    );
    return result ? result.LABEL : control;
  }
  getControlPatternMessage(control: string): any {
    let result: any = Object.values(LEARNERSHIP_FORM).find(
      (res: any) => res.NAME == control
    );
    return result
      ? result.PATTERN_MESSAGE
        ? result.PATTERN_MESSAGE
        : `Please provide valid ${control}`
      : `Please provide valid ${control}`;
  }

  onSubmit(event: any) {
    event.preventDefault();
    this.validateForm();
    if (this.learnershipForm.valid) {
      let payload = this.createPayload();
      if (this.formConfig.mode == FORM_MODE.VIEW) {
        this.updateLearnershipStatus(payload);
      }
    }
  }

  createPayload() {
    let payload = {
      ApplicantStatusId: this.learnershipForm.value.ApplicantStatusId,
      StatusNote: this.learnershipForm.value.StatusNote,
      LearnerShipId: this.formConfig.id,
    };
    return payload;
  }
}
