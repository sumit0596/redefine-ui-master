import { DatePipe } from '@angular/common';
import { PresentationService } from './../../../../../services/presentation.service';
import { Component } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable, of } from 'rxjs';
import {
  FORM_MODE,
  FILETYPE,
  ROUTE,
  INPUT_ERROR,
  SESSION,
  PRESENTATION_FORM,
} from 'src/app/models/constants';
import { ATTACHMENT_TYPE } from 'src/app/models/enum';
import { CommonStoreService } from 'src/app/services/common-store.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { LoaderService } from 'src/app/shared/services/loader/loader.service';

@Component({
  selector: 'app-presentation-form',
  templateUrl: './presentation-form.component.html',
  styleUrls: ['./presentation-form.component.scss'],
})
export class PresentationFormComponent {
  formMode: any = FORM_MODE;
  formConfig!: any;
  categoryList$!: Observable<any>;
  categoryList!: any[];
  presentationDetails: any;
  fileList: any[] = [];
  fileTypes: string[] = [FILETYPE.PDF];
  fileContainer: any = {};
  presentationForm!: FormGroup;

  type$: Observable<any> = of([
    {
      id: 1,
      label: 'Presentation',
    },
    {
      id: 2,
      label: 'Webcast',
    },
  ]);
  type: any;
  //today = new Date();

  constructor(
    private fb: FormBuilder,
    private PresentationService: PresentationService,
    private loaderService: LoaderService,
    private toasterService: ToastrService,
    private commonStoreService: CommonStoreService,
    private commonService: CommonService,
    private router: Router,
    private datePipe: DatePipe
  ) {}
  async ngOnInit() {
    this.presentationForm = this.fb.group({
      Title: ['', [Validators.required, Validators.maxLength(100)]],
      Type: [{ value: '', disabled: true }],
      TypeName: [''],
      PublishDate: ['', Validators.required],
      PublishTime: [''],
      PresentationCategoryId: [null, [Validators.required]],
      Pdf: [null],
      WebCastLink: [''],
    });
    await this.configureForm();
  }

  get pdf() {
    return this.presentationForm.get('Pdf') as FormControl;
  }

  async getCategory() {
    this.categoryList$ = await this.PresentationService.getCategories();
    this.categoryList$.subscribe({
      next: (res: any) => {
        this.categoryList = res.data;
      },
      error: (error: any) => {},
    });
  }

  async configureForm() {
    this.formConfig = await this.commonStoreService.getFormConfig();
    this.presentationForm.get('Type')?.setValue(this.formConfig.tab);
    switch (this.formConfig.mode) {
      case FORM_MODE.CREATE:
        this.getCategory();
        break;
      case FORM_MODE.EDIT:
        this.getPresentationById(this.formConfig.id);
        this.getCategory();

        break;
      case FORM_MODE.VIEW:
        this.presentationForm.disable();
        this.getPresentationById(this.formConfig.id);
        this.getCategory();

        break;
      default:
        break;
    }
  }
  getPresentationById(id: number) {
    this.loaderService.show();
    this.PresentationService.viewPresentation(id).subscribe({
      next: (res) => {
        this.presentationDetails = res.data;
        this.fillFormData();
        this.loaderService.hide();
      },
      error: (error) => {
        this.loaderService.hide();
        this.toasterService.error(error.error.message);
      },
    });
  }
  editPresentation() {
    let formConfig = {
      mode: FORM_MODE.EDIT,
      id: this.formConfig.id,
    };
    this.commonStoreService.setFormConfig(formConfig);
    this.router.navigate([`${ROUTE.EDIT_PRESENTATION}`]);
  }
  createPresentation(payload: any) {
    this.loaderService.show();
    this.PresentationService.createPresentation(payload).subscribe({
      next: (res) => {
        this.reset();
        this.loaderService.hide();
        this.goToManage(res);
      },
      error: (error) => {
        this.loaderService.hide();
        error.error.errors
          ? this.displayError(error.error.errors)
          : this.toasterService.error(error.error.message);
      },
    });
  }
  updatePresentation(payload: any) {
    this.loaderService.show();
    this.PresentationService.updatePresentation(
      payload,
      this.presentationDetails.PresentationsId
    ).subscribe({
      next: (res) => {
        this.loaderService.hide();
        this.goToManage(res);
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

    if (this.formConfig.mode == FORM_MODE.CREATE) {
      if (this.presentationForm.get('Type')?.value == 2) {
        this.presentationForm
          .get('WebCastLink')
          ?.setValidators([Validators.required, Validators.maxLength(255)]);

        this.presentationForm.get('WebCastLink')?.updateValueAndValidity();
      } else if (this.presentationForm.get('Type')?.value == 1) {
        this.presentationForm.get('Pdf')?.setValidators([Validators.required]);

        this.presentationForm.get('Pdf')?.updateValueAndValidity();
      }
      this.validateForm();
      if (this.presentationForm.valid) {
        let payload = this.createPayload();
        this.createPresentation(payload);
      }
    } else if (this.formConfig.mode == FORM_MODE.EDIT) {
      if (
        this.presentationForm.value.Pdf === null &&
        (this.type == 1 || this.presentationDetails.Type == 1)
      ) {
        this.presentationForm.get('Pdf')?.setValidators([Validators.required]);

        this.presentationForm.get('Pdf')?.updateValueAndValidity();
      }

      if (
        this.presentationForm.value.Pdf === null &&
        (this.type == 2 || this.presentationDetails.Type == 2)
      ) {
        this.presentationForm
          .get('WebCastLink')
          ?.setValidators([Validators.required, Validators.maxLength(255)]);

        this.presentationForm.get('WebCastLink')?.updateValueAndValidity();
      }
      this.validateForm();
      if (this.presentationForm.valid) {
        let payload = this.createPayload();
        this.updatePresentation(payload);
      }
    }
  }
  fillFormData() {
    Object.keys(this.presentationForm.controls).forEach((control) => {
      if (control == PRESENTATION_FORM.PDF.NAME) {
        this.toggleControl(
          control,
          this.presentationDetails.Pdf == '' ||
            this.presentationDetails.Pdf == null
        );
      } else {
        this.presentationForm
          .get(control)
          ?.setValue(this.presentationDetails[control]);
      }
    });
  }

  createPayload() {
    let payload = this.presentationForm.getRawValue();
    payload.PublishDate = this.datePipe.transform(
      payload.PublishDate,
      'Y-MM-dd'
    );
    Object.keys(this.fileContainer).forEach((key: string) => {
      if (key == PRESENTATION_FORM.PDF.NAME) {
        payload[key] = this.fileContainer.Pdf[0];
      }
    });
    // this.fileContainer.forEach((file) => {});
    return payload;
  }
  validateForm() {
    Object.keys(this.presentationForm.controls).forEach((control: any) => {
      this.setControlError(control);
    });
  }
  checkError(control: string, error: string) {
    return this.presentationForm.get(control)?.hasError(error);
  }
  setControlError(control: string) {
    let formControl = this.getControl(this.presentationForm, control);
    if (this.checkError(control, 'required')) {
      this.presentationForm.get(control)?.setErrors({
        ...formControl.errors,
        invalid: `${this.getControlLabel(control)} is required`,
      });
    } else if (
      this.checkError(control, 'minlength') ||
      this.checkError(control, 'maxlength')
    ) {
      this.presentationForm.get(control)?.setErrors({
        ...formControl.errors,
        invalid: INPUT_ERROR.NAME_PATTERN,
      });
    }
  }

  onFileSelect(fileList: any[], type: number) {
    this.fileList = [...fileList];
    if (type == ATTACHMENT_TYPE.PDF) {
      if (fileList.length == 0) {
        this.pdf.setValue(null);
      } else {
        Object.assign(this.fileContainer, { Pdf: [...fileList] });
        this.getControl(this.presentationForm, 'Pdf')?.setValue(fileList[0]);
      }
    }
  }

  onFileDelete(event: any, type: number) {
    switch (type) {
      case ATTACHMENT_TYPE.PDF:
        this.fileContainer.Pdf = this.fileContainer.Pdf[event] = undefined;
        this.pdf.setValue(null);
        break;
    }
  }
  deleteFile(prop: string) {
    const dialogRef = this.commonService.deleteFileConfirmation();
    dialogRef.afterClosed().subscribe((action: any) => {
      if (action) {
        this.loaderService.show();
        this.PresentationService.deleteFile(
          this.presentationDetails.PresentationsId
        ).subscribe({
          next: (res: any) => {
            this.presentationDetails[prop] = '';
            this.presentationForm.get(prop)?.setValue(null);
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
      this.presentationForm.get(control)?.enable();
    } else {
      this.presentationForm.get(control)?.disable();
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
    this.presentationForm.reset();
  }
  goToManage(res?: any) {
    sessionStorage.removeItem(SESSION.FORM_CONFIG);
    let formConfig = {
      tab: res?.data?.Type,
    };
    this.commonStoreService.setFormConfig(formConfig);
    res?.message != undefined
      ? this.router.navigate([ROUTE.MANAGE_PRESENTATION]).then((m) => {
          this.toasterService.success(res.message);
        })
      : this.router.navigate([ROUTE.MANAGE_PRESENTATION]);
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
    return form?.get(control) as FormControl;
  }
  getControlLabel(control: string) {
    let result: any = Object.values(PRESENTATION_FORM).find(
      (res: any) => res.NAME == control
    );
    return result ? result.LABEL : control;
  }
  getControlPatternMessage(control: string): any {
    let result: any = Object.values(PRESENTATION_FORM).find(
      (res: any) => res.NAME == control
    );
    return result
      ? result.PATTERN_MESSAGE
        ? result.PATTERN_MESSAGE
        : `Please provide valid ${control}`
      : `Please provide valid ${control}`;
  }

  typeSelect(event: any) {
    this.type = event.id;
    if (event.id == 1) {
      this.presentationForm.get('Pdf')?.setValidators([Validators.required]);
      this.presentationForm.get('Pdf')?.updateValueAndValidity();
    } else {
      this.presentationForm.get('Pdf')?.clearValidators();
      this.presentationForm.get('Pdf')?.updateValueAndValidity();
    }
    if (event.id == 2) {
      this.presentationForm
        .get('WebCastLink')
        ?.setValidators([Validators.required, Validators.maxLength(255)]);
      this.presentationForm.get('WebCastLink')?.updateValueAndValidity();
    } else {
      this.presentationForm.get('WebCastLink')?.clearValidators();
      this.presentationForm.get('WebCastLink')?.updateValueAndValidity();
    }
  }
}
