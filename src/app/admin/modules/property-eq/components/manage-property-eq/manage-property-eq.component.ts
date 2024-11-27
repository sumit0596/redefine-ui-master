import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import * as XLSX from 'xlsx';
import { PropertyEqService } from 'src/app/admin/services/property-eq.service';
import {
  ROUTE,
  GRID_ACTION,
  STATUS,
  FORM_MODE,
  GRID_TOOLBAR,
  CONSTANTS,
  PROPERTYEQTYPE,
} from 'src/app/models/constants';
import { CommonStoreService } from 'src/app/services/common-store.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { LoaderService } from 'src/app/shared/services/loader/loader.service';
import { PropertyEqDialogComponent } from '../property-eq-dialog/property-eq-dialog.component';
import { PropertyEqDropdownDialogComponent } from '../property-eq-dropdown-dialog/property-eq-dropdown-dialog.component';

@Component({
  selector: 'app-manage-property-eq',
  templateUrl: './manage-property-eq.component.html',
  styleUrls: ['./manage-property-eq.component.scss'],
})
export class ManagePropertyEqComponent {
  filterData: any;
  tableConfig: any;
  columns: any[] = [
    {
      field: 'Title',
      header: 'Title',
      id: 'propertyEqTitle',
      sort: true,
      visible: true,
      show: true,
    },
    {
      field: 'PropertyEqType',
      header: 'Media Type',
      sort: true,
      visible: true,
      show: true,
    },
    {
      field: 'CreatedOn',
      header: 'Date Created',
      sort: true,
      visible: true,
      show: true,
    },
    {
      field: 'Author',
      header: 'Author',
      sort: true,
      visible: true,
      show: true,
    },
    {
      field: 'Featured',
      header: 'Featured',
      sort: true,
      visible: true,
      show: true,
    },
    {
      field: 'Pin',
      header: 'Pin',
      sort: true,
      visible: false,
      show: false,
    },
    {
      field: 'PropertyEqStatus',
      header: 'Status',
      sort: true,
      visible: true,
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
  actions: any[] = [{}];
  filterColumns: any;
  filter: any = {
    PageNo: 1,
    PerPage: 10,
    Search: undefined,
    SortBy: undefined,
    SortOrder: 'Desc',
    Status: undefined,
    Type: undefined,
  };
  propertyEqDetails: any;
  constructor(
    private router: Router,
    private dialog: MatDialog,
    private loaderService: LoaderService,
    private commonStoreService: CommonStoreService,
    private toasterService: ToastrService,
    private propertyEq: PropertyEqService,
    private datePipe: DatePipe,
    private commonService: CommonService
  ) {}

  ngOnInit(): void {
    this.initializeTable();
    this.loadTableData(this.filter);
  }

  initializeTable() {
    this.tableConfig = {
      id: 'PropertyEq',
      tablename: 'All Content',
      columns: this.columns,
      rows: [],
      tools: [],
      pin: 0,
      totalRowsCount: 0,
      pageCnt: 0,
      isPaginationRequired: true,
      showActions: true,
    };
  }
  loadTableData(filter: any) {
    this.loaderService.show();
    this.propertyEq.getAllPropertyEq(filter).subscribe({
      next: (result: any) => {
        this.loaderService.hide();
        this.propertyEqDetails = result;
        this.createTableConfig(result);
      },
      error: (error: any) => {
        this.loaderService.hide();
        error.error.errors
          ? this.displayError(error.error.errors)
          : this.toasterService.error(error.error.message);
      },
    });
  }

  deletePropertyEq(id: number) {
    this.loaderService.show();
    this.propertyEq.deletePropertyEq(id).subscribe({
      next: (res: any) => {
        this.loaderService.hide();
        this.toasterService.success(res.message);
        this.loadTableData(this.filter);
      },
      error: (error: any) => {
        this.loaderService.hide();
        error.error.errors
          ? this.displayError(error.error.errors)
          : this.toasterService.error(error.error.message);
      },
    });
  }

  createTableConfig(data: any) {
    this.tableConfig = {
      ...this.tableConfig,
      totalRowsCount: data.totalCount,
      pageCnt: data.pageCount,
      tools: [
        {
          name: 'Search',
          id: 'search',
          disabled: false,
          icon: 'assets/images/search.svg',
        },
        {
          name: 'Filter',
          id: 'filter',
          disabled: false,
          icon: 'assets/images/filter.svg',
        },
        {
          name: 'Column',
          id: 'column',
          disabled: false,
          icon: 'assets/images/grid-columns.svg',
        },
        {
          name: 'Export',
          id: 'export',
          disabled: false,
          icon: 'assets/images/download.svg',
        },
      ],
      rows: [...data.PropertyEq].map((d: any) => {
        return {
          ...d,
          operations: data.FullAccess
            ? [
                {
                  name: GRID_ACTION.VIEW.TITLE,
                  icon: GRID_ACTION.VIEW.ID,
                  operationName: GRID_ACTION.VIEW.ID,
                  path: GRID_ACTION.VIEW.ICON,
                },

                {
                  name: GRID_ACTION.EDIT.TITLE,
                  icon: GRID_ACTION.EDIT.ID,
                  operationName: GRID_ACTION.EDIT.ID,
                  path: GRID_ACTION.EDIT.ICON,
                },

                {
                  name: GRID_ACTION.DELETE.TITLE,
                  icon: GRID_ACTION.DELETE.ID,
                  operationName: GRID_ACTION.DELETE.ID,
                  path: GRID_ACTION.DELETE.ICON,
                },
                ...(d
                  ? [
                      {
                        name: CONSTANTS.EDIT_SEO_OPERATION,
                        icon: CONSTANTS.EDIT,
                        operationName: CONSTANTS.EDITSEO,
                        path: 'assets/images/edit.svg',
                      },
                    ]
                  : []),
              ]
            : [
                {
                  name: GRID_ACTION.VIEW.TITLE,
                  icon: GRID_ACTION.VIEW.ID,
                  operationName: GRID_ACTION.VIEW.ID,
                  path: GRID_ACTION.VIEW.ICON,
                },
              ],
        };
      }),
    };
  }
  tableData(event: any) {
    this.filter = {
      PageNo: event.pageNumber,
      PerPage: event.pageCount,
      Search: event.searchValue,
      SortBy: event.sortBy ? event.sortBy : undefined,
      SortOrder: event.sortOrder ? event.sortOrder : undefined,
      Status: event.Status ? event.Status : undefined,
    };
    this.loadTableData(this.filter);
  }
  createPropertyEq() {
    let formConfig: any = {
      id: undefined,
      mode: FORM_MODE.CREATE,
      access: this.propertyEqDetails.FullAccess,
    };
    this.commonStoreService.setFormConfig(formConfig);
    this.router.navigate([`${ROUTE.CREATE_PROPERTY_EQ}`]);
  }

  changeRoute(route: string, formConfig: any) {
    this.commonStoreService.setFormConfig(formConfig);
    this.router.navigate([route]);
  }

  onToolbarClick(event: any) {
    this.filterData = {
      label: event.name,
      columns: this.tableConfig.columns,
      // Status: this.filterData?.Status ? this.filterData.Status : null,
      Status: this.filterData?.Status != null ? this.filterData?.Status : null,
      Type: this.filterData?.Type ? this.filterData.Type : null,
    };

    this.filter = {
      ...this.filter,
      PageNo: event.filter.pageNumber,
      PerPage: event.filter.pageSize,
      Search: event.filter.searchValue,
      SortBy: event.filter.sortBy,
      SortOrder: event.filter.sortOrder,
    };
    switch (event.name) {
      case GRID_TOOLBAR.SEARCH.NAME:
        this.filter = {
          ...this.filter,
          PageNo: 1,
        };
        this.loadTableData(this.filter);

        break;
      case GRID_TOOLBAR.FILTER.NAME:
        this.openDialog(this.filterData);
        break;
      case GRID_TOOLBAR.COLUMN.NAME:
        this.openDialog(this.filterData);
        break;
      case GRID_TOOLBAR.PAGINATION.NAME:
        this.loadTableData(this.filter);

        break;
      case GRID_TOOLBAR.SORT.NAME:
        this.loadTableData(this.filter);

        break;
      case GRID_TOOLBAR.EXPORT.NAME:
        this.filter = {
          ...this.filter,
          PerPage: 'all',
        };
        if (this.propertyEqDetails?.PropertyEq?.length) {
          this.getExcelData(this.filter);
        }
        break;
    }
  }

  getExcelData(filter: any) {
    this.loaderService.show();
    this.propertyEq.getAllPropertyEq(filter).subscribe({
      next: (res: any) => {
        this.loaderService.hide();
        this.exportExcel(res.PropertyEq);
      },
      error: (error: any) => {
        this.loaderService.hide();
        error.error.errors
          ? this.displayError(error.error.errors)
          : this.toasterService.error(error.error.message);
      },
    });
  }

  exportExcel(data: any[]) {
    var activeColumns = this.tableConfig.columns.filter(
      (x: any) => x.show && x.field != 'actions'
    );
    var excelDataList: any = [];
    data.map((x: any) => {
      var excelData: any = {};
      activeColumns.map((y: any) => {
        excelData[y.header] = x[y.field];
      });
      excelDataList.push(excelData);
    });
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(excelDataList);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, `Report`);
    XLSX.writeFile(
      wb,
      `PropertyEq-${this.datePipe.transform(
        Date.now().toString(),
        'dd-MM-yyyy'
      )}.xlsx`
    );
  }

  rowActions(data: any) {
    let formConfig: any = {
      mode: data.operation,
      id: data.rowData.PropertyEqId,
      access: this.propertyEqDetails.FullAccess,
    };
    this.commonStoreService.setFormConfig(formConfig);
    switch (data.operation) {
      case CONSTANTS.EDIT_SEO_OPERATION.toLocaleLowerCase():
        const seodialogRef = this.dialog.open(
          PropertyEqDropdownDialogComponent,
          {}
        );
        seodialogRef.afterClosed().subscribe((result: any) => {});
        break;
      case GRID_ACTION.EDIT.ID:
        this.router.navigate([ROUTE.EDIT_PROPERTY_EQ]);
        break;

      case GRID_ACTION.VIEW.ID:
        this.router.navigate([ROUTE.VIEW_PROPERTY_EQ]);
        break;

      case GRID_ACTION.DELETE.ID:
        let dialogRef = this.commonService.showModal(
          'Delete',
          'Are you sure you want to delete this property-eq?'
        );
        dialogRef.afterClosed().subscribe((result: any) => {
          if (result) {
            this.deletePropertyEq(data.rowData.PropertyEqId);
          }
        });
        break;
    }
  }
  onActionClick(event: any) {}
  openDialog(data: any) {
    const dialogRef = this.dialog.open(PropertyEqDialogComponent, {
      data: this.filterData,
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.filterData = result.clear ? undefined : result.data;
        switch (result?.data?.label) {
          case GRID_TOOLBAR.FILTER.NAME:
            this.filter = {
              ...this.filter,
              PageNo: 1,
              Status: result.clear ? null : result.data.Status,
              Type: result.clear ? null : result.data.Type,
            };
            this.loadTableData(this.filter);
            break;
          case GRID_TOOLBAR.COLUMN.NAME:
            this.tableConfig = {
              ...this.tableConfig,
              columns: result.clear ? this.columns : result.data.columns,
            };
            break;
        }
      }
    });
  }
  displayError(error: any) {
    let errors = JSON.parse(error);
    Object.keys(errors).forEach((err: any) => {
      this.toasterService.error(errors[err][0]);
    });
  }
}
