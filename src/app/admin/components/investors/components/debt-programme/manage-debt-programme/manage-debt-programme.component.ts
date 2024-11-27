import { DebtProgrammeService } from './../../../../../services/debt-programme.service';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CONSTANTS, FORM_MODE, ROUTE, SESSION } from 'src/app/models/constants';
import { CommonStoreService } from 'src/app/services/common-store.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { LoaderService } from 'src/app/shared/services/loader/loader.service';
import { DEBT_PROGRAMME } from 'src/app/models/enum';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-manage-debt-programme',
  templateUrl: './manage-debt-programme.component.html',
  styleUrls: ['./manage-debt-programme.component.scss'],
})
export class ManageDebtProgrammeComponent {
  rows: any;
  totalRowsCount: any;
  pageCnt: any;
  columns: any;
  tableSettings: any;
  pageNumber = 1;
  pageSize = 10;
  categoryList$!: Observable<any>;
  categoryList: any;
  filterColumns: any = [];
  activeRoute: string = '';
  tabName: any;
  status$: Observable<any[]> = of([
    {
      Id: 1,
      Name: 'Published',
    },
    {
      Id: 2,
      Name: 'Archived',
    },
  ]);
  access: any;
  Debtparams: any;
  pricingParams: any;
  creditParams: any;
  formConfig: any;
  activeTab!: any;
  constructor(
    private debtService: DebtProgrammeService,
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
    this.formConfig = await this.commonStoreService.getFormConfig();
    if (this.formConfig?.tab == '1') {
      this.activeTab = 0;
    } else if (this.formConfig?.tab == '2') {
      this.activeTab = 1;
    } else if (this.formConfig?.tab == '3') {
      this.activeTab = 2;
    }
    sessionStorage.removeItem(SESSION.FORM_CONFIG);

    // this.formConfig = await this.commonStoreService.getFormConfig();
    // this.activeTab = (this.formConfig == undefined) ? 0 : this.formConfig?.tab;
    // sessionStorage.removeItem(SESSION.FORM_CONFIG);
    this.getAllDebtProgrammes();
  }

  async getDebtCategoryTypes() {
    this.categoryList$ = await this.debtService.getDebtCreditCategoryTypes();
    this.categoryList$.subscribe({
      next: (res: any) => {
        this.categoryList = res;
      },
      error: (error: any) => {},
    });
  }

  getAllDebtProgrammes(pageSize?: any, pageNumber?: any, type?: any) {
    this.loaderService.show();
    if (type == undefined) {
      type =
        this.activeTab == 0
          ? 1
          : this.activeTab == 1
          ? 2
          : this.activeTab == 2
          ? 3
          : 1;
    }
    if (pageSize != undefined && pageNumber != undefined) {
      this.pageSize = pageSize;
      this.pageNumber = pageNumber;
    }
    this.debtService
      .getAllDebtProgrammes(this.pageSize, this.pageNumber, type)
      .subscribe({
        next: (res) => {
          this.debtProgrammeData(res);
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
        field: 'Title',
        header: 'Title',
        sort: true,
        visible: true,
        show: true,
      },
      // {
      //   field: 'DebtCreditCategoryName',
      //   header: 'Category',
      //   sort: true,
      //   visible: true,
      //   show: true,
      // },

      {
        field: 'CreatedOn',
        header: 'Date Created',
        sort: true,
        visible: true,
        show: true,
      },

      {
        field: 'DebtStatus',
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
      tablename: 'All Debt Programmes',
    };
  }

  debtProgrammeData(res: any) {
    this.initializeTableSettings();
    if (res.data) {
      this.totalRowsCount = res.data.totalCount;
      this.pageCnt = res.data.pageCount;
      this.access = res.data.FullAccess;
      if (res.data.FullAccess === 1) {
        res.data.debtCreditRatings.forEach((e: any) => {
          if (e.DebtStatus == 'Published') {
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
                name: CONSTANTS.ARCHIVE_OPERATION,
                icon: CONSTANTS.DELETE_ICON,
                operationName: CONSTANTS.DELETE,
                path: 'assets/images/archive.svg',
              },
            ];
          } else {
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
            ];
          }
        });
      } else {
        res.data.debtCreditRatings.forEach((e: any) => {
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
      this.rows = res.data.debtCreditRatings;
      this.tableSettings = {
        rows: this.rows,
        columns: this.columns,
        id: 'DebtCreditRatingId',
        Id: 'DebtCreditCategoryId',
        totalRowsCount: this.totalRowsCount,
        pageCnt: this.pageCnt,
        tablename: this.getTablename(),
        isPaginationRequired: true,
        isFilterRequired: true,
        isSearchRequired: true,
        isColumnGroupRequired: true,
        isDownloadRequired: true,
        showActions: true,
      };
      if (
        this.getTablename() === 'All Pricing Supplement' ||
        this.getTablename() === 'All Credit Ratings'
      ) {
        this.removeItem(
          this.columns,
          this.columns.filter((x: any) => x.field === 'DebtCreditCategoryName')
        );
      } else {
        let categoryColumn = {
          field: 'DebtCreditCategoryName',
          header: 'Category',
          sort: true,
          visible: true,
          show: true,
          checked: true,
        };
        // var contains =   JSON.stringify(this.columns).includes(JSON.stringify(categoryColumn));
        if (
          !this.columns.find((x: any) => x.field === 'DebtCreditCategoryName')
        ) {
          this.columns.splice(1, 0, categoryColumn);
        }
      }
    } else {
      this.rows = [];
      this.totalRowsCount = 0;
      this.pageCnt = 0;
    }
  }

  removeItem(array: any[], item: any) {
    if (item.length > 0) {
      let index = array.findIndex(
        (category) => category.field == item[0].field
      );
      array.splice(index, 1);
    }
  }

  getTablename(): any {
    if (this.tabName === 'PricingSupplement') {
      this.categoryList$ = of([]);
      return 'All Pricing Supplement';
    } else if (this.tabName === 'CreditRatings') {
      this.categoryList$ = of([]);
      return 'All Credit Ratings';
    } else {
      this.getDebtCategoryTypes();
      return 'All Debt Programme';
    }
  }

  // tableData(event: any) {
  //   this.getDebtProgrammeData(event);
  // }

  getDebtTableData(event: any) {
    this.getDebtProgrammeData(event);
  }

  getPricingTableData(event: any) {
    this.getPrcingData(event);
  }

  getCreditTableData(event: any) {
    this.getCreditData(event);
  }

  getDebtProgrammeData(event: any): void {
    this.Debtparams = event;
    this.loaderService.show();
    event.type = this.getTabType();
    this.debtService
      .getAllDebtProgrammes(
        event.pageSize,
        event.pageNumber,
        event.type,
        event.debtStatusIds,
        event.categoryIds,
        event.searchValue,
        event.sortBy,
        event.sortOrder
      )
      .subscribe({
        next: (res) => {
          this.debtProgrammeData(res);
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

  getPrcingData(event: any): void {
    this.pricingParams = event;
    this.loaderService.show();
    event.type = this.getTabType();
    this.debtService
      .getAllDebtProgrammes(
        event.pageSize,
        event.pageNumber,
        event.type,
        event.debtStatusIds,
        event.categoryIds,
        event.searchValue,
        event.sortBy,
        event.sortOrder
      )
      .subscribe({
        next: (res) => {
          this.debtProgrammeData(res);
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

  getCreditData(event: any): void {
    this.creditParams = event;
    this.loaderService.show();
    event.type = this.getTabType();
    this.debtService
      .getAllDebtProgrammes(
        event.pageSize,
        event.pageNumber,
        event.type,
        event.debtStatusIds,
        event.categoryIds,
        event.searchValue,
        event.sortBy,
        event.sortOrder
      )
      .subscribe({
        next: (res) => {
          this.debtProgrammeData(res);
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

  getTabType(): any {
    if (this.tabName === 'DebtProgramme') {
      return 1;
    } else if (this.tabName === 'PricingSupplement') {
      return 2;
    } else if (this.tabName === 'CreditRatings') {
      return 3;
    }
  }

  async rowActions(data: any) {
    let debtProgramme: any = {
      mode: data.operation,
      id: data.rowData.DebtCreditRatingId,
      access: this.access,
    };
    await this.commonStoreService.setFormConfig(debtProgramme);
    if (data.operation === CONSTANTS.EDIT) {
      this.router.navigate([ROUTE.EDIT_DEBT_PROGRAMME]);
    } else if (data.operation === CONSTANTS.VIEW.toLowerCase()) {
      this.router.navigate([ROUTE.VIEW_DEBT_PROGRAMME]);
    } else if (data.operation === CONSTANTS.ARCHIVE_OPERATION.toLowerCase()) {
      const dialogRef = this.commonService.showModal(
        'Archive',
        CONSTANTS.DEBT_STATUS_CONFIRMATION
      );
      dialogRef.afterClosed().subscribe((action: any) => {
        if (action) {
          this.loaderService.show();
          this.debtService
            .updateStatus(data.rowData.DebtCreditRatingId, 2)
            .subscribe({
              next: (res: any) => {
                this.toasterService.success(res.message);
                if (
                  this.tabName === 'DebtProgramme' ||
                  this.tabName == undefined
                ) {
                  this.Debtparams
                    ? this.getDebtTableData(this.Debtparams)
                    : this.getAllDebtProgrammes(
                        data.pageSize,
                        data.activePageNumber,
                        1
                      );
                } else if (this.tabName === 'PricingSupplement') {
                  this.pricingParams
                    ? this.getPricingTableData(this.pricingParams)
                    : this.getAllDebtProgrammes(
                        data.pageSize,
                        data.activePageNumber,
                        2
                      );
                } else if (this.tabName === 'CreditRatings') {
                  this.creditParams
                    ? this.getCreditTableData(this.creditParams)
                    : this.getAllDebtProgrammes(
                        data.pageSize,
                        data.activePageNumber,
                        3
                      );
                }
                this.loaderService.hide();
              },
              error: (error) => {
                this.loaderService.hide();
                this.toasterService.error(error.error.message);
              },
            });
        }
      });
    }
  }

  createDebtProgramme() {
    let formConfig = {
      id: undefined,
      mode: FORM_MODE.CREATE,
    };
    this.commonStoreService.setFormConfig(formConfig);
    this.router.navigate([`${ROUTE.CREATE_DEBT_PROGRAMME}`]);
  }

  onTabChange(event: any) {
    this.tabName = event.tab.textLabel;
    this.filterColumns.forEach((element: any) => {
      element.checked = true;
    });
    if (event.tab.textLabel == 'DebtProgramme') {
      this.Debtparams
        ? this.getDebtTableData(this.Debtparams)
        : this.getAllDebtProgrammes(10, 1, DEBT_PROGRAMME.DEBT_PROGRAMME);
    } else if (event.tab.textLabel == 'PricingSupplement') {
      this.pricingParams
        ? this.getPricingTableData(this.pricingParams)
        : this.getAllDebtProgrammes(10, 1, DEBT_PROGRAMME.PRICING_SUPPLEMENT);
    } else if (event.tab.textLabel == 'CreditRatings') {
      this.creditParams
        ? this.getCreditTableData(this.creditParams)
        : this.getAllDebtProgrammes(10, 1, DEBT_PROGRAMME.CREDIT_RATINGS);
    }
  }
}
