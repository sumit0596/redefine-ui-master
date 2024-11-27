import { Component, Inject } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable, of, map } from 'rxjs';
import { PropertyEqTagService } from 'src/app/admin/services/property-eq-tag.service';
import { PropertyEqService } from 'src/app/admin/services/property-eq.service';

@Component({
  selector: 'app-property-eq-tag-dialog',
  templateUrl: './property-eq-tag-dialog.component.html',
  styleUrls: ['./property-eq-tag-dialog.component.scss'],
})
export class PropertyEqTagDialogComponent {
  filterForm!: FormGroup;
  previousSelection: any;

  constructor(
    private propertyEq: PropertyEqTagService,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<PropertyEqTagDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  private initializeForm() {
    this.filterForm = this.fb.group({});
  }

  onSelect(event: any) {}

  allChecked(columns: any) {
    return columns.every((col: any) => col.show);
  }

  onCheckAll(event: any) {
    if (!event.target.checked) {
      const visibleColumns = this.data.columns.filter(
        (col: any) => col.visible
      );
      if (visibleColumns.length > 0) {
        this.data.columns = this.data.columns.map((col: any) => {
          if (col === visibleColumns[0]) {
            return { ...col, show: true };
          } else if (col.visible) {
            return { ...col, show: false };
          } else {
            return col;
          }
        });
        return;
      }
    }

    this.data.columns = [...this.data.columns].map((col: any) => {
      return col.visible ? { ...col, show: event.target.checked } : col;
    });
  }
  onCheck(event: any, column: any) {
    if (!event.target.checked) {
      const checkedCount = this.data.columns.filter(
        (col: any) => col.show
      ).length;

      if (checkedCount === 2) {
        event.preventDefault();
        return;
      }
    }

    this.data.columns = [...this.data.columns].map((col: any) => {
      if (column.field == col.field) {
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
      },
    });
  }
}
