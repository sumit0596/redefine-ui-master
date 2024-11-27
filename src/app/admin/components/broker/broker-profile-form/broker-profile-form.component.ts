import { Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import {
  CONSTANTS,
  FILETYPE,
  INPUT_ERROR,
  PATTERN,
  SESSION,
  USER_FORM,
} from 'src/app/models/constants';
import { LoaderService } from 'src/app/shared/services/loader/loader.service';
import { UserService } from '../../../services/user.service';
import { UserStoreService } from 'src/app/services/user-store.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { PROPERTY_TYPE } from 'src/app/models/enum';
import { FePropertiesService } from 'src/app/admin/services/fe-properties.service';
import { environment } from 'src/environments/environment.dev';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-broker-profile-form',
  templateUrl: './broker-profile-form.component.html',
  styleUrls: ['./broker-profile-form.component.scss'],
})
export class BrokerProfileFormComponent {
  brokerProfileForm!: FormGroup;
  fileType: any = FILETYPE;
  mediaType!: string;
  selectedFiles!: any[];
  media: any;
  file: any = {};
  userDetails: any;
  personalInterestList$!: Observable<any>;
  personalInterestList!: any[];
  areaList$!: Observable<any>;
  areaList!: any[];
  sectorList$!: Observable<any>;
  sectorList!: any[];
  subscriptionPreferenceList!: any[];
  subscriptionPreferenceList$!: Observable<any>;
  resYear: any ='';
  // provinceList!: any[];
  // provinceList$!: Observable<any>;

  vacancySchedule = [
    { Id: 1, Name: 'Once a day', checked: false },
    { Id: 2, Name: 'Once a week', checked: false },
    { Id: 3, Name: 'Once a month', checked: false },
  ];
  DateOfBirth: any;

  environment: any = environment;

  inputLabel: string = 'Which Suburbs would you like to notified of?';
  dateBroker: any;
  
  constructor(
    private fb: FormBuilder,
    private loaderService: LoaderService,
    private userservice: UserService,
    private toasterService: ToastrService,
    private router: Router,
    private userStore: UserStoreService,
    private commonService: CommonService,
    private feProperties: FePropertiesService,
    public datePipe: DatePipe
  ) { }
  ngOnInit() {
    this.brokerProfileForm = this.fb.group({
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
        { value: '', disabled: true },
        [
          Validators.required,
          Validators.pattern(PATTERN.EMAIL_PATTERN),
          Validators.maxLength(255),
        ],
      ],
      CellNumber: [
        '',
        [
          Validators.pattern(PATTERN.NUMERIC_PLUS_SPACE_PATTERN.PATTERN),
          Validators.maxLength(16),
        ],
      ],
      OfficeNumber: [
        '',
        [
          Validators.required,
          Validators.pattern(PATTERN.NUMERIC_PLUS_SPACE_PATTERN.PATTERN),
          Validators.maxLength(16),
        ],
      ],
      CompanyName: ['', [Validators.required, Validators.maxLength(100)]],
      CompanyAddress: ['', [Validators.maxLength(255)]],
      CompanyMediaId: [''],
      Dob: [{ value: '', disabled: true }, Validators.required],
      Sector: [null, Validators.required],
      Areas: [null, Validators.required],
      PersonalInterest: [null, Validators.required],
      SubscriptionPreferences: [''],
      VacancySchedule: [''],
      Status: [''],
      RoleId: [''],
      // ProvinceId:['']
    });
    this.getUserDetails();
    this.getSectors();
    // this.getProvinces();
    this.getAllAreas();
    this.getAllPersonalInterest();

    this.getAllSubscriptionPreferences();
  }

  async getSectors() {
    this.sectorList$ = await this.userservice.getSectors(
      PROPERTY_TYPE.SOUTH_AFRICA
    );
    this.sectorList$.subscribe({
      next: (res: any) => {
        this.sectorList = res;
        this.sectorList.forEach((sector: any) => {
          sector.checked = false;
        });
      },
      error: (error: any) => { },
    });
  }

  async getAllAreas() {
    this.areaList$ = await this.feProperties.getAllSALocation(1, 1);
    this.areaList$.subscribe({
      next: (res: any) => {
        this.areaList = res;
      },
      error: (error: any) => { },
    });
  }

  async getAllPersonalInterest() {
    this.personalInterestList$ = await this.userservice.getPersonalInterests();
    this.personalInterestList$.subscribe({
      next: (res: any) => {
        this.personalInterestList = res;
      },
      error: (error: any) => { },
    });
  }

  async getAllSubscriptionPreferences() {
    this.subscriptionPreferenceList$ =
      await this.userservice.getSubscriptionPreferences();
    this.subscriptionPreferenceList$.subscribe({
      next: (res: any) => {
        this.subscriptionPreferenceList = res;
      },
      error: (error: any) => { },
    });
  }

  getUserDetails() {
    this.loaderService.show();
    let user: any = sessionStorage.getItem(SESSION.USER);
    this.userservice.getUserById(JSON.parse(user).UserId).subscribe({
      // if(res.data.Dob != null){
      //   this.DateOfBirth = res.data.Dob;
      //   this.userDetails.Dob = this.userDetails.Dob.slice(0,-5).replace('-','/');
      //   }

      next: (res) => {
        this.loaderService.hide();
        this.userDetails = res.data;
        this.fillFormData();
      },
      error: (error) => {
        this.loaderService.hide();
      },
    });
  }

  fillFormData() {
    Object.keys(this.brokerProfileForm.controls).forEach((control: string) => {
      if (control == 'CompanyMediaId') {
        this.file.Url = this.userDetails.CompanyLogoUrl;
        this.file.Name = this.userDetails.CompanyLogoName;
        this.file.CreatedOn = this.userDetails.CompanyLogoCreatedOn;
        this.file.MediaId = this.userDetails.CompanyMediaId;
      } else if (control == 'Dob') {
        if (this.userDetails.Dob) {
          const parts = this.userDetails.Dob.split('-');
          const day = parseInt(parts[0], 10);
          const month = parseInt(parts[1], 10) - 1;
          const year = parseInt(parts[2], 10);
          
          const date = new Date(year, month, day);

          const formattedDate = this.datePipe.transform(date, 'dd-MMMM');
          this.resYear = year;
          this.brokerProfileForm.get(control)?.setValue(formattedDate);
        } else {
          this.brokerProfileForm.get(control)?.setValue(null);
        }
      } else if (control == 'VacancySchedule') {
        this.vacancySchedule.forEach((vacancy: any) => {
          vacancy.checked = vacancy.Id === this.userDetails.VacancySchedule;
        });
      } else {
        this.brokerProfileForm
          .get(control)
          ?.setValue(this.userDetails[control]);
      }
    });
  }

  onFileSelect(fileList: any[], type: string) {
    this.upload(fileList[0]);
  }

  upload(file: any) {
    this.loaderService.show();
    this.userservice.uploadCompanyLogo(file).subscribe({
      next: (res: any) => {
        this.loaderService.hide();
        this.file = {
          Url: res.data.Url,
          Name: res.data.Name,
          MediaId: res.data.MediaId,
          CreatedOn: res.data.CreatedOn,
        };
        this.brokerProfileForm
          .get('CompanyMediaId')
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

  onFileDelete(event: any, type: string, index: number = 0) {
    const dialogRef = this.commonService.deleteFileConfirmation();
    dialogRef.afterClosed().subscribe((action: any) => {
      if (action) {
        this.loaderService.show();
        this.userservice.deleteCompanyLogo(event.MediaId).subscribe({
          next: (res: any) => {
            this.loaderService.hide();
            this.toasterService.success(res.message);
            // this.updateFormFile(type, index);
            this.file = null;
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

  displayError(error: any) {
    let errors = JSON.parse(error);
    Object.keys(errors).forEach((err: any) => {
      this.toasterService.error(errors[err][0]);
    });
  }

  selectVacancySchedule(event: any, preference: any) {
    this.vacancySchedule.forEach((i) => {
      if (i.Id == preference.Id) {
        preference.checked = event.target.checked;
        this.brokerProfileForm.get('VacancySchedule')?.setValue(preference.Id);
      } else {
        i.checked = false;
      }
    });
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
        invalid: `Minimum ${control.getError('minlength')?.requiredLength
          } characters are allowed`,
      });
    } else if (control.hasError('maxlength')) {
      control?.setErrors({
        ...control.errors,
        invalid: `Maximum ${control.getError('maxlength')?.requiredLength
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

  async onSubmit() {
    let payload: any;
    if (this.userDetails.RoleId != 2) {
      this.brokerProfileForm.get('Areas')?.clearValidators();
      this.brokerProfileForm.get('Areas')?.updateValueAndValidity();

      this.brokerProfileForm.get('CompanyName')?.clearValidators();
      this.brokerProfileForm.get('CompanyName')?.updateValueAndValidity();

      this.brokerProfileForm.get('Sector')?.clearValidators();
      this.brokerProfileForm.get('Sector')?.updateValueAndValidity();

      this.brokerProfileForm.get('PersonalInterest')?.clearValidators();
      this.brokerProfileForm.get('PersonalInterest')?.updateValueAndValidity();

      this.brokerProfileForm.get('OfficeNumber')?.clearValidators();
      this.brokerProfileForm.get('OfficeNumber')?.updateValueAndValidity();
    }
    this.validateForm();
    if (!this.brokerProfileForm.invalid) {
      this.brokerProfileForm.value.Status = this.userDetails.Status;
      this.brokerProfileForm.value.RoleId = this.userDetails.RoleId;
      //  this.brokerProfileForm.value.ProvinceId =this.userDetails.ProvinceId;
      if (this.brokerProfileForm.value.CompanyMediaId == 0) {
        this.brokerProfileForm.removeControl('CompanyMediaId');
      }
      if (this.brokerProfileForm.value.VacancySchedule == 0) {
        this.brokerProfileForm.removeControl('VacancySchedule');
      }
      //this.brokerProfileForm.value.Areas = [1, 4, 5, 17, 70]
      payload = await this.createPayload(this.brokerProfileForm.getRawValue());
      this.updateUser(payload);
    }
  }

  validateForm() {
    Object.keys(this.brokerProfileForm.controls).forEach((control: any) => {
      this.setControlError(control);
    });
  }
  checkError(control: string, error: string) {
    return this.brokerProfileForm.get(control)?.hasError(error);
  }

  setControlError(control: string) {
    if (
      this.checkError(control, 'required') ||
      this.checkError(control, 'matDatepickerParse')
    ) {
      this.brokerProfileForm.get(control)?.setErrors({
        required: true,
        invalid: `${this.getControlLabel(control)} is required`,
      });
    } else if (this.checkError(control, 'pattern')) {
      if (
        control == USER_FORM.FIRST_NAME.NAME ||
        control == USER_FORM.LAST_NAME.NAME
      ) {
        this.brokerProfileForm.get(control)?.setErrors({
          required: false,
          invalid: INPUT_ERROR.ALPHABETS_PATTERN,
        });
      }
      if (
        control == USER_FORM.CELL_NUMBER.NAME ||
        control == USER_FORM.OFFICE_NUMBER.NAME
      ) {
        this.brokerProfileForm.get(control)?.setErrors({
          required: false,
          invalid: INPUT_ERROR.NUMERIC_PATTERM,
        });
      }
    } else if (
      this.checkError(control, 'minlength') ||
      this.checkError(control, 'maxlength')
    ) {
      if (
        control == USER_FORM.FIRST_NAME.NAME ||
        control == USER_FORM.LAST_NAME.NAME
      ) {
        this.brokerProfileForm.get(control)?.setErrors({
          required: false,
          invalid: INPUT_ERROR.NAME_PATTERN,
        });
      }
      if (
        control == USER_FORM.CELL_NUMBER.NAME ||
        control == USER_FORM.OFFICE_NUMBER.NAME
      ) {
        this.brokerProfileForm.get(control)?.setErrors({
          required: false,
          invalid: INPUT_ERROR.CELL_NUMBER,
        });
      }
      if (control == USER_FORM.COMPANY_NAME.NAME) {
        this.brokerProfileForm.get(control)?.setErrors({
          required: false,
          invalid: INPUT_ERROR.NAME_PATTERN,
        });
      }
    }
  }

  async createPayload(brokerForm: any): Promise<any> {
    // if (this.roleId == ROLE.BROKER) {
    brokerForm.Sector = this.commonService.changeDataFormat(
      this.brokerProfileForm.value.Sector,
      CONSTANTS.STRING
    );
    brokerForm.Areas = this.commonService.changeDataFormat(
      this.brokerProfileForm.value.Areas,
      CONSTANTS.STRING
    );
    brokerForm.PersonalInterest = this.commonService.changeDataFormat(
      this.brokerProfileForm.value.PersonalInterest,
      CONSTANTS.STRING
    );
    brokerForm.SubscriptionPreferences = this.commonService.changeDataFormat(
      this.brokerProfileForm.value.SubscriptionPreferences,
      CONSTANTS.STRING
    );
    return brokerForm;
  }

  private formatDateToDMY(date: string | Date): string {
    let d: Date;

    if (date instanceof Date) {
      d = date;
    } else {
      const parts = date.split('-');
      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const year = parseInt(parts[2], 10);
      d = new Date(year, month, day);
    }

    const day = ('0' + d.getDate()).slice(-2);
    const month = ('0' + (d.getMonth() + 1)).slice(-2);
    const year = d.getFullYear();

    return `${day}-${month}-${year}`;
  }

  getMonthFromString(mon:any, day:any, year:any){
 
    var d = Date.parse(mon + day+","+year);
    if(!isNaN(d)){
      return new Date(d).getMonth();
 
    }
 
    return -1;
 
  }
  

  updateUser(payload: any) {
    if (payload.Dob) {
      const parts = payload.Dob.split('-');
      if (parts.length === 2) {
        //date is in 'dd-MM' format
        const day = parseInt(parts[0], 10);
        // const month = parseInt(parts[1], 10) - 1;
       // const year = new Date().getFullYear();
        const year = this.resYear;
        const month = this.getMonthFromString(parts[1],day,year);
        const date = new Date(year, month, day);
        payload.Dob = this.formatDateToDMY(date);
      } else if (parts.length === 3) {
        //date is in 'd-m-Y' format
        const day = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1;
        const year = parseInt(parts[2], 10);
        const date = new Date(year, month, day);
        payload.Dob = this.formatDateToDMY(date);
      }
    }

    this.loaderService.show();
    this.userservice.editUser(payload, this.userDetails.UserId).subscribe({
      next: (res: any) => {
        this.toasterService.success(res.message);
        this.loaderService.hide();
        this.userStore.setUser(res.data);
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

  cancel() {
    this.router.navigate(['admin/dashboard']);
  }

  getLocation(data: any) {
    this.brokerProfileForm.controls['Areas'].patchValue(data);
  }
}
