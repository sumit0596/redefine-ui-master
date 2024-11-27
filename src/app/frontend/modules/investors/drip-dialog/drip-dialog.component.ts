import { Component, Inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Observable, of } from 'rxjs';
import {
  COUNTRIES,
  FRONTEND_DRIP_QUESTIONARY_FORM,
  PATTERN,
  ROUTE,
} from 'src/app/models/constants';
import { CookieService } from 'ngx-cookie-service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonService } from 'src/app/shared/services/common.service';
import { Router } from '@angular/router';
import { SelectModule } from 'src/app/shared/modules/select/select.module';
import { InputModule } from 'src/app/shared/modules/input/input.module';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-drip-dialog',
  standalone: true,
  templateUrl: './drip-dialog.component.html',
  styleUrls: ['./drip-dialog.component.scss'],
  imports: [SelectModule, InputModule, ReactiveFormsModule, CommonModule],
})
export class DripDialogComponent {
  step1: boolean = true;
  step2: boolean = false;
  step3: boolean = false;
  dripFilter!: FormGroup;
  countries$: Observable<any> = of(COUNTRIES);
  accessDenied: boolean = false;
  dripFilterStatus: any;

  constructor(
    private fb: FormBuilder,
    private cookieService: CookieService,
    public dialogRef: MatDialogRef<DripDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private commonService: CommonService,
    private router: Router
  ) {}

  ngOnInit(): any {
    this.dripFilter = this.fb.group({
      PostalCode: [
        null,
        [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(4),
          Validators.pattern(PATTERN.NUMERIC.PATTERN),
        ],
      ],
      Country: [null, [Validators.required]],
      Step2Terms: ['', [Validators.required]],
      Step3Terms: ['', [Validators.required]],
    });
  }

  step2Terms() {
    return this.dripFilter.get('Step2Terms') as FormControl;
  }

  cancel() {
    this.dialogRef.close();
  }

  closeModal() {
    this.dialogRef.close();
  }

  stepChange() {
    this.step1 = true;
    this.step2 = false;
    this.step3 = false;
    this.accessDenied = false;
  }

  onChange(event: any, step: any) {
    this.validateFormField(event);
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
        invalid: `Please enter 4 characters`,
      });
    } else if (control?.hasError('maxlength')) {
      control?.setErrors({
        ...control.errors,
        invalid: `Please enter 4 characters`,
      });
    } else if (control?.hasError('pattern')) {
      control?.setErrors({
        ...control.errors,
        invalid: this.getControlPatternMessage(data.control),
      });
    }
  }

  getControlPatternMessage(control: string): any {
    let result: any = Object.values(FRONTEND_DRIP_QUESTIONARY_FORM).find(
      (res: any) => res.NAME == control
    );
    return result
      ? result.PATTERN_MESSAGE
        ? result.PATTERN_MESSAGE
        : `Please provide valid ${control}`
      : `Please provide valid ${control}`;
  }

  onSubmit(event: any, step: any) {
    event.preventDefault();
    if (step == 'step1') {
      this.dripFilter.get('PostalCode')?.clearValidators();
      this.dripFilter.get('PostalCode')?.updateValueAndValidity();
      this.dripFilter.get('Step2Terms')?.clearValidators();
      this.dripFilter.get('Step2Terms')?.updateValueAndValidity();
      this.dripFilter.get('Step3Terms')?.clearValidators();
      this.dripFilter.get('Step3Terms')?.updateValueAndValidity();
    } else if (step == 'step2') {
      this.dripFilter
        .get('PostalCode')
        ?.addValidators([
          Validators.required,
          Validators.maxLength(4),
          Validators.minLength(4),
          Validators.pattern(PATTERN.NUMERIC.PATTERN),
        ]);
      this.dripFilter.get('PostalCode')?.updateValueAndValidity();
      this.dripFilter.get('Step2Terms')?.addValidators([Validators.required]);
      this.dripFilter.get('Step2Terms')?.updateValueAndValidity();
      this.dripFilter.get('Step3Terms')?.clearValidators();
      this.dripFilter.get('Step3Terms')?.updateValueAndValidity();
    } else if (step == 'step3') {
      this.dripFilter.get('Step3Terms')?.addValidators([Validators.required]);
      this.dripFilter.get('Step3Terms')?.updateValueAndValidity();
    }

    this.validateForm(step);
    if (this.dripFilter.valid && step == 'step1') {
      if (this.dripFilter.value.Country == 162) {
        this.accessDenied = false;
        this.step2 = true;
        this.step3 = false;
        this.step1 = false;
        this.dripFilter
          .get('PostalCode')
          ?.addValidators([
            Validators.required,
            Validators.maxLength(4),
            Validators.minLength(4),
            Validators.pattern(PATTERN.NUMERIC.PATTERN),
          ]);
        this.dripFilter.get('PostalCode')?.updateValueAndValidity();
      } else {
        this.accessDenied = true;
        this.step1 = false;
        this.step2 = false;
        this.step3 = false;
      }
    } else if (this.dripFilter.valid && step == 'step2') {
      this.accessDenied = false;
      this.step1 = false;
      this.step2 = false;
      this.step3 = true;
    } else if (this.dripFilter.valid && step == 'step3') {
      this.cookieService.set('DRIP_FILTER', 'Success', 365);
      if (this.data.page == 'sens-announcement') {
        this.dialogRef.close(ROUTE.SENS_DETAILS + this.data.sens.Slug);
      } else {
        this.dialogRef.close(this.data.Pdf);
        // this.commonService.pdfDownload(this.data.Pdf);
      }
    }
  }

  createPayload() {
    let payload = this.dripFilter.value;
    return payload;
  }

  submit(payload: any) {}

  validateForm(step: any) {
    Object.keys(this.dripFilter.controls).forEach((control: any) => {
      this.setControlError(control, step);
    });
  }
  setControlError(control: string, step: any) {
    let formControl = this.getControl(this.dripFilter, control);
    if (this.checkError(control, 'required')) {
      this.dripFilter.get(control)?.setErrors({
        ...formControl.errors,
        invalid: `${this.getControlLabel(control)} `,
      });
    } else if (
      this.checkError(control, 'minlength') ||
      this.checkError(control, 'maxlength')
    ) {
      this.dripFilter.get(control)?.setErrors({
        required: false,
        invalid: `Please enter 4 characters`,
      });
    }
  }

  checkError(control: string, error: string): any {
    return this.dripFilter.get(control)?.hasError(error);
  }

  getControl(form: any, control: string): FormControl {
    return form?.get(control) as FormControl;
  }

  getControlLabel(control: string) {
    let result: any = Object.values(FRONTEND_DRIP_QUESTIONARY_FORM).find(
      (res: any) => res.NAME == control
    );
    return result ? result.LABEL : control;
  }

  citizenChange(control: any) {
    if (!this.dripFilter.get(control)?.value) {
      this.dripFilter.get(control)?.setValue('');
    }
  }
}
