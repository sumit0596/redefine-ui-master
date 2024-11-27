import { Component, Inject } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable, of, map } from 'rxjs';
import { EnquiriesService } from 'src/app/admin/services/enquiries.service';

@Component({
  selector: 'app-enquiries-dialog',
  templateUrl: './enquiries-dialog.component.html',
  styleUrls: ['./enquiries-dialog.component.scss'],
})
export class EnquiriesDialogComponent {
  filterForm!: FormGroup;
  Status$: Observable<any[]> = of([
    {
      Id: 0,
      Name: 'Pending',
    },
    {
      Id: 1,
      Name: 'Resolved',
    },
  ]);
  EnquiryTypeId$!: Observable<any[]>;
  previousSelection: any;

  constructor(
    private enquiriesService: EnquiriesService,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<EnquiriesDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.filterForm = this.fb.group({
      Status: [data ? data.Status : null],
      EnquiryTypeId: [data.EnquiryTypeId ? data.EnquiryTypeId : null],
    });
  }

  ngOnInit(): void {
    this.enquiriesService
      .getEnquiryType()
      .pipe(
        map((res: any) => {
          let arr = [];
          for (const key in res.data) {
            if (res.data.hasOwnProperty(key)) {
              arr.push({ ...res.data[key], id: key });
            }
          }
          this.EnquiryTypeId$ = of(arr);
        })
      )
      .subscribe();
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
        Status: null,
        EnquiryTypeId: null,
      },
    });
  }
}
