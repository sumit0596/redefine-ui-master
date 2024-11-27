import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Observable, map, of } from 'rxjs';
import { PropertyService } from 'src/app/admin/services/property.service';
import { UserService } from 'src/app/admin/services/user.service';
import { PROPERTY_TYPE } from 'src/app/models/enum';

@Component({
  selector: 'app-leads-dialog',
  templateUrl: './leads-dialog.component.html',
  styleUrls: ['./leads-dialog.component.scss'],
})
export class LeadsDialogComponent {
  filterForm!: FormGroup;
  

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<LeadsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.filterForm = this.fb.group({
      SectorId: [data.SectorId ? data.SectorId : null],
      Medium: [data.Medium ? data.Medium : null],
      Source: [data.Source ? data.Source : null],
      Campaign: [data.Campaign ? data.Campaign : null],
    });
  }
  ngOnInit(): void {
    
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
        SectorId: null,
        Medium: null,
        Source: null,
        Campaign: null,
      },
    });
  }
}
