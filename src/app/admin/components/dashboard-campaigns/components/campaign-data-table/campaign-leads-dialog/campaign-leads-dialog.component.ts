import { Component, Inject, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CampaignDataTableComponent } from '../campaign-data-table.component';

@Component({
  selector: 'app-campaign-leads-dialog',
  templateUrl: './campaign-leads-dialog.component.html',
  styleUrls: ['./campaign-leads-dialog.component.scss']
})
export class CampaignLeadsDialogComponent {
  @ViewChild(CampaignDataTableComponent) campTable!: CampaignDataTableComponent;

  filterForm!: FormGroup;
  preDataFilter: any;
  postDataFilter: any;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<CampaignLeadsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.filterForm = this.fb.group({
      PropertyId: [data.PropertyId ? data.PropertyId : null],
      SectorId: [data.SectorId ? data.SectorId : null],
      Medium: [data.Medium ? data.Medium : null],
      Source: [data.Source ? data.Source : null],
      LeasingExecutiveId: [data.LeasingExecutiveId ? data.LeasingExecutiveId : null],
    });

  }

  ngOnInit(): void {
    // this.preDataFilter = this.data?.Campaign;
    // console.log('before', this.preDataFilter);
    // this.clearFormData();
    
    // if (this.preDataFilter !== '') {
    //   this.preDataFilter = '';
    // console.log('after', this.preDataFilter);

    // }
  }

  onSelect(event: any) {

  }

  ngDoCheck() {
  
  }

  allChecked(columns: any) {
    return [...columns].every((col: any) => col.show);
  }
  onCheckAll(event: any) {
    if (!event.target.checked) {
      const visibleColumns = this.data.columns.filter((col: any) => col.visible);

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
    } else {
      this.data.columns = this.data.columns.map((col: any) => {
        return col.visible ? { ...col, show: event.target.checked } : col;
      });
    }
  }
  onCheck(event: any, column: any) {
    const checkedColumns = this.data.columns.filter((col: any) => col.show);

    if (!event.target.checked && checkedColumns.length <= 1) {
      event.preventDefault();
      return;
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
        SectorId: null,
        Medium: null,
        Source: null,
        Campaign: null,
        LeasingExecutiveId: null,
        PropertyId: null
      },
    });
  }

  clearFormData() {
   this.filterForm.get('PropertyId')?.setValue(null);
   this.filterForm.get('SectorId')?.setValue(null);
   this.filterForm.get('Medium')?.setValue(null);
   this.filterForm.get('Source')?.setValue(null);
   this.filterForm.get('LeasingExecutiveId')?.setValue(null);
  }
}

