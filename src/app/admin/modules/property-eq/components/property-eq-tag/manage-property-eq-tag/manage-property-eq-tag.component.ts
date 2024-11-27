import { Component } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import {
  CONSTANTS,
  FORM_MODE,
  GRID_ACTION,
  GRID_TOOLBAR,
  ROUTE,
} from 'src/app/models/constants';
import * as XLSX from 'xlsx';
import { CommonStoreService } from 'src/app/services/common-store.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { LoaderService } from 'src/app/shared/services/loader/loader.service';
import { PropertyEqTagService } from 'src/app/admin/services/property-eq-tag.service';
import { MatDialog } from '@angular/material/dialog';
import { PropertyEqTagDialogComponent } from '../property-eq-tag-dialog/property-eq-tag-dialog.component';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-manage-property-eq-tag',
  templateUrl: './manage-property-eq-tag.component.html',
  styleUrls: ['./manage-property-eq-tag.component.scss'],
})
export class ManagePropertyEqTagComponent {
  filterColumns: any;
  tableSettings: any;
  pageNumber = 1;
  pageSize = 10;
  totalRowsCount: any;
  pageCnt: any;
  rows: any;

  filterData: any;
  tableConfig: any;
  columns: any[] = [
    {
      field: 'Title',
      header: 'Name',
      sort: true,
      visible: true,
      show: true,
    },
    {
      field: 'Type',
      header: 'Type',
      sort: true,
      visible: true,
      show: true,
    },
    {
      field: 'Description',
      header: 'Description',
      sort: false,
      visible: true,
      show: true,
    },
    {
      field: 'AddedBy',
      header: 'Created By',
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
      field: 'actions',
      header: 'Actions',
      sort: false,
      visible: false,
      show: true,
    },
  ];
  actions: any[] = [{}];
  filter: any = {
    PageNo: 1,
    PerPage: 10,
    Search: undefined,
    SortBy: undefined,
    SortOrder: 'Desc',
    Status: undefined,
    Type: undefined,
  };
  propertyEqTagDetails: any;
  type: any;
  constructor(
    private dialog: MatDialog,
    private propertyEqTagService: PropertyEqTagService,
    private router: Router,
    private loaderService: LoaderService,
    private commonService: CommonService,
    private toasterService: ToastrService,
    private datePipe: DatePipe,
    private commonStoreService: CommonStoreService
  ) {}

  ngOnInit(): void {
    this.initializeTable();
    this.loadTableData(this.filter);
  }

  initializeTable() {
    this.tableConfig = {
      id: 'PropertyEqTag',
      tablename: 'All Categories/Tags',
      columns: this.columns,
      rows: [],
      tools: [],
      totalRowsCount: 0,
      pageCnt: 0,
      isPaginationRequired: true,
      showActions: true,
    };
  }
  loadTableData(filter: any) {
    this.loaderService.show();
    this.propertyEqTagService.getAllPropertyEqTags(filter).subscribe({
      next: (result: any) => {
        this.loaderService.hide();
        this.propertyEqTagDetails = result;
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
      rows: [...data.PropertyEqTag].map((d: any) => {
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
      Type: event.type ? event.type : undefined,
    };
    this.loadTableData(this.filter);
  }
  createPropertyEqTag() {
    let formConfig: any = {
      id: undefined,
      mode: FORM_MODE.CREATE,
      access: this.propertyEqTagDetails.FullAccess,
    };
    this.commonStoreService.setFormConfig(formConfig);
    this.router.navigate([`${ROUTE.CREATE_PROPERTY_EQ_TAG}`]);
  }

  onToolbarClick(event: any) {
    this.filterData = {
      label: event.name,
      columns: this.tableConfig.columns,
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
        if (this.propertyEqTagDetails?.PropertyEqTag?.length) {
          this.getExcelData(this.filter);
        }
        break;
    }
  }

  getExcelData(filter: any) {
    this.loaderService.show();
    this.propertyEqTagService.getAllPropertyEqTags(filter).subscribe({
      next: (res: any) => {
        this.loaderService.hide();
        this.exportExcel(res.PropertyEqTag);
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
      `PropertyEqTags-${this.datePipe.transform(
        Date.now().toString(),
        'dd-MM-yyyy'
      )}.xlsx`
    );
  }

  rowActions(data: any) {
    let formConfig: any = {
      mode: data.operation,
      id: data.rowData.PropertyEqTagId,
      access: this.propertyEqTagDetails.FullAccess,
    };
    this.commonStoreService.setFormConfig(formConfig);
    switch (data.operation) {
      case GRID_ACTION.EDIT.ID:
        this.router.navigate([ROUTE.EDIT_PROPERTY_EQ_TAG]);
        break;

      case GRID_ACTION.VIEW.ID:
        this.router.navigate([ROUTE.VIEW_PROPERTY_EQ_TAG]);
        break;

      case GRID_ACTION.DELETE.ID:
        let dialogRef = this.commonService.showModal(
          'Delete',
          'Are you sure you want to delete this propertyeq tag?'
        );
        dialogRef.afterClosed().subscribe((result: any) => {
          if (result) {
            this.deletePropertyEqTag(data.rowData.PropertyEqTagId);
          }
        });
        break;
    }
  }

  onActionClick(event: any) {}
  openDialog(data: any) {
    const dialogRef = this.dialog.open(PropertyEqTagDialogComponent, {
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

  deletePropertyEqTag(id: number) {
    this.loaderService.show();
    this.propertyEqTagService.deletePropertyEqTag(id).subscribe({
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
}
