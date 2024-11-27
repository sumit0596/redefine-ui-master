import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable, of } from 'rxjs';
import { PeopleService } from 'src/app/admin/services/people.service';
import { CONSTANTS, ROUTE, FORM_MODE } from 'src/app/models/constants';
import { CommonStoreService } from 'src/app/services/common-store.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { LoaderService } from 'src/app/shared/services/loader/loader.service';

@Component({
  selector: 'app-manage-people',
  templateUrl: './manage-people.component.html',
  styleUrls: ['./manage-people.component.scss'],
})
export class ManagePeopleComponent {
  rows: any;
  totalRowsCount: any;
  pageCnt: any;
  columns: any;
  tableSettings: any;
  pageNumber = 1;
  pageSize = 10;
  type: any;
  params: any;

  status$: Observable<any[]> = of([
    {
      Id: 0,
      Name: 'Draft',
    },
    {
      Id: 1,
      Name: 'Published',
    },
  ]);

  filterColumns: any;
  activeRoute: string = '';
  access: any;
  constructor(
    private peopleService: PeopleService,
    private router: Router,
    private loaderService: LoaderService,
    private commonService: CommonService,
    private toasterService: ToastrService,
    private commonStoreService: CommonStoreService
  ) {
    this.activeRoute = router.url;
    this.setColumnHeaders();
    this.initializeTableSettings();
  }
  async ngOnInit() {
    this.getAllPeople();
  }

  getAllPeople(pageSize?: any, pageNumber?: any) {

    this.type = this.router.url == ROUTE.MANAGE_PEOPLE ? 1 : 2;

    this.loaderService.show();
    if (pageSize != undefined && pageNumber != undefined) {
      this.pageSize = pageSize;
      this.pageNumber = pageNumber;
    }
    this.peopleService
      .getAllPeople(this.pageSize, this.pageNumber, this.type)
      .subscribe({
        next: (res) => {
          this.peopleData(res);
        },
        error: (error) => {
          this.loaderService.hide();
          this.toasterService.error(error.error.message);
        },
        complete: () => {
          this.loaderService.hide();
        },
      });
  }

  setColumnHeaders() {
    this.columns = [
      {
        field: 'EmployeeName',
        header: 'Name of Employee',
        sort: true,
        visible: true,
        show: true,
      },
      {
        field: 'JobTitle',
        header: 'Job Title',
        sort: true,
        visible: true,
        show: true,
      },
      // {
      //   field: 'Description',
      //   header: 'Description',
      //   sort: true,
      //   visible: true,
      //   show: true,
      // },
      {
        field: 'YearAppointed',
        header: 'Year Appointed',
        sort: true,
        visible: true,
        show: true,
      },
      {
        field: 'InvestorContactsStatus',
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
      columns: this.columns,
      tablename: 'All Investor Contacts',
    };
  }

  peopleData(res: any) {
    this.initializeTableSettings();
    if (res.data) {
      this.totalRowsCount = res.data.totalCount;
      this.pageCnt = res.data.pageCount;
      this.access = res.data.FullAccess;
      if (res.data.FullAccess === 1) {
        res.data.people.forEach((e: any) => {
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
        res.data.people.forEach((e: any) => {
          e.operations = [
            {
              name: CONSTANTS.VIEW,
              icon: CONSTANTS.DETAILS_ICON,
              operationName: CONSTANTS.VIEW,
              path: 'assets/images/eye.svg',
            },
          ];
        });
      }
      this.rows = res.data.people;
      if (this.type == 1) {
        this.tableSettings = {
          rows: this.rows,
          columns: this.columns,
          id: 'InvestorContactsId',
          totalRowsCount: this.totalRowsCount,
          pageCnt: this.pageCnt,
          tablename: 'All Investor Contacts',
          isPaginationRequired: true,
          isFilterRequired: true,
          isSearchRequired: true,
          isColumnGroupRequired: true,
          isDownloadRequired: true,
          showActions: true,
        };
      } else if (this.type == 2) {
        this.tableSettings = {
          rows: this.rows,
          columns: this.columns,
          id: 'InvestorContactsId',
          totalRowsCount: this.totalRowsCount,
          pageCnt: this.pageCnt,
          tablename: 'All Leaders',
          isPaginationRequired: true,
          isFilterRequired: true,
          isSearchRequired: true,
          isColumnGroupRequired: true,
          isDownloadRequired: true,
          showActions: true,
        };
      }
    } else {
      this.rows = [];
      this.totalRowsCount = 0;
      this.pageCnt = 0;
    }
  }

  tableData(event: any) {
    this.getPeopleData(event);
  }

  getPeopleData(event: any): void {
    this.params =  event;
    event.type = this.type;
    this.loaderService.show();
    this.peopleService
      .getAllPeople(
        event.pageSize,
        event.pageNumber,
        event.type,
        event.statusIds,
        event.searchValue,
        event.sortBy,
        event.sortOrder
      )
      .subscribe({
        next: (res) => {
          this.peopleData(res);
        },
        error: (error: ErrorEvent) => {
          this.toasterService.error(error.error.message);
          this.loaderService.hide();
        },
        complete: () => {
          this.loaderService.hide();
        },
      });
  }

  async rowActions(data: any) {
    let event: any = {
      mode: data.operation,
      id: data.rowData.InvestorContactsId,
      access: this.access,
      type: this.type,
    };
    await this.commonStoreService.setFormConfig(event);
    if (data.operation === CONSTANTS.EDIT && this.type == 1) {
      this.router.navigate([ROUTE.EDIT_PEOPLE]);
    } else if (data.operation === CONSTANTS.EDIT && this.type == 2) {
      this.router.navigate([ROUTE.EDIT_LEADERSHIP]);
    } else if (
      data.operation === CONSTANTS.VIEW.toLowerCase() &&
      this.type == 1
    ) {
      this.router.navigate([ROUTE.VIEW_PEOPLE]);
    } else if (
      data.operation === CONSTANTS.VIEW.toLowerCase() &&
      this.type == 2
    ) {
      this.router.navigate([ROUTE.VIEW_LEADERSHIP]);
    } else if (data.operation === CONSTANTS.DELETE_OPERATION.toLowerCase()) {
      const dialogRef = this.commonService.showModal(
        'Delete',
        CONSTANTS.PEOPLE_DELETE_CONFIRMATION,
      );
      dialogRef.afterClosed().subscribe((action: any) => {
        if (action) {
          this.loaderService.show();
          this.peopleService
            .deletePeople(data.rowData.InvestorContactsId)
            .subscribe({
              next: (res: any) => {
                this.toasterService.success(res.message);
                this.params ?  this.getPeopleData(this.params) : this.getAllPeople(data.pageSize, data.activePageNumber);
                this.loaderService.hide();
              },
              error: (error: any) => {
                this.loaderService.hide();
                this.toasterService.error(error.error.message);
              },
            });
        }
      });
    }
  }

  createPeople() {
    let formConfig = {
      id: undefined,
      mode: FORM_MODE.CREATE,
      type: this.type,
    };
    this.commonStoreService.setFormConfig(formConfig);

    if (this.type == 1) {
      this.router.navigate([`${ROUTE.CREATE_PEOPLE}`]);
    } else {
      this.router.navigate([`${ROUTE.CREATE_LEADERSHIP}`]);
    }
  }
}
