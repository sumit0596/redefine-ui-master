import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import {
  LOGIN_FORM,
  INPUT_ERROR,
  PATTERN,
  MESSAGE,
  CONSTANTS,
} from 'src/app/models/constants';
import { LoginService } from 'src/app/services/login/login.service';
import { UserStoreService } from 'src/app/services/user-store.service';
import { CustomValidator } from 'src/app/utilities/custom-validator';
import { CommonService } from '../../services/common.service';
import { InputModule } from '../input/input.module';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [CommonModule, InputModule, RouterModule],
})
export class LoginComponent implements OnInit {
  formType: number = 1;
  token!: any;
  loader: boolean = false;
  loggedIn: boolean = false;
  loginForm!: FormGroup;
  user$!: Observable<any>;
  userInfo: any;
  userName: string = '';
  title: string = '';
  message: string = '';
  policy: string = '<em>Tooltip</em> <u>with</u> <b>HTML</b>';
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private loginService: LoginService,
    private toasterService: ToastrService,
    private userStore: UserStoreService,
    private commonService: CommonService
  ) {
    this.formType = route.snapshot.data['id'];
  }

  ngOnInit() {
    this.loginForm = this.fb.group({
      Email: [
        '',
        [Validators.required, Validators.pattern(PATTERN.EMAIL_PATTERN)],
      ],
      Password: ['', [Validators.required]],
      ConfirmPassword: ['', Validators.required],
    });
    this.getToken();
  }
  get email() {
    return this.loginForm.get(LOGIN_FORM.EMAIL.NAME) as FormControl;
  }
  get password() {
    return this.loginForm.get(LOGIN_FORM.PASSWORD.NAME) as FormControl;
  }
  get confirmPassword() {
    return this.loginForm.get(LOGIN_FORM.CONFIRM_PASSWORD.NAME) as FormControl;
  }
  getToken() {
    this.token = this.route.snapshot.paramMap.get('token');
    if (this.token) {
      this.validateResetPasswordToken();
    } else {
      this.toggleFormControl();
    }
  }
  adLogin() {
    this.loginService.adLogin().subscribe({
      next: (res) => {
        this.router.navigate(['admin']);
      },
      complete: () => {},
      error: (error) => {},
    });
  }
  login(event: any) {
    this.loginService.logout();
    event.preventDefault();
    this.validateControl();
    if (!this.loginForm.invalid) {
      this.user$ = this.loginService.login(this.loginForm.value);
      this.user$.subscribe({
        next: (res: any) => {
          this.loader = false;
          this.router.navigate(['admin']).then((m) => {
            this.toasterService.success('Login successful');
          });
        },
        complete: () => {},
        error: (error) => {
          this.toasterService.error(error.error.message);
        },
      });
    }
  }
  forgotPassword() {
    this.router.navigate(['forgot-password']);
  }
  savePassword(event: MouseEvent) {
    let formData: any;
    event.preventDefault();
    this.validateControl();
    if (!this.loginForm.invalid) {
      formData = {
        Token: this.token,
        Password: this.password.value,
      };
      this.loader = true;
      this.loginService.resetPassword(formData).subscribe({
        next: (res) => {
          this.userName = `${res.data.FirstName} ${res.data.LastName}`;
          this.title = MESSAGE.PASSWORD_CHANGE_SUCCESSFUL;
          this.message = MESSAGE.UPDATE_PASSWORD;
          this.formType = 4;
          this.toggleFormControl();
        },
        complete: () => {
          this.loader = false;
        },
        error: (error) => {
          this.loader = false;
          this.toasterService.error(error.error.message);
        },
      });
    }
  }
  sendEmail(event: MouseEvent) {
    event.preventDefault();
    this.validateControl();
    if (!this.loginForm.invalid) {
      this.loader = true;
      this.loginService.forgotPassword(this.loginForm.value).subscribe({
        next: (res) => {
          this.userName = `${res.data.FirstName} ${res.data.LastName}`;
          this.title = MESSAGE.WELCOME;
          this.message = MESSAGE.FORGOT_PASSWORD.replace(
            '[email]',
            res.data.Email
          );
          this.formType = 4;
          this.toggleFormControl();
          this.toasterService.success(res.message);
        },
        complete: () => {
          this.loader = false;
        },
        error: (error) => {
          this.loader = false;
          this.toasterService.error(error.error.message);
        },
      });
    }
  }
  back() {
    this.router.navigate(['login']);
  }
  validateControl() {
    Object.keys(this.loginForm.controls).forEach((control) => {
      if (this.checkError(control, 'required')) {
        this.setError(
          control,
          `${this.getControlLabel(control)} ${INPUT_ERROR.REQUIRED}`
        );
      } else if (
        this.checkError(control, 'pattern') ||
        this.checkError(control, 'minlength')
      ) {
        if (control.toUpperCase() == 'PASSWORD' && this.formType == 3) {
          this.setError(
            control,
            `${this.getControlLabel(control)} ${INPUT_ERROR.PASSWORD_PATTERN}`
          );
        }
        if (control.toUpperCase() == 'EMAIL') {
          this.setError(control, `${INPUT_ERROR.EMAIL_PATTERN}`);
        }
      } else if (
        this.formType == 3 &&
        control.toUpperCase() == 'CONFIRMPASSWORD'
      ) {
        if (this.password.value != this.confirmPassword.value) {
          this.setError(
            control,
            `${this.getControlLabel(control)} ${INPUT_ERROR.PASSWORD_MISMATCH}`
          );
        }
      } else if (this.checkError(control, 'policyMatch')) {
        this.setError(
          control,
          `${this.getControlLabel(control)} ${INPUT_ERROR.PASSWORD_PATTERN}`
        );
      }
    });
  }
  checkError(control: string, error: string) {
    return this.loginForm.get(control)?.hasError(error);
  }
  setError(name: string, message: string) {
    this.loginForm.get(name)?.setErrors({
      invalid: `${message}`,
    });
  }
  getControlLabel(control: string) {
    let result: any = Object.values(LOGIN_FORM).find(
      (res: any) => res.NAME == control
    );
    return result ? result.LABEL : control;
  }
  async toggleFormControl() {
    this.reset();
    if (this.formType == 1) {
      // fromType 1 => Login form
      this.email.enable({ onlySelf: true, emitEvent: false });
      this.password.enable({ onlySelf: true, emitEvent: false });
      this.confirmPassword.disable({ onlySelf: true, emitEvent: false });
    } else if (this.formType == 2) {
      // fromType 1 => Forgot password form
      this.email.enable({ onlySelf: true, emitEvent: false });
      this.password.disable({ onlySelf: true, emitEvent: false });
      this.confirmPassword.disable({ onlySelf: true, emitEvent: false });
    } else if (this.formType == 3) {
      // fromType 1 => Update password form
      // this.userInfo = await this.userStore.getUser();
      this.email.disable({ onlySelf: true, emitEvent: false });
      this.password.enable({ onlySelf: true, emitEvent: false });
      this.confirmPassword.enable({ onlySelf: true, emitEvent: false });
      this.password.addValidators([
        CustomValidator.passwordPolicy(this.userInfo.Email),
      ]);
    }
  }
  keydown(event: any) {
    switch (this.formType) {
      case 1:
        this.login(event);
        break;
      case 2:
        this.sendEmail(event);
        break;
      case 3:
        this.savePassword(event);
        break;
      case 4:
        this.back();
        break;
    }
  }
  reset() {
    this.loginForm?.reset();
  }
  async validateResetPasswordToken() {
    this.loginService.validateResetPasswordToken(this.token).subscribe({
      next: (res: any) => {
        this.userStore.setUser(res.data);
        this.userInfo = res.data;
        this.toggleFormControl();
      },
      error: (error: any) => {
        this.showMessage();
      },
    });
  }
  showMessage() {
    const dialogRef = this.commonService.dialog(
      CONSTANTS.INVALID_RESET_LINK,
      CONSTANTS.NO,
      CONSTANTS.YES,
      true
    );
    dialogRef.afterClosed().subscribe((action: any) => {
      if (action == CONSTANTS.YES) {
        this.router.navigate(['forgot-password']);
      } else {
        this.back();
      }
    });
  }
}
