import { Component, Inject } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Observable, of, map } from 'rxjs';
import { UserService } from 'src/app/admin/services/user.service';

@Component({
  selector: 'app-user-dialog',
  templateUrl: './user-dialog.component.html',
  styleUrls: ['./user-dialog.component.scss'],
})
export class UserDialogComponent {
  filterForm!: FormGroup;
  PropertyEqMediaTypeId$!: Observable<any[]>;
  previousSelection: any;
  roleList$!: Observable<any>;
  roleList!: any[];

  constructor(
    private user: UserService,
    private toasterService: ToastrService,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<UserDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  async ngOnInit() {
    this.initializeForm();
    this.getRoles();
  }

  async getRoles() {
    this.roleList$ = await this.user.getRoles();
    this.roleList$.subscribe({
      next: (res) => {
        this.roleList = res;
      },
      error: (error) => {
        this.toasterService.error(error.error.message);
      },
    });
  }

  private initializeForm() {
    this.filterForm = this.fb.group({
      RoleId: [this.data.RoleId ?? null],
    });
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
        Status: null,
        RoleId: null,
      },
    });
  }
}
