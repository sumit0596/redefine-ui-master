import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable, of } from 'rxjs';
import { CareerService } from 'src/app/frontend/services/career.service';
import {
  CONSTANTS,
  FILETYPE,
  FRONTEND_JOB_APPLICATION_FORM,
  INPUT_ERROR,
  PATTERN,
  ROUTE,
} from 'src/app/models/constants';
import { ATTACHMENT_TYPE } from 'src/app/models/enum';
import { DataStoreService } from 'src/app/shared/services/data-store.service';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { CommonStoreService } from 'src/app/services/common-store.service';
import { environment } from 'src/environments/environment.dev';

export const MY_DATE_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YY',
  },
  display: {
    dateInput: 'DD/MM/YY',
    monthYearLabel: 'MMMM YY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YY',
  },
};

@Component({
  selector: 'app-application',
  templateUrl: './application.component.html',
  styleUrls: ['./application.component.scss'],
  providers: [{ provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS }],
})
export class ApplicationComponent {
  applicationForm!: FormGroup;
  today = new Date();
  bannerDetails: any;
  bannerText = 'Application';
  fileTypes: string[] = [FILETYPE.PDF, FILETYPE.MS_WORD_XML, FILETYPE.MS_WORD];
  fileContainer: any = {};
  fileList: any;
  citizenship: any;
  countryList!: any[];
  countryList$!: Observable<any>;
  gender$: Observable<any> = of([
    {
      Id: 2,
      Name: 'Female',
    },
    {
      Id: 1,
      Name: 'Male',
    },
    {
      Id: 3,
      Name: 'Other',
    },
  ]);
  race$: Observable<any> = of([
    {
      Id: 1,
      Name: 'African',
    },
    {
      Id: 2,
      Name: 'Indian',
    },
    {
      Id: 3,
      Name: 'Coloured',
    },
    {
      Id: 4,
      Name: 'White',
    },
    {
      Id: 5,
      Name: 'Other',
    },
  ]);
  idMessage: string = '';
  breadcrumbLinks: any;
  formConfig: any;

  constructor(
    private fb: FormBuilder,
    private careerService: CareerService,
    private dataStoreService: DataStoreService,
    private toasterService: ToastrService,
    private datePipe: DatePipe,
    private router: Router,
    private route: ActivatedRoute,
    private commonStoreService: CommonStoreService
  ) {}

  ngOnInit() {
    this.breadcrumbLinks =
      this.careerService.getJobApplicationRouterLinks('job-application');
    this.applicationForm = this.fb.group({
      IdNumber: [
        '',
        [
          Validators.required,
          Validators.minLength(13),
          Validators.maxLength(13),
          Validators.pattern(PATTERN.NUMERIC.PATTERN),
        ],
      ],
      JobId: [''],
      FirstName: [
        '',
        [
          Validators.required,
          Validators.pattern(PATTERN.NAME_PATTERN),
          Validators.maxLength(100),
        ],
      ],
      LastName: [
        '',
        [
          Validators.required,
          Validators.pattern(PATTERN.NAME_PATTERN),
          Validators.maxLength(100),
        ],
      ],
      Email: [
        '',
        [
          Validators.required,
          Validators.pattern(PATTERN.EMAIL_PATTERN),
          Validators.maxLength(255),
        ],
      ],
      Mobile: [
        '',
        [
          Validators.required,
          Validators.pattern(PATTERN.NUMERIC.PATTERN),
          Validators.minLength(10),
          Validators.maxLength(10),
        ],
      ],
      Dob: [{ value: '', disabled: true }, [Validators.required]],
      Age: [
        { value: '', disabled: true },
        [Validators.required, Validators.pattern(PATTERN.NUMERIC.PATTERN)],
      ],
      Gender: [{ value: null, disabled: true }, [Validators.required]],
      Race: [null, Validators.required],
      Cv: [null, Validators.required],
      Country: [''],
      Citizen: ['', Validators.required],
      PassportNumber: [''],
      Recaptcha: [
        { value: '', disabled: !environment.RECAPTCHA.enabled },
        ,
        Validators.required,
      ],
    });
    this.getBanner();
    this.configureForm();
  }

  async configureForm() {
    this.formConfig = await this.commonStoreService.getFormConfig();
  }

  async getCountries() {
    this.countryList$ = await this.dataStoreService.getCountries();
    this.countryList$.subscribe({
      next: (res: any) => {
        this.countryList = res;
      },
      error: (error: any) => {},
    });
  }

  get cv() {
    return this.applicationForm.get('Cv') as FormControl;
  }

  getBanner() {
    this.careerService
      .getBanner('JOB_PAGE_BANNER')
      .subscribe((res: any) => (this.bannerDetails = res.data.Value));
  }

  citizenChange(event: any, citizenship: number) {
    this.resetForm();
    this.citizenship = citizenship;
    if (this.citizenship == 2) {
      this.getCountries();
      this.applicationForm.get('Dob')?.enable();
      this.applicationForm.get('Age')?.enable();
      this.applicationForm.get('Gender')?.enable();
      this.applicationForm.get('Country')?.setValidators([Validators.required]);
      this.applicationForm
        .get('PassportNumber')
        ?.setValidators([Validators.required]);
      this.applicationForm.updateValueAndValidity();
    } else {
      this.applicationForm.get('Dob')?.disable();
      this.applicationForm.get('Age')?.disable();
      this.applicationForm.get('Gender')?.disable();
      this.applicationForm
        .get('Country')
        ?.removeValidators([Validators.required]);
      this.applicationForm
        .get('PassportNumber')
        ?.removeValidators([Validators.required]);
      this.applicationForm.updateValueAndValidity();
    }
  }

  getPlaceHolder(): any {
    if (this.citizenship == 1) {
      return '';
    } else {
      return 'Please Select';
    }
  }

  getAgePlaceHolder(): any {
    if (this.citizenship == 1) {
      return '';
    } else {
      return 'Please Provide Your Age';
    }
  }

  resetForm() {
    this.applicationForm.get('IdNumber')?.reset();
    this.applicationForm.get('FirstName')?.reset();
    this.applicationForm.get('LastName')?.reset();
    this.applicationForm.get('Dob')?.reset();
    this.applicationForm.get('Age')?.reset();
    this.applicationForm.get('Race')?.reset();
    this.applicationForm.get('Gender')?.reset();
    this.applicationForm.get('Email')?.reset();
    this.applicationForm.get('Mobile')?.reset();
    this.applicationForm.get('PassportNumber')?.reset();
    this.applicationForm.get('Country')?.reset();
    this.fileContainer.Cv = undefined;
  }

  onFileSelect(fileList: any[], type: number) {
    this.fileList = [...fileList];
    if (type == ATTACHMENT_TYPE.CV) {
      if (fileList.length == 0) {
        this.applicationForm.get('Cv')?.setValue(null);
      } else {
        Object.assign(this.fileContainer, { Cv: [...fileList] });
        this.getControl(this.applicationForm, 'Cv')?.setValue(fileList[0]);
      }
    }
  }
  onFileDelete(event: any, type: number) {
    switch (type) {
      case ATTACHMENT_TYPE.CV:
        this.fileContainer.Cv = this.fileContainer.Cv[event] = undefined;
        this.applicationForm.get('Cv')?.setValue(null);
        break;
    }
  }

  get citizen() {
    return this.applicationForm.get('Citizen') as FormControl;
  }

  onChange(event: any) {
    this.idMessage = '';
    if (event.control == 'IdNumber' && event.value?.length == 13) {
      var saIdParser = require('south-african-id-parser');
      var info = saIdParser.validate(event.value);
      if (info == true) {
        this.applicationForm
          .get('Dob')
          ?.setValue(
            event.value.substring(4, 6) +
              '/' +
              event.value.substring(2, 4) +
              '/' +
              event.value.substring(0, 2)
          );
        this.applicationForm
          .get('Age')
          ?.setValue(
            this.getAge(
              event.value.substring(0, 2) +
                '/' +
                event.value.substring(2, 4) +
                '/' +
                event.value.substring(4, 6)
            )
          );
        let gender = event.value.substring(6, 10);
        if (gender >= 0 && gender <= 4999) {
          this.applicationForm.get('Gender')?.setValue(2);
        } else if (gender >= 5000 && gender <= 9999) {
          this.applicationForm.get('Gender')?.setValue(1);
        }
        this.applicationForm.get('Gender')?.disable();
      } else if (event.form.get('IdNumber').errors != null) {
        this.idMessage = '';
      } else {
        this.idMessage = 'Please enter valid Id number';
      }
    }
    this.validateFormField(event);
  }

  calculateDob(date: any) {
    let currentYear = new Date().getFullYear() % 100;
    let [year, month, day] = date.match(/\d\d/g);
    return `${(year <= currentYear ? '20' : '19') + year}-${month}-${day}`;
  }

  getAge(dateString: any) {
    var today = new Date();
    var birthDate = new Date(dateString);
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }

  validateFormField(data: any) {
    let control: FormControl = this.getControl(data.form, data.control);
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
  getControl(form: any, control: string): FormControl {
    return form?.get(control) as FormControl;
  }

  onSubmit(event: any) {
    event.preventDefault();
    this.validateForm();
    if (this.applicationForm.value.Citizen == 2) {
      this.applicationForm?.get('IdNumber')?.clearValidators();
      this.applicationForm?.get('IdNumber')?.updateValueAndValidity();
      this.applicationForm
        ?.get('IdNumber')
        ?.setValue(this.applicationForm.value.PassportNumber);
    }
    if (this.applicationForm.valid) {
      let payload = this.createPayload();
      this.uploadApplication(payload);
    }
  }

  createPayload() {
    let payload = this.applicationForm.getRawValue();
    payload.JobId = this.formConfig.id;
    if (this.citizenship == 2) {
      payload.Dob = this.datePipe.transform(
        this.applicationForm.get('Dob')?.value,
        'yyyy-MM-dd'
      );
    } else {
      payload.Dob = this.calculateDob(payload.IdNumber.substring(0, 6));
    }
    Object.keys(this.fileContainer).forEach((key: string) => {
      if (key == 'Cv') {
        payload[key] = this.fileContainer.Cv[0];
      }
    });
    return payload;
  }

  uploadApplication(payload: any) {
    let data = 'job-application';
    this.careerService.uploadApplicantInfo(payload).subscribe({
      next: (res: any) => {
        this.applicationForm.reset();
        this.toasterService.success(res.message);
        if (res.message == CONSTANTS.ALREADY_APPLIED_JOB_TEXT) {
          this.router.navigate([`${ROUTE.FRONTEND_CAREER_JOB_APPLIED}`]);
        } else {
          // this.router.navigate([`${ROUTE.FRONTEND_CAREER_THANKYOU}`]);
          this.router.navigate([`${ROUTE.FRONTEND_CAREER_THANKYOU}`], {
            relativeTo: this.route,
            state: { data },
          });
        }
      },
      error: (error: any) => {
        error.error.errors
          ? this.displayError(error.error.errors)
          : this.toasterService.error(error.error.message);
      },
    });
  }

  displayError(error: any) {
    if (error) {
      let errors = JSON.parse(error);
      Object.keys(errors).forEach((err: any) => {
        this.toasterService.error(errors[err][0]);
      });
    }
  }

  validateForm() {
    Object.keys(this.applicationForm.controls).forEach((control: any) => {
      this.setControlError(control);
    });
  }
  setControlError(control: string) {
    let formControl = this.getControl(this.applicationForm, control);
    if (this.checkError(control, 'required')) {
      this.applicationForm.get(control)?.setErrors({
        ...formControl.errors,
        invalid: `${this.getControlLabel(control)} `,
      });
    } else if (
      this.checkError(control, 'minlength') ||
      this.checkError(control, 'maxlength')
    ) {
      this.applicationForm.get(control)?.setErrors({
        ...formControl.errors,
        invalid: INPUT_ERROR.NAME_PATTERN,
      });
    }
  }
  checkError(control: string, error: string) {
    return this.applicationForm.get(control)?.hasError(error);
  }

  getControlLabel(control: string) {
    let result: any = Object.values(FRONTEND_JOB_APPLICATION_FORM).find(
      (res: any) => res.NAME == control
    );
    return result ? result.LABEL : control;
  }
  getControlPatternMessage(control: string): any {
    let result: any = Object.values(FRONTEND_JOB_APPLICATION_FORM).find(
      (res: any) => res.NAME == control
    );
    return result
      ? result.PATTERN_MESSAGE
        ? result.PATTERN_MESSAGE
        : `Please provide valid ${control}`
      : `Please provide valid ${control}`;
  }
}
