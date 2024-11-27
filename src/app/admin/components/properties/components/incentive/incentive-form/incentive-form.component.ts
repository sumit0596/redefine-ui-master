import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import {
  CONSTANTS,
  FILETYPE,
  FORM_MODE,
  INCENTIVE_FORM,
  INPUT_ERROR,
  PATTERN,
  ROUTE,
  SESSION,
} from 'src/app/models/constants';
import { ATTACHMENT_TYPE } from 'src/app/models/enum';
import { CommonStoreService } from 'src/app/services/common-store.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { LoaderService } from 'src/app/shared/services/loader/loader.service';
import { IncentiveService } from '../../../../../services/incentive.service';

@Component({
  selector: 'app-incentive-form',
  templateUrl: './incentive-form.component.html',
  styleUrls: ['./incentive-form.component.scss'],
})
export class IncentiveFormComponent implements OnInit {
  formMode: any = FORM_MODE;
  formConfig!: any;
  incentiveDetails: any;
  fileList: any[] = [];
  fileTypes: string[] = [
    FILETYPE.PDF,
    FILETYPE.EXCEL_SPREADSHEET,
    FILETYPE.MS_EXCEL,
  ];
  fileContainer: any = {};
  incentiveForm!: FormGroup;
  constructor(
    private fb: FormBuilder,
    private incentiveService: IncentiveService,
    private loaderService: LoaderService,
    private toasterService: ToastrService,
    private commonStoreService: CommonStoreService,
    private commonService: CommonService,
    private router: Router
  ) {}
  async ngOnInit() {
    this.incentiveForm = this.fb.group({
      Title: ['', [Validators.required, Validators.maxLength(100)]],
      Visibility: ['', [Validators.required]],
      AdditionalInformation: ['', Validators.maxLength(700)],
      Brochure: [null],
      TermAndCondition: [null],
    });
    await this.configureForm();
  }
  get visibility() {
    return this.incentiveForm.get('Visibility') as FormControl;
  }
  get brochure() {
    return this.incentiveForm.get('Brochure') as FormControl;
  }
  get termAndCondition() {
    return this.incentiveForm.get('TermAndCondition') as FormControl;
  }
  async configureForm() {
    this.formConfig = await this.commonStoreService.getFormConfig();
    switch (this.formConfig.mode) {
      case FORM_MODE.CREATE:
        break;
      case FORM_MODE.EDIT:
        this.getIncentiveById(this.formConfig.id);
        break;
      case FORM_MODE.VIEW:
        this.incentiveForm.disable();
        this.getIncentiveById(this.formConfig.id);
        break;
      default:
        break;
    }
  }
  getIncentiveById(id: number) {
    this.loaderService.show();
    this.incentiveService.getIncentive(id).subscribe({
      next: (res) => {
        this.incentiveDetails = res;
        this.fillFormData();
        this.loaderService.hide();
      },
      error: (error) => {
        this.loaderService.hide();
        this.toasterService.error(error.error.message);
      },
    });
  }
  editIncentive() {
    let formConfig = {
      mode: FORM_MODE.EDIT,
      id: this.formConfig.id,
    };
    this.commonStoreService.setFormConfig(formConfig);
    this.router.navigate([`${ROUTE.EDIT_INCENTIVE}`]);
  }
  createIncentive(payload: any) {
    this.loaderService.show();
    this.incentiveService.createIncentive(payload).subscribe({
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
  updateIncentive(payload: any) {
    this.loaderService.show();
    this.incentiveService
      .updateIncentive(payload, this.incentiveDetails.IncentiveId)
      .subscribe({
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
  deleteIncentive() {
    const dialogRef = this.commonService.showModal(
      'Delete',
      CONSTANTS.INCENTIVE_DELETE_CONFIRMATION
    );
    dialogRef.afterClosed().subscribe((action: any) => {
      if (action) {
        this.loaderService.show();
        this.incentiveService
          .deleteIncentive(this.incentiveDetails.IncentiveId)
          .subscribe({
            next: (res) => {
              this.loaderService.hide();
              this.goToManage(res.message);
            },
            error: (error) => {
              this.loaderService.hide();
              this.toasterService.error(error.error.message);
            },
          });
      }
    });
  }
  onSubmit(event: any) {
    event.preventDefault();
    this.validateForm();
    if (this.incentiveForm.valid) {
      let payload = this.createPayload();
      if (this.formConfig.mode == FORM_MODE.CREATE) {
        this.createIncentive(payload);
      } else if (this.formConfig.mode == FORM_MODE.EDIT) {
        this.updateIncentive(payload);
      }
    }
  }
  fillFormData() {
    Object.keys(this.incentiveForm.controls).forEach((control) => {
      if (control == INCENTIVE_FORM.BROCHURE.NAME) {
        this.toggleControl(
          control,
          this.incentiveDetails.Brochure == '' ||
            this.incentiveDetails.Brochure == null
        );
      } else if (control == INCENTIVE_FORM.TERMS_AND_CONDITIONS.NAME) {
        this.toggleControl(
          control,
          this.incentiveDetails.TermAndCondition == '' ||
            this.incentiveDetails.TermAndCondition == null
        );
      } else {
        this.incentiveForm
          .get(control)
          ?.setValue(this.incentiveDetails[control]);
      }
    });
  }
  createPayload() {
    let payload = this.incentiveForm.value;
    Object.keys(this.fileContainer).forEach((key: string) => {
      if (key == INCENTIVE_FORM.BROCHURE.NAME) {
        payload[key] = this.fileContainer.Brochure
          ? this.fileContainer.Brochure[0]
          : null;
      } else if (key == INCENTIVE_FORM.TERMS_AND_CONDITIONS.NAME) {
        payload[key] = this.fileContainer.TermAndCondition
          ? this.fileContainer.TermAndCondition[0]
          : null;
      }
    });
    // this.fileContainer.forEach((file) => {});
    return payload;
  }
  validateForm() {
    Object.keys(this.incentiveForm.controls).forEach((control: any) => {
      this.setControlError(control);
    });
  }
  checkError(control: string, error: string) {
    return this.incentiveForm.get(control)?.hasError(error);
  }
  setControlError(control: string) {
    let formControl = this.getControl(this.incentiveForm, control);
    if (this.checkError(control, 'required')) {
      this.incentiveForm.get(control)?.setErrors({
        ...formControl.errors,
        invalid: `${this.getControlLabel(control)} is required`,
      });
    } else if (
      this.checkError(control, 'minlength') ||
      this.checkError(control, 'maxlength')
    ) {
      this.incentiveForm.get(control)?.setErrors({
        ...formControl.errors,
        invalid: INPUT_ERROR.NAME_PATTERN,
      });
    }
  }

  onFileSelect(fileList: any[], type: number) {
    this.fileList = [...fileList];
    if (type == ATTACHMENT_TYPE.BROCHURE) {
      if (fileList.length == 0) {
        this.brochure.setValue(null);
      } else {
        Object.assign(this.fileContainer, { Brochure: [...fileList] });
      }
    } else if (type == ATTACHMENT_TYPE.TERMS_CONDITIONS) {
      if (fileList.length == 0) {
        this.termAndCondition.setValue(null);
      } else {
        Object.assign(this.fileContainer, { TermAndCondition: [...fileList] });
      }
    }
  }
  onFileDelete(event: any, type: number) {
    switch (type) {
      case ATTACHMENT_TYPE.BROCHURE:
        this.fileContainer.Brochure = this.fileContainer.Brochure[event] =
          undefined;
        break;
      case ATTACHMENT_TYPE.TERMS_CONDITIONS:
        this.fileContainer.TermAndCondition =
          this.fileContainer.TermAndCondition[event] = undefined;
        break;
    }
  }
  deleteFile(prop: string, type: number) {
    const dialogRef = this.commonService.deleteFileConfirmation();
    dialogRef.afterClosed().subscribe((action: any) => {
      if (action) {
        this.loaderService.show();
        this.incentiveService
          .deleteFile(this.incentiveDetails.IncentiveId, type)
          .subscribe({
            next: (res: any) => {
              this.incentiveDetails[prop] = '';
              this.incentiveForm.get(prop)?.setValue(null);
              this.toggleControl(prop, true);
              this.loaderService.hide();
              this.toasterService.success(res.message);
            },
            error: (error) => {
              this.loaderService.hide();
              this.toasterService.error(error.error.message);
            },
          });
      }
    });
  }
  toggleControl(control: string, enable: boolean) {
    if (enable) {
      this.incentiveForm.get(control)?.enable();
    } else {
      this.incentiveForm.get(control)?.disable();
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
    this.fileContainer = undefined;
    this.fileList = [];
    this.incentiveForm.reset();
  }
  goToManage(message?: any) {
    sessionStorage.removeItem(SESSION.FORM_CONFIG);
    message != undefined
      ? this.router.navigate([`${ROUTE.MANAGE_INCENTIVE}`]).then((m) => {
          this.toasterService.success(message);
        })
      : this.router.navigate([`${ROUTE.MANAGE_INCENTIVE}`]);
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
  getControlLabel(control: string) {
    let result: any = Object.values(INCENTIVE_FORM).find(
      (res: any) => res.NAME == control
    );
    return result ? result.LABEL : control;
  }
  getControlPatternMessage(control: string): any {
    let result: any = Object.values(INCENTIVE_FORM).find(
      (res: any) => res.NAME == control
    );
    return result
      ? result.PATTERN_MESSAGE
        ? result.PATTERN_MESSAGE
        : `Please provide valid ${control}`
      : `Please provide valid ${control}`;
  }

  getIcon(name: any): any {
    let extension = name.split('.').pop();
    switch (extension) {
      case 'xlsx':
        return 'assets/images/excel.svg';
      case 'xls':
        return 'assets/images/excel.svg';
      case 'pdf':
        return 'assets/images/pdf.svg';
    }
  }
}
