import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NgxCaptchaModule } from 'ngx-captcha';
import { environment } from 'src/environments/environment.dev';

@Component({
  selector: 'app-captcha',
  standalone: true,
  templateUrl: './captcha.component.html',
  styleUrls: ['./captcha.component.scss'],
  imports: [CommonModule, ReactiveFormsModule, NgxCaptchaModule],
})
export class CaptchaComponent {
  @Input() form!: FormGroup | any;
  @Input() controlName!: string;
  @Input() id: any;

  recaptchaConfig: any = environment.RECAPTCHA;

  handleSuccess(event: any) {
    this.form.get(this.controlName).setErrors(null);
  }
}
