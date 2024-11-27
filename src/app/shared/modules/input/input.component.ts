import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'rd-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
})
export class InputComponent implements OnInit {
  visible: boolean = true;
  disabled: boolean = true;

  @Input() label!: string;
  @Input() id!: string;
  @Input() value: string = '';
  @Input() placeholder!: string;
  @Input() required: boolean = false;
  @Input() icon: boolean = false;
  @Input() forgot: boolean = false;
  @Input() type!: string;
  @Input() iconUrl!: string;
  @Input() form!: FormGroup | any;
  @Input() controlName!: string;
  @Input() disable: boolean = false;
  @Input() autofocus: boolean = false;
  @Output() forgotPasswordEvent = new EventEmitter<any>();
  @Output() onClickEvent = new EventEmitter<any>();
  @Output() onChange = new EventEmitter<any>();
  @ViewChild('password') passwordInput!: ElementRef<HTMLInputElement>;

  constructor() {}

  ngOnChanges(changes: SimpleChanges){
    this.disable = changes['disable']?.currentValue;
  }

  ngOnInit(): void {
    this.form?.get(this.controlName).valueChanges.subscribe((result: any) => {
      this.onChange.emit({
        form: this.form,
        control: this.controlName,
        value: result,
      });
    });
  }

  onKeyUp(event: KeyboardEvent) {
    if (this.passwordInput.nativeElement.value != '') {
      this.disabled = false;
    } else {
      this.visible = true;
      this.disabled = true;
    }
  }
  onFocus(event: FocusEvent) {
    if (this.passwordInput.nativeElement.value != '') {
      this.disabled = false;
    } else {
      this.visible = true;
      this.disabled = true;
    }
  }
  showPassword() {
    this.visible = !this.visible;
    if (this.visible) {
      this.passwordInput.nativeElement.type = 'password';
    } else {
      this.passwordInput.nativeElement.type = 'text';
    }
  }
  forgotPassword() {
    this.forgotPasswordEvent.emit();
  }
  onClick() {
    this.onClickEvent.emit({
      controlName: this.controlName,
      value: this.form.get(this.controlName)?.value,
    });
  }
}
