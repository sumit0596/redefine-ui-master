import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { PressReleaseDialogComponent } from 'src/app/admin/components/investors/components/press-release/press-release-dialog/press-release-dialog.component';
import { JobApplicationsService } from 'src/app/admin/services/job-applications.service';
import { JobListingService } from 'src/app/admin/services/job-listing.service';
import { ContextContainer } from 'src/app/core/context/context-container';
import { IFormConfig } from 'src/app/interfaces/common-interface';
import { CONSTANTS, FORM_MODE, GRID_ACTION, GRID_TOOLBAR, ROUTE, SESSION } from 'src/app/models/constants';
import { CommonStoreService } from 'src/app/services/common-store.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-applicant-form',
  templateUrl: './applicant-form.component.html',
  styleUrls: ['./applicant-form.component.scss']
})
export class ApplicantFormComponent {

  formMode: any = FORM_MODE;
  formConfig!: any;
  applicantDetails!: any
  applicantID!: any

  //for application history
  historyFormConfig!: any
  applicationHistory!: any
  filterData: any;
  tableConfig: any;
  columns: any[] = [
    {
      field: 'JobCode',
      header: 'Job Code',
      sort: true,
      visible: true,
      show: true,
    },
    {
      field: 'Title',
      header: 'Job Title',
      sort: true,
      visible: true,
      show: true,
    },
    {
      field: 'StartDate',
      header: 'Publish Date',
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
  };

  constructor(
    private jobApplicationsService: JobApplicationsService,
    private context: ContextContainer,
    private router: Router,
    private datePipe: DatePipe,
    private dialog: MatDialog,
    private joblist: JobListingService,
    private commonStoreService: CommonStoreService,
  ) { }

  ngOnInit() {
    this.configureForm();
    this.initializeTable();
  }

  goToManage() {
    if (this.formConfig.label == CONSTANTS.JOB_LIST) {
      sessionStorage.removeItem(SESSION.FORM_CONFIG);
      this.router.navigate([`${ROUTE.VIEW_APPLICATION_DETAILS}`]);
    } else if (this.formConfig.label == CONSTANTS.APPLICATION_LIST) {
      sessionStorage.removeItem(SESSION.FORM_CONFIG);
      this.router.navigate([`${ROUTE.MANAGE_JOB_APPLICATION}`]);
    }

  }

  async configureForm() {
    this.formConfig = await this.context.commonStoreService.getFormConfig();
    if (this.formConfig.label == CONSTANTS.JOB_LIST) {
      await this.joblist.getApplicationID().subscribe(id => {
        this.applicantID = id
      })
    } else if (this.formConfig.label == CONSTANTS.APPLICATION_LIST) {
      this.applicantID = this.formConfig.id
    }
    switch (this.formConfig.mode) {
      case FORM_MODE.VIEW:
        this.getApplicantDetails(this.applicantID);
        this.loadTableData(this.filter, this.applicantID);
        break;
      default:
        break;
    }
  }

  getApplicantDetails(Id: any) {
    this.context.loaderService.show();
    this.jobApplicationsService.getApplicantDetails(Id)
      .subscribe({
        next: (res: any) => {
          this.context.loaderService.hide();
          this.applicantDetails = res.data;
        },
        error: (error: any) => {
          this.context.loaderService.hide();
          error.error.errors
            ? this.displayError(error.error.errors)
            : this.context.toasterService.error(error.error.message);
        },
      });
  }

  displayError(error: any) {
    let errors = JSON.parse(error);
    Object.keys(errors).forEach((err: any) => {
      this.context.toasterService.error(errors[err][0]);
    });
  }

  // For Application history

  initializeTable() {
    this.tableConfig = {
      id: 'ApplicationHistory',
      tablename: 'Application History',
      columns: this.columns,
      rows: [],
      tools: [],
      totalRowsCount: 0,
      pageCnt: 0,
      isPaginationRequired: true,
      showActions: true,
    };
  }

  loadTableData(filter: any, Id: any) {
    this.context.loaderService.show();
    this.jobApplicationsService.getApplicationHistory(filter, Id).subscribe({
      next: (result: any) => {
        this.context.loaderService.hide();
        this.applicationHistory = result;
        this.createTableConfig(result);
      },
      error: (error: any) => {
        this.context.loaderService.hide();
        error.error.errors
          ? this.displayError(error.error.errors)
          : this.context.toasterService.error(error.error.message);
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
        // {
        //   name: 'Filter',
        //   id: 'filter',
        //   disabled: false,
        //   icon: 'assets/images/filter.svg',
        // },
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
      rows: [...data.applicationhistory].map((d: any) => {
        return {
          ...d,
          operations:
            [
              {
                name: GRID_ACTION.VIEW.TITLE,
                icon: GRID_ACTION.VIEW.ID,
                operationName: GRID_ACTION.VIEW.ID,
                path: GRID_ACTION.VIEW.ICON,
              }
            ]
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
    };
    this.loadTableData(this.filter, this.applicantID);
  }

  changeRoute(route: string, formConfig: any) {
    //this.jobApplicationsService.setFormConfig(formConfig);
    this.commonStoreService.setFormConfig(formConfig);
    this.router.navigate([route]);
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
        }
        this.loadTableData(this.filter, this.applicantID);
        break;
      // case GRID_TOOLBAR.FILTER.NAME:
      //   this.openDialog(this.filterData);
      //   break;
      case GRID_TOOLBAR.COLUMN.NAME:
        this.openDialog(this.filterData);
        break;
      case GRID_TOOLBAR.PAGINATION.NAME:
        this.loadTableData(this.filter, this.applicantID);
        break;
      case GRID_TOOLBAR.SORT.NAME:
        this.loadTableData(this.filter, this.applicantID);
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
    this.context.loaderService.show();
    this.jobApplicationsService.getApplicationHistory(filter, this.applicantID).subscribe({
      next: (res: any) => {
        this.context.loaderService.hide();
        this.exportExcel(res.applicationhistory);
      },
      error: (error: any) => {
        this.context.loaderService.hide();
        error.error.errors
          ? this.displayError(error.error.errors)
          : this.context.toasterService.error(error.error.message);
      },
    });
  }

  exportExcel(data: any[]) {
    let sheetData = data.map((d: any) => {
      return {
        'Job Code': d.JobCode,
        'Job Title': d.Title,
        'Publish Date': d.StartDate,
      };
    });
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(sheetData);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, `Report`);
    XLSX.writeFile(
      wb,
      `ApplicationHistory-${this.datePipe.transform(
        Date.now().toString(),
        'dd-MM-yyyy'
      )}.xlsx`
    );
  }

  rowActions(data: any) {
    let formConfig: IFormConfig = {
      ...this.formConfig,
      label: CONSTANTS.APPLICATION_LIST,
      data: {
        mode: data.operation,
        id: data.rowData.ApplicantJobId,
        access: this.applicationHistory.FullAccess,
        label: CONSTANTS.APPLICATION_LIST,
      }
    };
    switch (data.operation) {
      case GRID_ACTION.VIEW.ID:
        this.changeRoute(ROUTE.VIEW_APPLICATION_DETAILS, formConfig);
        break;
    }
  }

  onActionClick(event: any) {
  }

  openDialog(data: any) {
    const dialogRef = this.dialog.open(PressReleaseDialogComponent, {
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


}
