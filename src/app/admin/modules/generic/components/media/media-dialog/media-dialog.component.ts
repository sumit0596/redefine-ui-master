import { Component, Inject } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-media-dialog',
  templateUrl: './media-dialog.component.html',
  styleUrls: ['./media-dialog.component.scss'],
})
export class MediaDialogComponent {
  filterForm!: FormGroup;
  previousSelection: any;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<MediaDialogComponent>,
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

      if (checkedCount === 1) {
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
