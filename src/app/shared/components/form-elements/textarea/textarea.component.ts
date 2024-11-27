import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'rd-textarea',
  standalone: true,
  templateUrl: './textarea.component.html',
  styleUrls: ['./textarea.component.scss'],
  imports: [CommonModule, ReactiveFormsModule,],
})
export class TextareaComponent implements OnInit {
  characters: number = 0;
  @Input() label!: string;
  @Input() id!: string;
  @Input() placeholder!: string;
  @Input() value: string = '';
  @Input() maxLength: number = 255;
  @Input() rows!: number;
  @Input() required: boolean = false;
  @Input() controlName!: string;
  @Input() form!: FormGroup;
  @Output() onChange = new EventEmitter<any>();

  ngOnInit(): void {
    this.form.get(this.controlName)?.valueChanges.subscribe((result: any) => {
      this.onChange.emit({
        form: this.form,
        control: this.controlName,
        value: result,
      });
    });
  }
  get textarea() {
    return this.form.get(this.controlName) as FormControl;
  }
}
