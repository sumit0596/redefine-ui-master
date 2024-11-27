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
import { ContextContainer } from 'src/app/core/context/context-container';
import {
  FORM_MODE,
  ROUTE,
  SESSION,
  PRESS_RELEASE_FORM,
  INPUT_ERROR,
} from 'src/app/models/constants';
import { INTEGRATED_REPORT_STATUS } from 'src/app/models/enum';
import { CustomDialogComponent } from 'src/app/shared/components/custom-dialog/custom-dialog.component';
import { PressReleaseService } from 'src/app/admin/services/press-release.service';
import { DatePipe } from '@angular/common';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { CommonService } from 'src/app/shared/services/common.service';

export const MY_DATE_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-press-release-form',
  templateUrl: './press-release-form.component.html',
  styleUrls: ['./press-release-form.component.scss'],
  providers: [{ provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS }],
})
export class PressReleaseFormComponent {
  status: any = INTEGRATED_REPORT_STATUS;
  formConfig: any;
  btnLabel: string = '';
  formMode: any = FORM_MODE;
  pressReleaseID!: number;
  pressReleaseForm!: FormGroup;
  isSubmit: boolean = true;
  pressReleaseDetails: any;
  type: any;
  today = new Date();

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private context: ContextContainer,
    private dialog: MatDialog,
    private pressReleaseService: PressReleaseService,
    private datePipe: DatePipe,
    private commonService: CommonService
  ) {
    this.type = this.router.url?.includes('generic-portal') ? 2 : 1;
  }

  ngOnInit(): void {
    this.setForm();
    this.configureForm();
  }

  setForm() {
    this.pressReleaseForm = this.fb.group({
      Title: ['', [Validators.required, Validators.maxLength(255)]],
      Content: ['', [Validators.required]],
      PublishDate: ['', Validators.required],
    });
  }

  async configureForm() {
    this.formConfig = await this.context.commonStoreService.getFormConfig();
    this.pressReleaseID = this.formConfig?.id;
    switch (this.formConfig.mode) {
      case FORM_MODE.CREATE:
        if (this.formConfig.id) {
          this.getPressReleaseDetails();
        }
        break;
      case FORM_MODE.EDIT:
        this.getPressReleaseDetails();
        break;
      case FORM_MODE.VIEW:
        this.pressReleaseForm.disable();
        this.getPressReleaseDetails();
        break;
    }
    this.loadButtonLabel();
  }
  getPressReleaseDetails() {
    this.context.loaderService.show();
    this.pressReleaseService
      .getPressReleaseDetails(this.pressReleaseID)
      .subscribe({
        next: (res: any) => {
          this.context.loaderService.hide();
          this.pressReleaseDetails = res.data;
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
  fillFormData() {
    Object.keys(this.pressReleaseForm.controls).forEach((control: any) => {
      this.getControl(this.pressReleaseForm, control)?.setValue(
        this.pressReleaseDetails[control]
      );
    });
  }

  onSubmit() {
    if (this.formConfig.mode == FORM_MODE.VIEW) {
      this.formConfig = {
        ...this.formConfig,
        mode: FORM_MODE.EDIT,
      };
      this.context.commonStoreService.setFormConfig(this.formConfig);
      if (this.type == 1) {
        this.router.navigate([ROUTE.EDIT_PRESS_RELEASE]);
        //return;
      } else if (this.type == 2) {
        this.router.navigate([ROUTE.EDIT_PRESS]);
      }
    }

    if (!this.pressReleaseForm.valid) {
      this.validateForm();
      return;
    }

    let payload = this.createPayload();

    if (this.formConfig.mode == FORM_MODE.CREATE) {
      let dialogRef = this.commonService.showModal(
        '',
        'You are about to publish a new Press Release'
      );

      dialogRef.afterClosed().subscribe((result: any) => {
        if (result) {
          this.createPressRelease(payload);
        }
      });
    } else if (this.formConfig.mode == FORM_MODE.EDIT) {
      this.updatePressRelease(payload);
    }
  }

  goToManage(message?: any) {
    if (this.type == 1) {
      sessionStorage.removeItem(SESSION.FORM_CONFIG);
      message != undefined
        ? this.router.navigate([ROUTE.MANAGE_PRESS_RELEASE]).then((m) => {
            this.context.toasterService.success(message);
          })
        : this.router.navigate([ROUTE.MANAGE_PRESS_RELEASE]);
    } else if (this.type == 2) {
      sessionStorage.removeItem(SESSION.FORM_CONFIG);
      message != undefined
        ? this.router.navigate([ROUTE.MANAGE_PRESS]).then((m) => {
            this.context.toasterService.success(message);
          })
        : this.router.navigate([ROUTE.MANAGE_PRESS]);
    }
  }
  loadButtonLabel() {
    if (this.formConfig) {
      this.btnLabel = 'Submit';
      if (this.formConfig.mode == this.formMode.VIEW) this.btnLabel = 'Edit';
      else if (this.formConfig.mode == this.formMode.EDIT) {
        this.btnLabel = 'Save & Update';
      }
    }
  }
  onChange(event: any) {
    this.validateFormField(event);
  }

  createPayload(): any {
    let formValues = this.pressReleaseForm.value;
    formValues.PublishDate = this.datePipe.transform(
      formValues.PublishDate,
      'Y-MM-dd'
    );
    if (this.formConfig.mode == FORM_MODE.CREATE) {
      formValues.Status = 1;
    } else formValues.Status = this.pressReleaseDetails.Status;

    return formValues;
  }
  createPressRelease(payload: any) {
    this.context.loaderService.show();
    this.pressReleaseService.addPressRelease(payload).subscribe({
      next: (res: any) => {
        this.context.loaderService.hide();
        this.pressReleaseID = res.data.PressReleaseId;
        this.formConfig.id = res.data.PressReleaseId;
        this.context.commonStoreService.setFormConfig(this.formConfig);
        if (this.isSubmit) {
          this.goToManage(res.message);
        } else {
          this.isSubmit = false;
        }
      },
      error: (error: any) => {
        this.context.loaderService.hide();
        error.error.errors
          ? this.displayError(error.error.errors)
          : this.context.toasterService.error(error.error.message);
      },
    });
  }
  updatePressRelease(payload: any) {
    this.context.loaderService.show();
    this.pressReleaseService
      .updatePressRelease(payload, this.pressReleaseID)
      .subscribe({
        next: (res: any) => {
          this.context.loaderService.hide();
          this.formConfig.id = res.data.PressReleaseId;
          this.context.commonStoreService.setFormConfig(this.formConfig);
          if (this.isSubmit) {
            this.goToManage(res.message);
          } else {
            this.isSubmit = false;
          }
        },
        error: (error: any) => {
          this.context.loaderService.hide();
          error.error.errors
            ? this.displayError(error.error.errors)
            : this.context.toasterService.error(error.error.message);
        },
      });
  }

  /*********************************************************
   *                      Validations                      *
   ********************************************************/
  validateForm() {
    Object.keys(this.pressReleaseForm.controls).forEach((control: any) => {
      this.setControlError(control);
    });
  }
  setControlError(control: string) {
    if (this.checkError(control, 'required')) {
      this.pressReleaseForm.get(control)?.setErrors({
        required: true,
        invalid: `${this.getControlLabel(control)} is required`,
      });
    } else if (this.checkError(control, 'maxlength')) {
      this.pressReleaseForm.get(control)?.setErrors({
        required: false,
        invalid: `${INPUT_ERROR.CONTENT_MAX_LENGTH}`,
      });
    }
  }

  checkError(control: string, error: string) {
    return this.pressReleaseForm.get(control)?.hasError(error);
  }

  validateFormField(data: any) {
    let control = this.getControl(data.form, data.control);
    if (control?.hasError('required')) {
      control?.setErrors({
        ...control.errors,
        invalid: `${this.getControlLabel(data.control)} is required`,
      });
    } else if (control?.hasError('maxlength')) {
      control?.setErrors({
        ...control.errors,
        invalid: `Maximum ${
          control.getError('maxlength')?.requiredLength
        } characters are allowed`,
      });
    }
  }

  getControlLabel(control: string) {
    let result: any = Object.values(PRESS_RELEASE_FORM).find(
      (res: any) => res.NAME == control
    );
    return result ? result.LABEL : control;
  }

  getControlPatternMessage(control: string): any {
    let result: any = Object.values(PRESS_RELEASE_FORM).find(
      (res: any) => res.NAME == control
    );
    return result
      ? result.PATTERN_MESSAGE
        ? result.PATTERN_MESSAGE
        : `Please provide valid ${control}`
      : `Please provide valid ${control}`;
  }

  /*********************************************************
   *                      Helpers                          *
   ********************************************************/
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
  displayError(error: any) {
    let errors = JSON.parse(error);
    Object.keys(errors).forEach((err: any) => {
      this.context.toasterService.error(errors[err][0]);
    });
  }
}
