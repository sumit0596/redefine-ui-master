import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { MatDatepicker, MatDatepickerModule, MatDatepickerToggle } from '@angular/material/datepicker';
// import { MatFormFieldModule, MatInputModule } from '@angular/material/datepicker';
export const MY_DATE_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'rd-calendar',
  standalone: true,
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatMomentDateModule,
    // MatFormFieldModule,
  ],
})
export class CalendarComponent {
  @Input() max!: Date;
  @Input() min!: Date;
  @Input() label!: string;
  @Input() id!: string;
  @Input() value: string = '';
  @Input() type!: string;
  @Input() placeholder!: string;
  @Input() required: boolean = false;
  @Input() form!: FormGroup | any;
  @Input() controlName!: string;
  @Output() dateChange = new EventEmitter<any>();
  @ViewChild('picker') datepicker!: MatDatepickerToggle<Date>;
  @ViewChild('elementToFocus') _input!: ElementRef;
  onChange(event: any) {
    this.dateChange.emit(event);
  }

  _openCalendar(picker: MatDatepicker<Date>) {
    picker.open();
    setTimeout(() => this._input.nativeElement.focus());
  }

  _closeCalendar(e:any) {
    setTimeout(() => this._input.nativeElement.blur());
  }
  
}
