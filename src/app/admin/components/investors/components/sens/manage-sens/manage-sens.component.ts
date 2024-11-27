import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { SensService } from 'src/app/admin/services/sens.service';
import { LoaderService } from 'src/app/shared/services/loader/loader.service';
import {
  CONSTANTS,
  GRID_ACTION,
  GRID_TOOLBAR,
  ROUTE,
} from 'src/app/models/constants';
import { CommonStoreService } from 'src/app/services/common-store.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Observable, of } from 'rxjs';
import * as XLSX from 'xlsx';
import { DatePipe } from '@angular/common';
import { SensAnnouncementsDialogComponent } from '../sens-announcements-dialog/sens-announcements-dialog.component';

@Component({
  selector: 'app-manage-sens',
  templateUrl: './manage-sens.component.html',
  styleUrls: ['./manage-sens.component.scss'],
})
export class ManageSensComponent implements OnInit {
  rows!: any;
  columns: any;
  filterColumns: any;
  filterData: any;
  filter: any = {
    PerPage: 10,
    PageNo: 1,
    Search: undefined,
    SortBy: undefined,
    SortOrder: 'Desc',
    Status: undefined,
    Import: undefined,
  };
  tableSettings: any;
  reportStatus$: Observable<any[]> = of([
    {
      Id: 0,
      Name: 'Unpublish',
    },
    {
      Id: 1,
      Name: 'Publish',
    },
  ]);
  sensDetails: any;
  access: any;

  constructor(
    private loaderService: LoaderService,
    private sensService: SensService,
    private toasterService: ToastrService,
    private commonStoreService: CommonStoreService,
    private router: Router,
    private dialog: MatDialog,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.setColumnHeaders();
    this.initializeTableSettings();
    this.getAllSens(this.filter);
  }

  importSens() {
    this.filter = {
      PerPage: 10,
      PageNo: 1,
      Search: undefined,
      SortBy: undefined,
      SortOrder: 'Desc',
      Status: undefined,
      Import: 1, //import change
    };
    this.getAllSens(this.filter);
  }

  setColumnHeaders() {
    this.columns = [
      {
        field: 'Headline',
        header: 'Name of SENS',
        sort: true,
        visible: true,
        show: true,
      },
      {
        field: 'Drip',
        header: 'Apply Drip',
        sort: true,
        visible: true,
        show: true,
      },
      {
        field: 'SensAnnouncementStatus',
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

  initializeTableSettings(): void {
    this.tableSettings = {
      rows: [],
      tools: [],
      columns: this.columns,
      tablename: 'All SENS',
      id: 'SensAnnouncementId',
      totalRowsCount: 0,
      pageCnt: 0,
      isPaginationRequired: true,
      isFilterRequired: true,
      isSearchRequired: true,
      isColumnGroupRequired: true,
      isDownloadRequired: true,
      showActions: true,
    };
  }

  getAllSens(filter: any) {
    // this.initializeTableSettings();
    this.loaderService.show();
    this.sensService.fetchAllSens(filter).subscribe({
      next: (res) => {
        this.loaderService.hide();
        this.sensDetails = res;
        this.createTableSettings(res);
      },
      error: (error: any) => {
        this.loaderService.hide();
        error.error.errors
          ? this.displayError(error.error.errors)
          : this.toasterService.error(error.error.message);
      },
      complete: () => {
        if (filter.Import) {
          this.toasterService.success(CONSTANTS.IMPORT_SENS);
          this.filter.Import = 0;
        }
        this.loaderService.hide();
      },
    });
  }

  createTableSettings(res: any) {
    this.access = res?.FullAccess;
    this.tableSettings = {
      ...this.tableSettings,
      totalRowsCount: res.totalCount,
      pageCnt: res.pageCount,
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
      rows: [...res.sensannouncements].map((e: any) => {
        return {
          ...e,
          operations: res.FullAccess
            ? [
                {
                  name: GRID_ACTION.VIEW.TITLE,
                  icon: GRID_ACTION.VIEW.ID,
                  operationName: GRID_ACTION.VIEW.ID,
                  path: GRID_ACTION.VIEW.ICON,
                },
                // ...(e.SensAnnouncementStatus?.toLowerCase() == 'published'
                //   ? [
                //       {
                //         name: GRID_ACTION.UN_PUBLISH.TITLE,
                //         icon: GRID_ACTION.UN_PUBLISH.ID,
                //         operationName: GRID_ACTION.UN_PUBLISH.ID,
                //         path: GRID_ACTION.UN_PUBLISH.ICON,
                //       },
                //     ]
                //   : [
                //       {
                //         name: GRID_ACTION.PUBLISH.TITLE,
                //         icon: GRID_ACTION.PUBLISH.ID,
                //         operationName: GRID_ACTION.PUBLISH.ID,
                //         path: GRID_ACTION.PUBLISH.ICON,
                //       },
                //     ]),
                {
                  name: GRID_ACTION.DRIP.TITLE,
                  icon: GRID_ACTION.DRIP.ID,
                  operationName: GRID_ACTION.DRIP.ID,
                  path: GRID_ACTION.DRIP.ICON,
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
      Status: event.statusIds ? event.statusIds : undefined,
      Import: undefined,
    };
    this.getAllSens(this.filter);
  }

  async rowActions(data: any) {
    let sensconfig: any = {
      mode: data.operation,
      id: data.rowData.SensAnnouncementId,
      access : this.access
    };
    switch (data.operation) {
      case GRID_ACTION.DRIP.ID:
        this.applyDrip(data.rowData.SensAnnouncementId);
        break;

      case GRID_ACTION.VIEW.ID:
        this.changeRoute(ROUTE.VIEW_SENS, sensconfig);

        break;

      // case GRID_ACTION.PUBLISH.ID:
      // case GRID_ACTION.UN_PUBLISH.ID:
      //   this.updateReportStatus(
      //     data.rowData.SensAnnouncementId,
      //     data.rowData.Status
      //   );
      //   break;
    }
  }

  changeRoute(route: string, formConfig: any) {
    this.commonStoreService.setFormConfig(formConfig);
    this.router.navigate([route]);
  }

  updateReportStatus(id: number, status: number) {
    let changedStatus: number;
    status == 0 ? (changedStatus = 1) : (changedStatus = 0);
    this.loaderService.show();
    this.sensService.updateStatus(id, changedStatus).subscribe({
      next: (res: any) => {
        this.loaderService.hide();
        this.toasterService.success(res.message);
        this.getAllSens(this.filter);
      },
      error: (error: any) => {
        this.loaderService.hide();
        error.error.errors
          ? this.displayError(error.error.errors)
          : this.toasterService.error(error.error.message);
      },
    });
  }

  onToolbarClick(event: any) {
    this.filterData = {
      label: event.name,
      columns: this.tableSettings.columns,
      status: this.filterData?.status != null ? this.filterData.status : null,
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
        this.getAllSens(this.filter);
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
        this.getExcelData(this.filter);
        break;
      case GRID_TOOLBAR.PAGINATION.NAME:
        this.getAllSens(this.filter);
        break;
      case GRID_TOOLBAR.SORT.NAME:
        this.getAllSens(this.filter);
        break;
    }
  }

  openDialog(data: any) {
    const dialogRef = this.dialog.open(SensAnnouncementsDialogComponent, {
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
              Status: result.clear ? '' : result.data.status,
            };
            this.getAllSens(this.filter);
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

  getExcelData(filter: any) {
    this.loaderService.show();
    this.sensService.fetchAllSens(filter).subscribe({
      next: (res: any) => {
        this.loaderService.hide();
        this.exportExcel(res.sensannouncements);
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
      `SensAnnouncement-${this.datePipe.transform(
        Date.now().toString(),
        'dd-MM-yyyy'
      )}.xlsx`
    );
  }

  applyDrip(id: number) {
    this.loaderService.show();
    this.sensService.updateDrip(id, 1).subscribe({
      next: (res: any) => {
        this.loaderService.hide();
        this.toasterService.success(res.message);
        this.getAllSens(this.filter);
      },
      error: (error: any) => {
        this.loaderService.hide();
        error.error.errors
          ? this.displayError(error.error.errors)
          : this.toasterService.error(error.error.message);
      },
    });
  }

  displayError(error: any) {
    let errors = JSON.parse(error);
    Object.keys(errors).forEach((err: any) => {
      this.toasterService.error(errors[err][0]);
    });
  }
}
