import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { InvestorService } from 'src/app/admin/services/investor.service';
import {
  FORM_MODE,
  GRID_ACTION,
  GRID_TOOLBAR,
  ROUTE,
  STATUS,
} from 'src/app/models/constants';
import { CommonStoreService } from 'src/app/services/common-store.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { LoaderService } from 'src/app/shared/services/loader/loader.service';
import { IntegratedReportDialogComponent } from '../integrated-report-dialog/integrated-report-dialog.component';
import * as XLSX from 'xlsx';
import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { INTEGRATED_REPORT_STATUS } from 'src/app/models/enum';

@Component({
  selector: 'app-manage-integrated-report',
  templateUrl: './manage-integrated-report.component.html',
  styleUrls: ['./manage-integrated-report.component.scss'],
})
export class ManageIntegratedReportComponent implements OnInit {
  filterData: any;
  tableConfig: any;
  columns: any[] = [
    {
      field: 'Year',
      header: 'Year',
      sort: true,
      visible: true,
      show: true,
    },
    {
      field: 'Publishdatetime',
      header: 'Publish date and time',
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
      field: 'IntegratedReportStatus',
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
  };
  integratedReportDetails: any;
  constructor(
    private router: Router,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private loaderService: LoaderService,
    private commonService: CommonService,
    private investorService: InvestorService,
    private commonStoreService: CommonStoreService,
    private datePipe: DatePipe,
    private toasterService: ToastrService
  ) {}
  ngOnInit(): void {
    this.initializeTable();
    this.loadTableData(this.filter);
  }
  initializeTable() {
    this.tableConfig = {
      id: 'IntegratedReport',
      tablename: 'All Integrated reports',
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
    this.investorService.getAllIntegratedReport(filter).subscribe({
      next: (result: any) => {
        this.loaderService.hide();
        this.integratedReportDetails = result;
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
  updateReportStatus(id: number, status: number) {
    this.loaderService.show();
    this.investorService.updateStatus(id, status).subscribe({
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
      rows: [...data.integratedreport].map((d: any) => {
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
                ...(d.IntegratedReportStatus != STATUS.ARCHIVED
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
      PerPage: event.pageSize,
      Search: event.searchValue,
      SortBy: event.sortBy ? event.sortBy : undefined,
      SortOrder: event.sortOrder ? event.sortOrder : undefined,
    };
    this.loadTableData(this.filter);
  }
  createIntegratedReport() {
    let years: any = [...this.integratedReportDetails.integratedreport].map(
      (report: any) => report.Year
    );
    let formConfig: any = {
      id: undefined,
      mode: FORM_MODE.CREATE,
      access: this.integratedReportDetails.FullAccess,
      year: years.length ? Math.max(years) : new Date().getFullYear(),
    };
    this.changeRoute(ROUTE.CREATE_INTEGRATED_REPORT, formConfig);
  }
  changeRoute(route: string, formConfig: any) {
    this.commonStoreService.setFormConfig(formConfig);
    this.router.navigate([route]);
  }
  getExcelData(filter: any) {
    this.loaderService.show();
    this.investorService.getAllIntegratedReport(filter).subscribe({
      next: (res: any) => {
        this.loaderService.hide();
        this.exportExcel(res.integratedreport);
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
    //     Title: d.Title,
    //     'Publish date and time': d.Publishdatetime,
    //     Year: d.Year,
    //     'Created By': d.AddedBy,
    //     Status: d.IntegratedReportStatus,
    //   };
    // });

    var activeColumns = this.tableConfig.columns.filter((x:any)=> x.show && x.field != 'actions');   
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
      `IntegratedReport-${this.datePipe.transform(
        Date.now().toString(),
        'dd-MM-yyyy'
      )}.xlsx`
    );
  }
  onToolbarClick(event: any) {
    this.filterData = {
      label: event.name,
      columns: this.tableConfig.columns,
      status: (this.filterData?.status != null) ? this.filterData.status : null,
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
        if (this.integratedReportDetails?.integratedreport?.length) {
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
  rowActions(data: any) {
    let formConfig: any = {
      mode: data.operation,
      id: data.rowData.IntegratedReportId,
      access: this.integratedReportDetails.FullAccess,
    };
    switch (data.operation) {
      case GRID_ACTION.EDIT.ID:
        this.changeRoute(ROUTE.EDIT_INTEGRATED_REPORT, formConfig);
        break;

      case GRID_ACTION.VIEW.ID:
        this.changeRoute(ROUTE.VIEW_INTEGRATED_REPORT, formConfig);

        break;

      case GRID_ACTION.ARCHIVE.ID:
        let dialogRef = this.commonService.showModal(
          'Archive',
          `Are you sure you want to archive the report?`
        );
        dialogRef.afterClosed().subscribe((result) => {
          if (result) {
            this.updateReportStatus(
              data.rowData.IntegratedReportId,
              INTEGRATED_REPORT_STATUS.ARCHIVE
            );
          }
        });
        break;
    }
  }
  onActionClick(event: any) {}
  openDialog(data: any) {
    const dialogRef = this.dialog.open(IntegratedReportDialogComponent, {
      data: this.filterData,
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.filterData = result?.data;
        switch (result?.data?.label) {
          case GRID_TOOLBAR.FILTER.NAME:
            this.filter = {
              ...this.filter,
              Status: result.clear ? '' : result.data.status,
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
