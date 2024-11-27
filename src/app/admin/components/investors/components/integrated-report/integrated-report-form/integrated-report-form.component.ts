import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { InvestorService } from 'src/app/admin/services/investor.service';
import { ContextContainer } from 'src/app/core/context/context-container';
import {
  CONSTANTS,
  FILETYPE,
  FORM_MODE,
  INTEGRATED_REPORT_FORM,
} from 'src/app/models/constants';
import { CommonService } from 'src/app/shared/services/common.service';

@Component({
  selector: 'app-integrated-report-form',
  templateUrl: './integrated-report-form.component.html',
  styleUrls: ['./integrated-report-form.component.scss'],
})
export class IntegratedReportFormComponent implements OnInit {
  btnLabel: string = '';
  formConfig: any;
  fileContainer: { report: any; image: any; document: any } = {
    report: undefined,
    image: undefined,
    document: undefined,
  };
  formMode: any = FORM_MODE;
  fileType: any = FILETYPE;
  integratedReportForm!: FormGroup;
  colors$!: Observable<any>;
  urlPattern2 =
    /^(?:(http(s)?)?(sftp)?(ftp)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/;

  mediaTypes$: Observable<any[]> = of([
    {
      Id: 1,
      Name: 'Document',
    },
    {
      Id: 2,
      Name: 'External Link',
    },
    {
      Id: 3,
      Name: 'Internal Link',
    },
  ]);
  mediaType!: number;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private datePipe: DatePipe,
    private context: ContextContainer,
    private investorService: InvestorService,
    private dialog: MatDialog,
    public reportModal: MatDialogRef<IntegratedReportFormComponent>,
    private commonService: CommonService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}
  ngOnInit(): void {
    this.getDocumentColors();
    this.setForm();
    this.configureForm();
  }
  setForm() {
    this.integratedReportForm = this.fb.group({
      Title: ['', [Validators.required, Validators.maxLength(255)]],
      Description: ['', [Validators.maxLength(30000)]],
      Pdf: [null, [Validators.required]],
      Image: [null, [Validators.required]],
      IntegratedReportId: [this.data?.integratedReportId],
      ColorsId: [null, [Validators.required]],
      Links: this.fb.array([]),
      ...(this.data &&
        this.data.reportDetails &&
        Object.prototype.hasOwnProperty.call(
          this.data.reportDetails,
          'IntegratedReportDocumentsId'
        ) && {
          IntegratedReportDocumentsId: [
            this.data.reportDetails.IntegratedReportDocumentsId,
          ],
        }),
    });
  }
  get linksForm() {
    return this.integratedReportForm.get('Links') as FormArray;
  }
  async configureForm() {
    switch (this.data.mode) {
      case FORM_MODE.CREATE:
        if (this.data?.integratedReportId && this.data.reportDetails) {
          this.fillFormData();
        }
        break;
      case FORM_MODE.EDIT:
        this.fillFormData();
        break;
    }
    this.loadButtonLabel();
  }
  getDocumentColors() {
    this.investorService
      .getIntegratedReportDocumentColors()
      .subscribe((res): any => {
        if (res) {
          let colors = res;
          let colorIds: any[] = this.data.integratedReportDocuments.map(
            (doc: any) => doc.ColorsId
          );
          colors = [...colors].map((color: any) => {
            return colorIds.includes(color.Id) &&
              this.data.integratedReportId &&
              color.Id != this.data.reportDetails?.ColorsId
              ? { ...color, disabled: true }
              : color;
          });
          this.colors$ = of(colors);
        }
      });
  }
  fillFormData() {
    this.setDocumentDataForFormControl();
    Object.keys(this.integratedReportForm.controls).forEach((control: any) => {
      let formControl = this.getControl(this.integratedReportForm, control);
      if (formControl instanceof FormControl) {
        formControl?.setValue(this.data.reportDetails[control]);
      } else if (formControl instanceof FormArray) {
        this.fillLinks();
      }
    });
  }
  fillLinks() {
    [...this.data.reportDetails.integratedreportsdocumentsLink].forEach(
      (link: any) => {
        this.addLink(link);
      }
    );
  }

  setDocumentDataForFormControl() {
    if (
      this.data?.reportDetails?.Pdf == null ||
      this.data?.reportDetails?.Pdf?.MediaId == '' ||
      this.data?.reportDetails?.Pdf?.Name == null ||
      this.data?.reportDetails?.Pdf?.Url == null
    ) {
      this.data.reportDetails.Pdf = null;
    }
    if (
      this.data?.reportDetails?.Image == null ||
      this.data?.reportDetails?.Image?.MediaId == '' ||
      this.data?.reportDetails?.Image?.Name == null ||
      this.data?.reportDetails?.Image?.Url == null
    ) {
      this.data.reportDetails.Image = null;
    }
    if (this.data?.reportDetails?.integratedreportsdocumentsLink?.length > 0) {
      this.data?.reportDetails?.integratedreportsdocumentsLink.map((x: any) => {
        if (
          x.TypeOfMedia == 1 &&
          (x.Document == null ||
            x.Document?.MediaId == '' ||
            x.Document?.Name == null ||
            x.Document?.Url == null)
        ) {
          x.Document = null;
        }
      });
    }
  }

  onSubmit(event: any) {
    event?.preventDefault();
    // if(this.data.mode == FORM_MODE.EDIT){
    // var arrayControl = this.integratedReportForm.get('Links') as FormArray;
    // for(let i = 0 ; i < arrayControl.controls.length ; i++ ){
    //   if(arrayControl.controls[i].value.TypeOfMedia != 1 && !(arrayControl.controls[i].value?.Document?.includes('.pdf') || arrayControl.controls[i].value?.Document?.includes('.xlsx'))){
    //     arrayControl.controls[i].get('Document')?.setValidators([Validators.required,
    //     Validators.maxLength(500),
    //     Validators.pattern(this.urlPattern2)]);
    //     arrayControl.controls[i].get('Document')?.updateValueAndValidity();
    //   }
    // }
    // }

    if (this.integratedReportForm.valid) {
      let payload = this.createPayload();
      this.createUpdateReport(payload);
    } else {
      this.validateForm();
    }
  }
  createUpdateReport(payload: any) {
    this.context.loaderService.show();
    this.investorService.addUpdateIntegratedReport(payload).subscribe({
      next: (res: any) => {
        this.context.loaderService.hide();
        this.context.toasterService.success(res.message);
        this.close(true);
      },
      error: (error: any) => {
        this.context.loaderService.hide();

        error.error.errors
          ? this.displayError(error.error.errors)
          : this.context.toasterService.error(error.error.message);
      },
    });
  }
  createPayload() {
    let payload = this.integratedReportForm.value;
    payload.Pdf = payload.Pdf.MediaId;
    payload.Image = payload.Image.MediaId;
    payload.Links = [...payload.Links].map((link: any) => {
      if (link.Document.MediaId) {
        return { ...link, Document: link.Document.MediaId };
      } else {
        return link;
      }
    });
    return payload;
  }
  loadButtonLabel() {
    if (this.data.mode) {
      this.btnLabel = 'Submit';
      if (this.data.mode == FORM_MODE.VIEW) this.btnLabel = 'Edit';
      else if (this.data.mode == FORM_MODE.EDIT) {
        this.btnLabel = 'Save & Update';
      }
    }
  }
  onChange(event: any) {
    this.validateFormField(event);
    //this.validateForm();
  }
  onDataChange(event: any, index: number = 0) {
    this.mediaType = event.Id;
    switch (event.control) {
      case INTEGRATED_REPORT_FORM.TYPE_OF_MEDIA.NAME:
        if (event.Id == 2 || event.Id == 3) {
          this.linksForm.at(index).get('Document')?.setValue(null);
          // this.linksForm
          //   .at(index)
          //   .get('Document')
          //   ?.setValidators([
          //     Validators.required,
          //     Validators.maxLength(500),
          //     Validators.pattern(this.urlPattern2),
          //   ]);
          this.linksForm.updateValueAndValidity();
        } else if (event.Id == 1) {
          this.linksForm.at(index).get('Document')?.setValue(null);
          // this.linksForm
          //   .at(index)
          //   .get('Document')
          //   ?.removeValidators([Validators.pattern(this.urlPattern2)]);
          // this.linksForm.updateValueAndValidity();
        }

        break;
    }
  }
  onFileSelect(event: any, type: string, index: number = 0) {
    if (type == 'PDF') {
      this.uploadMedia(event[0], this.integratedReportForm, 'Pdf');
    } else if (type == 'IMAGE') {
      this.uploadMedia(event[0], this.integratedReportForm, 'Image');
    } else if (type == 'DOCUMENT') {
      this.uploadMedia(event[0], this.linksForm.at(index), 'Document');
    }
  }

  onFileDelete(event: any, type: string, index: number = 0) {
    const dialogRef = this.commonService.deleteFileConfirmation();
    dialogRef.afterClosed().subscribe((action: any) => {
      if (action) {
        this.context.loaderService.show();
        this.investorService
          .deleteIntegratedReportMedia(event.MediaId)
          .subscribe({
            next: (res: any) => {
              this.context.loaderService.hide();
              this.context.toasterService.success(res.message);
              this.updateFormFile(type, index);
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
  updateFormFile(type: string, index: number) {
    switch (type) {
      case 'PDF':
        this.getControl(
          this.integratedReportForm,
          INTEGRATED_REPORT_FORM.PDF.NAME
        )?.setValue(null);
        break;
      case 'IMAGE':
        this.getControl(
          this.integratedReportForm,
          INTEGRATED_REPORT_FORM.IMAGE.NAME
        )?.setValue(null);
        break;
      case 'DOCUMENT':
        this.getControl(
          this.linksForm,
          INTEGRATED_REPORT_FORM.DOCUMENT.NAME,
          index
        )?.setValue(null);
        break;

      default:
        break;
    }
  }
  deleteIntegratedReportDocumentLink(index: number) {
    let link =
      this.data.mode == FORM_MODE.CREATE
        ? undefined
        : [...this.data?.reportDetails.integratedreportsdocumentsLink][index];
    if (link) {
      this.context.loaderService.show();
      this.investorService
        .deleteIntegratedReportDocumentLink(
          link.IntegratedReportDocumentsLinkId
        )
        .subscribe({
          next: (res: any) => {
            this.context.loaderService.hide();
            this.context.toasterService.success(res.message);
            this.linksForm.removeAt(index);
          },
          error: (error: any) => {
            this.context.loaderService.hide();
            error.error.errors
              ? this.displayError(error.error.errors)
              : this.context.toasterService.error(error.error.message);
          },
        });
    } else {
      this.linksForm.removeAt(index);
    }
  }
  uploadMedia(file: any, form: any, control: string) {
    this.context.loaderService.show();
    this.investorService.uploadIntegratedReportMedia(file).subscribe({
      next: (res: any) => {
        this.context.loaderService.hide();
        let file = {
          Url: res.data.Url,
          Name: res.data.Name,
          MediaId: res.data.MediaId,
          CreatedOn: res.data.CreatedOn,
        };
        this.getControl(form, control)?.setValue(file);
      },
      error: (error: any) => {
        this.context.loaderService.hide();
        error.error.errors
          ? this.displayError(error.error.errors)
          : this.context.toasterService.error(error.error.message);
      },
    });
  }
  addLink(data: any = undefined) {
    let linkForm = this.fb.group({
      LinkTitle: [
        data ? data.LinkTitle : null,
        [Validators.required, Validators.maxLength(255)],
      ],
      TypeOfMedia: [data ? data.TypeOfMedia : null, [Validators.required]],
      Document: [
        data ? data.Document : null,
        [Validators.required, Validators.maxLength(500)],
      ],
      ...(data &&
        Object.prototype.hasOwnProperty.call(
          data,
          'IntegratedReportDocumentsLinkId'
        ) && {
          IntegratedReportDocumentsLinkId: [
            data.IntegratedReportDocumentsLinkId,
          ],
        }),
    });
    this.linksForm.push(linkForm);
  }
  deleteLink(i: number) {
    this.context.loaderService.show();
    this.linksForm.removeAt(i);
  }
  close(submit: boolean = false) {
    this.reportModal.close(submit);
  }
  /*********************************************************
   *                      Form validations                 *
   ********************************************************/
  validateForm() {
    Object.keys(this.integratedReportForm.controls).forEach((control: any) => {
      let formControl = this.getControl(this.integratedReportForm, control);
      if (formControl instanceof FormControl) {
        this.setControlError(formControl, control);
      } else if (formControl instanceof FormArray) {
        formControl.controls.forEach((linkForm: any) => {
          Object.keys(linkForm.controls).forEach((link: any) => {
            let linkControl = linkForm.get(link);
            if (
              link == INTEGRATED_REPORT_FORM.DOCUMENT.NAME &&
              linkForm.value.TypeOfMedia != null &&
              linkForm.value.TypeOfMedia != 1 &&
              !(
                linkForm.value?.Document?.includes('.pdf') ||
                linkForm.value?.Document?.includes('.xlsx')
              )
            ) {
              this.setControlError(linkControl, 'Link');
            } else {
              this.setControlError(linkControl, link);
            }
          });
        });
      }
    });
  }
  setControlError(control: FormControl, name: string) {
    if (control.hasError('required')) {
      control?.setErrors({
        ...control.errors,
        invalid: `${this.getControlLabel(name)} is required`,
      });
    } else if (control.hasError('pattern')) {
      control?.setErrors({
        ...control.errors,
        invalid: `Please enter valid link`,
      });
    }
  }
  checkError(control: string, error: string) {
    return this.integratedReportForm.get(control)?.hasError(error);
  }
  validateFormField(data: any) {
    if (this.mediaType != 1) {
      data.control = 'Link';
    }
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
}
