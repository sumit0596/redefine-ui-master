import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import {
  GRID_ACTION,
  STATUS,
  FORM_MODE,
  ROUTE,
  GRID_TOOLBAR,
} from 'src/app/models/constants';
import { CommonStoreService } from 'src/app/services/common-store.service';
import { LoaderService } from 'src/app/shared/services/loader/loader.service';
import { PressReleaseService } from 'src/app/admin/services/press-release.service';
import { PressReleaseDialogComponent } from '../press-release-dialog/press-release-dialog.component';
import * as XLSX from 'xlsx';
import { CommonService } from 'src/app/shared/services/common.service';

@Component({
  selector: 'app-manage-press-release',
  templateUrl: './manage-press-release.component.html',
  styleUrls: ['./manage-press-release.component.scss'],
})
export class ManagePressReleaseComponent {
  filterData: any;
  tableConfig: any;
  type: any;
  columns: any[] = [
    {
      field: 'Title',
      header: 'Press Release Title',
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
      field: 'AddedBy',
      header: 'Created By',
      sort: true,
      visible: true,
      show: true,
    },
    {
      field: 'PressReleaseStatus',
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
    Year: undefined,
  };
  pressReleaseDetails: any;
  constructor(
    private router: Router,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private loaderService: LoaderService,
    private commonStoreService: CommonStoreService,
    private toasterService: ToastrService,
    private pressReleaseService: PressReleaseService,
    private datePipe: DatePipe,
    private commonService : CommonService
  ) {}

  ngOnInit(): void {
    this.initializeTable();
    this.loadTableData(this.filter, this.type);
  }

  initializeTable() {
    this.tableConfig = {
      id: 'PressRelease',
      tablename: 'All Press Releases',
      columns: this.columns,
      rows: [],
      tools: [],
      totalRowsCount: 0,
      pageCnt: 0,
      isPaginationRequired: true,
      showActions: true,
    };
  }
  loadTableData(filter: any, type: any) {
    this.type = this.router.url == ROUTE.MANAGE_PRESS_RELEASE ? 1 : 2;

    this.loaderService.show();
    this.pressReleaseService.getAllPressRelease(filter, this.type).subscribe({
      next: (result: any) => {
        this.loaderService.hide();
        this.pressReleaseDetails = result;
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
  updatePressReleaseStatus(id: number, status: number) {
    this.loaderService.show();
    this.pressReleaseService.updateStatus(id, status).subscribe({
      next: (res: any) => {
        this.loaderService.hide();
        this.toasterService.success(res.message);
        this.loadTableData(this.filter, this.type);
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
      rows: [...data.pressrelease].map((d: any) => {
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
                ...(d.PressReleaseStatus != STATUS.ARCHIVED
                  ? [
                      {
                        name: GRID_ACTION.ARCHIVE.TITLE,
                        icon: GRID_ACTION.ARCHIVE.ID,
                        operationName: GRID_ACTION.ARCHIVE.ID,
                        path: GRID_ACTION.ARCHIVE.ICON,
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
      Status: event.PressReleaseStatus ? event.PressReleaseStatus : undefined,
    };
    this.loadTableData(this.filter, this.type);
  }
  createPressRelease() {
    let formConfig: any = {
      id: undefined,
      mode: FORM_MODE.CREATE,
      access: this.pressReleaseDetails.FullAccess,
    };
    if (this.type == 1) {
      this.changeRoute(ROUTE.CREATE_PRESS_RELEASE, formConfig);
    } else if (this.type == 2) {
      this.changeRoute(ROUTE.CREATE_PRESS, formConfig);
    }
  }
  changeRoute(route: string, formConfig: any) {
    this.commonStoreService.setFormConfig(formConfig);
    this.router.navigate([route]);
  }

  onToolbarClick(event: any) {
    this.filterData = {
      label: event.name,
      columns: this.tableConfig.columns,
      Status: this.filterData?.Status ? this.filterData.Status : null,
      Year: this.filterData?.Year ? this.filterData.Year : null,
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
        this.loadTableData(this.filter, this.type);

        break;
      case GRID_TOOLBAR.FILTER.NAME:
        this.openDialog(this.filterData);
        break;
      case GRID_TOOLBAR.COLUMN.NAME:
        this.openDialog(this.filterData);
        break;
      case GRID_TOOLBAR.PAGINATION.NAME:
        this.loadTableData(this.filter, this.type);

        break;
      case GRID_TOOLBAR.SORT.NAME:
        this.loadTableData(this.filter, this.type);

        break;
      case GRID_TOOLBAR.EXPORT.NAME:
        this.filter = {
          ...this.filter,
          PerPage: 'all',
        };
        this.getExcelData(this.filter);
        break;
    }
  }

  getExcelData(filter: any) {
    this.type = this.router.url == ROUTE.MANAGE_PRESS_RELEASE ? 1 : 2;

    this.loaderService.show();
    this.pressReleaseService.getAllPressRelease(filter, this.type).subscribe({
      next: (res: any) => {
        this.loaderService.hide();
        this.exportExcel(res.pressrelease);
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
    // let sheetData = data.map((d: any) => {
    //   return {
    //     'Press Release Title': d.Title,
    //     'Date Created': d.CreatedOn,
    //     'Created By': d.AddedBy,
    //     Status: d.PressReleaseStatus,
    //   };
    // });
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
      `PressRelease-${this.datePipe.transform(
        Date.now().toString(),
        'dd-MM-yyyy'
      )}.xlsx`
    );
  }

  rowActions(data: any) {
    let formConfig: any = {
      mode: data.operation,
      id: data.rowData.PressReleaseId,
      access: this.pressReleaseDetails.FullAccess,
    };
    switch (data.operation) {
      case GRID_ACTION.EDIT.ID:
        if (this.type == 1) {
          this.changeRoute(ROUTE.EDIT_PRESS_RELEASE, formConfig);
        } else if (this.type == 2) {
          this.changeRoute(ROUTE.EDIT_PRESS, formConfig);
        }

        break;

      case GRID_ACTION.VIEW.ID:
        if (this.type == 1) {
          this.changeRoute(ROUTE.VIEW_PRESS_RELEASE, formConfig);
        } else if (this.type == 2) {
          this.changeRoute(ROUTE.VIEW_PRESS, formConfig);
        }
        //this.changeRoute(ROUTE.VIEW_PRESS_RELEASE, formConfig);

        break;

      case GRID_ACTION.ARCHIVE.ID:
        let dialogRef = this.commonService.showModal(
          'Archive',
          'Are you sure you want to archive this press-release?');
        dialogRef.afterClosed().subscribe((result: any) => {
          if (result) {
            this.updatePressReleaseStatus(data.rowData.PressReleaseId, 2);
          }
        });
        break;
    }
  }
  onActionClick(event: any) {}
  openDialog(data: any) {
    const dialogRef = this.dialog.open(PressReleaseDialogComponent, {
      data: this.filterData,
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.filterData = result?.data;
        switch (result?.data?.label) {
          case GRID_TOOLBAR.FILTER.NAME:
            this.filter = {
              ...this.filter,
              PageNo: 1,
              Status: result.clear ? null : result.data.Status,
              Year: result.clear ? null : result.data.Year,
            };
            this.loadTableData(this.filter, this.type);
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
