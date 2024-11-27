import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'rd-timepicker',
  standalone: true,
  templateUrl: './timepicker.component.html',
  styleUrls: ['./timepicker.component.scss'],
  imports: [CommonModule, ReactiveFormsModule],
})
export class TimepickerComponent {
  @Input() label!: string;
  @Input() id!: string;
  @Input() placeholder!: string;
  @Input() required: boolean = false;
  @Input() min: string = '00:00';
  @Input() max: string = '24:00';
  @Input() form!: FormGroup | any;
  @Input() controlName!: string;
  @Output() onChange = new EventEmitter<any>();

  timeChange(event: any) {
    this.onChange.emit(event);
  }
}
