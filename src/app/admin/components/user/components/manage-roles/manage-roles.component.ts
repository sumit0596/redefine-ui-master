import { CommonStoreService } from '../../../../../services/common-store.service';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { RolesServiceService } from 'src/app/admin/services/roles.service.service';
import { CONSTANTS, FORM_MODE, ROUTE } from 'src/app/models/constants';
import { CommonService } from 'src/app/shared/services/common.service';
import { LoaderService } from 'src/app/shared/services/loader/loader.service';

@Component({
  selector: 'app-manage-roles',
  templateUrl: './manage-roles.component.html',
  styleUrls: ['./manage-roles.component.scss'],
})
export class ManageRolesComponent {
  columns: any;
  filterColumns: any;
  activeRoute: string;
  tableSettings: any;
  pageNumber = 1;
  pageSize = 10;
  totalRowsCount: any;
  pageCnt: any;
  rows: any;
  access: any;

  constructor(
    private rolesService: RolesServiceService,
    private router: Router,
    private loaderService: LoaderService,
    private coomonService: CommonService,
    private toasterService: ToastrService,
    private commonStoreService: CommonStoreService
  ) {
    this.activeRoute = router.url;
    this.setColumnHeaders();
    this.initializeTableSettings();
  }
  ngOnInit() {
    this.getAllRoles();
  }

  getAllRoles(pageSize?: any, pageNumber?: any) {
    this.loaderService.show();
    if (pageSize != undefined && pageNumber != undefined) {
      this.pageSize = pageSize;
      this.pageNumber = pageNumber;
    }
    this.rolesService.getAllRoles(this.pageSize, this.pageNumber).subscribe({
      next: (res) => {
        this.rolesData(res);
      },
      error: (error) => {
        this.loaderService.hide();
        this.toasterService.error(error.error.message);
      },
      complete: () => {
        this.loaderService.hide();
      },
    });
  }

  rolesData(res: any) {
    this.initializeTableSettings();
    if (res.data) {
      this.totalRowsCount = res.data.totalCount;
      this.pageCnt = res.data.pageCount;
      this.access = res.data.FullAccess;
      res.data.roles.forEach((element: any) => {
        element.CreatedOn = new Date(element.CreatedOn);
        element.CreatedOn = moment(element.CreatedOn).format('DD/MM/YYYY');
      });
      if (res.data.FullAccess === 1) {
        res.data.roles.forEach((e: any) => {
          e.operations = [
            {
              name: CONSTANTS.EDIT_OPERATION,
              icon: CONSTANTS.EDIT,
              operationName: CONSTANTS.EDIT,
              path: 'assets/images/edit.svg',
            },
            {
              name: CONSTANTS.DELETE,
              icon: CONSTANTS.DELETE_ICON,
              operationName: CONSTANTS.DELETE,
              path: 'assets/images/delete.svg',
            },
          ];
        });
      } else {
        var index = this.columns.findIndex(function (element: any) {
          return element.field == 'actions';
        });
        if (index !== -1) {
          this.columns.splice(index, 1);
        }
      }
      // else {
      //   res.data.roles.forEach((e: any) => {
      //     e.operations = [
      //       {
      //         name: CONSTANTS.VIEW,
      //         icon: CONSTANTS.DETAILS_ICON,
      //         operationName: CONSTANTS.VIEW,
      //         path: 'assets/images/eye.svg',
      //       },
      //     ];
      //   });
      // }
      this.rows = res.data.roles;
      this.tableSettings = {
        rows: this.rows,
        columns: this.columns,
        id: 'RoleId',
        totalRowsCount: this.rows.length,
        pageCnt: this.pageCnt,
        tablename: 'All Roles',
        isPaginationRequired: false,
        isFilterRequired: false,
        isSearchRequired: false,
        isColumnGroupRequired: false,
        isDownloadRequired: false,
        showActions: true,
      };
    } else {
      this.rows = [];
      this.totalRowsCount = 0;
      this.pageCnt = 0;
    }
  }

  setColumnHeaders() {
    this.columns = [
      {
        field: 'Name',
        header: 'Name',
        sort: false,
        visible: false,
        show: true,
      },
      {
        field: 'Description',
        header: 'Description',
        sort: false,
        visible: false,
        show: true,
      },
      {
        field: 'CreatedOn',
        header: 'Date Created',
        sort: false,
        visible: false,
        show: true,
      },
      {
        field: 'actions',
        header: 'Actions',
        sort: false,
        visible: false,
        show: true,
      },
    ];
  }

  initializeTableSettings(): void {
    this.tableSettings = {
      rows: [],
      columns: this.columns,
      tablename: 'All Roles',
    };
  }

  tableData(event: any) {
    this.getRolesData(event);
  }

  getRolesData(event: any): void {
    this.loaderService.show();
    this.rolesService
      .getAllRoles(
        event.pageSize,
        event.pageNumber,
        event.searchValue,
        event.sortBy,
        event.sortOrder
      )
      .subscribe({
        next: (res) => {
          this.rolesData(res);
        },
        error: (error: ErrorEvent) => {
          this.toasterService.error(error.error.message);
        },
        complete: () => {
          this.loaderService.hide();
        },
      });
  }

  async rowActions(data: any) {
    let formConfig: any = {
      mode: data.operation,
      id: data.rowData.RoleId,
      access: this.access,
    };
    await this.commonStoreService.setFormConfig(formConfig);
    if (data.operation === FORM_MODE.VIEW) {
      this.router.navigate([`${ROUTE.CREATE_ROLE}`]);
    } else if (data.operation === CONSTANTS.EDIT) {
      this.router.navigate([ROUTE.EDIT_ROLE]);
    } else if (data.operation === CONSTANTS.DELETE.toLowerCase()) {
      const dialogRef = this.coomonService.dialog(
        CONSTANTS.ROLE_DELETE_CONFIRMATION,
        CONSTANTS.NO,
        CONSTANTS.YES
      );
      dialogRef.afterClosed().subscribe((action: any) => {
        if (action === CONSTANTS.YES) {
          this.loaderService.show();
          this.rolesService.deleteRole(data.rowData.RoleId).subscribe({
            next: (res) => {
              this.loaderService.hide();
              this.toasterService.success(res.message);
              this.getAllRoles(data.pageSize, data.activePageNumber);
            },
            error: (error) => {
              this.loaderService.hide();
              this.toasterService.error(error.error.message);
            },
          });
        }
      });
    }
  }

  createRole() {
    let formConfig = {
      mode: FORM_MODE.CREATE,
      id: undefined,
    };
    this.commonStoreService.setFormConfig(formConfig);
    this.router.navigate([ROUTE.CREATE_ROLE]);
  }
}
