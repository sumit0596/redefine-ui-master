import {
  Form,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
} from '@angular/forms';

export class FormBase {
  form!: FormGroup;
  formConfig: any;

  constructor(public fb: FormBuilder) {}

  validateForm(formConfig?: any) {
    this.formConfig = formConfig;
    this.validateControls(this.form);
  }
  private validateControls(form: FormGroup) {
    Object.keys(form.controls).forEach((control: string) => {
      let formControl = this.getControl(control, form);
      if (formControl instanceof FormControl) {
        this.setControlError(control, form);
      } else if (formControl instanceof FormArray) {
        formControl.controls.forEach((subForm: any) => {
          this.validateControls(subForm);
        });
      }
    });
  }
  setControlError(control: string, form?: FormGroup) {
    let formControl = this.getControl(control, form) as FormControl;
    if (formControl.hasError('required')) {
      formControl.setErrors({
        ...formControl.errors,
        invalid: `${this.getControlLabel(control)} is required`,
      });
    } else if (
      formControl.hasError('minlength') ||
      formControl.hasError('maxlength')
    ) {
      let error = '';
      if (
        formControl.hasError('minlength') &&
        formControl.hasError('maxlength')
      ) {
        error = `${this.getControlLabel(control)} must be between ${
          formControl.getError('minlength')?.requiredLength
        } and ${formControl.getError('maxlength')?.requiredLength} characters.`;
      } else if (formControl.hasError('minlength')) {
        error = `Minimum ${
          formControl.getError('minlength')?.requiredLength
        }  characters are allowed`;
      } else if (formControl.hasError('maxlength')) {
        error = `Maximum ${
          formControl.getError('maxlength')?.requiredLength
        }  characters are allowed`;
      }
      formControl.setErrors({
        ...formControl.errors,
        invalid: error,
      });
    } else if (formControl.hasError('pattern')) {
      formControl.setErrors({
        ...formControl.errors,
        invalid: `${this.getPatternError(control)}`,
      });
    }
  }
  getControl(control: string, form?: FormGroup): any {
    return form ? form.get(control) : this.form.get(control);
  }
  checkError(control: string, error: string, form?: FormGroup) {
    return form
      ? form.get(control)?.hasError(error)
      : this.form.get(control)?.hasError(error);
  }
  getControlLabel(control: string) {
    let result: any = this.formConfig
      ? Object.values(this.formConfig).find((res: any) => res.NAME == control)
      : undefined;
    return result ? result.LABEL : control;
  }
  getPatternError(control: string) {
    let result: any = this.formConfig
      ? Object.values(this.formConfig).find((res: any) => res.NAME == control)
      : undefined;
    return result ? result.PATTERN : control;
  }
}
