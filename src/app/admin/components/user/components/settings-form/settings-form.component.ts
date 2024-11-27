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
  FILETYPE,
  FORM_MODE,
  SETTINGS_FORM,
  INPUT_ERROR,
  ROUTE,
  SESSION,
} from 'src/app/models/constants';
import { CommonStoreService } from 'src/app/services/common-store.service';
import { LoaderService } from 'src/app/shared/services/loader/loader.service';
import { SettingService } from 'src/app/admin/services/setting.service';
@Component({
  selector: 'app-settings-form',
  templateUrl: './settings-form.component.html',
  styleUrls: ['./settings-form.component.scss'],
})
export class SettingsFormComponent implements OnInit {
  formMode: any = FORM_MODE;
  formConfig!: any;
  settingDetails: any;
  fileList: any[] = [];
  fileTypes: string[] = [
    FILETYPE.PDF,
    FILETYPE.EXCEL_SPREADSHEET,
    FILETYPE.MS_EXCEL,
  ];
  fileContainer: any = {};
  settingForm!: FormGroup;
  constructor(
    private fb: FormBuilder,
    private settingService: SettingService,
    private loaderService: LoaderService,
    private toasterService: ToastrService,
    private commonStoreService: CommonStoreService,
    private router: Router
  ) {}
  async ngOnInit() {
    this.settingForm = this.fb.group({
      Name: ['', [Validators.required, Validators.maxLength(100)]],
      Value: [''],
    });
    await this.configureForm();
  }
  get name() {
    return this.settingForm.get('Name') as FormControl;
  }
  get setting() {
    return this.settingForm.get('Value') as FormControl;
  }
  async configureForm() {
    this.formConfig = await this.commonStoreService.getFormConfig();
    switch (this.formConfig.mode) {
      case FORM_MODE.EDIT:
        this.getSettingById(this.formConfig.name);
        break;
      default:
        break;
    }
  }
  getSettingById(name: string) {
    this.loaderService.show();
    this.settingService.getSettingDetails(name).subscribe({
      next: (res) => {
        this.settingDetails = res;
        this.fillFormData();
        this.loaderService.hide();
      },
      error: (error) => {
        this.loaderService.hide();
        this.toasterService.error(error.error.message);
      },
    });
  }
  updateSetting(payload: any) {
    this.loaderService.show();
    this.settingService.updateSetting(payload, this.formConfig.id).subscribe({
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

  onSubmit(event: any) {
    event.preventDefault();
    this.validateForm();
    if (this.settingForm.valid) {
      let payload = this.createPayload();
      this.updateSetting(payload);
    }
  }
  fillFormData() {
    Object.keys(this.settingForm.controls).forEach((control) => {
      if (control == SETTINGS_FORM.Name.NAME) {
        this.toggleControl(control, true);
      } else if (control == SETTINGS_FORM.Value.NAME) {
        this.toggleControl(control, true);
      }
      this.settingForm.get(control)?.setValue(this.settingDetails[control]);
    });
  }
  createPayload() {
    let payload = this.settingForm.value;
    Object.keys(SETTINGS_FORM).forEach((key: string) => {
      if (key == SETTINGS_FORM.Name.NAME) {
        payload[key] = this.settingForm.value
          ? this.settingForm.value.Name
          : null;
      } else if (key == SETTINGS_FORM.Value.NAME) {
        payload[key] = this.settingForm.value
          ? this.settingForm.value.Value
          : null;
      }
    });
    return payload;
  }
  validateForm() {
    Object.keys(this.settingForm.controls).forEach((control: any) => {
      this.setControlError(control);
    });
  }
  checkError(control: string, error: string) {
    return this.settingForm.get(control)?.hasError(error);
  }
  setControlError(control: string) {
    let formControl = this.getControl(this.settingForm, control);
    if (this.checkError(control, 'required')) {
      this.settingForm.get(control)?.setErrors({
        ...formControl.errors,
        invalid: `${this.getControlLabel(control)} is required`,
      });
    } else if (
      this.checkError(control, 'minlength') ||
      this.checkError(control, 'maxlength')
    ) {
      this.settingForm.get(control)?.setErrors({
        ...formControl.errors,
        invalid: INPUT_ERROR.NAME_PATTERN,
      });
    }
  }
  toggleControl(control: string, enable: boolean) {
    if (enable) {
      this.settingForm.get(control)?.enable();
    } else {
      this.settingForm.get(control)?.disable();
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
    this.settingForm.reset();
  }
  goToManage(message?: any) {
    sessionStorage.removeItem(SESSION.FORM_CONFIG);
    message != undefined
      ? this.router.navigate([`${ROUTE.MANAGE_SETTINGS}`]).then((m) => {
          this.toasterService.success(message);
        })
      : this.router.navigate([`${ROUTE.MANAGE_SETTINGS}`]);
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
    let result: any = Object.values(SETTINGS_FORM).find(
      (res: any) => res.NAME == control
    );
    return result ? result.LABEL : control;
  }
  getControlPatternMessage(control: string): any {
    let result: any = Object.values(SETTINGS_FORM).find(
      (res: any) => res.NAME == control
    );
    return result
      ? result.PATTERN_MESSAGE
        ? result.PATTERN_MESSAGE
        : `Please provide valid ${control}`
      : `Please provide valid ${control}`;
  }
}
