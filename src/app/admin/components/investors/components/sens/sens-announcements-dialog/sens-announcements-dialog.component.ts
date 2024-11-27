import { Component, Inject } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable, of, map } from 'rxjs';
import { PressReleaseService } from 'src/app/admin/services/press-release.service';
import { PressReleaseDialogComponent } from '../../press-release/press-release-dialog/press-release-dialog.component';
import { SensService } from 'src/app/admin/services/sens.service';

@Component({
  selector: 'app-sens-announcements-dialog',
  templateUrl: './sens-announcements-dialog.component.html',
  styleUrls: ['./sens-announcements-dialog.component.scss'],
})
export class SensAnnouncementsDialogComponent {
  filterForm!: FormGroup;
  previousSelection: any;
  Status$: Observable<any[]> = of([
    {
      Id: 0,
      Name: 'Unpublished',
    },
    {
      Id: 1,
      Name: 'Published',
    },
  ]);

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<SensAnnouncementsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.filterForm = this.fb.group({
      status: [data.status != null ? data.status : null],
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
