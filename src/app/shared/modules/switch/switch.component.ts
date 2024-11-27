import {
  Component,
  EventEmitter,
  Input,
  Output,
  SimpleChanges,
} from '@angular/core';

@Component({
  selector: 'rd-switch',
  templateUrl: './switch.component.html',
  styleUrls: ['./switch.component.scss'],
})
export class SwitchComponent {
  @Input() label!: string;
  @Input() onLabel: string = 'ON';
  @Input() offLabel: string = 'OFF';
  @Input() id!: string;
  @Input() checked: boolean = false;
  @Input() toggleChecked: any;
  @Input() isLabel: boolean = false;
  @Input() disable: boolean = false;
  @Output() onChange: EventEmitter<any> = new EventEmitter<any>();

  toggleSwitch(event: any) {
    // this.checked = event.target.checked;
    this.onChange.emit({ label: this.label, checked: event.target.checked });
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes['toggleChecked']) {
      this.checked = changes['toggleChecked']?.currentValue.checked;
    }
  }
}
