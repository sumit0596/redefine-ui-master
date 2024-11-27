import { DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { EnquiriesService } from 'src/app/admin/services/enquiries.service';
import {
  GRID_ACTION,
  ROUTE,
  GRID_TOOLBAR,
  SESSION,
} from 'src/app/models/constants';
import { CommonStoreService } from 'src/app/services/common-store.service';
import { LoaderService } from 'src/app/shared/services/loader/loader.service';
import * as XLSX from 'xlsx';
import { EnquiriesDialogComponent } from '../enquiries-dialog/enquiries-dialog.component';

@Component({
  selector: 'app-manage-enquiries',
  templateUrl: './manage-enquiries.component.html',
  styleUrls: ['./manage-enquiries.component.scss'],
})
export class ManageEnquiriesComponent implements OnInit, OnDestroy {
  filterData: any;
  tableConfig: any;
  columns: any[] = [
    {
      field: 'Name',
      header: 'Name of Enquirer',
      sort: true,
      visible: true,
      show: true,
    },
    {
      field: 'EnquiryType',
      header: 'Enquiry Type',
      sort: true,
      visible: true,
      show: true,
    },
    {
      field: 'CreatedOn',
      header: 'Date Sent',
      sort: true,
      visible: true,
      show: true,
    },
    {
      field: 'Status',
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
    SortOrder: 'Asc',
    Status: undefined,
    EnquiryTypeId: undefined,
  };
  enquiryDetails: any;
  constructor(
    private router: Router,
    private dialog: MatDialog,
    private loaderService: LoaderService,
    private commonStoreService: CommonStoreService,
    private toasterService: ToastrService,
    private datePipe: DatePipe,
    private enquiriesService: EnquiriesService
  ) {}

  ngOnDestroy(): void {
    sessionStorage.removeItem(SESSION.ENQUIRY_TYPE);
  }

  ngOnInit(): void {
    this.initializeTable();
    this.loadTableData(this.filter);
  }

  initializeTable() {
    this.tableConfig = {
      id: 'Enquiries',
      tablename: 'All Enquiries',
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
    this.enquiriesService.getAllEnquiries(filter).subscribe({
      next: (result: any) => {
        this.loaderService.hide();
        this.enquiryDetails = result;
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
      rows: [...data.people].map((d: any) => {
        return {
          ...d,
          operations: data.FullAccess
            ? [
                {
                  name:
                    GRID_ACTION.VIEW.TITLE + ' / ' + GRID_ACTION.RESPOND.TITLE,
                  icon: GRID_ACTION.VIEW.ID,
                  operationName: GRID_ACTION.VIEW.ID,
                  path: GRID_ACTION.VIEW.ICON,
                },
                // {
                //   name: GRID_ACTION.RESPOND.TITLE,
                //   icon: GRID_ACTION.RESPOND.ID,
                //   operationName: GRID_ACTION.RESPOND.ID,
                //   path: GRID_ACTION.RESPOND.ICON,
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

  changeRoute(route: string, formConfig: any) {
    this.commonStoreService.setFormConfig(formConfig);
    this.router.navigate([route]);
  }

  onToolbarClick(event: any) {
    this.filterData = {
      label: event.name,
      columns: this.tableConfig.columns,
      Status: this.filterData ? this.filterData.Status : null,
      EnquiryTypeId: this.filterData?.EnquiryTypeId
        ? this.filterData.EnquiryTypeId
        : null,
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
        this.getExcelData(this.filter);
        break;
    }
  }

  getExcelData(filter: any) {
    this.loaderService.show();
    this.enquiriesService.getAllEnquiries(filter).subscribe({
      next: (res: any) => {
        this.loaderService.hide();
        this.exportExcel(res.people);
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
    let sheetData = data.map((d: any) => {
      return {
        'Name of Enquirer': d.Name,
        'Enquire Type': d.EnquiryType,
        'Date Sent': d.CreatedOn,
        Status: d.Status,
      };
    });
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(sheetData);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, `Report`);
    XLSX.writeFile(
      wb,
      `Enquiries-${this.datePipe.transform(
        Date.now().toString(),
        'dd-MM-yyyy'
      )}.xlsx`
    );
  }

  rowActions(data: any) {
    let formConfig: any = {
      mode: data.operation,
      id: data.rowData.EnquiryId,
      access: this.enquiryDetails.FullAccess,
    };
    switch (data.operation) {
      case GRID_ACTION.VIEW.ID:
        this.changeRoute(ROUTE.VIEW_ENQUIRY, formConfig);
        break;
      case GRID_ACTION.RESPOND.ID:
        this.changeRoute(ROUTE.VIEW_ENQUIRY, formConfig);
        break;
    }
  }
  onActionClick(event: any) {}
  openDialog(data: any) {
    const dialogRef = this.dialog.open(EnquiriesDialogComponent, {
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
              EnquiryTypeId: result.clear ? null : result.data.EnquiryTypeId,
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
