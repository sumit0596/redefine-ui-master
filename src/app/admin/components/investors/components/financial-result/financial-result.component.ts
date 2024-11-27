import { Component, OnDestroy } from '@angular/core';
import { ContextContainer } from 'src/app/core/context/context-container';
import { Router } from '@angular/router';
import { BaseComponent } from 'src/app/core/base.component';
import {
  CONSTANTS,
  FORM_MODE,
  GRID_ACTION,
  GRID_TOOLBAR,
  ROUTE,
  STATUS,
} from 'src/app/models/constants';
import {
  FinancialResultService,
} from 'src/app/admin/services/financial-result.service';
import { FinancialResultDialogComponent } from './financial-result-dialog/financial-result-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import * as XLSX from 'xlsx';
import { DatePipe } from '@angular/common';
import { FINANCIAL_RESULTS_STATUS } from 'src/app/models/enum';

@Component({
  selector: 'app-financial-result',
  templateUrl: './financial-result.component.html',
  styleUrls: ['./financial-result.component.scss'],
})
export class FinancialResultComponent
  extends BaseComponent
  implements OnDestroy
{
  financialResultDetails: any;
  filterData: any;
  filter: any = {
    PageNo: 1,
    PerPage: 10,
    Search: undefined,
    SortBy: undefined,
    SortOrder: 'Desc',
    Type: undefined,
    Status: undefined,
  };
  year = new Date().getFullYear();
  constructor(
    context: ContextContainer,
    private financialResultService: FinancialResultService,
    private router: Router,
    private dialog: MatDialog,
    private datePipe: DatePipe
  ) {
    super(context);
  }

  override ngOnInit(): void {
    this.setColumnHeaders();
    this.initializeTableSettings('Financial Results');
    this.getAllFinancialResultGridData();
  }
  createFinancialResult() {
    let formConfig = {
      id: 0,
      mode: FORM_MODE.CREATE,
      access: this.financialResultDetails.FullAccess,
    };
    this.context.commonStoreService.setFormConfig(formConfig);
    this.router.navigate([`${ROUTE.CREATE_FINANCIAL_RESULT}`]);
  }

  tableData(event: any) {
    this.getFinancialResultData(event);
  }

  getAllFinancialResultGridData(pageSize?: any, pageNumber?: any) {
    this.context.loaderService.show();
    this.financialResultService.getFinancialResultData(this.filter).subscribe({
      next: (res) => {
        this.financialResultDetails = res.data;
        this.financialResultData(res);
      },
      error: (error) => {
        this.context.loaderService.hide();
        this.context.toasterService.error(error.error.message);
      },
      complete: () => {
        this.context.loaderService.hide();
      },
    });
  }
  getExcelData(filter: any) {
    this.context.loaderService.show();
    this.financialResultService.getFinancialResultData(filter).subscribe({
      next: (res: any) => {
        this.context.loaderService.hide();
        this.exportExcel(res.data.financialresults);
      },
      error: (error: any) => {
        this.context.loaderService.hide();
        error.error.errors
          ? this.displayError(error.error.errors)
          : this.context.toasterService.error(error.error.message);
      },
    });
  }
  private getFinancialResultData(event: any) {
    this.context.loaderService.show();
    this.financialResultService.getFinancialResultData(this.filter).subscribe({
      next: (res) => {
        this.financialResultData(res);
      },
      error: (error: ErrorEvent) => {
        this.context.toasterService.error(error.error.message);
        this.context.loaderService.hide();
      },
      complete: () => {
        this.context.loaderService.hide();
      },
    });
  }
  updateResultStatus(id: number, status: any) {
    this.context.loaderService.show();
    this.financialResultService.updateResultStatus(id, status).subscribe({
      next: (res) => {
        this.context.loaderService.hide();
        this.context.toasterService.success(res.message);
        this.getAllFinancialResultGridData();
      },
      error: (error: ErrorEvent) => {
        this.context.toasterService.error(error.error.message);
        this.context.loaderService.hide();
      },
    });
  }
  transformGridData(data: any[]) {
    (data || []).forEach((row: any) => {
      row.PublishDate =
        row.PublishDate !== null && row.PublishDate != ''
          ? new Date(row.PublishDate).getFullYear()
          : null;
    });
    return data;
  }

  private financialResultData(res: any) {
    this.initializeTableSettings('Financial Results');
    if (res.data) {
      res.data.financialresults = this.transformGridData(
        res.data.financialresults
      );
      this.totalRowsCount = res.data.totalCount;
      this.pageCnt = res.data.pageCount;
      if (res.data.FullAccess === 1) {
        res.data.financialresults.forEach((e: any) => {
          e.operations = [
            {
              name: CONSTANTS.VIEW,
              icon: CONSTANTS.DETAILS_ICON,
              operationName: CONSTANTS.VIEW,
              path: 'assets/images/eye.svg',
            },
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
        res.data.financialresults.forEach((e: any) => {
          e.operations = [
            {
              name: CONSTANTS.VIEW,
              icon: CONSTANTS.DETAILS_ICON,
              operationName: CONSTANTS.VIEW,
            },
          ];
        });
      }
      this.rows = [...res.data.financialresults].map((d: any) => {
        return {
          ...d,
          operations: res.data.FullAccess
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
                ...(d.FinancialResultsStatus == STATUS.DRAFT
                  ? [
                      {
                        name: GRID_ACTION.ARCHIVE.TITLE,
                        icon: GRID_ACTION.ARCHIVE.ID,
                        operationName: GRID_ACTION.ARCHIVE.ID,
                        path: GRID_ACTION.ARCHIVE.ICON,
                      },
                    ]
                  : []),
                // {
                //   name: GRID_ACTION.DELETE.TITLE,
                //   icon: GRID_ACTION.DELETE.ID,
                //   operationName: GRID_ACTION.DELETE.ID,
                //   path: GRID_ACTION.DELETE.ICON,
                // },
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
      });
      this.tableSettings = {
        rows: this.rows,
        columns: this.columns,
        id: 'FinancialResultId',
        totalRowsCount: this.totalRowsCount,
        pageCnt: this.pageCnt,
        tablename: 'Financial Results',
        isPaginationRequired: true,
        isFilterRequired: true,
        isSearchRequired: true,
        isColumnGroupRequired: true,
        isDownloadRequired: true,
        showActions: true,
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
        field: 'PublishDate',
        header: 'Year Published',
        sort: true,
        visible: true,
        show: true,
      },
      { field: 'Type', header: 'Type', sort: true, visible: true, show: true },
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
        field: 'FinancialResultsStatus',
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
    this.filterColumns = this.columns;
  }

  async rowActions(data: any) {
    let formConfig: any = {
      mode: data.operation,
      id: data.rowData.FinancialResultsId,
      access: this.financialResultDetails.FullAccess,
    };
    await this.context.commonStoreService.setFormConfig(formConfig);
    if (data.operation === CONSTANTS.VIEW.toLocaleLowerCase()) {
      this.router.navigate([`${ROUTE.VIEW_FINANCIAL_RESULT}`]);
    } else if (data.operation === CONSTANTS.EDIT) {
      this.router.navigate([`${ROUTE.EDIT_FINANCIAL_RESULT}`]);
    } else if (data.operation === CONSTANTS.DELETE.toLowerCase()) {
      const dialogRef = this.context.commonService.dialog(
        CONSTANTS.FINANCIAL_RESULT_DELETE_CONFIRMATION,
        CONSTANTS.NO,
        CONSTANTS.YES
      );
      dialogRef.afterClosed().subscribe((action: any) => {
        if (action === CONSTANTS.YES) {
          this.context.loaderService.show();
          this.financialResultService
            .deleteResult(data.rowData.FinancialResultsId)
            .subscribe({
              next: (res) => {
                this.context.loaderService.hide();
                this.context.toasterService.success(res.message);
                this.getAllFinancialResultGridData(
                  data.pageSize,
                  data.activePageNumber
                );
              },
              complete: () => {
                this.context.loaderService.hide();
              },
              error: (error) => {
                this.context.loaderService.hide();
                this.context.toasterService.error(error.error.message);
              },
            });
        }
      });
    } else if (data.operation == GRID_ACTION.ARCHIVE.ID) {
      let dialogRef = this.context.commonService.showModal(
        'Archive',
        'Are you sure you want to archive the financial result?'
      );
      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          this.updateResultStatus(
            data.rowData.FinancialResultsId,
            FINANCIAL_RESULTS_STATUS.ARCHIVE
          );
        }
      });
    }
  }
  onToolbarClick(event: any) {
    this.filterData = {
      label: event.name,
      columns: this.tableSettings.columns,
      Status: this.filterData ? this.filterData.Status : null,
      Type: this.filterData ? this.filterData.Type : null,
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
            event.filter.searchValue == '' || event.filter.searchValue == null
              ? null
              : this.filterData.Search
          // Type:
          //   event.filter.searchValue == '' || event.filter.searchValue == null
          //     ? null
          //     : this.filterData.Type,
        };
        this.getAllFinancialResultGridData(this.filter);
        break;
      case GRID_TOOLBAR.FILTER.NAME:
        this.openDialog(this.filterData);
        break;
      case GRID_TOOLBAR.COLUMN.NAME:
        this.openDialog(this.filterData);
        break;
      case GRID_TOOLBAR.EXPORT.NAME:
        this.filter = {
          ...this.filter,
          PerPage: 'all',
        };
        if (this.financialResultDetails?.financialresults?.length) {
          this.getExcelData(this.filter);
        }
        break;
      case GRID_TOOLBAR.PAGINATION.NAME:
        this.getAllFinancialResultGridData(this.filter);
        break;
      case GRID_TOOLBAR.SORT.NAME:
        this.getAllFinancialResultGridData(this.filter);
        break;
    }
  }
  onActionClick(event: any) {}
  openDialog(data: any) {
    const dialogRef = this.dialog.open(FinancialResultDialogComponent, {
      data: this.filterData,
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.filterData = result.clear ? undefined : result.data;
        switch (result?.data?.label) {
          case GRID_TOOLBAR.FILTER.NAME:
            this.filter = {
              ...this.filter,
              Type: result.clear ? null : result.data.Type,
              Status: result.clear ? null : result.data.Status,
            };
            this.getAllFinancialResultGridData(this.filter);
            break;
          case GRID_TOOLBAR.COLUMN.NAME:
            this.tableSettings = {
              ...this.tableSettings,
              columns: result.clear ? this.columns : result.data.columns,
            };
            break;
        }
      }
    });
  }
  exportExcel(data: any[]) {
    // let sheetData = data.map((d: any) => {
    //   return {
    //     Title: d.Title,
    //     Type: d.Type,
    //     'Year Published': this.datePipe.transform(d.PublishDate, 'yyyy'),
    //     'Date Created': d.CreatedOn,
    //     'Created By': d.AddedBy,
    //     Status: d.FinancialResultsStatus,
    //   };
    // });
    var activeColumns = this.tableSettings.columns.filter((x:any)=> x.show && x.field != 'actions');   
    var excelDataList :any=[];
    data.map((x:any)=>{
      var excelData:any ={};
      activeColumns.map((y:any) =>{
        excelData[y.header] = x[y.field];
      });
      excelDataList.push(excelData)
    });
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(excelDataList);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, `Report`);
    XLSX.writeFile(
      wb,
      `FinancialResult-${this.datePipe.transform(
        Date.now().toString(),
        'dd-MM-yyyy'
      )}.xlsx`
    );
  }
  displayError(error: any) {
    let errors = JSON.parse(error);
    Object.keys(errors).forEach((err: any) => {
      this.context.toasterService.error(errors[err][0]);
    });
  }
}
