import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable, of } from 'rxjs';
import { PropertyService } from 'src/app/admin/services/property.service';
import { UserService } from 'src/app/admin/services/user.service';
import { PROPERTY_TYPE } from 'src/app/models/enum';

@Component({
  selector: 'app-internationalpropertydialog',
  templateUrl: './internationalpropertydialog.component.html',
  styleUrls: ['./internationalpropertydialog.component.scss'],
})
export class InternationalpropertydialogComponent {
  filterForm!: FormGroup;

  holdingCompanies$: Observable<any> = of([
    {
      Id: 1,
      Name: 'Redefine Europe',
    },
    {
      Id: 2,
      Name: 'Epp-Poland',
    },
  ]);

  completionType$: Observable<any> = of([
    {
      Id: 1,
      Name: 'Under Construction',
    },
    {
      Id: 2,
      Name: 'Asset Completed',
    },
  ]);

  constructor(
    private propertyService: PropertyService,
    private userService: UserService,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<InternationalpropertydialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.filterForm = this.fb.group({
      SectorId: [data.SectorId ? data.SectorId : null],
      HoldingCompanyId: [data.HoldingCompanyId ? data.HoldingCompanyId : null],
      CompletionType: [data.CompletionType ? data.CompletionType : null],
    });
  }
  ngOnInit() {}

  onSelect(event: any) {
    // this.getProperties(event.Id);
  }

  getProperties(id: any) {}
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
    var a = this.data.columns.filter(
      (x: any) => x.show === false && x.field != 'actions'
    );
    var b = this.data.columns.filter((x: any) => x.field != 'actions');
    if (a.length == b.length) {
      this.data.columns.forEach((element: any) => {
        element.show = true;
      });
    }
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
        HoldingCompanyId: null,
        CompletionType: null,
      },
    });
  }
}
