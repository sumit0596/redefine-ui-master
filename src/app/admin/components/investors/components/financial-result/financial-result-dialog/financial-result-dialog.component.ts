import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IntegratedReportDialogComponent } from '../../integrated-report/integrated-report-dialog/integrated-report-dialog.component';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-financial-result-dialog',
  templateUrl: './financial-result-dialog.component.html',
  styleUrls: ['./financial-result-dialog.component.scss'],
})
export class FinancialResultDialogComponent {
  filterForm!: FormGroup;
  previousSelection: any;
  reportStatus$: Observable<any[]> = of([
    {
      Id: 0,
      Name: 'Draft',
    },
    {
      Id: 1,
      Name: 'Published',
    },
    {
      Id: 2,
      Name: 'Archived',
    },
  ]);
  resultType$: Observable<any[]> = of([
    {
      Id: 1,
      Name: 'Annual',
    },
    {
      Id: 2,
      Name: 'Interim',
    },
  ]);
  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<IntegratedReportDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.filterForm = this.fb.group({
      Type: [data ? data.Type : null],
      Status: [data ? data.Status : null],
    });
  }
  onSelect(event: any) {}
  allChecked(columns: any) {
    return [...columns].every((col: any) => col.show);
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
        status: null,
      },
    });
  }
}
