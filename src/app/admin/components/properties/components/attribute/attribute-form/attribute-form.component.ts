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
  FORM_MODE,
  ATTRIBUTE_FORM,
  ROUTE,
  CONSTANTS,
  SESSION,
  INPUT_ERROR,
} from 'src/app/models/constants';
import { CommonStoreService } from 'src/app/services/common-store.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { LoaderService } from 'src/app/shared/services/loader/loader.service';
import { AttributeService } from '../../../../../services/attribute.service';

@Component({
  selector: 'app-attribute-form',
  templateUrl: './attribute-form.component.html',
  styleUrls: ['./attribute-form.component.scss'],
})
export class AttributeFormComponent implements OnInit {
  formMode: any = FORM_MODE;
  formConfig!: any;
  attributeDetails: any;
  fileList: any[] = [];
  attributeForm!: FormGroup;
  constructor(
    private fb: FormBuilder,
    private attributeService: AttributeService,
    private loaderService: LoaderService,
    private toasterService: ToastrService,
    private commonStoreService: CommonStoreService,
    private commonService: CommonService,
    private router: Router
  ) {}
  async ngOnInit() {
    this.attributeForm = this.fb.group({
      Title: ['', [Validators.required, Validators.maxLength(100)]],
      // Visibility: ['', [Validators.required, Validators.maxLength(700)]],
      AdditionalInformation: ['', [Validators.maxLength(700)]],
    });
    await this.configureForm();
  }
  // get visibility() {
  //   return this.attributeForm.get('Visibility') as FormControl;
  // }
  async configureForm() {
    this.formConfig = await this.commonStoreService.getFormConfig();
    switch (this.formConfig.mode) {
      case FORM_MODE.CREATE:
        break;
      case FORM_MODE.EDIT:
        this.getAttributeById(this.formConfig.id);
        break;
      case FORM_MODE.VIEW:
        this.attributeForm.disable();
        this.getAttributeById(this.formConfig.id);
        break;
      default:
        break;
    }
  }
  fillFormData() {
    Object.keys(this.attributeForm.controls).forEach((control) => {
      this.attributeForm.get(control)?.setValue(this.attributeDetails[control]);
    });
  }
  getAttributeById(id: number) {
    this.loaderService.show();
    this.attributeService.getAttribute(id).subscribe({
      next: (res) => {
        this.attributeDetails = res;
        this.fillFormData();
        this.loaderService.hide();
      },
      error: (error) => {
        this.loaderService.hide();
        this.toasterService.error(error.error.message);
      },
    });
  }
  editAttribute() {
    let formConfig = {
      mode: FORM_MODE.EDIT,
      id: this.formConfig.id,
    };
    this.commonStoreService.setFormConfig(formConfig);
    this.router.navigate([`${ROUTE.EDIT_ATTRIBUTE}`]);
  }
  onSubmit(event: any) {
    event.preventDefault();
    this.validateForm();
    if (this.attributeForm.valid) {
      let payload = this.createPayload();
      if (this.formConfig.mode == FORM_MODE.CREATE) {
        this.createAttribute(payload);
      } else if (this.formConfig.mode == FORM_MODE.EDIT) {
        this.updateAttribute(payload);
      }
    }
  }
  createPayload() {
    let payload = this.attributeForm.value;
    return payload;
  }
  createAttribute(payload: any) {
    this.loaderService.show();
    this.attributeService.createAttribute(payload).subscribe({
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
  updateAttribute(payload: any) {
    this.loaderService.show();
    this.attributeService
      .updateAttribute(payload, this.attributeDetails.AttributeId)
      .subscribe({
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
  deleteAttribute() {
    const dialogRef = this.commonService.showModal(
      'Delete',
      CONSTANTS.ATTRIBUTE_DELETE_CONFIRMATION
    );
    dialogRef.afterClosed().subscribe((action: any) => {
      if (action) {
        this.loaderService.show();
        this.attributeService
          .deleteAttribute(this.attributeDetails.AttributeId)
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
    });
  }
  validateForm() {
    Object.keys(this.attributeForm.controls).forEach((control: any) => {
      this.setControlError(control);
    });
  }
  checkError(control: string, error: string) {
    return this.attributeForm.get(control)?.hasError(error);
  }
  setControlError(control: string) {
    if (this.checkError(control, 'required')) {
      this.attributeForm.get(control)?.setErrors({
        required: true,
        invalid: `${this.getControlLabel(control)} is required`,
      });
    } else if (
      this.checkError(control, 'minlength') ||
      this.checkError(control, 'maxlength')
    ) {
      this.attributeForm.get(control)?.setErrors({
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
    this.fileList = [];
    this.attributeForm.reset();
  }
  goToManage(message?: any) {
    sessionStorage.removeItem(SESSION.FORM_CONFIG);
    message != undefined
      ? this.router.navigate([`${ROUTE.MANAGE_ATTRIBUTE}`]).then((m) => {
          this.toasterService.success(message);
        })
      : this.router.navigate([`${ROUTE.MANAGE_ATTRIBUTE}`]);
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
        required: false,
        invalid: `Minimum ${
          control.getError('minlength')?.requiredLength
        } characters are allowed`,
      });
    } else if (control.hasError('maxlength')) {
      control?.setErrors({
        ...control.errors,
        required: false,
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
    let result: any = Object.values(ATTRIBUTE_FORM).find(
      (res: any) => res.NAME == control
    );
    return result ? result.LABEL : control;
  }
  getControlPatternMessage(control: string): any {
    let result: any = Object.values(ATTRIBUTE_FORM).find(
      (res: any) => res.NAME == control
    );
    return result
      ? result.PATTERN_MESSAGE
        ? result.PATTERN_MESSAGE
        : `Please provide valid ${control}`
      : `Please provide valid ${control}`;
  }
}
