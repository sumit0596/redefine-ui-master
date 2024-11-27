import {
  Component,
  ContentChild,
  EventEmitter,
  Input,
  Output,
  TemplateRef,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import {
  Observable,
  Subject,
  catchError,
  concat,
  distinctUntilChanged,
  of,
  switchMap,
  tap,
} from 'rxjs';

@Component({
  selector: 'rd-autocomplete',
  templateUrl: './autocomplete.component.html',
  styleUrls: ['./autocomplete.component.scss'],
})
export class AutocompleteComponent {
  searchInput$ = new Subject<string>();
  items$!: Observable<any>;

  @Input() id!: string;
  @Input() label!: string;
  @Input() data!: any[];
  @Input() placeholder!: string;
  @Input() bindLabel!: string;
  @Input() bindValue!: string;
  @Input() searchKey!: string;
  @Input() controlName!: string;
  @Input() helpingText: string = 'Please start typing...';
  @Input() selectedItems: any = [];
  @Input() required: boolean = false;
  @Input() multiselect: boolean = false;
  @Input() checkbox: boolean = false;
  @Input() loading: boolean = false;
  @Input() disable: boolean = false;
  @Input() form!: FormGroup | any;
  @Input() max!: number;

  @Output() onChange = new EventEmitter<any>();
  @Output() onSelect = new EventEmitter<any>();
  @Output() onDeSelect = new EventEmitter<any>();
  @Output() onClear = new EventEmitter<any>();
  @Output() searchFilter = new EventEmitter<any>();

  @ContentChild(TemplateRef) optionTemplate: TemplateRef<any> | undefined;
  @ContentChild(TemplateRef) labelTemplate: TemplateRef<any> | undefined;

  ngOnChanges(){
    this.items$ = of(this.data);
  }

  ngOnInit() {
    this.loadItems();
  }
  trackByFn(item: any) {
    return item[this.searchKey];
  }
  onDataSelect(event: any) {
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
  onFilter(event: any) {
    this.searchFilter.emit(event?.term);
  }

  private loadItems() {
    this.items$ = concat(
      of([]), // default items
      this.searchInput$.pipe(
        distinctUntilChanged(),
        tap((res: any) => {
          this.loading = true;
        }),
        switchMap((term) =>
          this.filterData(term).pipe(
            catchError(() => of([])), // empty list on error
            tap(() => (this.loading = false))
          )
        )
      )
    );
  }
  filterData(term: string) {
    let filterData = this.data.filter(
      (x) =>
        x[this.searchKey]
          .toLocaleLowerCase()
          .indexOf(term?.toLocaleLowerCase()) > -1
    );
    return of(filterData);
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
