import { DialogRef } from '@angular/cdk/dialog';
import { Component } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { map, of, Observable } from 'rxjs';
import { PropertyService } from 'src/app/admin/services/property.service';
import {
  ENQUIRY_STATUS_FORM,
  FORM_MODE,
  INPUT_ERROR,
  PATTERN,
  ROUTE,
  SESSION,
} from 'src/app/models/constants';
import { CommonStoreService } from 'src/app/services/common-store.service';
import { EmailDialogComponent } from 'src/app/shared/components/email-dialog/email-dialog.component';

@Component({
  selector: 'app-leads-form',
  templateUrl: './leads-form.component.html',
  styleUrls: ['./leads-form.component.scss'],
})
export class LeadsFormComponent {
  enquiryStatusForm!: FormGroup;
  formMode: any = FORM_MODE;
  formConfig!: any;
  leadId: any;
  leadStatus$: any;
  leadDetails: any;
  userDetails: any;
  categoryList$!: Observable<any>;
  categoryList!: any[];
  unitList$!: Observable<any>;
  unitList!: any[];

  type$: Observable<any> = of([
    {
      id: 1,
      label: 'Web',
    },
    {
      id: 2,
      label: 'Mobile',
    },
    {
      id: 3,
      label: 'Other',
    },
  ]);
  type: any;

  constructor(
    private fb: FormBuilder,
    private commonStoreService: CommonStoreService,
    private propertyService: PropertyService,
    private toasterService: ToastrService,
    private router: Router,
    private dialogRef: MatDialog
  ) {}
  ngOnInit() {
    let user: any = sessionStorage.getItem(SESSION.USER);
    this.userDetails = JSON.parse(user);
    this.setForm();
    this.configureForm();
  }
  setForm() {
    this.enquiryStatusForm = this.fb.group({
      Type: [null, [Validators.required]],
      PropertyId: [null, [Validators.required]],
      //PropertyUnitsId: [null, [Validators.required]],
      Note: ['', [Validators.maxLength(700)]],
      FirstName: [
        '',
        [
          Validators.required,
          Validators.pattern(PATTERN.NAME_PATTERN),
          Validators.maxLength(255),
        ],
      ],
      LastName: [
        '',
        [
          Validators.required,
          Validators.pattern(PATTERN.NAME_PATTERN),
          Validators.maxLength(255),
        ],
      ],
      Email: [
        '',
        [
          Validators.required,
          Validators.pattern(PATTERN.EMAIL_PATTERN),
          Validators.maxLength(100),
        ],
      ],
      Mobile: [
        '',
        [
          Validators.required,
          Validators.pattern(PATTERN.NUMERIC.PATTERN),
          Validators.maxLength(10),
        ],
      ],
      CompanyName: ['', [Validators.required, Validators.maxLength(255)]],
      CompanyDescription: [''],
      Campaign: ['', [Validators.maxLength(255)]],
      Medium: ['', [Validators.maxLength(255)]],
      Source: ['', [Validators.maxLength(255)]],
      Keyword: ['', [Validators.maxLength(255)]],
      AdContent: ['', [Validators.maxLength(255)]],
      LeadStatusId: ['', [Validators.required]],
    });
  }

  onChange(event: any) {
    //this.validateForm(event);
  }

  propertySelect(event: any) {
    this.getUnits(event.PropertyId);
  }

  async getProperties() {
    this.categoryList$ = await this.propertyService.getCategories();
    this.categoryList$.subscribe({
      next: (res: any) => {
        this.categoryList = res.data;
      },
      error: (error: any) => {},
    });
  }

  async getUnits(propertyId: number) {
    this.propertyService
      .getUnits(propertyId)
      .pipe(
        map((res: any) => {
          let arr = [];
          for (const key in res.data) {
            if (res.data.hasOwnProperty(key)) {
              arr.push({ ...res.data[key] });
            }
          }
          this.unitList$ = of(arr);
        })
      )
      .subscribe();
  }

  async configureForm() {
    this.formConfig = await this.commonStoreService.getFormConfig();
    this.leadId = this.formConfig.id;
    switch (this.formConfig.mode) {
      case FORM_MODE.CREATE:
        this.getProperties();
        break;
      case FORM_MODE.RESPOND:
        this.getLeadsStatus();
        this.getLeadDetails(this.leadId);
        break;
      case FORM_MODE.VIEW:
        this.getLeadsStatus();
        this.getLeadDetails(this.leadId);
        break;
      default:
        break;
    }
  }

  getLeadsStatus() {
    this.propertyService
      .getLeadStatus()
      .pipe(
        map((res: any) => {
          let arr = [];
          for (const key in res.data) {
            if (res.data.hasOwnProperty(key)) {
              arr.push({ ...res.data[key] });
            }
          }
          this.leadStatus$ = of(arr);
        })
      )
      .subscribe();
  }

  getLeadDetails(id: any) {
    this.propertyService.getLeadDetails(id).subscribe({
      next: (result: any) => {
        this.leadDetails = result.data;
        if (this.leadDetails.messages.length > 0) {
          this.leadDetails.messages.forEach((element: any) => {
            if (element.UserId == this.userDetails.UserId) {
              element.Name = 'You';
            } else {
              element.Name = element.AddedBy;
            }
          });
        }
        this.fillFormData();
      },
      error: (error: any) => {
        error.error.errors
          ? this.displayError(error.error.errors)
          : this.toasterService.error(error.error.message);
      },
    });
  }

  fillFormData() {
    Object.keys(this.enquiryStatusForm.controls).forEach((control: any) => {
      this.getControl(this.enquiryStatusForm, control)?.setValue(
        this.leadDetails[control]
      );
    });
  }

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

  // if (this.formConfig.mode == FORM_MODE.EDIT)

  onSubmit(event: any) {
    event.preventDefault();
    this.validateForm();
    if (this.enquiryStatusForm.valid) {
      let payload = this.createPayload();
      if (this.formConfig.mode == FORM_MODE.CREATE) {
        this.createLead(payload);
      } else {
        this.updateStatus(payload);
      }
    }
  }

  validateForm() {
    Object.keys(this.enquiryStatusForm.controls).forEach((control: any) => {
      this.setControlError(control);
    });
  }

  checkError(control: string, error: string) {
    return this.enquiryStatusForm.get(control)?.hasError(error);
  }

  setControlError(control: string) {
    if (
      this.checkError(control, 'required') ||
      this.checkError(control, 'matDatepickerParse')
    ) {
      this.enquiryStatusForm.get(control)?.setErrors({
        required: true,
        invalid: `${this.getControlLabel(control)} is required`,
      });
    } else if (this.checkError(control, 'pattern')) {
      if (
        control == ENQUIRY_STATUS_FORM.FIRST_NAME.NAME ||
        control == ENQUIRY_STATUS_FORM.LAST_NAME.NAME
      ) {
        this.enquiryStatusForm.get(control)?.setErrors({
          required: false,
          invalid: INPUT_ERROR.ALPHABETS_PATTERN,
        });
      }
      if (control == ENQUIRY_STATUS_FORM.EMAIL.NAME) {
        this.enquiryStatusForm.get(control)?.setErrors({
          required: false,
          invalid: `${this.getControlLabel(control)} ${
            INPUT_ERROR.EMAIL_PATTERN
          }`,
        });
      }
      if (control == ENQUIRY_STATUS_FORM.MOBILE.NAME) {
        this.enquiryStatusForm.get(control)?.setErrors({
          required: false,
          invalid: INPUT_ERROR.NUMERIC_PATTERM,
        });
      }
    } else if (
      this.checkError(control, 'minlength') ||
      this.checkError(control, 'maxlength')
    ) {
      if (control == ENQUIRY_STATUS_FORM.FIRST_NAME.NAME) {
        this.enquiryStatusForm.get(control)?.setErrors({
          required: false,
          invalid: INPUT_ERROR.NAME_PATTERN,
        });
      }
      if (control == ENQUIRY_STATUS_FORM.MOBILE.NAME) {
        this.enquiryStatusForm.get(control)?.setErrors({
          required: false,
          invalid: INPUT_ERROR.CELL_NUMBER,
        });
      }
      if (control == ENQUIRY_STATUS_FORM.EMAIL.NAME) {
        this.enquiryStatusForm.get(control)?.setErrors({
          required: false,
          invalid: INPUT_ERROR.EMAIL_LENGTH_PATTERN,
        });
      }
      if (control == ENQUIRY_STATUS_FORM.COMPANY_NAME.NAME) {
        this.enquiryStatusForm.get(control)?.setErrors({
          required: false,
          invalid: INPUT_ERROR.NAME_PATTERN,
        });
      }
    }
  }

  getControlLabel(control: string) {
    let result: any = Object.values(ENQUIRY_STATUS_FORM).find(
      (res: any) => res.NAME == control
    );
    return result ? result.LABEL : control;
  }

  createPayload() {
    let payload = this.enquiryStatusForm.value;
    // let payload = {
    //   LeadStatusId: this.enquiryStatusForm.value.LeadStatusId,
    //   Note: this.enquiryStatusForm.value.Note,

    // };
    return payload;
  }

  goToManage() {
    this.router.navigate([ROUTE.MANAGE_LEAD]);
  }

  displayError(error: any) {
    let errors = JSON.parse(error);
    Object.keys(errors).forEach((err: any) => {
      this.toasterService.error(errors[err][0]);
    });
  }

  createLead(payload: any) {
    this.propertyService.createLead(payload).subscribe({
      next: (res) => {
        //this.reset();
        this.toasterService.success(res.message);
        this.goToManage();
      },
      error: (error) => {
        error.error.errors
          ? this.displayError(error.error.errors)
          : this.toasterService.error(error.error.message);
      },
    });
  }

  updateStatus(payload: any) {
    this.propertyService.updateEnquiryStatus(payload, this.leadId).subscribe({
      next: (res: any) => {
        this.toasterService.success(res.message);
      },
      complete: () => {
        this.goToManage();
      },
      error: (error: any) => {
        error.error.errors
          ? this.displayError(error.error.errors)
          : this.toasterService.error(error.error.message);
      },
    });
  }

  respondToLead() {
    const dialogRef = this.dialogRef.open(EmailDialogComponent, {
      data: {
        BuildingName: this.leadDetails.PropertyName,
        Id: this.leadDetails.LeadId,
        Type: 1,
      },
    });
    dialogRef.afterClosed().subscribe((action: any) => {
      if (action === 'send') {
        this.getLeadDetails(this.leadId);
      }
    });
  }
}
