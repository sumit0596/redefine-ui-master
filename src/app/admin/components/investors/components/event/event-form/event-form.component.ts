import { EventService } from 'src/app/admin/services/event.service';
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
import {
  FORM_MODE,
  FILETYPE,
  ROUTE,
  INPUT_ERROR,
  SESSION,
  EVENT_FORM,
  CONSTANTS,
} from 'src/app/models/constants';
import { EVENT_CATEGORY } from 'src/app/models/enum';
import { CommonStoreService } from 'src/app/services/common-store.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { LoaderService } from 'src/app/shared/services/loader/loader.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-event-form',
  templateUrl: './event-form.component.html',
  styleUrls: ['./event-form.component.scss'],
})
export class EventFormComponent {
  fileType: any = FILETYPE;
  formMode: any = FORM_MODE;
  formConfig!: any;
  categoryList$!: Observable<any>;
  financialYearList$!: Observable<any>;
  prsentationsList$!: Observable<any>;
  categoryList!: any[];
  financialYearList!: any[];
  prsentationsList!: any[];
  eventDetails: any;
  fileList: any[] = [];
  fileTypes: string[] = [
    FILETYPE.PDF,
    FILETYPE.EXCEL_SPREADSHEET,
    FILETYPE.MS_EXCEL,
  ];
  fileContainer: any = {};
  eventForm!: FormGroup;
  IsFile: boolean = false;
  type: any;
  documentSelectMessage: string = '';
  minDate: Date;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private eventService: EventService,
    private loaderService: LoaderService,
    private toasterService: ToastrService,
    private commonStoreService: CommonStoreService,
    private commonService: CommonService,
    private router: Router,
    private datePipe: DatePipe
  ) {
    this.minDate = new Date();
  }
  async ngOnInit() {
    this.eventForm = this.fb.group({
      Title: ['', [Validators.required, Validators.maxLength(100)]],
      EventCategoryId: [null, [Validators.required]],
      EventDate: ['', [Validators.required]],
      Url: [''],
      EventStartTime: ['', [Validators.required]],
      EventEndTime: ['', [Validators.required]],
      FinancialResultsId: [null],
      PresentationsId: [null],
      Document: [null],
      // MicrosoftOutlook: [null],
      // GoogleCalendar: [null],
      Ical: [null],
    });
    await this.configureForm();

    this.getCategory();
    this.getFinancialResults();
    this.getPrsentations();
  }

  toggleSwitch(event: any) {
    this.IsFile = event.checked;
    if (this.IsFile === true) {
      //this.eventForm.get('Document')?.setValidators([Validators.required]);
      this.eventForm.get('Document')?.updateValueAndValidity();
      this.eventForm.get('Url')?.clearValidators();
      this.eventForm.get('Url')?.updateValueAndValidity();
    } else {
      // this.eventForm.get('Url')?.setValidators([Validators.required]);
      this.eventForm.get('Document')?.clearValidators();
      this.eventForm.updateValueAndValidity();
    }
  }

  async getCategory() {
    this.categoryList$ = await this.eventService.getCategories();
    this.categoryList$.subscribe({
      next: (res: any) => {
        this.categoryList = res.data;
      },
      error: (error: any) => {},
    });
  }

  async getFinancialResults() {
    this.financialYearList$ = await this.eventService.getFinancialResults();
    this.financialYearList$.subscribe({
      next: (res: any) => {
        this.financialYearList = res.data;
      },
      error: (error: any) => {},
    });
  }

  async getPrsentations() {
    this.prsentationsList$ = await this.eventService.getPresentations();
    this.prsentationsList$.subscribe({
      next: (res: any) => {
        this.prsentationsList = res.data;
      },
      error: (error: any) => {},
    });
  }

  async configureForm() {
    this.formConfig = await this.commonStoreService.getFormConfig();
    switch (this.formConfig.mode) {
      case FORM_MODE.CREATE:
        break;
      case FORM_MODE.EDIT:
        this.getEventById(this.formConfig.id);

        break;
      case FORM_MODE.VIEW:
        this.eventForm.disable();
        this.getEventById(this.formConfig.id);

        break;
      default:
        break;
    }
  }
  getEventById(id: number) {
    this.loaderService.show();
    this.eventService.viewEvent(id).subscribe({
      next: (res: any) => {
        this.eventDetails = res.data;
        this.fillFormData();
        this.loaderService.hide();
      },
      error: (error: any) => {
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
    this.router.navigate([`${ROUTE.EDIT_EVENT}`]);
  }
  createEvent(payload: any) {
    this.loaderService.show();
    this.eventService.createEvent(payload).subscribe({
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
  updateEvent(payload: any) {
    this.loaderService.show();
    this.eventService
      .updateEvent(payload, this.eventDetails.EventsId)
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

  onSubmit(event: any) {
    event.preventDefault();
    this.validateForm();
    if (this.eventForm.valid && this.errorMessage == '') {
      let payload = this.createPayload();
      if (this.formConfig.mode == FORM_MODE.CREATE) {
        this.createEvent(payload);
      } else if (this.formConfig.mode == FORM_MODE.EDIT) {
        this.updateEvent(payload);
      }
    }
  }
  fillFormData() {
    Object.keys(this.eventForm.controls).forEach((control) => {
      if (control == EVENT_FORM.DOCUMENT.NAME) {
        if (this.eventDetails.Document != null) {
          this.IsFile = true;
        }
        this.toggleControl(
          control,
          this.eventDetails.Document == '' || this.eventDetails.Document == null
        );
      }
      //  else if (control == EVENT_FORM.MICROSOFT_OUTLOOK.NAME) {
      //     this.toggleControl(
      //       control,
      //       this.eventDetails.MicrosoftOutlook == '' ||
      //         this.eventDetails.MicrosoftOutlook == null
      //     );
      //   }
      //   else if (control == EVENT_FORM.GOOGLE_CALENDAR.NAME) {
      //     this.toggleControl(
      //       control,
      //       this.eventDetails.GoogleCalendar == '' ||
      //         this.eventDetails.GoogleCalendar == null
      //     );
      //   }
      else if (control == EVENT_FORM.ICAL.NAME) {
        this.toggleControl(
          control,
          this.eventDetails.Ical == '' || this.eventDetails.Ical == null
        );
      } else {
        this.eventForm.get(control)?.setValue(this.eventDetails[control]);
      }
    });
  }

  createPayload() {
    this.eventForm.value.EventDate = this.datePipe.transform(
      this.eventForm.value.EventDate,
      'Y-MM-dd'
    );
    let payload = this.eventForm.value;
    Object.keys(this.fileContainer).forEach((key: string) => {
      if (key == EVENT_FORM.DOCUMENT.NAME) {
        payload[key] = this.fileContainer.Document[0];
      } else if (key == EVENT_FORM.ICAL.NAME) {
        payload[key] = this.fileContainer.Ical[0];
      }
    });
    return payload;
  }
  validateForm() {
    if (
      this.eventForm.get('Category')?.value == 4 &&
      this.IsFile === true &&
      this.eventForm.get('Document')?.value == null
    ) {
    }
    this.clearControlError(this.eventForm.get('EventDate'));
    Object.keys(this.eventForm.controls).forEach((control: any) => {
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
  checkError(control: string, error: string) {
    return this.eventForm.get(control)?.hasError(error);
  }
  setControlError(control: string) {
    let formControl = this.getControl(this.eventForm, control);
    if (this.checkError(control, 'required')) {
      this.eventForm.get(control)?.setErrors({
        ...formControl.errors,
        invalid: `${this.getControlLabel(control)} is required`,
      });
    } else if (
      this.checkError(control, 'minlength') ||
      this.checkError(control, 'maxlength')
    ) {
      this.eventForm.get(control)?.setErrors({
        ...formControl.errors,
        invalid: INPUT_ERROR.NAME_PATTERN,
      });
    }
  }

  onFileSelect(fileList: any[], type: number, documentType: any) {
    this.fileList = [...fileList];
    if (documentType === 'Document') {
      if (fileList.length == 0) {
        this.eventForm.get('Document')?.setValue(null);
      } else {
        Object.assign(this.fileContainer, { Document: [...fileList] });
        this.getControl(this.eventForm, 'Document')?.setValue(fileList[0]);
      }
    } else if (documentType === 'Ical') {
      this.documentSelectMessage = '';
      if (fileList.length == 0) {
        this.eventForm.get('Ical')?.setValue(null);
      } else {
        Object.assign(this.fileContainer, { Ical: [...fileList] });
        this.getControl(this.eventForm, 'Ical')?.setValue(fileList[0]);
      }
    }
  }

  onFileDelete(event: any, type: number, documentType: any) {
    switch (documentType) {
      case 'Document':
        this.fileContainer.Document = this.fileContainer.Document[event] =
          undefined;
        this.eventForm.get('Document')?.setValue(null);
        break;

      case 'Ical':
        this.fileContainer.Ical = this.fileContainer.Ical[event] = undefined;
        this.eventForm.get('Ical')?.setValue(null);
        break;
    }
  }
  deleteFile(prop: string, type: number) {
    const dialogRef = this.commonService.deleteFileConfirmation();
    dialogRef.afterClosed().subscribe((action: any) => {
      if (action) {
        this.loaderService.show();
        this.eventService
          .deleteFile(this.eventDetails.EventsId, prop)
          .subscribe({
            next: (res: any) => {
              this.eventDetails[prop] = '';
              this.eventForm.get(prop)?.setValue(null);
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
      this.eventForm.get(control)?.enable();
    } else {
      this.eventForm.get(control)?.disable();
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
    this.eventForm.reset();
  }
  goToManage(message?: any) {
    sessionStorage.removeItem(SESSION.FORM_CONFIG);
    message != undefined
      ? this.router.navigate([ROUTE.MANAGE_EVENTS]).then((m) => {
          this.toasterService.success(message);
        })
      : this.router.navigate([ROUTE.MANAGE_EVENTS]);
  }

  timeChange() {
    this.errorMessage = '';
    if (
      this.eventForm.get('EventStartTime')?.value != '' &&
      this.eventForm.get('EventEndTime')?.value != ''
    ) {
      if (
        this.eventForm.get('EventEndTime')?.value ==
        this.eventForm.get('EventStartTime')?.value
      ) {
        this.errorMessage =
          'Event start time and Event end time should not be same';
      } else if (
        this.eventForm.get('EventStartTime')?.value >
        this.eventForm.get('EventEndTime')?.value
      ) {
        this.errorMessage =
          'Event start time should be less than  Event end time';
      }
    }
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
    }
  }
  getControl(form: any, control: string): FormControl {
    return form?.get(control) as FormControl;
  }
  getControlLabel(control: string) {
    let result: any = Object.values(EVENT_FORM).find(
      (res: any) => res.NAME == control
    );
    return result ? result.LABEL : control;
  }

  onSwitchToggle(event: any) {}

  categorySelect(event: any) {
    this.eventForm.get('PresentationsId')?.setValue(null);
    this.eventForm.get('FinancialResultsId')?.setValue(null);
    this.eventForm.get('Url')?.setValue(null);

    if (event.Id == EVENT_CATEGORY.OTHERS) {
      if (this.IsFile === true) {
        //this.eventForm.get('Document')?.setValidators([Validators.required]);
      } else {
        // this.eventForm.get('Url')?.setValidators([Validators.required]);
      }
      this.eventForm.get('PresentationsId')?.clearValidators();
      this.eventForm.get('FinancialResultsId')?.clearValidators();
    } else if (event.Id == EVENT_CATEGORY.FINANCIAL_RESULTS) {
      this.eventForm
        .get('FinancialResultsId')
        ?.setValidators([Validators.required]);
      this.eventForm.get('Document')?.clearValidators();
      this.eventForm.get('Url')?.clearValidators();
      this.eventForm.get('PresentationsId')?.clearValidators();
    } else if (event.Id == EVENT_CATEGORY.PRESENTATION) {
      this.eventForm
        .get('PresentationsId')
        ?.setValidators([Validators.required]);
      this.eventForm.get('Document')?.clearValidators();
      this.eventForm.get('Url')?.clearValidators();
      this.eventForm.get('FinancialResultsId')?.clearValidators();
    }
  }

  switchToggle(event: any, type: any) {
    this.documentSelectMessage = '';
    if (event.checked) {
      this.eventForm.get(type)?.setValue(1);
    } else {
      this.eventForm.get(type)?.setValue(0);
    }
  }
}
