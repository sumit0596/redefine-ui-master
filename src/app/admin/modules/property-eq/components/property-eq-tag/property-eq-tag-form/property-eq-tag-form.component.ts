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
  PROPERTY_EQ_TAG_FORM,
  ROUTE,
  CONSTANTS,
  SESSION,
  INPUT_ERROR,
} from 'src/app/models/constants';
import { CommonStoreService } from 'src/app/services/common-store.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { LoaderService } from 'src/app/shared/services/loader/loader.service';
import { PropertyEqTagService } from 'src/app/admin/services/property-eq-tag.service';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-property-eq-tag-form',
  templateUrl: './property-eq-tag-form.component.html',
  styleUrls: ['./property-eq-tag-form.component.scss'],
})
export class PropertyEqTagFormComponent implements OnInit {
  formMode: any = FORM_MODE;
  formConfig!: any;
  propertyEqTagDetails: any;
  fileList: any[] = [];
  propertyEqTagForm!: FormGroup;

  type$: Observable<any> = of([
    {
      id: 1,
      label: 'Tag',
    },
    {
      id: 2,
      label: 'Category',
    },
  ]);

  constructor(
    private fb: FormBuilder,
    private propertyEqTagService: PropertyEqTagService,
    private loaderService: LoaderService,
    private toasterService: ToastrService,
    private commonStoreService: CommonStoreService,
    private commonService: CommonService,
    private router: Router
  ) {}

  async ngOnInit() {
    this.propertyEqTagForm = this.fb.group({
      Type: [null, [Validators.required]],
      Title: ['', [Validators.required, Validators.maxLength(30)]],
      Description: ['', [Validators.maxLength(700)]],
    });
    await this.configureForm();
  }

  async configureForm() {
    this.formConfig = await this.commonStoreService.getFormConfig();
    switch (this.formConfig.mode) {
      case FORM_MODE.CREATE:
        break;
      case FORM_MODE.EDIT:
        this.propertyEqTagForm.get('Type')?.disable();
        this.getPropertyEqTagById(this.formConfig.id);
        break;
      case FORM_MODE.VIEW:
        this.propertyEqTagForm.disable();
        this.getPropertyEqTagById(this.formConfig.id);
        break;
      default:
        break;
    }
  }

  fillFormData() {
    Object.keys(this.propertyEqTagForm.controls).forEach((control) => {
      this.propertyEqTagForm
        .get(control)
        ?.setValue(this.propertyEqTagDetails[control]);
    });
  }

  getPropertyEqTagById(id: number) {
    this.loaderService.show();
    this.propertyEqTagService.getPropertyEqTag(id).subscribe({
      next: (res) => {
        this.propertyEqTagDetails = res;
        this.fillFormData();
        this.loaderService.hide();
      },
      error: (error) => {
        this.loaderService.hide();
        this.toasterService.error(error.error.message);
      },
    });
  }

  updatePropertyEqTag(payload: any) {
    this.loaderService.show();
    this.propertyEqTagService
      .updatePropertyEqTag(payload, this.propertyEqTagDetails.PropertyEqTagId)
      .subscribe({
        next: (res) => {
          this.reset();
          this.loaderService.hide();
          this.goToManage(res.message);
          this.propertyEqTagForm.get('Type')?.disable();
        },

        error: (error) => {
          this.loaderService.hide();
          error.error.errors
            ? this.displayError(error.error.errors)
            : this.toasterService.error(error.error.message);
        },
      });
  }

  editPropertyEqTag() {
    let formConfig = {
      mode: FORM_MODE.EDIT,
      id: this.formConfig.id,
    };
    this.commonStoreService.setFormConfig(formConfig);
    this.router.navigate([`${ROUTE.EDIT_PROPERTY_EQ_TAG}`]);
  }

  onSubmit(event: any) {
    event.preventDefault();
    this.validateForm();
    if (this.propertyEqTagForm.valid) {
      let payload = this.createPayload();
      if (this.formConfig.mode == FORM_MODE.CREATE) {
        this.createPropertyEqTag(payload);
      } else if (this.formConfig.mode == FORM_MODE.EDIT) {
        this.propertyEqTagForm.get('Type')?.enable();
        let payload = this.createPayload();
        this.updatePropertyEqTag(payload);
      }
    }
  }

  createPayload() {
    let payload = this.propertyEqTagForm.value;
    return payload;
  }

  createPropertyEqTag(payload: any) {
    this.loaderService.show();
    this.propertyEqTagService.createPropertyEqTag(payload).subscribe({
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

  deletePropertyEqTag() {
    const dialogRef = this.commonService.showModal(
      'Delete',
      CONSTANTS.PROPERTY_EQ_TAG__DELETE_CONFIRMATION
    );
    dialogRef.afterClosed().subscribe((action: any) => {
      if (action) {
        this.loaderService.show();
        this.propertyEqTagService
          .deletePropertyEqTag(this.propertyEqTagDetails.PropertyEqTagId)
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
    Object.keys(this.propertyEqTagForm.controls).forEach((control: any) => {
      this.setControlError(control);
    });
  }
  checkError(control: string, error: string) {
    return this.propertyEqTagForm.get(control)?.hasError(error);
  }
  setControlError(control: string) {
    if (this.checkError(control, 'required')) {
      this.propertyEqTagForm.get(control)?.setErrors({
        required: true,
        invalid: `${this.getControlLabel(control)} is required`,
      });
    } else if (
      this.checkError(control, 'minlength') ||
      this.checkError(control, 'maxlength')
    ) {
      this.propertyEqTagForm.get(control)?.setErrors({
        required: false,
        invalid: `${INPUT_ERROR.PROPERTYEQTAG_PATTERN}`,
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
    this.propertyEqTagForm.reset();
  }
  goToManage(message?: any) {
    sessionStorage.removeItem(SESSION.FORM_CONFIG);
    message != undefined
      ? this.router.navigate([`${ROUTE.MANAGE_PROPERTY_EQ_TAG}`]).then((m) => {
          this.toasterService.success(message);
        })
      : this.router.navigate([`${ROUTE.MANAGE_PROPERTY_EQ_TAG}`]);
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
    let result: any = Object.values(PROPERTY_EQ_TAG_FORM).find(
      (res: any) => res.NAME == control
    );
    return result ? result.LABEL : control;
  }
  getControlPatternMessage(control: string): any {
    let result: any = Object.values(PROPERTY_EQ_TAG_FORM).find(
      (res: any) => res.NAME == control
    );
    return result
      ? result.PATTERN_MESSAGE
        ? result.PATTERN_MESSAGE
        : `Please provide valid ${control}`
      : `Please provide valid ${control}`;
  }
}
