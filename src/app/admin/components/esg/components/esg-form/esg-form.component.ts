import { Component } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from '@angular/forms';
import { Router } from '@angular/router';

import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { EsgService } from 'src/app/admin/services/esg.service';
import {
  FORM_MODE,
  ROUTE,
  ESG_FORM,
  INPUT_ERROR,
  SESSION,
} from 'src/app/models/constants';
import { ATTACHMENT_TYPE, ESG_STATUS } from 'src/app/models/enum';
import { CommonStoreService } from 'src/app/services/common-store.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { LoaderService } from 'src/app/shared/services/loader/loader.service';

@Component({
  selector: 'app-esg-form',
  templateUrl: './esg-form.component.html',
  styleUrls: ['./esg-form.component.scss'],
})
export class esgFormComponent {
  formMode: any = FORM_MODE;
  formConfig!: any;
  categoryList$!: Observable<any>;
  categoryList!: any[];
  esgDetails: any;
  fileList: any[] = [];
  fileContainer: any = {};
  esgForm!: FormGroup;
  Image!: any[];
  mediaType!: string;
  progressFiles!: any;
  esgStatus = ESG_STATUS;
  status: any;
  file: any = {};

  constructor(
    private fb: FormBuilder,
    private esgService: EsgService,
    private loaderService: LoaderService,
    private toasterService: ToastrService,
    private commonStoreService: CommonStoreService,
    private commonService: CommonService,
    private router: Router
  ) {}
  async ngOnInit() {
    this.esgForm = this.fb.group({
      JobTitle: ['', [Validators.required, Validators.maxLength(100)]],
      EmployeeName: ['', [Validators.required, Validators.maxLength(100)]],
      Image: [null],
      LinkedIn: ['', [Validators.maxLength(255)]],
      KeyRole: ['', [Validators.required, Validators.maxLength(700)]],
      Qualification: ['', [Validators.required, Validators.maxLength(255)]],
      CommitteeMembershipDescription: [''],
      PreviousExperienceDescription: [''],
      Status: [''],
    });
    await this.configureForm();
  }

  get image() {
    return this.esgForm.get('Image') as FormControl;
  }

  async configureForm() {
    this.formConfig = await this.commonStoreService.getFormConfig();
    switch (this.formConfig.mode) {
      case FORM_MODE.CREATE:
        break;
      case FORM_MODE.EDIT:
        this.getEsgById(this.formConfig.id);

        break;
      case FORM_MODE.VIEW:
        this.esgForm.disable();
        this.getEsgById(this.formConfig.id);

        break;
      default:
        break;
    }
  }
  getEsgById(id: number) {
    this.loaderService.show();
    this.esgService.viewEsg(id).subscribe({
      next: (res: any) => {
        this.esgDetails = res.data;
        this.file.Url = this.esgDetails.Image;
        this.file.Name = this.esgDetails.ImageName;
        this.file.CreatedOn = this.esgDetails.CreatedOn;
        this.fillFormData();
        this.loaderService.hide();
      },
      error: (error: any) => {
        this.loaderService.hide();
        this.toasterService.error(error.error.message);
      },
    });
  }
  editEsg() {
    let formConfig = {
      mode: FORM_MODE.EDIT,
      id: this.formConfig.id,
    };
    this.commonStoreService.setFormConfig(formConfig);
    this.router.navigate([`${ROUTE.EDIT_ESG}`]);
  }
  createEsg(payload: any) {
    this.loaderService.show();
    this.esgService.createEsg(payload).subscribe({
      next: (res) => {
        this.esgDetails = res.data;

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

  onSwitchToggle(event: any) {}
  updateEsg(payload: any) {
    this.loaderService.show();
    this.esgService
      .updateEsg(payload, this.esgDetails.EsgContactsId)
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

  updateStatus(status: any) {
    this.loaderService.show();
    this.esgService
      .updateStatus(this.esgDetails.EsgContactsId, status)
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
    //event.preventDefault();

    this.validateForm();

    if (this.esgForm.valid) {
      let payload = this.createPayload();
      if (this.formConfig.mode == FORM_MODE.CREATE) {
        this.createEsg(payload);
      } else if (this.formConfig.mode == FORM_MODE.EDIT) {
        this.updateEsg(payload);
      }
    }
  }

  onSave(status: any) {
    this.esgForm.value.Status = status;
    switch (status) {
      case ESG_STATUS.PUBLISH:
        this.onSubmit(event);

        break;
      case ESG_STATUS.DRAFT:
        this.onSubmit(event);

        break;
      default:
        break;
    }
  }

  fillFormData() {
    Object.keys(this.esgForm.controls).forEach((control) => {
      if (control == ESG_FORM.IMAGE.NAME) {
        this.toggleControl(
          control,
          this.esgDetails.Image == '' || this.esgDetails.Image == null
        );
      } else {
        this.esgForm.get(control)?.setValue(this.esgDetails[control]);
      }
    });
  }

  createPayload() {
    let payload = this.esgForm.value;
    Object.keys(this.fileContainer).forEach((key: string) => {
      if (key == ESG_FORM.IMAGE.NAME) {
        if (this.fileContainer.Image != undefined) {
          payload[key] = this.fileContainer.Image[0];
        } else {
          payload[key] = undefined;
        }
      }
    });
    // this.fileContainer.forEach((file) => {});
    return payload;
  }
  validateForm() {
    Object.keys(this.esgForm.controls).forEach((control: any) => {
      this.setControlError(control);
    });
  }
  checkError(control: string, error: string) {
    return this.esgForm.get(control)?.hasError(error);
  }
  setControlError(control: string) {
    let formControl = this.getControl(this.esgForm, control);
    if (this.checkError(control, 'required')) {
      this.esgForm.get(control)?.setErrors({
        ...formControl.errors,
        invalid: `${this.getControlLabel(control)} is required`,
      });
    } else if (
      this.checkError(control, 'minlength') ||
      this.checkError(control, 'maxlength')
    ) {
      this.esgForm.get(control)?.setErrors({
        ...formControl.errors,
        invalid: INPUT_ERROR.NAME_PATTERN,
      });
    }
  }

  onFileSelect(fileList: any[], type: any) {
    this.fileList = [...fileList];

    if (fileList.length == 0) {
      this.esgForm.get('Image')?.setValue(null);
    } else {
      Object.assign(this.fileContainer, { Image: [...fileList] });

      this.getControl(this.esgForm, 'Image')?.setValue(fileList[0]);
    }
  }

  onFileDelete(event: any, type: any) {
    switch (type) {
      case ATTACHMENT_TYPE.IMAGE:
        this.fileContainer.Image = this.fileContainer.Image[event] = undefined;
        this.esgForm.get('Image')?.setValue(null);
        break;
    }
  }

  deleteFile(prop: string) {
    this.loaderService.show();
    this.esgService.deleteFile(this.esgDetails.EsgContactsId).subscribe({
      next: (res: any) => {
        this.esgDetails[prop] = '';
        this.esgForm.get(prop)?.setValue(null);
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

  toggleControl(control: string, enable: boolean) {
    if (enable) {
      this.esgForm.get(control)?.enable();
    } else {
      this.esgForm.get(control)?.disable();
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
    this.esgForm.reset();
  }
  goToManage(message? : any) {
    sessionStorage.removeItem(SESSION.FORM_CONFIG);
    (message != undefined) ? this.router.navigate([`${ROUTE.MANAGE_ESG}`]).then(m => {
      this.toasterService.success(message);
    }) : this.router.navigate([`${ROUTE.MANAGE_ESG}`]);
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
    let result: any = Object.values(ESG_FORM).find(
      (res: any) => res.NAME == control
    );
    return result ? result.LABEL : control;
  }
  getControlPatternMessage(control: string): any {
    let result: any = Object.values(ESG_FORM).find(
      (res: any) => res.NAME == control
    );
    return result
      ? result.PATTERN_MESSAGE
        ? result.PATTERN_MESSAGE
        : `Please provide valid ${control}`
      : `Please provide valid ${control}`;
  }
}
