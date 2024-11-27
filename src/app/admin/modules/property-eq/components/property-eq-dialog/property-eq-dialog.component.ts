import { Component, Inject } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable, of, map } from 'rxjs';
import { PropertyEqService } from 'src/app/admin/services/property-eq.service';

@Component({
  selector: 'app-property-eq-dialog',
  templateUrl: './property-eq-dialog.component.html',
  styleUrls: ['./property-eq-dialog.component.scss'],
})
export class PropertyEqDialogComponent {
  filterForm!: FormGroup;
  PropertyEqMediaTypeId$!: Observable<any[]>;
  propertyEqStatus$: Observable<any[]> = of([
    {
      Id: 0,
      Name: 'Draft',
    },
    {
      Id: 1,
      Name: 'Published',
    },
  ]);
  previousSelection: any;

  constructor(
    private propertyEq: PropertyEqService,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<PropertyEqDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.initializeForm();

    this.propertyEq
      .getPropertyEnquiryType()
      .pipe(
        map((res: any) => {
          let arr = [];
          for (const key in res.data) {
            if (res.data.hasOwnProperty(key)) {
              arr.push({ ...res.data[key], id: key });
            }
          }
          return arr;
        })
      )
      .subscribe((arr) => {
        this.PropertyEqMediaTypeId$ = of(arr);
      });
  }

  private initializeForm() {
    this.filterForm = this.fb.group({
      Status: [this.data.Status ?? null],
      Type: [this.data.Type ?? null],
    });
  }

  onSelect(event: any) {}

  allChecked(columns: any) {
    return columns
      .filter((col: any) => col.field !== 'Pin')
      .every((col: any) => col.show);
  }

  onCheckAll(event: any) {
    if (!event.target.checked) {
      const visibleColumns = this.data.columns.filter(
        (col: any) => col.visible && col.field !== 'Pin'
      );
      if (visibleColumns.length > 0) {
        this.data.columns = this.data.columns.map((col: any) => {
          if (col.field === visibleColumns[0].field) {
            return { ...col, show: true };
          } else if (col.visible && col.field !== 'Pin') {
            return { ...col, show: false };
          } else {
            return col;
          }
        });
        return;
      }
    }

    this.data.columns = this.data.columns.map((col: any) => {
      if (col.visible && col.field !== 'Pin') {
        return { ...col, show: event.target.checked };
      } else {
        return col;
      }
    });
  }

  onCheck(event: any, column: any) {
    if (!event.target.checked) {
      const checkedCount = this.data.columns.filter(
        (col: any) => col.show && col.field !== 'Pin'
      ).length;

      if (checkedCount === 2) {
        event.preventDefault();
        return;
      }
    }

    this.data.columns = this.data.columns.map((col: any) => {
      if (column.field === col.field) {
        return { ...col, show: event.target.checked };
      } else {
        return col;
      }
    });
  }

  onSubmit() {
    this.dialogRef.close({
      submit: true,
      data: { ...this.data, ...this.filterForm.value },
    });
  }

  close() {
    this.dialogRef.close();
  }

  clearFilter() {
    this.dialogRef.close({
      clear: true,
      data: {
        ...this.data,
        columns: null,
        Status: null,
        Type: null,
      },
    });
  }
}
