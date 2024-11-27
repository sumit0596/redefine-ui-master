import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatTabGroup } from '@angular/material/tabs';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable, of } from 'rxjs';
import { FePropertiesService } from 'src/app/admin/services/fe-properties.service';
import { UserService } from 'src/app/admin/services/user.service';
import { CareerService } from 'src/app/frontend/services/career.service';
import {
  FILETYPE,
  FRONTEND_LEARNERSHIP_APPLICATION_FORM,
  INPUT_ERROR,
  PATTERN,
  ROUTE,
} from 'src/app/models/constants';
import { ATTACHMENT_TYPE } from 'src/app/models/enum';
import { DataStoreService } from 'src/app/shared/services/data-store.service';
import { MAT_DATE_FORMATS } from '@angular/material/core';
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
  selector: 'app-learnership-application-form',
  templateUrl: './learnership-application-form.component.html',
  styleUrls: ['./learnership-application-form.component.scss'],
  providers: [{ provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS }],
})
export class LearnershipApplicationFormComponent {
  step1: boolean = false;
  step2: boolean = true;
  step3: boolean = true;

  bannerDetails: any;
  learnershipFormStep1!: FormGroup;
  learnershipFormStep2!: FormGroup;
  learnershipFormStep3!: FormGroup;
  today = new Date();
  fileTypes: string[] = [FILETYPE.PDF, FILETYPE.MS_WORD_XML, FILETYPE.MS_WORD];
  idDocumentFileTypes: string[] = [
    FILETYPE.PDF,
    FILETYPE.IMAGE_PNG,
    FILETYPE.IMAGE_JPEG,
  ];
  educationalDocumentTypes: string[] = [FILETYPE.PDF, FILETYPE.IMAGE_JPEG];
  fileContainer: any = {};
  fileList: any;
  citizenship: any;
  countryList!: any[];
  countryList$!: Observable<any>;
  qualificationsList!: any[];
  qualificationsList$!: Observable<any>;
  title$: Observable<any> = of([
    {
      Id: 1,
      Name: 'Mr',
    },
    {
      Id: 2,
      Name: 'Mrs',
    },
    {
      Id: 3,
      Name: 'Ms',
    },
  ]);
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
  provinceList!: any[];
  provinceList$!: Observable<any>;
  cityList!: any[];
  cityList$!: Observable<any>;
  suburbList!: any[];
  suburbList$!: Observable<any>;
  learnerShipId: any;
  breadcrumbLinks: any;
  bannerText = 'Application';

  constructor(
    private careerService: CareerService,
    private fb: FormBuilder,
    private dataStoreService: DataStoreService,
    private toasterService: ToastrService,
    private datePipe: DatePipe,
    private router: Router,
    private userService: UserService,
    private feproperties: FePropertiesService,
    private route: ActivatedRoute
  ) {
    this.initializeForm();
  }

  ngOnInit() {
    this.breadcrumbLinks = this.careerService.getJobApplicationRouterLinks(
      'learnership-application'
    );
    this.getBanner();
    this.getProvinces();
    this.getEducationalQualifications();
  }

  initializeForm() {
    this.learnershipFormStep1 = this.fb.group({
      IdNumber: [
        '',
        [
          Validators.required,
          Validators.minLength(13),
          Validators.maxLength(13),
          Validators.pattern(PATTERN.NUMERIC.PATTERN),
        ],
      ],
      // JobId: [''],
      Title: [null, [Validators.required]],
      Initials: ['', [Validators.required, Validators.maxLength(100)]],
      FirstName: [
        '',
        [
          Validators.required,
          Validators.pattern(PATTERN.NAME_PATTERN),
          Validators.maxLength(100),
        ],
      ],
      Surname: [
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
      EmailConfirmation: [
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
          Validators.maxLength(10),
          Validators.minLength(10),
        ],
      ],
      AlternativeMobile: [
        '',
        [
          Validators.pattern(PATTERN.NUMERIC.PATTERN),
          Validators.minLength(10),
          Validators.maxLength(10),
        ],
      ],
      DOB: [{ value: '', disabled: true }, [Validators.required]],
      Age: [
        { value: '', disabled: true },
        [Validators.required, Validators.pattern(PATTERN.NUMERIC.PATTERN)],
      ],
      Gender: [{ value: null, disabled: true }, [Validators.required]],
      Race: [null, Validators.required],
      Country: [''],
      SouthAfricanCitizen: ['', Validators.required],
      Disability: ['', Validators.required],
      DisabilityComment: [''],
      CriminalOffences: ['', Validators.required],
      CriminalOffencesComment: [''],
      OtherLearnerShip: ['', Validators.required],
      OtherLearnerShipMessage: [''],
      PassportNumber: [''],
      Recaptcha: [
        { value: '', disabled: !environment.RECAPTCHA.enabled },
        Validators.required,
      ],
    });

    this.learnershipFormStep2 = this.fb.group({
      Street1: ['', [Validators.required, Validators.maxLength(255)]],
      Street2: ['', [Validators.required, Validators.maxLength(255)]],
      Suburb: [null, [Validators.required]],
      City: [null, [Validators.required]],
      Province: [null, [Validators.required]],
      PostalCode: [
        '',
        [
          Validators.required,
          Validators.maxLength(4),
          Validators.pattern(PATTERN.NUMERIC.PATTERN),
        ],
      ],
      Relocate: ['', [Validators.required]],
    });

    this.learnershipFormStep3 = this.fb.group({
      HighestQualificationId: [null, [Validators.required]],
      QualificationSpecialisation: [
        '',
        [Validators.required, Validators.maxLength(255)],
      ],
      CurrentlyStudying: ['', [Validators.required, Validators.maxLength(255)]],
      StudyingTowards: [''],
      IdDocument: [null, Validators.required],
      Cv: [null, Validators.required],
      QualificationCertificate: [null, Validators.required],
      Motivation: [null, Validators.required],
    });
  }

  async getProvinces() {
    this.provinceList$ = await this.userService.getProvinces();
    this.provinceList$.subscribe({
      next: (res: any) => {
        this.provinceList = res;
      },
      error: (error: any) => {},
    });
  }

  async getCity(provinceId: number) {
    this.cityList$ = await this.feproperties.getCity(provinceId);
    this.cityList$.subscribe({
      next: (res: any) => {
        this.cityList = res;
      },
      error: (error: any) => {},
    });
  }

  async getSuburb(cityId: number) {
    this.suburbList$ = await this.feproperties.getSuburb(cityId);
    this.suburbList$.subscribe({
      next: (res: any) => {
        this.suburbList = res;
      },
      error: (error: any) => {},
    });
  }

  async getEducationalQualifications() {
    this.qualificationsList$ =
      await this.careerService.getEducationalQualifications();
    this.qualificationsList$.subscribe({
      next: (res: any) => {
        this.qualificationsList = res;
      },
      error: (error: any) => {},
    });
  }

  getBanner() {
    this.careerService
      .getBanner('LEARNERSHIP_PAGE_BANNER')
      .subscribe((res: any) => (this.bannerDetails = res.data.Value));
  }

  getPlaceHolder(): any {
    if (this.citizenship == 1) {
      return '';
    } else {
      return 'Please Slect';
    }
  }

  getAgePlaceHolder(): any {
    if (this.citizenship == 1) {
      return '';
    } else {
      return 'Please Provide Your Age';
    }
  }

  onFileSelect(fileList: any[], type: number) {
    this.fileList = [...fileList];
    if (type == ATTACHMENT_TYPE.CV) {
      if (fileList.length == 0) {
        this.learnershipFormStep3.get('Cv')?.setValue(null);
      } else {
        Object.assign(this.fileContainer, { Cv: [...fileList] });
        this.getControl(this.learnershipFormStep3, 'Cv')?.setValue(fileList[0]);
      }
    }
    if (type == ATTACHMENT_TYPE.ID_DOCUMENT) {
      if (fileList.length == 0) {
        this.learnershipFormStep3.get('IdDocument')?.setValue(null);
      } else {
        Object.assign(this.fileContainer, { IdDocument: [...fileList] });
        this.getControl(this.learnershipFormStep3, 'IdDocument')?.setValue(
          fileList[0]
        );
      }
    }
    if (type == ATTACHMENT_TYPE.EDUCATIONAL_CERTIFICATE) {
      if (fileList.length == 0) {
        this.learnershipFormStep3
          .get('QualificationCertificate')
          ?.setValue(null);
      } else {
        Object.assign(this.fileContainer, {
          QualificationCertificate: [...fileList],
        });
        this.getControl(
          this.learnershipFormStep3,
          'QualificationCertificate'
        )?.setValue(fileList[0]);
      }
    }
    if (type == ATTACHMENT_TYPE.MOTIVATION) {
      if (fileList.length == 0) {
        this.learnershipFormStep3.get('Motivation')?.setValue(null);
      } else {
        Object.assign(this.fileContainer, { Motivation: [...fileList] });
        this.getControl(this.learnershipFormStep3, 'Motivation')?.setValue(
          fileList[0]
        );
      }
    }
  }
  onFileDelete(event: any, type: number) {
    switch (type) {
      case ATTACHMENT_TYPE.CV:
        this.fileContainer.Cv = this.fileContainer.Cv[event] = undefined;
        this.learnershipFormStep3.get('Cv')?.setValue(null);
        break;

      case ATTACHMENT_TYPE.ID_DOCUMENT:
        this.fileContainer.IdDocument = this.fileContainer.IdDocument[event] =
          undefined;
        this.learnershipFormStep3.get('IdDocument')?.setValue(null);
        break;

      case ATTACHMENT_TYPE.EDUCATIONAL_CERTIFICATE:
        this.fileContainer.QualificationCertificate =
          this.fileContainer.QualificationCertificate[event] = undefined;
        this.learnershipFormStep3
          .get('QualificationCertificate')
          ?.setValue(null);
        break;
      case ATTACHMENT_TYPE.MOTIVATION:
        this.fileContainer.Motivation = this.fileContainer.Motivation[event] =
          undefined;
        this.learnershipFormStep3.get('Motivation')?.setValue(null);
        break;
    }
  }

  resetForm() {
    this.learnershipFormStep1.get('IdNumber')?.reset();
    this.learnershipFormStep1.get('FirstName')?.reset();
    this.learnershipFormStep1.get('Surname')?.reset();
    this.learnershipFormStep1.get('DOB')?.reset();
    this.learnershipFormStep1.get('Age')?.reset();
    this.learnershipFormStep1.get('Race')?.reset();
    this.learnershipFormStep1.get('Gender')?.reset();
    this.learnershipFormStep1.get('Email')?.reset();
    this.learnershipFormStep1.get('EmailConfirmation')?.reset();
    this.learnershipFormStep1.get('Mobile')?.reset();
    this.learnershipFormStep1.get('AlternativeMobile')?.reset();
    this.learnershipFormStep1.get('PassportNumber')?.reset();
    this.learnershipFormStep1.get('Country')?.reset();
    this.learnershipFormStep1.get('Title')?.reset();
    this.learnershipFormStep1.get('Initials')?.reset();
    this.learnershipFormStep1.get('DisabilityComment')?.reset();
    this.learnershipFormStep1.get('CriminalOffencesComment')?.reset();
    this.learnershipFormStep1.get('OtherLearnerShipMessage')?.reset();
  }

  citizenChange(event: any, citizenship: number) {
    this.resetForm();
    this.citizenship = citizenship;
    if (this.citizenship == 2) {
      this.getCountries();
      this.learnershipFormStep1?.get('DOB')?.enable();
      this.learnershipFormStep1?.get('Age')?.enable();
      this.learnershipFormStep1?.get('Gender')?.enable();
      this.learnershipFormStep1
        ?.get('Country')
        ?.setValidators([Validators.required]);
      this.learnershipFormStep1
        ?.get('PassportNumber')
        ?.setValidators([Validators.required]);
      this.learnershipFormStep1?.updateValueAndValidity();
    } else {
      this.learnershipFormStep1?.get('DOB')?.disable();
      this.learnershipFormStep1?.get('Age')?.disable();
      this.learnershipFormStep1?.get('Gender')?.disable();
      this.learnershipFormStep1
        ?.get('Country')
        ?.removeValidators([Validators.required]);
      this.learnershipFormStep1
        ?.get('PassportNumber')
        ?.removeValidators([Validators.required]);
      this.learnershipFormStep1?.updateValueAndValidity();
    }
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

  get citizen() {
    return this.learnershipFormStep1?.get('SouthAfricanCitizen') as FormControl;
  }
  get disability() {
    return this.learnershipFormStep1?.get('Disability') as FormControl;
  }
  get criminalOffences() {
    return this.learnershipFormStep1?.get('CriminalOffences') as FormControl;
  }

  get otherLearnership() {
    return this.learnershipFormStep1?.get('OtherLearnerShip') as FormControl;
  }

  get relocate() {
    return this.learnershipFormStep2?.get('Relocate') as FormControl;
  }

  get currentlyStudying() {
    return this.learnershipFormStep3?.get('CurrentlyStudying') as FormControl;
  }

  disabilityChange(event: any, disability: number) {
    if (disability == 1) {
      this.learnershipFormStep1
        ?.get('DisabilityComment')
        ?.addValidators([Validators.required]);
    } else {
      this.learnershipFormStep1?.get('DisabilityComment')?.clearValidators();
    }
    this.learnershipFormStep1
      ?.get('DisabilityComment')
      ?.updateValueAndValidity();
  }

  criminalOffenceChange(event: any, criminalOffences: number) {
    if (criminalOffences == 1) {
      this.learnershipFormStep1
        ?.get('CriminalOffencesComment')
        ?.addValidators([Validators.required]);
    } else {
      this.learnershipFormStep1
        ?.get('CriminalOffencesComment')
        ?.clearValidators();
    }
    this.learnershipFormStep1
      ?.get('CriminalOffencesComment')
      ?.updateValueAndValidity();
  }

  learnershipProgrammeChange(event: any, learnershipProgramme: number) {
    if (learnershipProgramme == 1) {
      this.learnershipFormStep1
        ?.get('OtherLearnerShipMessage')
        ?.addValidators([Validators.required]);
    } else {
      this.learnershipFormStep1
        ?.get('OtherLearnerShipMessage')
        ?.clearValidators();
    }
    this.learnershipFormStep1
      ?.get('OtherLearnerShipMessage')
      ?.updateValueAndValidity();
  }

  currentlyStudyingChange(event: any, currentlyStudying: number) {
    if (currentlyStudying == 1) {
      this.learnershipFormStep3
        ?.get('StudyingTowards')
        ?.addValidators([Validators.required]);
    } else {
      this.learnershipFormStep3?.get('StudyingTowards')?.clearValidators();
    }
    this.learnershipFormStep3?.get('StudyingTowards')?.updateValueAndValidity();
  }

  onChange(event: any) {
    this.idMessage = '';
    if (event.control == 'IdNumber' && event.value?.length == 13) {
      var saIdParser = require('south-african-id-parser');
      var info = saIdParser.validate(event.value);
      if (info == true) {
        this.learnershipFormStep1
          .get('DOB')
          ?.setValue(
            event.value.substring(4, 6) +
              '/' +
              event.value.substring(2, 4) +
              '/' +
              event.value.substring(0, 2)
          );
        this.learnershipFormStep1
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
          this.learnershipFormStep1.get('Gender')?.setValue(2);
        } else if (gender >= 5000 && gender <= 9999) {
          this.learnershipFormStep1.get('Gender')?.setValue(1);
        }
        this.learnershipFormStep1.get('Gender')?.disable();
      } else if (event.form.get('IdNumber').errors != null) {
        this.idMessage = '';
      } else {
        this.idMessage = 'Please enter valid Id number';
      }
    } else if (event.control == 'EmailConfirmation') {
      if (this.learnershipFormStep1.get('EmailConfirmation')?.value == '') {
        this.learnershipFormStep1.get(event.control)?.setErrors({
          required: true,
          // invalid: `Confirmation Email is required`,
        });
      } else if (
        this.learnershipFormStep1.get('Email')?.value != '' &&
        this.learnershipFormStep1.get('Email')?.value !=
          this.learnershipFormStep1.get('EmailConfirmation')?.value
      ) {
        this.learnershipFormStep1.get(event.control)?.setErrors({
          required: false,
          invalid: `Confirmation Email ${INPUT_ERROR.EMAIL_MISMATCH}`,
        });
      } else if (
        this.learnershipFormStep1.get('Email')?.value ==
        this.learnershipFormStep1.get('EmailConfirmation')?.value
      ) {
        this.learnershipFormStep1.get('Email')?.setErrors(null);
        this.learnershipFormStep1.get('EmailConfirmation')?.setErrors(null);
      }
    } else if (event.control == 'Email') {
      if (this.learnershipFormStep1.get('Email')?.value == '') {
        this.learnershipFormStep1.get(event.control)?.setErrors({
          required: true,
          // invalid: `Confirmation Email is required`,
        });
      } else if (
        this.learnershipFormStep1.get('EmailConfirmation')?.value != '' &&
        this.learnershipFormStep1.get('Email')?.value !=
          this.learnershipFormStep1.get('EmailConfirmation')?.value
      ) {
        this.learnershipFormStep1.get(event.control)?.setErrors({
          required: false,
          invalid: `Email ${INPUT_ERROR.CONFIRMATION_EMAIL_MISMATCH}`,
        });
      } else if (
        this.learnershipFormStep1.get('Email')?.value ==
        this.learnershipFormStep1.get('EmailConfirmation')?.value
      ) {
        this.learnershipFormStep1.get('EmailConfirmation')?.setErrors(null);
        this.learnershipFormStep1.get('Email')?.setErrors(null);
      }
      // else {
      //   this.learnershipFormStep1.get(event.control)?.setErrors(null);
      // }
    }

    this.validateFormField(event);
  }

  getAge(dateString: any): any {
    var today = new Date();
    var birthDate = new Date(dateString);
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    if (age) {
      this.learnershipFormStep1.get('Age')?.disable();
      return age;
    } else {
      this.learnershipFormStep1.get('Age')?.enable();
    }
  }

  validateFormField(data: any) {
    let control: FormControl = this.getControl(data.form, data.control);
    if (control?.hasError('required')) {
      control?.setErrors({
        ...control.errors,
        invalid: `${this.getControlLabel(data.control)}`,
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
    let result: any = Object.values(FRONTEND_LEARNERSHIP_APPLICATION_FORM).find(
      (res: any) => res.NAME == control
    );
    return result ? result.LABEL : control;
  }

  getControl(form: any, control: string): FormControl {
    return form?.get(control) as FormControl;
  }

  getControlPatternMessage(control: string): any {
    let result: any = Object.values(FRONTEND_LEARNERSHIP_APPLICATION_FORM).find(
      (res: any) => res.NAME == control
    );
    return result
      ? result.PATTERN_MESSAGE
        ? result.PATTERN_MESSAGE
        : `Please provide valid ${control}`
      : `Please provide valid ${control}`;
  }

  onTabChange(event: any) {}

  onSubmit(event: any, step: any, tabgroup: any) {
    if (step == 'step1') {
      event.preventDefault();
      this.validateForm(step);
      if (this.learnershipFormStep1.get('SouthAfricanCitizen')?.value == 2) {
        this.learnershipFormStep1?.get('IdNumber')?.clearValidators();
        this.learnershipFormStep1?.get('IdNumber')?.updateValueAndValidity();
        this.learnershipFormStep1
          ?.get('IdNumber')
          ?.setValue(this.learnershipFormStep1.value.PassportNumber);
      }
      if (this.learnershipFormStep1.valid) {
        let payload = this.createPayload(step);
        this.uploadApplication(payload, tabgroup);
      }
    } else if (step == 'step2') {
      event.preventDefault();
      this.validateForm(step);
      if (this.learnershipFormStep2.valid) {
        let payload = this.createPayload(step);
        this.uploadApplicationStep2(payload, tabgroup);
      }
    } else if (step == 'step3') {
      event.preventDefault();
      this.validateForm(step);
      if (this.learnershipFormStep3.valid) {
        let payload = this.createPayload(step);
        this.uploadApplicationStep3(payload, tabgroup);
      }
    }
  }

  calculateDob(date: any) {
    let currentYear = new Date().getFullYear() % 100;
    let [year, month, day] = date.match(/\d\d/g);
    return `${(year <= currentYear ? '20' : '19') + year}-${month}-${day}`;
  }

  createPayload(step: any) {
    if (step == 'step1') {
      let payload = this.learnershipFormStep1.getRawValue();
      if (this.citizenship == 2) {
        payload.DOB = this.datePipe.transform(
          this.learnershipFormStep1.get('DOB')?.value,
          'yyyy-MM-dd'
        );
      } else {
        payload.DOB = this.calculateDob(payload.IdNumber.substring(0, 6));
      }
      return payload;
    } else if (step == 'step2') {
      let payload = this.learnershipFormStep2.value;
      return payload;
    } else if (step == 'step3') {
      let payload = this.learnershipFormStep3.value;
      Object.keys(this.fileContainer).forEach((key: string) => {
        if (key == 'Cv') {
          payload[key] = this.fileContainer.Cv[0];
        }
      });
      Object.keys(this.fileContainer).forEach((key: string) => {
        if (key == 'QualificationCertificate') {
          payload[key] = this.fileContainer.QualificationCertificate[0];
        }
      });
      Object.keys(this.fileContainer).forEach((key: string) => {
        if (key == 'IdDocument') {
          payload[key] = this.fileContainer.IdDocument[0];
        }
      });
      Object.keys(this.fileContainer).forEach((key: string) => {
        if (key == 'Motivation') {
          payload[key] = this.fileContainer.Motivation[0];
        }
      });
      return payload;
    }
  }

  uploadApplication(payload: any, tabgroup: MatTabGroup) {
    this.careerService.uploadLearnershipApplicantInfoStep1(payload).subscribe({
      next: (res: any) => {
        this.learnerShipId = res.data.LearnerShipId;
        this.learnershipFormStep1.reset();
        this.toasterService.success(res.message);
        this.changeIndex(tabgroup, 1);
        this.step1 = true;
        this.step2 = false;
        this.step3 = true;
      },
      error: (error: any) => {
        error.error.errors
          ? this.displayError(error.error.errors)
          : this.toasterService.error(error.error.message);
      },
    });
  }

  uploadApplicationStep2(payload: any, tabgroup: MatTabGroup) {
    this.careerService
      .uploadLearnershipApplicantInfoStep2(payload, this.learnerShipId)
      .subscribe({
        next: (res: any) => {
          this.learnershipFormStep2.reset();
          this.toasterService.success(res.message);
          this.changeIndex(tabgroup, 2);
          this.step1 = true;
          this.step2 = true;
          this.step3 = false;
        },
        error: (error: any) => {
          error.error.errors
            ? this.displayError(error.error.errors)
            : this.toasterService.error(error.error.message);
        },
      });
  }

  uploadApplicationStep3(payload: any, tabgroup: MatTabGroup) {
    let data = 'learnership-application';
    this.careerService
      .uploadLearnershipApplicantInfoStep3(payload, this.learnerShipId)
      .subscribe({
        next: (res: any) => {
          this.learnershipFormStep3.reset();
          this.toasterService.success(res.message);
          // this.router.navigate([`${ROUTE.FRONTEND_CAREER_THANKYOU}`], {
          //   relativeTo: this.route,
          //   state: { data },
          // });
          this.router.navigate([`${ROUTE.FRONTEND_CAREER_THANKYOU}`], {
            state: {
              message: '',
              prevRoute: this.router.url,
            },
          });
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

  validateForm(step: any) {
    if (step == 'step1') {
      Object.keys(this.learnershipFormStep1.controls).forEach(
        (control: any) => {
          this.setControlError(control, step);
        }
      );
    } else if (step == 'step2') {
      Object.keys(this.learnershipFormStep2.controls).forEach(
        (control: any) => {
          this.setControlError(control, step);
        }
      );
    } else if (step == 'step3') {
      Object.keys(this.learnershipFormStep3.controls).forEach(
        (control: any) => {
          this.setControlError(control, step);
        }
      );
    }
  }
  setControlError(control: string, step: any) {
    if (step == 'step1') {
      let formControl = this.getControl(this.learnershipFormStep1, control);
      if (this.checkError(control, 'required', 'step1')) {
        this.learnershipFormStep1.get(control)?.setErrors({
          ...formControl.errors,
          invalid: `${this.getControlLabel(control)} `,
        });
      } else if (
        this.checkError(control, 'minlength', 'step1') ||
        this.checkError(control, 'maxlength', 'step1')
      ) {
        this.learnershipFormStep1.get(control)?.setErrors({
          ...formControl.errors,
          invalid: INPUT_ERROR.NAME_PATTERN,
        });
      }
    } else if (step == 'step2') {
      let formControl = this.getControl(this.learnershipFormStep2, control);
      if (this.checkError(control, 'required', 'step2')) {
        this.learnershipFormStep2.get(control)?.setErrors({
          ...formControl.errors,
          invalid: `${this.getControlLabel(control)} `,
        });
      } else if (
        this.checkError(control, 'minlength', 'step2') ||
        this.checkError(control, 'maxlength', 'step2')
      ) {
        this.learnershipFormStep2.get(control)?.setErrors({
          ...formControl.errors,
          invalid: INPUT_ERROR.NAME_PATTERN,
        });
      }
    }
    if (step == 'step3') {
      let formControl = this.getControl(this.learnershipFormStep3, control);
      if (this.checkError(control, 'required', 'step3')) {
        this.learnershipFormStep3.get(control)?.setErrors({
          ...formControl.errors,
          invalid: `${this.getControlLabel(control)}`,
        });
      } else if (
        this.checkError(control, 'minlength', 'step3') ||
        this.checkError(control, 'maxlength', 'step3')
      ) {
        this.learnershipFormStep3.get(control)?.setErrors({
          ...formControl.errors,
          invalid: INPUT_ERROR.NAME_PATTERN,
        });
      }
    }
  }
  checkError(control: string, error: string, step: any): any {
    if (step == 'step1') {
      return this.learnershipFormStep1.get(control)?.hasError(error);
    } else if (step == 'step2') {
      return this.learnershipFormStep2.get(control)?.hasError(error);
    } else if (step == 'step3') {
      return this.learnershipFormStep3.get(control)?.hasError(error);
    }
  }

  provinceSelect(event: any) {
    this.getCity(event.Id);
  }

  citySelect(event: any) {
    this.getSuburb(event.Id);
  }

  changeIndex(tabgroup: MatTabGroup, number: number) {
    tabgroup.selectedIndex = number;
    window.scroll(0, 500);
  }
}
