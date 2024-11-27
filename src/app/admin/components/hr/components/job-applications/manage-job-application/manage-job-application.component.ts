import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PressReleaseDialogComponent } from 'src/app/admin/components/investors/components/press-release/press-release-dialog/press-release-dialog.component';
import { JobApplicationsService } from 'src/app/admin/services/job-applications.service';
import { IFormConfig } from 'src/app/interfaces/common-interface';
import { GRID_ACTION, FORM_MODE, ROUTE, GRID_TOOLBAR, CONSTANTS } from 'src/app/models/constants';
import { CommonStoreService } from 'src/app/services/common-store.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { LoaderService } from 'src/app/shared/services/loader/loader.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-manage-job-application',
  templateUrl: './manage-job-application.component.html',
  styleUrls: ['./manage-job-application.component.scss']
})
export class ManageJobApplicationComponent {
  filterData: any;
  tableConfig: any;
  columns: any[] = [
    {
      field: 'IdNumber',
      header: 'ID/ Passport Number',
      sort: true,
      visible: true,
      show: true,
    },
    {
      field: 'Name',
      header: 'Name of Applicant',
      sort: true,
      visible: true,
      show: true,
    },
    {
      field: 'Mobile',
      header: 'Mobile Number',
      sort: true,
      visible: true,
      show: true,
    },
    {
      field: 'Email',
      header: 'Email Address',
      sort: true,
      visible: true,
      show: true,
    },
    {
      field: 'TotalApplication',
      header: 'Total Application',
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
  JobApplicationsDetails: any;

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private loaderService: LoaderService,
    private commonStoreService: CommonStoreService,
    private toasterService: ToastrService,
    private jobApplicationsService: JobApplicationsService,
    private datePipe: DatePipe,
    private commonService : CommonService
  ) { }

  ngOnInit(): void {
    this.initializeTable();
    this.loadTableData(this.filter);
  }

  initializeTable() {
    this.tableConfig = {
      id: 'JobApplications',
      tablename: 'All Job Applications',
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
    this.jobApplicationsService.getAllJobApplications(filter).subscribe({
      next: (result: any) => {
        this.loaderService.hide();
        this.JobApplicationsDetails = result;
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
      rows: [...data.applicantdetails].map((d: any) => {
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
      Status: event.PressReleaseStatus ? event.PressReleaseStatus : undefined
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
        this.loadTableData(this.filter);
        break;
      // case GRID_TOOLBAR.FILTER.NAME:
      //   this.openDialog(this.filterData);
      //   break;
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
    this.jobApplicationsService.getAllJobApplications(filter).subscribe({
      next: (res: any) => {
        this.loaderService.hide();
        this.exportExcel(res.applicantdetails);
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
        'ID/ Passport Number': d.IdNumber,
        'Name of Applicant': d.Name,
        'Mobile Number': d.Mobile,
        'Email Address': d.Address,
        'Total Application': d.TotalApplication
      };
    });
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(sheetData);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, `Report`);
    XLSX.writeFile(
      wb,
      `JobApplications-${this.datePipe.transform(
        Date.now().toString(),
        'dd-MM-yyyy'
      )}.xlsx`
    );
  }

  rowActions(data: any) {
    let formConfig: IFormConfig = {
      mode: data.operation,
      id: data.rowData.ApplicantId,
      access: this.JobApplicationsDetails.FullAccess,
      label: CONSTANTS.APPLICATION_LIST
    };
    switch (data.operation) {
      case GRID_ACTION.VIEW.ID:
        this.changeRoute(ROUTE.VIEW_APPLICANT, formConfig);
        break;

      case GRID_ACTION.DELETE.ID:
        const dialogRef = this.commonService.showModal(
          'Delete',
          'Are you sure you want to delete this applicant?'
        );
        dialogRef.afterClosed().subscribe((action: any) => {
          if (action) {
            this.deleteApplicant(data.rowData.ApplicantId);
          }
        });
        break;
    }
  }

  deleteApplicant(Id: any) {
    this.jobApplicationsService.deleteApplicant(Id).subscribe({
      next: (res) => {
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

  displayError(error: any) {
    let errors = JSON.parse(error);
    Object.keys(errors).forEach((err: any) => {
      this.toasterService.error(errors[err][0]);
    });
  }


}
