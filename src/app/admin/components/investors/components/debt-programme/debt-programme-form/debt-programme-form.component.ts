import { ThisReceiver } from '@angular/compiler';
import { ChangeDetectorRef, Component } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { DebtProgrammeService } from 'src/app/admin/services/debt-programme.service';
import {
  CONSTANTS,
  DEBT_FORM,
  FILETYPE,
  FORM_MODE,
  INPUT_ERROR,
  ROUTE,
  SESSION,
} from 'src/app/models/constants';
import { ATTACHMENT_TYPE } from 'src/app/models/enum';
import { CommonStoreService } from 'src/app/services/common-store.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { LoaderService } from 'src/app/shared/services/loader/loader.service';

@Component({
  selector: 'app-debt-programme-form',
  templateUrl: './debt-programme-form.component.html',
  styleUrls: ['./debt-programme-form.component.scss'],
})
export class DebtProgrammeFormComponent {
  formMode: any = FORM_MODE;
  formConfig!: any;
  debtDetails: any;
  fileType: any = FILETYPE;
  fileList: any[] = [];
  fileTypes: string[] = [
    FILETYPE.PDF,
    FILETYPE.EXCEL_SPREADSHEET,
    FILETYPE.MS_EXCEL,
  ];
  fileContainer: any = {};
  debtProgrammeForm!: FormGroup;
  typeList$!: Observable<any>;
  typeList: any;
  typeId: any;
  categoryList$!: Observable<any>;
  categoryList: any;
  constructor(
    private fb: FormBuilder,
    private debtService: DebtProgrammeService,
    private loaderService: LoaderService,
    private toasterService: ToastrService,
    private commonStoreService: CommonStoreService,
    private commonService: CommonService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}
  async ngOnInit() {
    this.debtProgrammeForm = this.fb.group({
      DebtCreditTypeId: [null, [Validators.required]],
      Title: ['', [Validators.required, Validators.maxLength(100)]],
      DebtCreditCategoryId: [null],
      Pdf: [null, [Validators.required]],
    });
    this.getDebtCreditTypes();
    this.getDebtCategoryTypes();
    await this.configureForm();
  }

  ngAfterViewChecked() {
    this.cdr.detectChanges();
  }

  async getDebtCreditTypes() {
    this.typeList$ = await this.debtService.getDebtCreditTypes();
    this.typeList$.subscribe({
      next: (res: any) => {
        this.typeList = res;
      },
      error: (error: any) => {},
    });
  }
  async getDebtCategoryTypes() {
    this.categoryList$ = await this.debtService.getDebtCreditCategoryTypes();
    this.categoryList$.subscribe({
      next: (res: any) => {
        this.categoryList = res;
      },
      error: (error: any) => {},
    });
  }
  get title() {
    return this.debtProgrammeForm.get('Title') as FormControl;
  }
  get pdf() {
    return this.debtProgrammeForm.get('Pdf') as FormControl;
  }
  get type() {
    return this.debtProgrammeForm.get('DebtCreditTypeId') as FormControl;
  }
  get category() {
    return this.debtProgrammeForm.get('DebtCreditCategoryId') as FormControl;
  }
  async configureForm() {
    this.formConfig = await this.commonStoreService.getFormConfig();
    switch (this.formConfig.mode) {
      case FORM_MODE.CREATE:
        break;
      case FORM_MODE.EDIT:
        this.getDebtProgrammeById(this.formConfig.id);
        break;
      case FORM_MODE.VIEW:
        this.debtProgrammeForm.disable();
        this.getDebtProgrammeById(this.formConfig.id);
        break;
      default:
        break;
    }
  }
  getDebtProgrammeById(id: number) {
    this.loaderService.show();
    this.debtService.viewDebtProgramme(id).subscribe({
      next: (res) => {
        this.debtDetails = res.data;
        this.typeId = this.debtDetails.DebtCreditTypeId;
        this.fillFormData();
        this.loaderService.hide();
      },
      error: (error) => {
        this.loaderService.hide();
        this.toasterService.error(error.error.message);
      },
    });
  }
  editDebtProgramme() {
    let formConfig = {
      mode: FORM_MODE.EDIT,
      id: this.formConfig.id,
    };
    this.commonStoreService.setFormConfig(formConfig);
    this.router.navigate([`${ROUTE.EDIT_DEBT_PROGRAMME}`]);
  }
  createDebtProgramme(payload: any) {
    this.loaderService.show();
    this.debtService.createDebtProgramme(payload).subscribe({
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
  updateDebtProgramme(payload: any) {
    payload.DebtCreditCategoryId =
      this.typeId === 1 ? payload.DebtCreditCategoryId : null;
    this.loaderService.show();
    this.debtService
      .updateDebtProgramme(payload, this.debtDetails.DebtCreditRatingId)
      .subscribe({
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
  deleteIncentive() {
    const dialogRef = this.commonService.showModal(
      'Delete',
      CONSTANTS.DEBT_DELETE_CONFIRMATION
    );
    dialogRef.afterClosed().subscribe((action: any) => {
      if (action) {
        this.loaderService.show();
        this.debtService
          .deleteDebtProgramme(this.debtDetails.DebtCreditTypeId)
          .subscribe({
            next: (res) => {
              this.loaderService.hide();
              // this.goToManage(res.message);
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
    if (this.debtProgrammeForm.valid) {
      let payload = this.createPayload();
      if (this.formConfig.mode == FORM_MODE.CREATE) {
        this.createDebtProgramme(payload);
      } else if (this.formConfig.mode == FORM_MODE.EDIT) {
        this.updateDebtProgramme(payload);
      }
    }
  }
  fillFormData() {
    Object.keys(this.debtProgrammeForm.controls).forEach((control) => {
      if (control == DEBT_FORM.PDF.NAME) {
        this.toggleControl(
          control,
          this.debtDetails.Pdf == '' || this.debtDetails.Pdf == null
        );
      } else {
        this.debtProgrammeForm
          .get(control)
          ?.setValue(this.debtDetails[control]);
      }
    });
  }
  createPayload() {
    let payload = this.debtProgrammeForm.value;
    Object.keys(this.fileContainer).forEach((key: string) => {
      if (key == DEBT_FORM.PDF.NAME) {
        payload[key] = this.fileContainer.Pdf[0];
      }
    });
    return payload;
  }
  validateForm() {
    Object.keys(this.debtProgrammeForm.controls).forEach((control: any) => {
      this.setControlError(control);
    });
  }
  checkError(control: string, error: string) {
    return this.debtProgrammeForm.get(control)?.hasError(error);
  }
  setControlError(control: string) {
    let formControl = this.getControl(this.debtProgrammeForm, control);
    if (this.checkError(control, 'required')) {
      this.debtProgrammeForm.get(control)?.setErrors({
        ...formControl.errors,
        invalid: `${this.getControlLabel(control)} is required`,
      });
    } else if (
      this.checkError(control, 'minlength') ||
      this.checkError(control, 'maxlength')
    ) {
      this.debtProgrammeForm.get(control)?.setErrors({
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
        this.getControl(this.debtProgrammeForm, 'Pdf')?.setValue(fileList[0]);
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
  deleteFile(prop: string, type: number) {
    const dialogRef = this.commonService.deleteFileConfirmation();
    dialogRef.afterClosed().subscribe((action: any) => {
      if (action) {
        this.loaderService.show();
        this.debtService
          .deleteFile(this.debtDetails.DebtCreditRatingId)
          .subscribe({
            next: (res: any) => {
              this.debtDetails[prop] = '';
              this.debtProgrammeForm.get(prop)?.setValue(null);
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
      this.debtProgrammeForm.get(control)?.enable();
    } else {
      this.debtProgrammeForm.get(control)?.disable();
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
    this.debtProgrammeForm.reset();
  }
  goToManage(res?: any) {
    sessionStorage.removeItem(SESSION.FORM_CONFIG);
    let formConfig = {
      tab:
        res?.data?.DebtCreditTypeId == '1'
          ? 1
          : res?.data?.DebtCreditTypeId == '2'
          ? 2
          : res?.data?.DebtCreditTypeId == '3'
          ? 3
          : 0,
    };
    this.commonStoreService.setFormConfig(formConfig);
    res?.message != undefined
      ? this.router.navigate([ROUTE.MANAGE_DEBT_PROGRAMME]).then((m) => {
          this.toasterService.success(res.message);
        })
      : this.router.navigate([ROUTE.MANAGE_DEBT_PROGRAMME]);
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
    let result: any = Object.values(DEBT_FORM).find(
      (res: any) => res.NAME == control
    );
    return result ? result.LABEL : control;
  }
  getControlPatternMessage(control: string): any {
    let result: any = Object.values(DEBT_FORM).find(
      (res: any) => res.NAME == control
    );
    return result
      ? result.PATTERN_MESSAGE
        ? result.PATTERN_MESSAGE
        : `Please provide valid ${control}`
      : `Please provide valid ${control}`;
  }

  onTypeSelect(event: any) {
    this.typeId = event.DebtCreditTypeId;
    if (this.typeId == 1) {
      this.debtProgrammeForm
        .get('DebtCreditCategoryId')
        ?.setValidators([Validators.required]);
      this.debtProgrammeForm
        .get('DebtCreditCategoryId')
        ?.updateValueAndValidity();
    } else {
      this.debtProgrammeForm.get('DebtCreditCategoryId')?.clearValidators();
      this.debtProgrammeForm
        .get('DebtCreditCategoryId')
        ?.updateValueAndValidity();
    }
  }
}
