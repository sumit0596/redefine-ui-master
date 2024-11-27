import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable, map, of } from 'rxjs';
import { PressReleaseService } from 'src/app/admin/services/press-release.service';

@Component({
  selector: 'app-press-release-dialog',
  templateUrl: './press-release-dialog.component.html',
  styleUrls: ['./press-release-dialog.component.scss'],
})
export class PressReleaseDialogComponent implements OnInit {
  filterForm!: FormGroup;
  pressReleaseStatus$: Observable<any[]> = of([
    {
      Id: 1,
      Name: 'Published',
    },
    {
      Id: 2,
      Name: 'Archived',
    },
  ]);
  year$!: Observable<any[]>;
  previousSelection: any;

  constructor(
    private pressReleaseService: PressReleaseService,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<PressReleaseDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.filterForm = this.fb.group({
      Status: [data.Status ? data.Status : null],
      Year: [data.Year ? data.Year : null],
    });
  }

  ngOnInit(): void {
    if (this.data.label === 'Filter') {
      this.pressReleaseService
        .getPressReleaseYears()
        .pipe(
          map((res: any) => {
            let arr = [];
            for (const key in res.data) {
              if (res.data.hasOwnProperty(key)) {
                arr.push({ ...res.data[key], id: key });
              }
            }
            this.year$ = of(arr);
          })
        )
        .subscribe();
    }
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
        Year: null,
      },
    });
  }
}
