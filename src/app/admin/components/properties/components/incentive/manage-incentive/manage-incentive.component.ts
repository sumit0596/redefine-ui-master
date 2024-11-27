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
import { CommonStoreService } from 'src/app/services/common-store.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { LoaderService } from 'src/app/shared/services/loader/loader.service';
import { IncentiveService } from '../../../../../services/incentive.service';
import * as XLSX from 'xlsx';
import { DatePipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { IncentivesDialogComponent } from '../incentives-dialog/incentives-dialog.component';

@Component({
  selector: 'app-incentives',
  templateUrl: './manage-incentive.component.html',
  styleUrls: ['./manage-incentive.component.scss'],
})
export class ManageIncentiveComponent {
  filterData: any;
  tableConfig: any;
  columns: any[] = [
    { field: 'Title', header: 'Name', sort: true, visible: true, show: true },
    {
      field: 'AdditionalInformation',
      header: 'Description',
      sort: false,
      visible: true,
      show: true,
    },
    {
      field: 'Visibility',
      header: 'Visibility',
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
  incentivesDetails: any;
  filterColumns: any;
  filter: any = {
    PageNo: 1,
    PerPage: 10,
    Search: undefined,
    SortBy: undefined,
    SortOrder: 'Desc',
  };
  constructor(
    private incentiveService: IncentiveService,
    private router: Router,
    private loaderService: LoaderService,
    private commonService: CommonService,
    private toasterService: ToastrService,
    private commonStoreService: CommonStoreService,
    private datePipe: DatePipe,
    private dialog: MatDialog
  ) {}
  ngOnInit(): void {
    this.initializeTable();
    this.loadTableData(this.filter);
  }
  initializeTable() {
    this.tableConfig = {
      id: 'Incentive',
      tablename: 'Incentives',
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
    this.incentiveService.getAllIncentives(filter).subscribe({
      next: (result: any) => {
        this.loaderService.hide();
        this.incentivesDetails = result;
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
    data.incentives.forEach((element: any) => {
      element.CreatedOn = new Date(element.CreatedOn);
      element.CreatedOn = moment(element.CreatedOn).format('DD/MM/YYYY');
    });
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
      rows: [...data.incentives].map((d: any) => {
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
      PerPage: event.pageSize,
      Search: event.searchValue,
      SortBy: event.sortBy ? event.sortBy : undefined,
      SortOrder: event.sortOrder ? event.sortOrder : undefined,
    };
    this.loadTableData(this.filter);
  }
  createIncentive() {
    let formConfig = {
      id: undefined,
      mode: FORM_MODE.CREATE,
    };
    this.commonStoreService.setFormConfig(formConfig);
    this.router.navigate([`${ROUTE.CREATE_INCENTIVE}`]);
  }
  changeRoute(route: string, formConfig: any) {
    this.commonStoreService.setFormConfig(formConfig);
    this.router.navigate([route]);
  }
  getExcelData(filter: any) {
    this.loaderService.show();
    this.incentiveService.getAllIncentives(filter).subscribe({
      next: (res: any) => {
        this.loaderService.hide();
        res?.incentives?.forEach((element: any) => {
          element.CreatedOn = new Date(element.CreatedOn);
          element.CreatedOn = moment(element.CreatedOn).format('DD/MM/YYYY');
        });
        this.exportExcel(res.incentives);
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
      `Incentives-${this.datePipe.transform(
        Date.now().toString(),
        'dd-MM-yyyy'
      )}.xlsx`
    );
  }
  onActionClick(event: any) {}
  onToolbarClick(event: any) {
    this.filterData = {
      label: event.name,
      columns: this.tableConfig.columns,
      status: this.filterData?.status != null ? this.filterData?.status : null,
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
        this.filterData = {
          ...this.filterData,
          Search:
            event.filter.searchValue ||
            event.filter.searchValue == '' ||
            event.filter.searchValue == null
              ? null
              : this.filterData.Search,
        };
        this.loadTableData(this.filter);
        break;
      case GRID_TOOLBAR.COLUMN.NAME:
        this.openDialog(this.filterData);
        break;
      case GRID_TOOLBAR.EXPORT.NAME:
        this.filter = {
          ...this.filter,
          PerPage: 'all',
        };
        if (this.incentivesDetails?.incentives?.length) {
          this.getExcelData(this.filter);
        }
        break;
      case GRID_TOOLBAR.PAGINATION.NAME:
        this.loadTableData(this.filter);
        break;
      case GRID_TOOLBAR.SORT.NAME:
        this.loadTableData(this.filter);
        break;
    }
  }
  async rowActions(data: any) {
    let formConfig: any = {
      mode: data.operation,
      id: data.rowData.IncentiveId,
      access: this.incentivesDetails.FullAccess,
    };
    await this.commonStoreService.setFormConfig(formConfig);
    switch (data.operation) {
      case GRID_ACTION.EDIT.ID:
        this.router.navigate([ROUTE.EDIT_INCENTIVE]);
        break;

      case GRID_ACTION.VIEW.ID:
        this.router.navigate([ROUTE.VIEW_INCENTIVE]);
        break;

      case GRID_ACTION.DELETE.ID:
        const dialogRef = this.commonService.showModal(
          'Delete',
          CONSTANTS.INCENTIVE_DELETE_CONFIRMATION
        );
        dialogRef.afterClosed().subscribe((action: any) => {
          if (action) {
            this.loaderService.show();
            this.incentiveService
              .deleteIncentive(data.rowData.IncentiveId)
              .subscribe({
                next: (res: any) => {
                  this.toasterService.success(res.message);
                  this.loadTableData(this.filter);
                  this.loaderService.hide();
                },
                error: (error: any) => {
                  this.loaderService.hide();
                  this.toasterService.error(error.error.message);
                },
              });
          }
        });
        break;
    }
  }

  openDialog(data: any) {
    const dialogRef = this.dialog.open(IncentivesDialogComponent, {
      data: this.filterData,
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.filterData = result?.data;
        switch (result?.data?.label) {
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
