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
import { PeopleService } from 'src/app/admin/services/people.service';
import {
  FORM_MODE,
  ROUTE,
  INPUT_ERROR,
  SESSION,
  PEOPLE_FORM,
  CONSTANTS,
} from 'src/app/models/constants';
import { ATTACHMENT_TYPE, PEOPLE_STATUS } from 'src/app/models/enum';
import { CommonStoreService } from 'src/app/services/common-store.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { LoaderService } from 'src/app/shared/services/loader/loader.service';

@Component({
  selector: 'app-people-form',
  templateUrl: './people-form.component.html',
  styleUrls: ['./people-form.component.scss'],
})
export class PeopleFormComponent {
  formMode: any = FORM_MODE;
  formConfig!: any;
  categoryList$!: Observable<any>;
  categoryList!: any[];
  peopleDetails: any;
  fileList: any[] = [];
  fileContainer: any = {};
  peopleForm!: FormGroup;
  Image!: any[];
  mediaType!: string;
  progressFiles!: any;
  peopleStatus = PEOPLE_STATUS;
  status: any;
  file: any = {};
  type: any;
  defaultImageUrl: string = 'assets/images/image-placeholder.png';
  constructor(
    private fb: FormBuilder,
    private peopleService: PeopleService,
    private loaderService: LoaderService,
    private toasterService: ToastrService,
    private commonStoreService: CommonStoreService,
    private commonService: CommonService,
    private router: Router
  ) {
    // this.type = this.router.url == ROUTE.MANAGE_PEOPLE ? 1 : 2;
  }
  async ngOnInit() {
    this.peopleForm = this.fb.group({
      JobTitle: ['', [Validators.required, Validators.maxLength(100)]],
      EmployeeName: ['', [Validators.required, Validators.maxLength(100)]],
      Image: [null],
      LinkedIn: ['', [Validators.maxLength(255)]],
      Qualification: ['', [Validators.maxLength(255)]],
      Type: [''],
      YearAppointed: [''],
      AppointedDescription: [''],
      CommitteeMembershipDescription: [''],
      ExternalAppointmentsDescription: [''],
      OthersAppointmentsDescription: [''],
      PreviousExperienceDescription: [''],
      Status: [''],
    });
    await this.configureForm();
    this.getYear();
  }

  startYear = new Date().getFullYear();
  range: any = [];

  getYear() {
    var Year = new Date().getFullYear();
    //this.range.push(Year);
    for (var i = 0; i < 50; i++) {
      this.range.push(Year - i);
    }
  }

  get image() {
    return this.peopleForm.get('Image') as FormControl;
  }

  async configureForm() {
    this.formConfig = await this.commonStoreService.getFormConfig();
    this.type = this.formConfig.type;
    switch (this.formConfig.mode) {
      case FORM_MODE.CREATE:
        break;
      case FORM_MODE.EDIT:
        this.getPeopleById(this.formConfig.id);

        break;
      case FORM_MODE.VIEW:
        this.peopleForm.disable();
        this.getPeopleById(this.formConfig.id);

        break;
      default:
        break;
    }
  }
  getPeopleById(id: number) {
    this.loaderService.show();
    this.peopleService.viewPeople(id).subscribe({
      next: (res: any) => {
        this.peopleDetails = res.data;
        this.file.Url = this.peopleDetails.Image;
        this.file.Name = this.peopleDetails.ImageName;
        this.file.CreatedOn = this.peopleDetails.CreatedOn;
        this.fillFormData();
        this.loaderService.hide();
      },
      error: (error: any) => {
        this.loaderService.hide();
        this.toasterService.error(error.error.message);
      },
    });
  }
  editPeople() {
    let formConfig = {
      mode: FORM_MODE.EDIT,
      id: this.formConfig.id,
      type: this.type,
    };
    this.commonStoreService.setFormConfig(formConfig);

    if (this.type == 1) {
      this.router.navigate([`${ROUTE.EDIT_PEOPLE}`]);
    } else {
      this.router.navigate([`${ROUTE.EDIT_LEADERSHIP}`]);
    }
  }
  createPeople(payload: any) {
    this.loaderService.show();
    this.peopleService.createPeople(payload).subscribe({
      next: (res) => {
        this.peopleDetails = res.data;

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

  updatePeople(payload: any) {
    this.loaderService.show();
    this.peopleService
      .updatePeople(payload, this.peopleDetails.InvestorContactsId)
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

  updateStatus(status: any) {
    this.loaderService.show();
    this.peopleService
      .updateStatus(this.peopleDetails.InvestorContactsId, status)
      .subscribe({
        next: (res: any) => {
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
    //event.preventDefault();

    this.validateForm();

    if (this.peopleForm.valid) {
      let payload = this.createPayload();
      if (this.formConfig.mode == FORM_MODE.CREATE) {
        this.createPeople(payload);
      } else if (this.formConfig.mode == FORM_MODE.EDIT) {
        this.updatePeople(payload);
      }
    }
  }

  onSave(status: any) {
    this.peopleForm.value.Status = status;
    switch (status) {
      case PEOPLE_STATUS.PUBLISH:
        this.onSubmit(event);

        break;
      case PEOPLE_STATUS.DRAFT:
        this.onSubmit(event);

        break;
      default:
        break;
    }
  }

  fillFormData() {
    Object.keys(this.peopleForm.controls).forEach((control) => {
      if (control == PEOPLE_FORM.IMAGE.NAME) {
        this.toggleControl(
          control,
          this.peopleDetails.Image == '' || this.peopleDetails.Image == null
        );
      } else if (control == PEOPLE_FORM.YEAR_APPOINTED.Name) {
        if (this.peopleDetails.YearAppointed == null) {
          let a: any = 'Select Year Appointed';
          this.range.push(a);
          //  this.peopleForm.get(control)?.setValue(a);
        } else {
          this.peopleForm.get(control)?.setValue(this.peopleDetails[control]);
        }
      } else {
        this.peopleForm.get(control)?.setValue(this.peopleDetails[control]);
      }
      this.peopleForm.get(control)?.setValue(this.peopleDetails[control]);
    });
  }

  createPayload() {
    let payload = this.peopleForm.value;
    payload.Type = this.type;
    Object.keys(this.fileContainer).forEach((key: string) => {
      if (key == PEOPLE_FORM.IMAGE.NAME) {
        if (this.fileContainer.Image != undefined) {
          payload[key] = this.fileContainer.Image[0];
        } else {
          payload[key] = undefined;
        }
      }
    });
    // this.fileContainer.forEach((file) => {});
    return payload;
  }
  validateForm() {
    Object.keys(this.peopleForm.controls).forEach((control: any) => {
      this.setControlError(control);
    });
  }
  checkError(control: string, error: string) {
    return this.peopleForm.get(control)?.hasError(error);
  }
  setControlError(control: string) {
    let formControl = this.getControl(this.peopleForm, control);
    if (this.checkError(control, 'required')) {
      this.peopleForm.get(control)?.setErrors({
        ...formControl.errors,
        invalid: `${this.getControlLabel(control)} is required`,
      });
    } else if (
      this.checkError(control, 'minlength') ||
      this.checkError(control, 'maxlength')
    ) {
      this.peopleForm.get(control)?.setErrors({
        ...formControl.errors,
        invalid: INPUT_ERROR.NAME_PATTERN,
      });
    }
  }

  onFileSelect(fileList: any[], type: any) {
    this.fileList = [...fileList];

    if (fileList.length == 0) {
      this.peopleForm.get('Image')?.setValue(null);
    } else {
      Object.assign(this.fileContainer, { Image: [...fileList] });

      this.getControl(this.peopleForm, 'Image')?.setValue(fileList[0]);
    }
  }

  onFileDelete(event: any, type: any) {
    switch (type) {
      case ATTACHMENT_TYPE.IMAGE:
        this.fileContainer.Image = this.fileContainer.Image[event] = undefined;
        this.peopleForm.get('Image')?.setValue(null);
        break;
    }
  }

  deleteFile(prop: string) {
    const dialogRef = this.commonService.deleteFileConfirmation();
    dialogRef.afterClosed().subscribe((action: any) => {
      if (action) {
        this.loaderService.show();
        this.peopleService
          .deleteFile(this.peopleDetails.InvestorContactsId)
          .subscribe({
            next: (res: any) => {
              this.peopleDetails[prop] = '';
              this.peopleForm.get(prop)?.setValue(null);
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
      this.peopleForm.get(control)?.enable();
    } else {
      this.peopleForm.get(control)?.disable();
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
    this.peopleForm.reset();
  }
  goToManage(message?: any) {
    sessionStorage.removeItem(SESSION.FORM_CONFIG);
    if (this.type == 1) {
      message != undefined
        ? this.router.navigate([`${ROUTE.MANAGE_PEOPLE}`]).then((m) => {
            this.toasterService.success(message);
          })
        : this.router.navigate([`${ROUTE.MANAGE_PEOPLE}`]);
    } else {
      message != undefined
        ? this.router.navigate([`${ROUTE.MANAGE_LEADERSHIP}`]).then((m) => {
            this.toasterService.success(message);
          })
        : this.router.navigate([`${ROUTE.MANAGE_LEADERSHIP}`]);
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
    let result: any = Object.values(PEOPLE_FORM).find(
      (res: any) => res.NAME == control
    );
    return result ? result.LABEL : control;
  }
  getControlPatternMessage(control: string): any {
    let result: any = Object.values(PEOPLE_FORM).find(
      (res: any) => res.NAME == control
    );
    return result
      ? result.PATTERN_MESSAGE
        ? result.PATTERN_MESSAGE
        : `Please provide valid ${control}`
      : `Please provide valid ${control}`;
  }
}
