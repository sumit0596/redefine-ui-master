import {
  Component,
  ContentChild,
  EventEmitter,
  Input,
  OnInit,
  Output,
  TemplateRef,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';

@Component({
  selector: 'rd-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
})
export class SelectComponent implements OnInit {

  @Input() isLoading: boolean = false;;
  @Input() id!: string;
  @Input() label!: string;
  @Input() placeholder!: string;
  @Input() bindLabel!: string;
  @Input() bindValue!: string;
  @Input() controlName!: string;
  @Input() items$!: Observable<any>;
  @Input() selectedItems!: any;
  @Input() required: boolean = false;
  @Input() multiselect: boolean = false;
  @Input() checkbox: boolean = false;
  @Input() disable: boolean = false;
  @Input() form!: FormGroup | any;
  @Input() clear!: boolean;
  @Input() groupBy!: string;
  @Input() max!: number;
  @Input() labelForId!: string;
  @Input() labelClass : string = 'sr-only';
  @Output() onChange = new EventEmitter<any>();
  @Output() onSelect = new EventEmitter<any>();
  @Output() onDeSelect = new EventEmitter<any>();
  @Output() onClear = new EventEmitter<any>();
  @ContentChild(TemplateRef) optionTemplate: TemplateRef<any> | undefined;
  @ContentChild(TemplateRef) labelTemplate: TemplateRef<any> | undefined;
  @ContentChild(TemplateRef) optionGroupTemplate!: TemplateRef<any>;

  ngOnInit(): void {
  }

  onDataChange(event: any) {
    this.onChange.emit({ ...event, control: this.controlName });
  }
  onAdd(event: any) {
    this.onSelect.emit(event);
  }
  onRemove(event: any) {
    this.onDeSelect.emit(event.value);
  }
  onDataClear(event: any) {
    this.onClear.emit(event);
  }
  public compareWith(a: any, b: any) {
    let res = false;
    if ((a[this.bindValue] && b[this.bindValue]) || (a[this.bindValue] && b)) {
      res = a[this.bindValue] === b[this.bindValue] || a[this.bindValue] === b;
    } else if (a && b) {
      res = a === b;
    }
    return res;
  }
}
