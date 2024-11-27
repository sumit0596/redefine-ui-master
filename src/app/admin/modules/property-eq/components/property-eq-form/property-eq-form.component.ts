import { PropertyEqPreviewComponent } from './../property-eq-preview/property-eq-preview.component';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { PropertyEqService } from 'src/app/admin/services/property-eq.service';
import {
  CONSTANTS,
  FILETYPE,
  FORM_MODE,
  INPUT_ERROR,
  PROPERTY_EQ_FORM,
  ROUTE,
  SESSION,
} from 'src/app/models/constants';
import {
  ATTACHMENT_TYPE,
  PROPERTY_EQ_MEDIA_TYPE,
  PROPERTY_EQ_STATUS,
} from 'src/app/models/enum';
import { CommonStoreService } from 'src/app/services/common-store.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { LoaderService } from 'src/app/shared/services/loader/loader.service';

@Component({
  selector: 'app-property-eq-form',
  templateUrl: './property-eq-form.component.html',
  styleUrls: ['./property-eq-form.component.scss'],
})
export class PropertyEqFormComponent {
  fileList: any[] = [];
  file: any = {};
  fileType: any = FILETYPE;
  fileContainer: any = {};
  formMode: any = FORM_MODE;
  formConfig!: any;
  categoryTypeList$!: Observable<any>;
  categoryList$!: Observable<any>;
  categoryList!: any[];
  categoryTagList$!: Observable<any>;
  categoryTagList!: any[];
  propertyEqFormGroup!: any;
  propertyEqStatus = PROPERTY_EQ_STATUS;
  recomendedSize!: string;
  propertyEqDetails: any;
  categoryTypeList!: any[];
  propertyEqTagIds: any;
  videoRecomendedSize = 'Recommended size for Video 480 × 480 px';
  articleRecomendedSize = 'Recommended size for Article 1492 × 300 px';
  pressRecomendedSize = 'Recommended size for Press release 1492 × 300 px';

  enableHtml: boolean = true;
  editorheight: string = '30rem';
  constructor(
    private fb: FormBuilder,
    private propertyEqService: PropertyEqService,
    private loaderService: LoaderService,
    private toasterService: ToastrService,
    private commonStoreService: CommonStoreService,
    private commonService: CommonService,
    public dialog: MatDialog,
    private router: Router
  ) {}

  async ngOnInit() {
    this.propertyEqFormGroup = this.fb.group({
      PropertyEqTypeId: [null, [Validators.required]],
      Title: ['', [Validators.required, Validators.maxLength(100)]],
      FeaturedImageId: [null],
      PropertyEqCategoryId: [null],
      Content: [''],
      Author: ['', [Validators.maxLength(100)]],
      YoutubeLink: [''],
      Featured: [0],
      Status: [null],
      PropertyEqTagIds: [''],
      Pin: [0],
    });
    await this.configureForm();
    this.getMediaTypeCategory();
    this.getCategory();
    this.getTagCategory();
  }

  async getMediaTypeCategory() {
    this.categoryTypeList$ =
      await this.propertyEqService.getMediaTypeCategories();
    this.categoryTypeList$.subscribe({
      next: (res: any) => {
        this.categoryTypeList = res.data;
      },
      error: (error: any) => {
        this.reset();
        this.loaderService.hide();
        error.error.errors ? this.displayError(error.error.errors) : '';
      },
    });
  }

  async getCategory() {
    this.categoryList$ = await this.propertyEqService.getCategories();
    this.categoryList$.subscribe({
      next: (res: any) => {
        this.categoryList = res.data;
      },
      error: (error: any) => {
        this.reset();
        this.loaderService.hide();
        error.error.errors ? this.displayError(error.error.errors) : '';
      },
    });
  }

  async getTagCategory() {
    this.categoryTagList$ = await this.propertyEqService.getTagCategories();
    this.categoryTagList$.subscribe({
      next: (res: any) => {
        this.categoryTagList = res.data;
      },
      error: (error: any) => {
        this.reset();
        this.loaderService.hide();
        error.error.errors ? this.displayError(error.error.errors) : '';
      },
    });
  }

  async configureForm() {
    this.formConfig = await this.commonStoreService.getFormConfig();
    switch (this.formConfig.mode) {
      case FORM_MODE.CREATE:
        break;
      case FORM_MODE.EDIT:
        this.getPropertyEqs(this.formConfig.id);
        this.propertyEqFormGroup.get('PropertyEqTypeId').disable();
        if (this.propertyEqFormGroup.get('PropertyEqTypeId')?.value == 1) {
          this.recomendedSize = 'Recommended size for Video 50 × 300 px';
        }

        break;
      case FORM_MODE.VIEW:
        this.propertyEqFormGroup.disable();
        this.getPropertyEqs(this.formConfig.id);
        break;
      default:
        break;
    }
  }

  openPreviewModal() {
    const dialogRef = this.dialog.open(PropertyEqPreviewComponent, {
      data: this.propertyEqDetails,
      minWidth: '76vw',
      maxWidth: '90vw',
      height: '90vh',
    });
    dialogRef.afterClosed().subscribe((result) => {});
  }

  getPropertyEqs(id: number) {
    this.loaderService.show();
    this.propertyEqService.getPropertyEq(this.formConfig.id).subscribe({
      next: (res: any) => {
        //this.propertyEqTagIds = res.data.PropertyEqTagIds;
        this.propertyEqDetails = res.data;
        this.file.Url = this.propertyEqDetails.MediaUrl;
        this.file.MediaId = this.propertyEqDetails.MediaId;
        this.file.Name = this.propertyEqDetails.MediaName;
        this.file.CreatedOn = this.propertyEqDetails.CreatedOn;
        this.fillFormData();
        this.loaderService.hide();
      },
      error: (error: any) => {
        this.loaderService.hide();
        this.toasterService.error(error.error.message);
      },
    });
  }

  fillFormData() {
    Object.keys(this.propertyEqFormGroup.controls).forEach((control) => {
      if (control == PROPERTY_EQ_FORM.FEATURED.NAME) {
        this.propertyEqFormGroup
          .get(control)
          ?.setValue(this.propertyEqDetails.Featured);
      } else if (control == PROPERTY_EQ_FORM.TAGS.NAME) {
        this.propertyEqFormGroup
          .get('PropertyEqTagIds')
          ?.setValue(this.propertyEqDetails.PropertyEqTag);
      } else {
        this.propertyEqFormGroup
          .get(control)
          ?.setValue(this.propertyEqDetails[control]);
      }
    });
  }

  editPropertyEq() {
    let formConfig = {
      mode: FORM_MODE.EDIT,
      id: this.formConfig.id,
    };
    this.commonStoreService.setFormConfig(formConfig);
    this.router.navigate([`${ROUTE.EDIT_PROPERTY_EQ}`]);
  }

  upload(file: any) {
    this.loaderService.show();
    this.propertyEqService.uploadPropertyEqImage(file).subscribe({
      next: (res: any) => {
        this.loaderService.hide();
        this.file = {
          Url: res.data.Url,
          Name: res.data.Name,
          MediaId: res.data.MediaId,
          CreatedOn: res.data.CreatedOn,
        };
        this.propertyEqFormGroup
          .get('FeaturedImageId')
          ?.setValue(this.file.MediaId);
      },
      error: (error: any) => {
        this.loaderService.hide();
        error.error.errors
          ? this.displayError(error.error.errors)
          : this.toasterService.error(error.error.message);
      },
    });
  }

  createPropertyEq(payload: any) {
    this.loaderService.show();
    this.propertyEqService.createPropertyEq(payload).subscribe({
      next: (res: any) => {
        this.propertyEqDetails = res.data;
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
  updatePropertyEq(payload: any) {
    this.loaderService.show();
    this.propertyEqService
      .updatePropertyEq(
        payload,
        this.propertyEqDetails.PropertyEqId,
        this.propertyEqDetails.PropertyEqTypeId
      )
      .subscribe({
        next: (res: any) => {
          this.reset();
          this.loaderService.hide();
          this.goToManage(res.message);
        },
        error: (error: any) => {
          this.propertyEqFormGroup.get('PropertyEqTypeId').disable();
          this.loaderService.hide();
          error.error.errors
            ? this.displayError(error.error.errors)
            : this.toasterService.error(error.error.message);
        },
      });
  }

  validateForm() {
    Object.keys(this.propertyEqFormGroup.controls).forEach((control: any) => {
      this.setControlError(control);
    });
  }

  createPayload() {
    if (this.propertyEqFormGroup.value.PropertyEqTagIds) {
      this.propertyEqFormGroup.value.PropertyEqTagIds =
        this.commonService?.changeDataFormat(
          this.propertyEqFormGroup.value?.PropertyEqTagIds,
          CONSTANTS.STRING
        );
    }

    return this.propertyEqFormGroup.value;
  }

  setControlError(control: string) {
    let formControl = this.propertyEqFormGroup.get(control);
    if (this.checkError(control, 'required')) {
      formControl.setErrors({
        ...formControl.errors,
        invalid: `${this.getControlLabel(control)} is required`,
      });
    } else if (
      this.checkError(control, 'minlength') ||
      this.checkError(control, 'maxlength')
    ) {
      formControl.setErrors({
        ...formControl.errors,
        invalid: 'Maximum 100 characters are allowed',
      });
    }
  }

  checkError(control: string, errorType: string): boolean {
    const formControl = this.propertyEqFormGroup.get(control);
    return formControl && formControl.hasError(errorType);
  }

  getControlLabel(control: string): string {
    switch (control) {
      case 'YoutubeLink':
        return 'YouTube Link';
      case 'Title':
        return 'Title';
      case 'Author':
        return 'Author name';
      case 'PropertyEqTypeId':
        return 'Media Type';
      case 'PropertyEqCategoryId':
        return 'Category';
      case 'FeaturedImageId':
        return 'Image';
      case 'Content':
        return 'Content';
      default:
        return 'Field';
    }
  }

  contentDescriptionValidation() {
    const propertyType = this.propertyEqFormGroup.get('PropertyEqTypeId').value;

    if (propertyType == '1') {
      this.setControlError('YoutubeLink');
      if (this.propertyEqFormGroup.get('Content').invalid) {
        this.propertyEqFormGroup.get('Content').setErrors({
          invalid: 'Description is required',
        });
      }
    } else if (propertyType == '2' || propertyType == '3') {
      if (this.propertyEqFormGroup.get('Content').invalid) {
        this.propertyEqFormGroup.get('Content').setErrors({
          invalid: 'Content is required',
        });
      }
    }
  }

  onSubmit(event: any) {
    this.contentDescriptionValidation();
    if (this.formConfig.mode == FORM_MODE.VIEW) {
      let payload = this.createPayload();
      this.updatePropertyEq(payload);
    }

    if (this.formConfig.mode == FORM_MODE.CREATE) {
      this.validateForm();
      if (this.propertyEqFormGroup.valid) {
        let payload = this.createPayload();
        this.createPropertyEq(payload);
      }
    } else if (this.formConfig.mode == FORM_MODE.EDIT) {
      if (this.propertyEqFormGroup.get('PropertyEqTypeId')?.value == 1) {
        this.propertyEqFormGroup
          .get('YoutubeLink')
          ?.setValidators([Validators.required]);
        this.propertyEqFormGroup.get('YoutubeLink')?.updateValueAndValidity();
      }
      this.validateForm();
      if (this.propertyEqFormGroup.valid) {
        this.propertyEqFormGroup.get('PropertyEqTypeId').enable();
        let payload = this.createPayload();
        this.updatePropertyEq(payload);
      }
    }
  }

  typeSelect(event: any) {
    this.propertyEqFormGroup.get('YoutubeLink')?.setValue();
    if (event.Id == PROPERTY_EQ_MEDIA_TYPE.ARTICLE) {
      this.recomendedSize = 'Recommended size for Article 1492 × 300 px';
      if (this.propertyEqFormGroup.get('FeaturedImageId').value == null) {
        this.propertyEqFormGroup
          .get('FeaturedImageId')
          ?.setValidators([Validators.required]);
      }
      this.propertyEqFormGroup.get('YoutubeLink')?.clearValidators();
      this.propertyEqFormGroup.get('YoutubeLink')?.updateValueAndValidity();
      this.propertyEqFormGroup.get('FeaturedImageId')?.updateValueAndValidity();
    }
    if (event.Id == PROPERTY_EQ_MEDIA_TYPE.VIDEO) {
      this.recomendedSize = 'Recommended size for Video 480 × 480 px';
      this.propertyEqFormGroup
        .get('YoutubeLink')
        ?.setValidators([Validators.required]);
      if (this.propertyEqFormGroup.get('FeaturedImageId').value == null) {
        this.propertyEqFormGroup
          .get('FeaturedImageId')
          ?.setValidators([Validators.required]);
      }
      this.propertyEqFormGroup.get('YoutubeLink')?.updateValueAndValidity();
      this.propertyEqFormGroup.get('FeaturedImageId')?.updateValueAndValidity();
    }
    if (event.Id == PROPERTY_EQ_MEDIA_TYPE.PRESS) {
      this.propertyEqFormGroup.get('YoutubeLink')?.clearValidators();
      this.propertyEqFormGroup.get('FeaturedImageId')?.clearValidators();
      this.propertyEqFormGroup.get('FeaturedImageId')?.clearValidators();
      this.recomendedSize = 'Recommended size for Press release 1492 × 300 px';
    }
  }

  onSave(status: any) {
    this.propertyEqFormGroup.get('Status').setValue(status);
    //this.propertyEqFormGroup.value.Status = status;
    let result: any;
    switch (status) {
      case PROPERTY_EQ_STATUS.PUBLISH:
        result = this.onSubmit(event);

        break;
      case PROPERTY_EQ_STATUS.DRAFT:
        result = this.onSubmit(event);

        break;
      default:
        break;
    }
  }

  onSwitchToggle(event: any) {
    if (event.checked) {
      this.propertyEqFormGroup.get('Featured')?.setValue(1);
    } else {
      this.propertyEqFormGroup.get('Featured')?.setValue(0);
    }
  }

  onPinToggle(event: any) {
    if (event.checked) {
      this.propertyEqFormGroup.get('Pin')?.setValue(1);
    } else {
      this.propertyEqFormGroup.get('Pin')?.setValue(0);
    }
  }

  goToManage(message?: any) {
    sessionStorage.removeItem(SESSION.FORM_CONFIG);
    message != undefined
      ? this.router.navigate([ROUTE.MANAGE_PROPERTY_EQ]).then((m) => {
          this.toasterService.success(message);
        })
      : this.router.navigate([ROUTE.MANAGE_PROPERTY_EQ]);
  }

  onChange(event: any) {
    this.validateFormField(event);
  }

  onFileSelect(fileList: any[], type: string) {
    this.upload(fileList[0]);
  }

  onFileDelete(event: any) {
    const dialogRef = this.commonService.deleteImageConfirmation();
    dialogRef.afterClosed().subscribe((action: any) => {
      if (action) {
        this.loaderService.show();
        this.propertyEqService.deletePropertyEqImage(event.MediaId).subscribe({
          next: (res: any) => {
            this.loaderService.hide();
            this.toasterService.success(res.message);
            this.file = null;
            this.propertyEqFormGroup.get('FeaturedImageId')?.setValue(null);
          },
          error: (error: any) => {
            this.loaderService.hide();
            error.error.errors
              ? this.displayError(error.error.errors)
              : this.toasterService.error(error.error.message);
          },
        });
      }
    });
  }

  toggleControl(control: string, enable: boolean) {
    if (enable) {
      this.propertyEqFormGroup.get(control)?.enable();
    } else {
      this.propertyEqFormGroup.get(control)?.disable();
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
    this.propertyEqFormGroup.reset();
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
  // getControlLabel(control: string) {
  //   let result: any = Object.values(PROPERTY_EQ_FORM).find(
  //     (res: any) => res.NAME == control
  //   );
  //   return result ? result.LABEL : control;
  // }
  getControlPatternMessage(control: string): any {
    let result: any = Object.values(PROPERTY_EQ_FORM).find(
      (res: any) => res.NAME == control
    );
    return result
      ? result.PATTERN_MESSAGE
        ? result.PATTERN_MESSAGE
        : `Please provide valid ${control}`
      : `Please provide valid ${control}`;
  }
}
