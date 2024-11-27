import { JobListingService } from 'src/app/admin/services/job-listing.service';
import { Component } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from '@angular/forms';

import { Router } from '@angular/router';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { ContextContainer } from 'src/app/core/context/context-container';
import {
  FORM_MODE,
  ROUTE,
  SESSION,
  INPUT_ERROR,
  JOB_LISTING_FORM,
  CONSTANTS,
  GRID_ACTION,
  GRID_TOOLBAR,
} from 'src/app/models/constants';
import { INTEGRATED_REPORT_STATUS, JOB_STATUS } from 'src/app/models/enum';
import { DatePipe, formatDate } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { CommonStoreService } from 'src/app/services/common-store.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { LoaderService } from 'src/app/shared/services/loader/loader.service';
import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { JobApplicationsService } from 'src/app/admin/services/job-applications.service';
import * as XLSX from 'xlsx';
import { JobListingDialogComponent } from '../job-listing-dialog/job-listing-dialog.component';
import { IFormConfig } from 'src/app/interfaces/common-interface';

export const MY_DATE_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-job-listing-details-form',
  templateUrl: './job-listing-details-form.component.html',
  styleUrls: ['./job-listing-details-form.component.scss'],
  providers: [{ provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS }],
})
export class JobListingDetailsFormComponent {
  status: any = INTEGRATED_REPORT_STATUS;
  formConfig: any;
  btnLabel: string = '';
  formMode: any = FORM_MODE;
  jobListID!: number;
  jobListForm!: FormGroup;
  isSubmit: boolean = true;
  jobListDetails: any;
  jobTypeList$!: Observable<any>;
  jobTypeList!: any[];
  jobAddressList$!: Observable<any>;
  jobAddressList!: any;
  jobRegionAddressList$!: Observable<any>;
  jobRegionAddressList!: any;
  jobLevelList$!: Observable<any>;
  jobLevelList!: any;

  minDate: Date;
  jobStatus = JOB_STATUS;
  whereListing: any = [];

  //for application history
  historyFormConfig!: any;
  applicantApplied!: any;
  filterData: any;
  tableConfig: any;
  columns: any[] = [
    {
      field: 'IdNumber',
      header: 'ID Number/Passport',
      sort: true,
      visible: true,
      show: true,
    },
    {
      field: 'ApplicantName',
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
  filter: any = {
    PageNo: 1,
    PerPage: 10,
    Search: undefined,
    SortBy: undefined,
    SortOrder: 'Desc',
  };
  redefineWebsite: any;
  intranet: any;
  jobPortals: any;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private jobListService: JobListingService,
    private loaderService: LoaderService,
    private toasterService: ToastrService,
    private commonStoreService: CommonStoreService,
    private commonService: CommonService,
    private router: Router,
    private datePipe: DatePipe,
    private context: ContextContainer,
    private jobApplicationsService: JobApplicationsService,
    private dialog: MatDialog
  ) {
    this.minDate = new Date();
    //const currentTime = new Date();
  }
  async ngOnInit() {
    this.jobListForm = this.fb.group({
      JobCode: ['', [Validators.required, Validators.maxLength(10)]],
      Title: [null, [Validators.required, Validators.maxLength(255)]],
      StartDate: ['', [Validators.required]],
      EndDate: ['', [Validators.required]],
      JobTypeId: [null, [Validators.required]],
      JobAddress: ['', [Validators.required]],
      JobLevelId: [null, [Validators.required]],
      PrimaryPurpose: ['', [Validators.maxLength(1000), Validators.required]],
      KeyPerformance: ['', [Validators.required]],
      JobSpecificRequirements: [
        '',
        [Validators.maxLength(1000), Validators.required],
      ],
      CompetencyRequirements: [
        '',
        [Validators.maxLength(1000), Validators.required],
      ],
      Disclaimer: ['', [Validators.maxLength(1000)]],
      WhereListing: ['', [Validators.required]],
    });

    await this.configureForm();
    await this.initializeTable();
  }

  async getJobLevel() {
    this.jobLevelList$ = await this.jobListService.getJobLevel();
    this.jobLevelList$.subscribe({
      next: (res: any) => {
        this.jobLevelList = res.data;
      },
      error: (error: any) => {
      },
    });
  }

  async getRegionAddress() {
    this.jobRegionAddressList$ = await this.jobListService.getRegionAddress();
    this.jobRegionAddressList$.subscribe({
      next: (res: any) => {
        this.jobRegionAddressList = res.data;
      },
      error: (error: any) => {
      },
    });
  }

  async getJobType() {
    this.jobTypeList$ = await this.jobListService.getJobTypes();
    this.jobTypeList$.subscribe({
      next: (res: any) => {
        this.jobTypeList = res.data;
      },
      error: (error: any) => {
      },
    });
  }

  async getAddress() {
    this.jobAddressList$ = await this.jobListService.getAddress();
    this.jobAddressList$.subscribe({
      next: (res: any) => {
        this.jobAddressList = res.data;
      },
      error: (error: any) => {
      },
    });
  }

  async configureForm() {
    this.formConfig = await this.commonStoreService.getFormConfig();

    switch (this.formConfig.mode) {
      case FORM_MODE.CREATE:
        this.jobListForm.get('JobCode')?.setValue(this.formConfig.code);
        this.getJobType();
        this.getAddress();
        this.getRegionAddress();
        this.getJobLevel();

        break;
      case FORM_MODE.EDIT:
        this.viewJobList(this.formConfig.id);
        this.getJobType();
        this.getAddress();
        this.getRegionAddress();
        this.getJobLevel();

        break;
      case FORM_MODE.VIEW:
        this.getJobType();
        this.getRegionAddress();
        this.getAddress();
        this.getJobLevel();

        this.viewJobList(this.formConfig.id);
        this.loadTableData(this.filter, this.formConfig.id);
        break;
      default:
        break;
    }
  }
  fillFormData() {
    Object.keys(this.jobListForm.controls).forEach((control) => {
      if (control === 'WhereListing') {
        if (this.jobListDetails.WhereListing != null) {
          this.jobListDetails.WhereListing =
            this.jobListDetails.WhereListing.split(',');
          this.redefineWebsite = this.jobListDetails.WhereListing.some(
            (x: any) => x === 'Redefine Website'
          );
          this.intranet = this.jobListDetails.WhereListing.some(
            (x: any) => x === 'Intranet'
          );
          this.jobPortals = this.jobListDetails.WhereListing.some(
            (x: any) => x === 'Job Portals'
          );
          this.jobListForm
            .get('WhereListing')
            ?.setValue(this.jobListDetails.WhereListing.toString());
        }
      } else {
        this.jobListForm.get(control)?.setValue(this.jobListDetails[control]);
      }
    });
  }
  viewJobList(id: any) {
    this.loaderService.show();
    this.jobListService.getJobListingsDetails(id).subscribe({
      next: (res) => {
        this.jobListDetails = res.data;
        this.fillFormData();
        this.loaderService.hide();
      },
      error: (error) => {
        this.loaderService.hide();
        this.toasterService.error(error.error.message);
      },
    });
  }
  editJobList() {
    let formConfig = {
      mode: FORM_MODE.EDIT,
      id: this.formConfig.id,
      label: CONSTANTS.JOB_LIST,
    };
    this.commonStoreService.setFormConfig(formConfig);
    this.router.navigate([`${ROUTE.EDIT_JOB_LIST}`]);
  }
  onSubmit(event: any) {
    event.preventDefault();
    this.validateForm();
    if (this.jobListForm.valid) {
      let payload = this.createPayload();
      if (this.formConfig.mode == FORM_MODE.CREATE) {
        this.createJobList(payload);
      } else if (this.formConfig.mode == FORM_MODE.EDIT) {
        this.updateJobList(payload);
      }
    }
  }
  createPayload() {
    let payload = this.jobListForm.value;
    this.jobListForm.value.StartDate = this.datePipe.transform(
      this.jobListForm.value.StartDate,
      'Y-MM-dd'
    );
    this.jobListForm.value.EndDate = this.datePipe.transform(
      this.jobListForm.value.EndDate,
      'Y-MM-dd'
    );

    return payload;
  }
  message: any;

  createJobList(payload: any) {
    this.loaderService.show();
    this.jobListService.addJobListings(payload).subscribe({
      next: (res: any) => {
        this.reset();
        this.goToManage(res.message);
        this.loaderService.hide();
      },
      error: (error) => {
        this.loaderService.hide();
        error.error.errors
          ? this.displayError(error.error.errors)
          : this.toasterService.error(error.error.message);
      },
    });
  }

  updateJobList(payload: any) {
    if (this.jobListDetails.WhereListing instanceof Array) {
      this.jobListForm
        .get('WhereListing')
        ?.setValue(this.jobListDetails.WhereListing.toString());
    }
    this.loaderService.show();
    this.jobListService
      .updateJobListings(payload, this.jobListDetails.JobId)
      .subscribe({
        next: (res: any) => {
          this.loaderService.hide();
          this.goToManage(res.message);
        },
        error: (error: any) => {
          this.loaderService.hide();
          error.error.errors
            ? this.displayError(error.error.errors)
            : this.toasterService.error(error.error.message);
        },
      });
  }

  deleteJobListing() {
    const dialogRef = this.commonService.showModal(
      'Delete',
      CONSTANTS.JOB_DELETE_CONFIRMATION,
    );
    dialogRef.afterClosed().subscribe((action: any) => {
      if (action) {
        this.loaderService.show();
        this.jobListService
          .deleteJobListing(this.jobListDetails.JobId)
          .subscribe({
            next: (res: any) => {
              this.loaderService.hide();
              this.goToManage(res.message);
            },
            error: (error) => {
              this.loaderService.hide();
              error.error.errors
                ? this.displayError(error.error.errors)
                : this.toasterService.error(error.error.message);
            },
          });
      }
    });
  }
  validateForm() {
    this.clearControlError(this.jobListForm.get('StartDate'));
    this.clearControlError(this.jobListForm.get('EndDate'));
    Object.keys(this.jobListForm.controls).forEach((control: any) => {
      this.setControlError(control);
    });
  }
  checkError(control: string, error: string) {
    return this.jobListForm.get(control)?.hasError(error);
  }
  setControlError(control: string) {
    if (this.checkError(control, 'required')) {
      this.jobListForm.get(control)?.setErrors({
        required: true,
        invalid: `${this.getControlLabel(control)} is required`,
      });
    } else if (
      this.checkError(control, 'minlength') ||
      this.checkError(control, 'maxlength')
    ) {
      this.jobListForm.get(control)?.setErrors({
        required: false,
        invalid: `${INPUT_ERROR.NAME_PATTERN}`,
      });
    }
  }
  displayError(error: any) {
    if (error) {
      let errors = JSON.parse(error);
      Object.keys(errors).forEach((err: any) => {
        this.toasterService.error(errors[err][0]);
      });
    }
  }
  reset() {
    this.jobListForm.reset();
  }
  goToManage(message? : any) {
    sessionStorage.removeItem(SESSION.FORM_CONFIG);
    (message != undefined)
    ? this.router.navigate([ROUTE.MANAGE_JOB_LIST]).then((m) => {
        this.toasterService.success(message);
      })
    : this.router.navigate([ROUTE.MANAGE_JOB_LIST]);
  }
  onChange(event: any) {
    this.validateFormField(event);
  }
  validateFormField(data: any) {
    let control: FormControl = this.getControl(data.form, data.control);
    if (control.hasError('required')) {
      control?.setErrors({
        ...control.errors,
        invalid: `${this.getControlLabel(data.control)} is required`,
      });
    } else if (control.hasError('minlength')) {
      control?.setErrors({
        ...control.errors,
        required: false,
        invalid: `Minimum ${
          control.getError('minlength')?.requiredLength
        } characters are allowed`,
      });
    } else if (control.hasError('maxlength')) {
      control?.setErrors({
        ...control.errors,
        required: false,
        invalid: `Maximum ${
          control.getError('maxlength')?.requiredLength
        } characters are allowed`,
      });
    } else if (control.hasError('pattern')) {
      control?.setErrors({
        ...control.errors,
        invalid: this.getControlPatternMessage(data.control),
      });
    }
  }
  getControl(form: any, control: string): FormControl {
    return form.get(control) as FormControl;
  }
  getControlLabel(control: string) {
    let result: any = Object.values(JOB_LISTING_FORM).find(
      (res: any) => res.NAME == control
    );
    return result ? result.LABEL : control;
  }
  getControlPatternMessage(control: string): any {
    let result: any = Object.values(JOB_LISTING_FORM).find(
      (res: any) => res.NAME == control
    );
    return result
      ? result.PATTERN_MESSAGE
        ? result.PATTERN_MESSAGE
        : `Please provide valid ${control}`
      : `Please provide valid ${control}`;
  }

  onSave(status: any) {
    this.jobListForm.value.Status = status;
    switch (status) {
      case JOB_STATUS.PUBLISH:
        this.onSubmit(event);

        break;
      case JOB_STATUS.DRAFT:
        this.onSubmit(event);

        break;
      default:
        break;
    }
  }

  // For Applicant Applied

  initializeTable() {
    this.tableConfig = {
      id: 'ApplicantApplied',
      tablename: 'Applicant Applied',
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
    this.jobListService.getApplicantApplied(filter, Id).subscribe({
      next: (result: any) => {
        this.context.loaderService.hide();
        this.applicantApplied = result;
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
      rows: [...data.applicants].map((d: any) => {
        return {
          ...d,
          operations: [
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
    };
    this.loadTableData(this.filter, this.formConfig.id);
  }

  changeRoute(route: string, formConfig: any, id: any) {
    this.jobListService.setApplicantID(id);
    //this.jobApplicationsService.setFormConfig(formConfig);
    this.commonStoreService.setFormConfig(formConfig);
    this.router.navigate([route]);
  }

  onToolbarClick(event: any) {
    this.filterData = {
      label: event.name,
      columns: this.tableConfig.columns,
      Status: this.filterData?.Status ? this.filterData.Status : null,
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
        this.loadTableData(this.filter, this.formConfig.id);
        break;
      case GRID_TOOLBAR.FILTER.NAME:
        this.openDialog(this.filterData);
        break;
      case GRID_TOOLBAR.COLUMN.NAME:
        this.openDialog(this.filterData);
        break;
      case GRID_TOOLBAR.PAGINATION.NAME:
        this.loadTableData(this.filter, this.formConfig.id);
        break;
      case GRID_TOOLBAR.SORT.NAME:
        this.loadTableData(this.filter, this.formConfig.id);
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
    this.jobListService
      .getApplicantApplied(filter, this.formConfig.id)
      .subscribe({
        next: (res: any) => {
          this.context.loaderService.hide();
          this.exportExcel(res.applicants);
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
        'ID Number/Passport': d.IdNumber,
        'Name of Applicant': d.ApplicantName,
        'Mobile Number': d.Mobile,
        'Email Address': d.Email,
        Status: d.Status,
      };
    });
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(sheetData);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, `Report`);
    XLSX.writeFile(
      wb,
      `applicants-${this.datePipe.transform(
        Date.now().toString(),
        'dd-MM-yyyy'
      )}.xlsx`
    );
  }

  rowActions(data: any) {
    let formConfig: IFormConfig = {
      ...this.formConfig,
      label: CONSTANTS.JOB_LIST,
      data: {
        mode: data.operation,
        id: data.rowData.ApplicantJobId,
        access: this.applicantApplied.FullAccess,
        label: CONSTANTS.JOB_LIST,
      },
    };
    switch (data.operation) {
      case GRID_ACTION.VIEW.ID:
        this.changeRoute(
          ROUTE.VIEW_APPLICATION_DETAILS,
          formConfig,
          data.rowData.ApplicantId
        );
        break;
    }
  }

  onActionClick(event: any) {}

  openDialog(data: any) {
    const dialogRef = this.dialog.open(JobListingDialogComponent, {
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
            };
            this.loadTableData(this.filter, this.formConfig.id);
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

  RedefineWebsiteChange(type: any, event: any) {
    this.whereListing = [];
    if (this.jobListDetails != undefined) {
      this.whereListing = this.jobListDetails?.WhereListing;
    }
    if (event.target.checked) {
      if (this.whereListing == null) {
        this.whereListing = [];
      }
      this.whereListing.push(type);
    } else {
      if (this.whereListing != null) {
        this.removeItem(this.whereListing, type);
      }
    }
    if (this.whereListing != null) {
      this.jobListForm
        .get('WhereListing')
        ?.setValue(this.whereListing.toString());
    }
  }

  IntranetChange(type: any, event: any) {
    this.whereListing = [];
    if (this.jobListDetails != undefined) {
      this.whereListing = this.jobListDetails?.WhereListing;
    }
    if (event.target.checked) {
      if (this.whereListing == null) {
        this.whereListing = [];
      }
      this.whereListing.push(type);
    } else {
      if (this.whereListing != null) {
        this.removeItem(this.whereListing, type);
      }
    }
    if (this.whereListing != null) {
      this.jobListForm
        .get('WhereListing')
        ?.setValue(this.whereListing.toString());
    }
  }

  JobPortalsChange(type: any, event: any) {
    this.whereListing = [];
    if (this.jobListDetails != undefined) {
      this.whereListing = this.jobListDetails?.WhereListing;
    }
    if (event.target.checked) {
      if (this.whereListing == null) {
        this.whereListing = [];
      }
      this.whereListing.push(type);
    } else {
      if (this.whereListing != null) {
        this.removeItem(this.whereListing, type);
      }
    }
    if (this.whereListing != null) {
      this.jobListForm
        .get('WhereListing')
        ?.setValue(this.whereListing.toString());
    }
  }

  removeItem(array: any[], item: any) {
    if (item.length > 0) {
      let index = array.findIndex((type) => type == item);
      array.splice(index, 1);
    }
  }

  clearControlError(control: any): void {
    const err = control.errors;

    if (err) {
      delete err['matDatepickerMin'];

      if (!Object.keys(err).length) {
        control.setErrors(null);
      } else {
        control.setErrors(err);
      }
    }
  }

  onTypeSelect(event: any) {
    this.jobListForm.get('JobAddress')?.setValue(['']);
  }

  dateChange() {
    this.errorMessage = '';
    if (
      this.jobListForm.get('StartDate')?.value != '' &&
      this.jobListForm.get('EndDate')?.value != ''
    ) {
      if (
        formatDate(this.jobListForm?.value?.StartDate, 'yyyy-MM-dd', 'en_US') >
        formatDate(this.jobListForm?.value?.EndDate, 'yyyy-MM-dd', 'en_US')
      ) {
        this.errorMessage = 'Start date should be less than  End date';
      } else if (
        formatDate(this.jobListForm?.value?.StartDate, 'yyyy-MM-dd', 'en_US') ==
        formatDate(this.jobListForm?.value?.EndDate, 'yyyy-MM-dd', 'en_US')
      ) {
        this.errorMessage = 'Start date and End date should not be same';
      }
    }
  }
}
