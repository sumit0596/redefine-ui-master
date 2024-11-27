import { ActivatedRoute, Router } from '@angular/router';
import { Component } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from '@angular/forms';
import {
  BROKER_FIELDS,
  CONSTANTS,
  FORM_MODE,
  INPUT_ERROR,
  PATTERN,
  ROUTE,
  SESSION,
  USER_FORM,
} from 'src/app/models/constants';
import { LoaderService } from 'src/app/shared/services/loader/loader.service';
import { ToastrService } from 'ngx-toastr';

import { MAT_DATE_FORMATS } from '@angular/material/core';
import { PROPERTY_TYPE, ROLE } from 'src/app/models/enum';
import { Observable, Subject, takeUntil } from 'rxjs';
import { DatePipe } from '@angular/common';
import * as moment from 'moment';
import { CommonStoreService } from 'src/app/services/common-store.service';
import { UserService } from 'src/app/admin/services/user.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { FePropertiesService } from 'src/app/admin/services/fe-properties.service';
import { UserStoreService } from 'src/app/services/user-store.service';

export const MY_DATE_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss'],
  providers: [{ provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS }],
})
export class UserFormComponent {
  /**************************************************************************
   *                             String/Numbers                             *
   **************************************************************************/
  type!: string;
  LastName!: string;
  FirstName!: string;
  placeholder!: string;
  roleId!: number;

  /**************************************************************************
   *                             Object                                     *
   **************************************************************************/
  formConfig: any;
  userDetails: any;
  // provinceId: any;
  today = new Date();
  userForm!: FormGroup;

  /**************************************************************************
   *                             Boolean                                    *
   **************************************************************************/
  fields: boolean = false;
  loader: boolean = false;
  showPassword: boolean = true;

  /**************************************************************************
   *                             List                                       *
   **************************************************************************/

  roleList!: any[];
  // provinceList!: any[];
  sectorList!: any[];
  areaList!: any[];
  personalInterestList!: any[];
  subscriptionPreferenceList!: any[];

  /**************************************************************************
   *                             Observables                                *
   **************************************************************************/
  roleList$!: Observable<any>;
  // provinceList$!: Observable<any>;
  sectorList$!: Observable<any>;
  areaList$!: Observable<any>;
  personalInterestList$!: Observable<any>;
  subscriptionPreferenceList$!: Observable<any>;
  destroySubject: Subject<void> = new Subject<void>();
  userInfo: any;

  constructor(
    private userService: UserService,
    private router: Router,
    private fb: FormBuilder,
    public activatedRoute: ActivatedRoute,
    private loaderService: LoaderService,
    private toasterService: ToastrService,
    private commonStoreService: CommonStoreService,
    private datePipe: DatePipe,
    private commonService: CommonService,
    private feProperties: FePropertiesService,
    private userStore: UserStoreService
  ) {}
  async ngOnInit() {
    this.userForm = this.fb.group({
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
      // Password: [this.generatePassword()],
      // Password_confirmation: [this.generatePassword()],
      CellNumber: [
        '',
        [
          Validators.pattern(PATTERN.NUMERIC_PLUS_SPACE_PATTERN.PATTERN),
          Validators.maxLength(16),
        ],
      ],
      RoleId: [null, Validators.required],
      OfficeNumber: [
        '',
        [
          Validators.required,
          Validators.pattern(PATTERN.NUMERIC_PLUS_SPACE_PATTERN.PATTERN),
          Validators.maxLength(16),
        ],
      ],
      CompanyName: ['', [Validators.required, Validators.maxLength(100)]],
      // ProvinceId: [null, Validators.required],
      Dob: ['', Validators.required],
      Sector: [null, Validators.required],
      Areas: [null, Validators.required],
      PersonalInterest: [null, Validators.required],
      SubscriptionPreferences: [null, Validators.required],
    });
    await this.configureForm();
  }
  get email() {
    return this.userForm.get(USER_FORM.EMAIL.NAME) as FormControl;
  }
  get password() {
    return this.userForm.get(USER_FORM.PASSWORD.NAME) as FormControl;
  }
  get confirmPassword() {
    return this.userForm.get(USER_FORM.CONFIRM_PASSWORD.NAME) as FormControl;
  }
  async configureForm() {
    this.formConfig = await this.commonStoreService.getFormConfig();
    if (this.formConfig) {
      sessionStorage.setItem(
        SESSION.FORM_CONFIG,
        JSON.stringify(this.formConfig)
      );
    } else {
      this.formConfig = JSON.parse(
        sessionStorage.getItem(SESSION.FORM_CONFIG) || 'undefined'
      );
    }
    switch (this.formConfig.mode) {
      case FORM_MODE.CREATE:
        //this.userForm.enable();
        this.getRoles();
        // this.fillFormData();
        break;
      case FORM_MODE.EDIT:
        //this.userForm.enable();
        this.email.disable();
        this.getUserById();
        this.getRoles();
        break;
      case FORM_MODE.VIEW:
        this.userForm.disable();
        this.getUserById();
        this.getRoles();
        // this.getProvinces();
        break;
    }
  }
  getUserById() {
    this.loaderService.show();
    this.userService.getUserById(this.formConfig.id).subscribe({
      next: async (res: any) => {
        this.userDetails = res.data;
        this.roleId = this.userDetails.RoleId;
        if (
          this.formConfig.mode == FORM_MODE.EDIT &&
          this.roleId == ROLE.BROKER
        ) {
          this.loadBrokerDropdowns();
        }
        this.fillFormData();
        this.loaderService.hide();
      },
      complete: () => {},
      error: (error: any) => {
        this.loaderService.hide();
        this.toasterService.error(error.error.message);
      },
    });
  }
  fillFormData() {
    this.toggleFormControls();
    Object.keys(this.userForm.controls).forEach((control: string) => {
      if (control == USER_FORM.DOB.NAME) {
        this.userForm.patchValue({
          Dob: moment(this.userDetails[control], 'DD/MM/YYYY'),
        });
      } else if (
        (control == USER_FORM.PROVINCE_ID.NAME ||
          control == USER_FORM.ROLE_ID.NAME) &&
        this.userDetails[control] == 0
      ) {
        this.userForm.get(control)?.setValue(null);
      } else {
        this.userForm.get(control)?.setValue(this.userDetails[control]);
      }
    });
  }
  toggleFormControls() {
    Object.keys(this.userForm.controls).forEach((control: string) => {
      let formControl = this.userForm.get(control) as FormControl;
      if (
        this.roleId == ROLE.BROKER &&
        BROKER_FIELDS.includes(control) &&
        (this.formConfig.mode == FORM_MODE.CREATE ||
          this.formConfig.mode == FORM_MODE.EDIT)
      ) {
        formControl?.enable();
        formControl?.setValidators([Validators.required]);
        if (
          control == USER_FORM.CELL_NUMBER.NAME ||
          control == USER_FORM.OFFICE_NUMBER.NAME
        ) {
          formControl?.setValidators([
            Validators.required,
            Validators.pattern(PATTERN.NUMERIC_PLUS_SPACE_PATTERN.PATTERN),
            Validators.maxLength(16),
          ]);
          formControl.updateValueAndValidity();
        }
        if (control == USER_FORM.COMPANY_NAME.NAME) {
          formControl?.setValidators([
            Validators.required,
            Validators.maxLength(100),
          ]);
          formControl.updateValueAndValidity();
        }
      } else if (BROKER_FIELDS.includes(control)) {
        formControl.disable();
      }
    });
  }
  async getRoles() {
    this.roleList$ = await this.userService.getRoles();
    this.roleList$.subscribe({
      next: (res: any) => {
        this.roleList = res;
      },
      error: (error: any) => {},
    });
  }
  async getSectors() {
    this.sectorList$ = await this.userService.getSectors(
      PROPERTY_TYPE.SOUTH_AFRICA
    );
    this.sectorList$.subscribe({
      next: (res: any) => {
        this.sectorList = res;
      },
      error: (error: any) => {},
    });
  }
  async getAllAreas() {
    this.areaList$ = await this.feProperties.getSASuburb(1);
    this.areaList$.subscribe({
      next: (res: any) => {
        this.areaList = res;
      },
      error: (error: any) => {},
    });
  }
  async getAllPersonalInterest() {
    this.personalInterestList$ = await this.userService.getPersonalInterests();
    this.personalInterestList$.subscribe({
      next: (res: any) => {
        this.personalInterestList = res;
      },
      error: (error: any) => {},
    });
  }

  async getAllSubscriptionPreferences() {
    this.subscriptionPreferenceList$ =
      await this.userService.getSubscriptionPreferences();
    this.subscriptionPreferenceList$.subscribe({
      next: (res: any) => {
        this.subscriptionPreferenceList = res;
      },
      error: (error: any) => {},
    });
  }
  async onSubmit() {
    let payload: any;
    this.validateForm();
    if (!this.userForm.invalid) {
      payload = await this.createPayload(this.userForm.value);
      if (this.formConfig.mode == FORM_MODE.CREATE) {
        this.createUser(payload);
      } else if (this.formConfig.mode == FORM_MODE.EDIT) {
        this.updateUser(payload);
      }
    }
  }
  createUser(payload: any) {
    this.loaderService.show();
    this.userService.postUserRegister(payload).subscribe({
      next: (res: any) => {
        this.router.navigateByUrl(`${ROUTE.MANAGE_USER}`).then((m) => {
          this.toasterService.success(res.message);
        });
        this.loaderService.hide();
        this.userForm.reset();
      },
      complete: () => {
        this.loaderService.hide();
      },
      error: (error: any) => {
        this.loaderService.hide();
        error.error.errors
          ? this.displayError(error.error.errors)
          : this.toasterService.error(error.error.message);
      },
    });
  }
  async updateUser(payload: any) {
    let userInfo$ = await this.userStore.getUser();
    userInfo$.pipe(takeUntil(this.destroySubject)).subscribe({
      next: (result: any) => {
        this.userInfo = result;
      },
    });
    this.loaderService.show();
    this.userService.editUser(payload, this.formConfig.id).subscribe({
      next: (res: any) => {
        if (res.data.UserId == this.userInfo.UserId) {
          this.userStore.setUser(res.data);
        }
        this.router.navigateByUrl(`${ROUTE.MANAGE_USER}`).then((m) => {
          this.toasterService.success(res.message);
        });
        this.loaderService.hide();
      },
      complete: () => {
        this.loaderService.hide();
      },
      error: (error: any) => {
        this.loaderService.hide();
        error.error.errors
          ? this.displayError(error.error.errors)
          : this.toasterService.error(error.error.message);
      },
    });
  }
  async createPayload(userForm: any): Promise<any> {
    if (this.roleId == ROLE.BROKER) {
      userForm.Sector = this.commonService.changeDataFormat(
        this.userForm.value.Sector,
        CONSTANTS.STRING
      );
      userForm.Areas = this.commonService.changeDataFormat(
        this.userForm.value.Areas,
        CONSTANTS.STRING
      );
      userForm.PersonalInterest = this.commonService.changeDataFormat(
        this.userForm.value.PersonalInterest,
        CONSTANTS.STRING
      );
      userForm.SubscriptionPreferences = this.commonService.changeDataFormat(
        this.userForm.value.SubscriptionPreferences,
        CONSTANTS.STRING
      );
      userForm.Dob = this.datePipe.transform(userForm.Dob, 'dd-MM-yyyy');
    }
    if (this.formConfig.mode == FORM_MODE.EDIT) {
      userForm.Status = this.userDetails.Status;
    }
    return userForm;
  }

  displayError(error: any) {
    let errors = JSON.parse(error);
    Object.keys(errors).forEach((err: any) => {
      this.toasterService.error(errors[err][0]);
    });
  }

  editUser() {
    let formConfig = {
      id: this.formConfig.id,
      mode: FORM_MODE.EDIT,
    };
    this.commonStoreService.setFormConfig(formConfig);
    this.router.navigate([`${ROUTE.EDIT_USER}`]);
  }
  onRoleChange(event: any) {
    this.roleId = event.Id;
    if (this.roleId == ROLE.BROKER) {
      this.loadBrokerDropdowns();
    }
    this.toggleFormControls();
  }

  // onProvinceSelect() {
  //   this.provinceId = this.userForm.value.ProvinceId;
  // }

  validateForm() {
    Object.keys(this.userForm.controls).forEach((control: any) => {
      this.setControlError(control);
    });
  }
  checkError(control: string, error: string) {
    return this.userForm.get(control)?.hasError(error);
  }

  setControlError(control: string) {
    if (
      this.checkError(control, 'required') ||
      this.checkError(control, 'matDatepickerParse')
    ) {
      this.userForm.get(control)?.setErrors({
        required: true,
        invalid: `${this.getControlLabel(control)} is required`,
      });
    } else if (this.checkError(control, 'pattern')) {
      if (
        control == USER_FORM.FIRST_NAME.NAME ||
        control == USER_FORM.LAST_NAME.NAME
      ) {
        this.userForm.get(control)?.setErrors({
          required: false,
          invalid: INPUT_ERROR.ALPHABETS_PATTERN,
        });
      }
      if (control == USER_FORM.EMAIL.NAME) {
        this.userForm.get(control)?.setErrors({
          required: false,
          invalid: `${this.getControlLabel(control)} ${
            INPUT_ERROR.EMAIL_PATTERN
          }`,
        });
      }
      if (
        control == USER_FORM.CELL_NUMBER.NAME ||
        control == USER_FORM.OFFICE_NUMBER.NAME
      ) {
        this.userForm.get(control)?.setErrors({
          required: false,
          invalid: INPUT_ERROR.NUMERIC_MOBILE_PATTERM,
        });
      }
    } else if (
      this.checkError(control, 'minlength') ||
      this.checkError(control, 'maxlength')
    ) {
      if (control == USER_FORM.PASSWORD.NAME) {
        this.userForm.get(control)?.setErrors({
          required: false,
          invalid: `${this.getControlLabel(control)} ${
            INPUT_ERROR.PASSWORD_PATTERN
          }`,
        });
      }
      if (
        control == USER_FORM.FIRST_NAME.NAME ||
        control == USER_FORM.LAST_NAME.NAME
      ) {
        this.userForm.get(control)?.setErrors({
          required: false,
          invalid: INPUT_ERROR.NAME_PATTERN,
        });
      }
      if (
        control == USER_FORM.CELL_NUMBER.NAME ||
        control == USER_FORM.OFFICE_NUMBER.NAME
      ) {
        this.userForm.get(control)?.setErrors({
          required: false,
          invalid: INPUT_ERROR.CELL_NUMBER,
        });
      }
      if (control == USER_FORM.EMAIL.NAME) {
        this.userForm.get(control)?.setErrors({
          required: false,
          invalid: INPUT_ERROR.EMAIL_LENGTH_PATTERN,
        });
      }
      if (control == USER_FORM.COMPANY_NAME.NAME) {
        this.userForm.get(control)?.setErrors({
          required: false,
          invalid: INPUT_ERROR.NAME_PATTERN,
        });
      }
    } else if (control == USER_FORM.CONFIRM_PASSWORD.NAME) {
      if (this.password.value != this.confirmPassword.value) {
        this.userForm.get(control)?.setErrors({
          required: false,
          invalid: `${this.getControlLabel(control)} ${
            INPUT_ERROR.PASSWORD_MISMATCH
          }`,
        });
      }
    }
  }

  /**
   * This method is used to get the label of form control from the forms constant object
   * @param control - form control nam
   * @returns  - label of control
   */
  // getControlLabel(control: string) {
  //   let result: any = Object.values(USER_FORM).find(
  //     (res: any) => res.NAME == control
  //   );
  //   return result ? result.LABEL : control;
  // }
  loadBrokerDropdowns() {
    // this.getProvinces();
    this.getSectors();
    this.getAllAreas();
    this.getAllPersonalInterest();
    this.getAllSubscriptionPreferences();
  }
  cancel() {
    this.router.navigate([`${ROUTE.MANAGE_USER}`]);
  }
  onSelect(event: any) {}

  onDeSelect(event: any) {}

  onSectorSelect(event: any) {}

  onSectorDeSelect(event: any) {}

  onAreaSelect(event: any) {}

  onAreaDeSelect(event: any) {}

  onpersonalInterestSelect(event: any) {}

  personalInterestDeselect(event: any) {}

  onSubscriptionPreferenceSelect(event: any) {}

  onSubscriptionPreferenceDeSelect(event: any) {}

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
    let result: any = Object.values(USER_FORM).find(
      (res: any) => res.NAME == control
    );
    return result ? result.LABEL : control;
  }
  getControlPatternMessage(control: string): any {
    let result: any = Object.values(USER_FORM).find(
      (res: any) => res.NAME == control
    );
    return result
      ? result.PATTERN_MESSAGE
        ? result.PATTERN_MESSAGE
        : `Please provide valid ${control}`
      : `Please provide valid ${control}`;
  }
}
