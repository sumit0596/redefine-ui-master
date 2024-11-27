import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable, of } from 'rxjs';
import { EventService } from 'src/app/admin/services/event.service';
import * as XLSX from 'xlsx';
import {
  CONSTANTS,
  ROUTE,
  FORM_MODE,
  GRID_ACTION,
  STATUS,
  GRID_TOOLBAR,
} from 'src/app/models/constants';
import { CommonStoreService } from 'src/app/services/common-store.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { LoaderService } from 'src/app/shared/services/loader/loader.service';
import { DatePipe } from '@angular/common';
import { EventsDialogComponent } from '../events-dialog/events-dialog.component';
@Component({
  selector: 'app-manage-events',
  templateUrl: './manage-events.component.html',
  styleUrls: ['./manage-events.component.scss'],
})
export class ManageEventsComponent {
  rows: any;
  totalRowsCount: any;
  pageCnt: any;
  tableSettings: any;
  pageNumber = 1;
  pageSize = 10;

  filterData: any;
  tableConfig: any;
  eventStatus$: Observable<any[]> = of([
    {
      Id: 1,
      Name: 'Published',
    },
    {
      Id: 2,
      Name: 'Archived',
    },
  ]);

  columns: any[] = [
    {
      field: 'Title',
      header: 'Name',
      sort: true,
      visible: true,
      show: true,
    },
    {
      field: 'EventCategoryName',
      header: 'Category',
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
      field: 'EventStatus',
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

  activeRoute: string = '';
  access: any;
  params: any;
  eventsDetails: any;
  constructor(
    private eventService: EventService,
    private router: Router,
    private loaderService: LoaderService,
    private commonService: CommonService,
    private toasterService: ToastrService,
    private commonStoreService: CommonStoreService,
    private dialog: MatDialog,
    private datePipe: DatePipe
  ) {
    this.activeRoute = router.url;
  }
  async ngOnInit() {
    this.initializeTable();
    this.loadTableData(this.filter);
  }

  initializeTable() {
    this.tableConfig = {
      id: 'Events',
      tablename: 'All Events',
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
    this.eventService.getAllEvents(filter).subscribe({
      next: (result: any) => {
        this.loaderService.hide();
        this.eventsDetails = result;
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
      rows: [...data.events].map((d: any) => {
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

                ...(d.EventStatus != STATUS.ARCHIVED
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

  createEvent() {
    let formConfig = {
      id: undefined,
      mode: FORM_MODE.CREATE,
    };
    this.commonStoreService.setFormConfig(formConfig);
    this.router.navigate([`${ROUTE.CREATE_EVENT}`]);
  }

  changeRoute(route: string, formConfig: any) {
    this.commonStoreService.setFormConfig(formConfig);
    this.router.navigate([route]);
  }

  getExcelData(filter: any) {
    this.loaderService.show();
    this.eventService.getAllEvents(filter).subscribe({
      next: (res: any) => {
        this.loaderService.hide();
        this.exportExcel(res.events);
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
      `Events-${this.datePipe.transform(
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
        if (this.eventsDetails?.events?.length) {
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
      id: data.rowData.EventsId,
      access: this.eventsDetails.FullAccess,
    };
    await this.commonStoreService.setFormConfig(formConfig);
    switch (data.operation) {
      case GRID_ACTION.EDIT.ID:
        this.router.navigate([ROUTE.EDIT_EVENT]);
        break;

      case GRID_ACTION.VIEW.ID:
        this.router.navigate([ROUTE.VIEW_EVENT]);
        break;

      case GRID_ACTION.ARCHIVE.ID:
        const dialogRef = this.commonService.showModal(
          'Archive',
          CONSTANTS.EVENT_STATUS_CONFIRMATION
        );
        dialogRef.afterClosed().subscribe((action: any) => {
          if (action) {
            this.loaderService.show();
            this.eventService.updateStatus(data.rowData.EventsId, 2).subscribe({
              next: (res: any) => {
                this.toasterService.success(res.message);
                this.loadTableData(this.filter);
                this.loaderService.hide();
              },
              error: (error) => {
                this.loaderService.hide();
                this.toasterService.error(error.error.message);
              },
            });
          } else if (action === CONSTANTS.YES) {
            this.loaderService.show();
            this.eventService.updateStatus(data.rowData.EventsId, 2).subscribe({
              next: (res: any) => {
                this.toasterService.success(res.message);
                this.loadTableData(this.filter);
                this.loaderService.hide();
              },
              error: (error) => {
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
    const dialogRef = this.dialog.open(EventsDialogComponent, {
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
