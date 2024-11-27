import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SensService } from 'src/app/admin/services/sens.service';
import { ContextContainer } from 'src/app/core/context/context-container';
import { ROUTE, SENS_FORM, SESSION } from 'src/app/models/constants';
import { SENS_STATUS } from 'src/app/models/enum';
import { CommonStoreService } from 'src/app/services/common-store.service';
import { LoaderService } from 'src/app/shared/services/loader/loader.service';

@Component({
  selector: 'app-sens-form',
  templateUrl: './sens-form.component.html',
  styleUrls: ['./sens-form.component.scss'],
})
export class SensFormComponent implements OnInit {
  status: any = SENS_STATUS;
  formConfig: any;
  sensForm!: FormGroup;
  sensDetails: any;
  rows!: number;
  payload: any = {
    SeoTitle: '',
    Drip: undefined,
    Status: undefined,
  };
  drip!: number;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private commonStoreService: CommonStoreService,
    private sensService: SensService,
    private loaderService: LoaderService,
    private toasterService: ToastrService
  ) {}

  ngOnInit(): void {
    this.setForm();
    this.configureForm();
  }

  setForm() {
    this.sensForm = this.fb.group({
      SeoTitle: ['', [Validators.maxLength(255)]],
      Headline: [{ value: '', disabled: true }, [Validators.maxLength(255)]],
      Date: [{ value: '', disabled: true }],
      Source: [{ value: '', disabled: true }],
      Announcement: [
        { value: '', disabled: true },
        [Validators.maxLength(30000)],
      ],
    });
  }
  async configureForm() {
    this.formConfig = await this.commonStoreService.getFormConfig();
    this.viewSens(this.formConfig.id);
    // this.loadButtonLabel();
  }

  viewSens(id: number) {
    this.loaderService.show();
    this.sensService.viewSens(id).subscribe({
      next: (res) => {
        this.sensDetails = res.data;
        this.drip = this.sensDetails.Drip;
        this.fillFormData();
        this.loaderService.hide();
      },
      error: (error) => {
        this.loaderService.hide();
        this.toasterService.error(error.error.message);
      },
    });
  }

  fillFormData() {
    Object.keys(this.sensForm.controls).forEach((control) => {
      this.sensForm.get(control)?.setValue(this.sensDetails[control]);
      let announce = this.sensDetails['Announcement'];
      let arr = announce.split('\n');
      this.rows = arr.length;
    });
  }

  goToManage(message? : any) {
    sessionStorage.removeItem(SESSION.FORM_CONFIG);
    (message != undefined)
    ? this.router.navigate([ROUTE.MANAGE_SENS]).then((m) => {
        this.toasterService.success(message);
      })
    : this.router.navigate([ROUTE.MANAGE_SENS]);
  }

  onSwitchToggle(event: any) {
    if (event.checked) {
      this.sensDetails.Drip = true;
      this.drip = 1;
    } else {
      this.sensDetails.Drip = false;
      this.drip = 0;
    }
  }

  createPayload(status: any) {
    this.payload = {
      ...this.payload,
      SeoTitle: this.sensForm.controls['SeoTitle'].value
        ? this.sensForm.controls['SeoTitle'].value
        : this.sensDetails.SeoTitle
        ? this.sensDetails.SeoTitle
        : '',
     // Status: status,
      Drip: this.drip,
    };
    return this.payload;
  }
  updateSens(payload: any) {
    this.loaderService.show();
    this.sensService.updateSens(payload, this.formConfig.id).subscribe({
      next: (res: any) => {
        this.sensForm.reset();
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

  checkError(control: string, error: string) {
    return this.sensForm.get(control)?.hasError(error);
  }

  getControlLabel(control: string) {
    let result: any = Object.values(SENS_FORM).find(
      (res: any) => res.NAME == control
    );
    return result ? result.LABEL : control;
  }

  displayError(error: any) {
    if (error) {
      let errors = JSON.parse(error);
      Object.keys(errors).forEach((err: any) => {
        this.toasterService.error(errors[err][0]);
      });
    }
  }

  // onSave(status: any) {
  //   this.payload = this.createPayload(status);
  //   this.updateSens(this.payload);
  // }

  onSubmit(event: any) {
    this.payload = this.createPayload(event);
    this.updateSens(this.payload);
  }
}
