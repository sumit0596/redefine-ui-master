import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  Options,
  LabelType,
  NgxSliderModule,
} from '@angular-slider/ngx-slider';
import { CommonModule, DecimalPipe } from '@angular/common';

@Component({
  selector: 'rd-slider',
  standalone: true,
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.scss'],
  imports: [CommonModule, NgxSliderModule],
})
export class SliderComponent implements OnInit {
  options: Options | undefined;
  @Input() id!: String;
  @Input() floor: number = 0;
  @Input() ceil: number = 100;
  @Input() step: number = 10;
  @Input() showTicks: boolean = false;
  @Input() lebalExtention: string = '';
  @Input() type!: String;
  @Input() disable: boolean = false;
  @Input() minValue: number = 1;
  @Input() maxValue: number = 99;

  @Output() onChange: EventEmitter<any> = new EventEmitter<any>();

  constructor(private decimalPipe: DecimalPipe){

  }
  ngOnInit(): void {
    this.options = {
      floor: this.floor,
      ceil: this.ceil,
      step: this.step,
      showTicks: this.showTicks,
      translate: (value: number, label: LabelType): any => {
        switch (label) {
          case LabelType.Low:
            return this.decimalPipe.transform(value)?.replaceAll(',', ' ') + this.lebalExtention;
          case LabelType.High:
            return this.decimalPipe.transform(value)?.replaceAll(',', ' ') + this.lebalExtention;
          default:
            return '';
        }
      },
    };
  }

  onSliderChange(event: any) {
    this.onChange.emit({ event, type: this.type });
  }
}
