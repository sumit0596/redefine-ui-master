import { ValidatorFn } from '@angular/forms';
import { AbstractControl, ValidationErrors } from '@angular/forms';
import { PATTERN } from 'src/app/models/constants';

export class CustomValidator {
  constructor() {}
  static permissionValidator(
    control: AbstractControl
  ): ValidationErrors | null {
    let data = [...control.value].some((p) => {
      return p.SubPermission.some(
        (subPermission: any) => subPermission.Checked
      );
    });
    if (!data) {
      return { permissionLength: { actual: 0, expected: 1 } };
    }
    return null;
  }
  static passwordPolicy(username: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      let isValid = null;
      let password: string = control.value;
      isValid =
        RegExp(PATTERN.PASSWORD_POLICY.PATTERN1).test(password) &&
        RegExp(PATTERN.PASSWORD_POLICY.PATTERN2).test(password) &&
        RegExp(PATTERN.PASSWORD_POLICY.PATTERN3).test(password.toLowerCase()) &&
        this.checkUsernameAvailability(
          password?.toLowerCase(),
          username?.toLowerCase()
        );
      return isValid ? null : { policyMatch: !isValid };
    };
  }
  private static checkUsernameAvailability(
    password: string,
    email: string
  ): boolean {
    let username = email ? email.split('@')[0] : '';
    return (
      !password.includes(username) &&
      !password.includes(username.replace('.', ''))
    );
  }
}
