import { DatePipe } from '@angular/common';
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
  SESSION,
  ROUTE,
  INTEGRATED_REPORT_FORM,
  CONSTANTS,
} from 'src/app/models/constants';
import { IntegratedReportFormComponent } from '../integrated-report-form/integrated-report-form.component';
import { InvestorService } from 'src/app/admin/services/investor.service';
import {
  INTEGRATED_REPORT_MEDIA_TYPE,
  INTEGRATED_REPORT_STATUS,
} from 'src/app/models/enum';
import { PreviewIntegratedReportComponent } from '../preview-integrated-report/preview-integrated-report.component';

@Component({
  selector: 'app-integrated-report-details-form',
  templateUrl: './integrated-report-details-form.component.html',
  styleUrls: ['./integrated-report-details-form.component.scss'],
})
export class IntegratedReportDetailsFormComponent {
  status: any = INTEGRATED_REPORT_STATUS;
  formConfig: any;
  btnLabel: string = '';
  formMode: any = FORM_MODE;
  integratedReportId!: number;
  integratedReportForm!: FormGroup;
  isSubmit: boolean = true;
  integratedReportDetails: any;
  minDate: Date = new Date();

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private datePipe: DatePipe,
    private context: ContextContainer,
    private investorService: InvestorService
  ) {}
  ngOnInit(): void {
    this.setForm();
    this.configureForm();
  }
  setForm() {
    this.integratedReportForm = this.fb.group({
      Title: ['', [Validators.required, Validators.maxLength(255)]],
      Description: ['', [Validators.maxLength(30000)]],
      PublishDate: [null],
      PublishTime: [null],
    });
  }
  async configureForm() {
    this.formConfig = await this.context.commonStoreService.getFormConfig();
    this.integratedReportId = this.formConfig?.id;
    switch (this.formConfig.mode) {
      case FORM_MODE.CREATE:
        this.integratedReportForm
          .get('Title')
          ?.setValue(
            `${
              this.formConfig.year
                ? this.formConfig.year + 1
                : new Date().getFullYear() + 1
            } Reporting suite`
          );
        if (this.formConfig.id) {
          this.getReportDetails();
        }
        break;
      case FORM_MODE.EDIT:
        this.getReportDetails();
        break;
      case FORM_MODE.VIEW:
        this.integratedReportForm.disable();
        this.getReportDetails();
        break;
    }
    this.loadButtonLabel();
  }
  getReportDetails() {
    this.context.loaderService.show();
    this.investorService
      .getIntegratedReportDetails(this.integratedReportId)
      .subscribe({
        next: (res: any) => {
          this.context.loaderService.hide();
          this.integratedReportDetails = res.data.integratedreports;
          this.formatFileObject();
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
    Object.keys(this.integratedReportForm.controls).forEach((control: any) => {
      this.getControl(this.integratedReportForm, control)?.setValue(
        this.integratedReportDetails[control]
      );
    });
  }
  onSubmit() {
    if (this.formConfig.mode != FORM_MODE.VIEW) {
      if (this.integratedReportForm.valid) {
        let payload = this.createPayload();
        if (
          this.formConfig.mode == FORM_MODE.CREATE &&
          this.integratedReportId == undefined
        ) {
          if (
            this.getControl(
              this.integratedReportForm,
              INTEGRATED_REPORT_FORM.PUBLISH_DATE.NAME
            )?.value ||
            this.getControl(
              this.integratedReportForm,
              INTEGRATED_REPORT_FORM.PUBLISH_TIME.NAME
            )?.value
          ) {
            this.createIntegratedReport(payload);
          } else {
            this.openConfirmationDialog(payload);
          }
        } else if (
          this.formConfig.mode == FORM_MODE.EDIT ||
          this.integratedReportId
        ) {
          this.updateIntegratedReport(payload);
        }
      } else {
        this.validateForm();
      }
    } else {
      this.formConfig = {
        ...this.formConfig,
        mode: FORM_MODE.EDIT,
      };
      this.context.commonStoreService.setFormConfig(this.formConfig);
      this.router.navigate([ROUTE.EDIT_INTEGRATED_REPORT]);
    }
  }
  openConfirmationDialog(payload: any) {
    let dialogRef = this.context.commonService.showModal(
      'Please Note',
      'You have not yet set a publishing date and time',
      'Click yes to proceed and save your work as draft'
    );
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.createIntegratedReport(payload);
      }
    });
  }
  onSave(status: any = undefined) {
    if (status == CONSTANTS.PREVIEW) {
      this.openPreviewModal();
    } else if (status == INTEGRATED_REPORT_STATUS.DRAFT) {
      this.updateReportStatus(status);
    }
  }
  updateReportStatus(status: number) {
    this.context.loaderService.show();
    this.investorService.updateStatus(this.formConfig.id, status).subscribe({
      next: (res: any) => {
        this.context.loaderService.hide();
        // this.context.toasterService.success(res.message);
        this.goToManage(res.message);
      },
      complete: () => {},
      error: (error: any) => {
        this.context.loaderService.hide();
        error.error.errors
          ? this.displayError(error.error.errors)
          : this.context.toasterService.error(error.error.message);
      },
    });
  }
  goToManage(message?: any) {
    sessionStorage.removeItem(SESSION.FORM_CONFIG);
    message != undefined
      ? this.router.navigate([ROUTE.MANAGE_INTEGRATED_REPORTS]).then((m) => {
          this.context.toasterService.success(message);
        })
      : this.router.navigate([ROUTE.MANAGE_INTEGRATED_REPORTS]);
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
  openReportModal(reportDetails: any = undefined) {
    if (this.formConfig.mode == FORM_MODE.CREATE && !this.formConfig.id) {
      this.isSubmit = false;
      this.onSubmit();
    } else {
      const dialogRef = this.dialog.open(IntegratedReportFormComponent, {
        height: '700px',
        data: {
          mode: reportDetails ? this.formConfig.mode : FORM_MODE.CREATE,
          integratedReportId: this.formConfig.id,
          reportDetails: reportDetails,
          integratedReportDocuments: this.integratedReportDetails
            ? this.integratedReportDetails.integratedreportsdocuments
            : [],
        },
      });
      dialogRef.afterClosed().subscribe((result) => {
        //if (result) {
        this.getReportDetails();
        //}
      });
    }
  }
  openPreviewModal() {
    const dialogRef = this.dialog.open(PreviewIntegratedReportComponent, {
      data: this.integratedReportDetails,
      minWidth: '70vw',
      maxWidth: '90vw',
      height: '90vh',
    });
    dialogRef.afterClosed().subscribe((result) => {});
  }
  createPayload(): any {
    let formValues = this.integratedReportForm.value;
    formValues.PublishDate = this.datePipe.transform(
      formValues.PublishDate,
      'yyyy-MM-dd'
    );
    return formValues;
  }
  createIntegratedReport(payload: any) {
    this.context.loaderService.show();
    this.investorService.addIntegratedReport(payload).subscribe({
      next: (res: any) => {
        this.context.loaderService.hide();
        // this.context.toasterService.success(res.message);
        this.integratedReportId = res.data.IntegratedReportId;
        this.formConfig.id = res.data.IntegratedReportId;
        this.context.commonStoreService.setFormConfig(this.formConfig);
        if (this.isSubmit) {
          this.goToManage(res.message);
        } else {
          this.openReportModal();
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
  updateIntegratedReport(payload: any) {
    this.context.loaderService.show();
    this.investorService
      .updateIntegratedReport(payload, this.integratedReportId)
      .subscribe({
        next: (res: any) => {
          this.context.loaderService.hide();
          //  this.context.toasterService.success(res.message);
          this.formConfig.id = res.data.IntegratedReportId;
          this.context.commonStoreService.setFormConfig(this.formConfig);
          this.goToManage(res.message);
        },
        error: (error: any) => {
          this.context.loaderService.hide();
          error.error.errorsF
            ? this.displayError(error.error.errors)
            : this.context.toasterService.error(error.error.message);
        },
      });
  }
  deleteIntegratedReportDocument(id: number, index: number) {
    let title =
      this.integratedReportDetails.integratedreportsdocuments[index].Title;
    let dialogRef = this.context.commonService.showModal(
      'Delete',
      `Are you sure you want to delete the report?`
    );
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.context.loaderService.show();
        this.investorService.deleteIntegratedReportDocument(id).subscribe({
          next: (res: any) => {
            this.context.loaderService.hide();
            this.context.toasterService.success(res.message);
            this.getReportDetails();
          },
          error: (error: any) => {
            this.context.loaderService.hide();
            error.error.errors
              ? this.displayError(error.error.errors)
              : this.context.toasterService.error(error.error.message);
          },
        });
      }
    });
  }
  editIntegratedReportDocument(index: number) {
    this.openReportModal(
      this.integratedReportDetails.integratedreportsdocuments[index]
    );
  }
  /*********************************************************
   *                      Validations                      *
   ********************************************************/
  validateForm() {
    this.clearControlError(this.integratedReportForm.get('PublishDate'));
    Object.keys(this.integratedReportForm.controls).forEach((control: any) => {
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

  setControlError(control: string) {
    if (this.checkError(control, 'required')) {
      this.integratedReportForm.get(control)?.setErrors({
        required: true,
        invalid: `${this.getControlLabel(control)} is required`,
      });
    }
  }
  checkError(control: string, error: string) {
    return this.integratedReportForm.get(control)?.hasError(error);
  }
  validateFormField(data: any) {
    let control = this.getControl(data.form, data.control);
    if (control?.hasError('required')) {
      control?.setErrors({
        ...control.errors,
        invalid: `${this.getControlLabel(data.control)} is required`,
      });
    } else if (control?.hasError('minlength')) {
      control?.setErrors({
        ...control.errors,
        invalid: `Minimum ${
          control.getError('minlength')?.requiredLength
        }  characters are allowed`,
      });
    } else if (control?.hasError('maxlength')) {
      control?.setErrors({
        ...control.errors,
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
  getControlLabel(control: string) {
    let result: any = Object.values(INTEGRATED_REPORT_FORM).find(
      (res: any) => res.NAME == control
    );
    return result ? result.LABEL : control;
  }
  getControlPatternMessage(control: string): any {
    let result: any = Object.values(INTEGRATED_REPORT_FORM).find(
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
  formatFileObject() {
    this.integratedReportDetails = {
      ...this.integratedReportDetails,
      integratedreportsdocuments: [
        ...this.integratedReportDetails.integratedreportsdocuments,
      ].map((document: any) => {
        return {
          ...document,
          Pdf: {
            MediaId: document.Pdf,
            Name: document.PdfName,
            Url: document.PdfUrl,
          },
          Image: {
            MediaId: document.Image,
            Name: document.ImageName,
            Url: document.ImageUrl,
          },
          integratedreportsdocumentsLink:
            document.integratedreportsdocumentsLink
              ? [...document.integratedreportsdocumentsLink].map(
                  (link: any) => {
                    if (
                      link.TypeOfMedia == INTEGRATED_REPORT_MEDIA_TYPE.DOCUMENT
                    ) {
                      return {
                        ...link,
                        Document: {
                          MediaId: link.Document,
                          Name: link.DocumentName,
                          Url: link.DocumentUrl,
                        },
                      };
                    } else {
                      return link;
                    }
                  }
                )
              : [],
        };
      }),
    };
  }
}
