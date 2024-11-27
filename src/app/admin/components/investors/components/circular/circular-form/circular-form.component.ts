import { CircularService } from 'src/app/admin/services/circular.service';
import { Component, Input } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import {
  FORM_MODE,
  ROUTE,
  CONSTANTS,
  INPUT_ERROR,
  SESSION,
  CIRCULAR_FORM,
  FILETYPE,
} from 'src/app/models/constants';
import { CommonStoreService } from 'src/app/services/common-store.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { LoaderService } from 'src/app/shared/services/loader/loader.service';
import { DatePipe } from '@angular/common';
import { ATTACHMENT_TYPE } from 'src/app/models/enum';

@Component({
  selector: 'app-circular-form',
  templateUrl: './circular-form.component.html',
  styleUrls: ['./circular-form.component.scss'],
})
export class CircularFormComponent {
  formMode: any = FORM_MODE;
  formConfig!: any;
  circularDetails: any;
  fileList: any[] = [];
  fileTypes: string[] = [FILETYPE.PDF];
  fileContainer: any = {};

  minDate: Date;

  circularForm!: FormGroup;
  constructor(
    private fb: FormBuilder,
    private CircularService: CircularService,
    private loaderService: LoaderService,
    private toasterService: ToastrService,
    private commonStoreService: CommonStoreService,
    private commonService: CommonService,
    private router: Router,
    private datePipe: DatePipe
  ) {
    this.minDate = new Date();
  }
  async ngOnInit() {
    this.circularForm = this.fb.group({
      Drip: [0],
      Title: ['', [Validators.required, Validators.maxLength(100)]],
      Description: ['', [Validators.maxLength(700)]],
      PublishDate: ['', [Validators.required]],
      PublishTime: ['', [Validators.required, this.validateTime]],
      // Url: ['', [Validators.maxLength(255)]],
      Pdf: [null, [Validators.required]],
    });

    await this.configureForm();
  }

  validateTime(control: FormControl) {
    const selectedTime = control.value;
    const currentTime = new Date();

    if (selectedTime < currentTime) {
      return { pastTime: true };
    }

    return null;
  }

  async configureForm() {
    this.formConfig = await this.commonStoreService.getFormConfig();
    switch (this.formConfig.mode) {
      case FORM_MODE.CREATE:
        break;
      case FORM_MODE.EDIT:
        this.viewCircular(this.formConfig.id);
        break;
      case FORM_MODE.VIEW:
        this.circularForm.disable();
        this.viewCircular(this.formConfig.id);
        break;
      default:
        break;
    }
  }
  fillFormData() {
    Object.keys(this.circularForm.controls).forEach((control) => {
      if (control == CIRCULAR_FORM.PDF.NAME) {
        this.toggleControl(
          control,
          this.circularDetails.Pdf == '' || this.circularDetails.Pdf == null
        );
      } else {
        this.circularForm.get(control)?.setValue(this.circularDetails[control]);
      }
    });
  }
  viewCircular(id: number) {
    this.loaderService.show();
    this.CircularService.viewCircular(id).subscribe({
      next: (res) => {
        this.circularDetails = res.data;

        this.fillFormData();
        this.loaderService.hide();
      },
      error: (error) => {
        this.loaderService.hide();
        this.toasterService.error(error.error.message);
      },
    });
  }
  editCircular() {
    let formConfig = {
      mode: FORM_MODE.EDIT,
      id: this.formConfig.id,
    };
    this.commonStoreService.setFormConfig(formConfig);
    this.router.navigate([`${ROUTE.EDIT_CIRCULAR}`]);
  }
  onSubmit(event: any) {
    event.preventDefault();
    this.validateForm();
    if (this.circularForm.valid) {
      let payload = this.createPayload();
      if (this.formConfig.mode == FORM_MODE.CREATE) {
        this.createCircular(payload);
      } else if (this.formConfig.mode == FORM_MODE.EDIT) {
        this.updateCircular(payload);
      }
    }
  }
  createPayload() {
    let payload = this.circularForm.value;
    Object.keys(this.fileContainer).forEach((key: string) => {
      if (key == CIRCULAR_FORM.PDF.NAME) {
        payload[key] = this.fileContainer.Pdf[0];
      }
    });
    this.circularForm.value.PublishDate = this.datePipe.transform(
      this.circularForm.value.PublishDate,
      'yyyy-MM-dd'
    );
    return payload;
  }
  createCircular(payload: any) {
    this.loaderService.show();
    this.CircularService.createCircular(payload).subscribe({
      next: (res) => {
        this.reset();
        this.goToManage(res.message);
        this.loaderService.hide();
      },
      error: (error) => {
        this.loaderService.hide();
        error.error.errors
          ? this.displayError(error.error.errors)
          : this.toasterService.error(error.error.message);
      },
    });
  }
  updateCircular(payload: any) {
    this.loaderService.show();
    this.CircularService.updateCircular(
      payload,
      this.circularDetails.CircularsId
    ).subscribe({
      next: (res) => {
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
  deleteCircular() {
    const dialogRef = this.commonService.showModal(
      'Delete',
      CONSTANTS.CIRCULAR_DELETE_CONFIRMATION
    );
    dialogRef.afterClosed().subscribe((action: any) => {
      if (action) {
        this.loaderService.show();
        this.CircularService.deleteCircular(
          this.circularDetails.CircularsId
        ).subscribe({
          next: (res) => {
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
    });
  }
  validateForm() {
    this.clearControlError(this.circularForm.get('PublishDate'));
    Object.keys(this.circularForm.controls).forEach((control: any) => {
      this.setControlError(control);
    });
  }

  clearControlError(control: any): void {
    const err = control.errors;
    if (err) {
      delete err['matDatepickerMin'];
      if (!Object.keys(err).length) {
        control.setErrors(null);
      } else {
        control.setErrors(err);
      }
    }
  }
  checkError(control: string, error: string) {
    return this.circularForm.get(control)?.hasError(error);
  }
  setControlError(control: string) {
    if (this.checkError(control, 'required')) {
      this.circularForm.get(control)?.setErrors({
        required: true,
        invalid: `${this.getControlLabel(control)} is required`,
      });
    } else if (
      this.checkError(control, 'minlength') ||
      this.checkError(control, 'maxlength')
    ) {
      this.circularForm.get(control)?.setErrors({
        required: false,
        invalid: `${INPUT_ERROR.NAME_PATTERN}`,
      });
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
    this.circularForm.reset();
  }
  goToManage(message?: any) {
    sessionStorage.removeItem(SESSION.FORM_CONFIG);
    message != undefined
      ? this.router.navigate([ROUTE.MANAGE_CIRCULAR]).then((m) => {
          this.toasterService.success(message);
        })
      : this.router.navigate([ROUTE.MANAGE_CIRCULAR]);
  }
  onChange(event: any) {
    this.validateFormField(event);
  }
  validateFormField(data: any) {
    let control: FormControl = this.getControl(data.form, data.control);
    if (control?.hasError('required')) {
      control?.setErrors({
        ...control.errors,
        invalid: `${this.getControlLabel(data.control)} is required`,
      });
    } else if (control?.hasError('minlength')) {
      control?.setErrors({
        ...control.errors,
        required: false,
        invalid: `Minimum ${
          control.getError('minlength')?.requiredLength
        } characters are allowed`,
      });
    } else if (control?.hasError('maxlength')) {
      control?.setErrors({
        ...control.errors,
        required: false,
        invalid: `Maximum ${
          control.getError('maxlength')?.requiredLength
        } characters are allowed`,
      });
    } else if (control?.hasError('pattern')) {
      control?.setErrors({
        ...control.errors,
        invalid: this.getControlPatternMessage(data.control),
      });
    }
  }
  getControl(form: any, control: string): FormControl {
    return form?.get(control) as FormControl;
  }
  getControlLabel(control: string) {
    let result: any = Object.values(CIRCULAR_FORM).find(
      (res: any) => res.NAME == control
    );
    return result ? result.LABEL : control;
  }
  getControlPatternMessage(control: string): any {
    let result: any = Object.values(CIRCULAR_FORM).find(
      (res: any) => res.NAME == control
    );
    return result
      ? result.PATTERN_MESSAGE
        ? result.PATTERN_MESSAGE
        : `Please provide valid ${control}`
      : `Please provide valid ${control}`;
  }

  // onSwitchToggle(event: any) {
  //   if (event.checked) {
  //     this.circularForm.value.Drip = 0;
  //   } else {
  //     this.circularForm.value.Drip = 1;
  //   }
  // }

  onSwitchToggle(event: any) {
    if (event.checked) {
      this.circularForm.get('Drip')?.setValue(1);
    } else {
      this.circularForm.get('Drip')?.setValue(0);
    }
  }

  get pdf() {
    return this.circularForm.get('Pdf') as FormControl;
  }

  onFileSelect(fileList: any[], type: number) {
    this.fileList = [...fileList];
    if (type == ATTACHMENT_TYPE.PDF) {
      if (fileList.length == 0) {
        this.pdf.setValue(null);
      } else {
        Object.assign(this.fileContainer, { Pdf: [...fileList] });
        this.getControl(this.circularForm, 'Pdf')?.setValue(fileList[0]);
      }
    }
  }

  onFileDelete(event: any, type: number) {
    switch (type) {
      case ATTACHMENT_TYPE.PDF:
        this.fileContainer.Pdf = this.fileContainer.Pdf[event] = undefined;
        break;
    }
  }
  deleteFile(prop: string) {
    const dialogRef = this.commonService.deleteFileConfirmation();
    dialogRef.afterClosed().subscribe((action: any) => {
      if (action) {
        this.CircularService.deleteFile(
          this.circularDetails.CircularsId
        ).subscribe({
          next: (res: any) => {
            this.circularDetails[prop] = '';
            this.circularForm.get(prop)?.setValue(null);
            this.toggleControl(prop, true);
            this.toasterService.success(res.message);
          },
          error: (error: any) => {
            this.toasterService.error(error.error.message);
          },
        });
      }
    });
  }

  toggleControl(control: string, enable: boolean) {
    if (enable) {
      this.circularForm.get(control)?.enable();
    } else {
      this.circularForm.get(control)?.disable();
    }
  }
}
