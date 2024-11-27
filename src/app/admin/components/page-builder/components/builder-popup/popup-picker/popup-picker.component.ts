import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBase } from 'src/app/utilities/form-base';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { SelectModule } from 'src/app/shared/modules/select/select.module';
import { Observable, of } from 'rxjs';
import { InputModule } from 'src/app/shared/modules/input/input.module';

@Component({
  selector: 'app-popup-picker',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SelectModule, InputModule],
  templateUrl: './popup-picker.component.html',
  styleUrls: ['./popup-picker.component.scss'],
})
export class PopupPickerComponent extends FormBase implements OnInit {
  @Input() popupData: any;
  @Output() submitEvent: EventEmitter<any> = new EventEmitter();

  sizes$: Observable<{ name: string; value: string }[]> = of([
    { name: 'Small', value: 'modal-sm' },
    { name: 'Medium', value: 'modal-lg' },
    { name: 'Large', value: 'modal-xl' },
    { name: 'Full screen', value: 'modal-fullscreen' },
  ]);
  constructor(fb: FormBuilder) {
    super(fb);
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      name: [null, [Validators.required]],
      label: [null, [Validators.required]],
      size: [null, [Validators.required]],
    });
    if (this.popupData) {
      this.form.patchValue(this.popupData);
    }
  }
  onSubmit() {
    this.submitEvent.emit(this.form.value);
  }
}
