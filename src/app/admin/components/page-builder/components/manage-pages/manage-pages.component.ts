import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import {
  CONSTANTS,
  FORM_MODE,
  GRID_ACTION,
  GRID_TOOLBAR,
  ROUTE,
  STATUS,
} from 'src/app/models/constants';
import { PageFormComponent } from '../page-form/page-form.component';
import { ToastrService } from 'ngx-toastr';
import { PageBuilderService } from '../../services/page-builder.service';
import {
  IPage,
  IPageDetails,
  IPageTableFilter,
  ITableConfig,
} from '../../model/interfaces';
import { LoaderService } from 'src/app/shared/services/loader/loader.service';
import { INTEGRATED_REPORT_STATUS } from 'src/app/models/enum';
import { CommonStoreService } from 'src/app/services/common-store.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { map } from 'rxjs';

@Component({
  selector: 'app-manage-pages',
  templateUrl: './manage-pages.component.html',
  styleUrls: ['./manage-pages.component.scss'],
})
export class ManagePagesComponent implements OnInit {
  portalUrl!: string;
  pageDetails: any;
  portalId: number | undefined;
  tableConfig!: ITableConfig;
  filterData: any;
  filter: IPageTableFilter = {
    PageNo: 1,
    PerPage: 10,
    Search: undefined,
    SortBy: undefined,
    SortOrder: 'Desc',
    Status: undefined,
    Portal: undefined,
  };
  filteredColumns: any;
  columns: any[] = [
    {
      field: 'Title',
      header: 'Page Name',
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
      field: 'UpdatedOn',
      header: 'Last Edited',
      sort: true,
      visible: true,
      show: true,
    },
    {
      field: 'AddedBy',
      header: 'Edited By',
      sort: true,
      visible: true,
      show: true,
    },
    {
      field: 'Status',
      header: 'Status',
      sort: false,
      visible: false,
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
  access: any;
  constructor(
    private router: Router,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private commonService: CommonService,
    private toasterService: ToastrService,
    private pageBuilderService: PageBuilderService,
    private commonStoreService: CommonStoreService
  ) {
    this.route.url.subscribe((urlPath: any) => {
      this.portalUrl = router.url.replace(urlPath[urlPath.length - 1].path, '');
    });
    route.parent?.data.subscribe((res: any) => {
      this.portalId = res.id || 0;
      this.filter = { ...this.filter, Portal: this.portalId };
    });
  }
  ngOnInit(): void {
    this.initializeTable();
    this.loadTableData(this.filter);
  }
  loadTableData(filter: IPageTableFilter) {
    this.pageBuilderService.getPageList(filter).subscribe({
      next: (res: any) => {
        this.pageDetails = res;
        this.formatGridData(res);
      },
      error: (error: Error) => {},
    });
  }
  formatGridData(data: any) {
    this.access = data?.FullAccess;
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
      ],
    };
    // rows: [...data.menus].map((page: IPage) => {
    //   return {
    //     ...page,
    //     operations: data.FullAccess
    //       ? [
    //           {
    //             name: GRID_ACTION.VIEW.TITLE,
    //             icon: GRID_ACTION.VIEW.ID,
    //             operationName: GRID_ACTION.VIEW.ID,
    //             path: GRID_ACTION.VIEW.ICON,
    //           },
    //           {
    //             name: GRID_ACTION.EDIT.TITLE,
    //             icon: GRID_ACTION.EDIT.ID,
    //             operationName: GRID_ACTION.EDIT.ID,
    //             path: GRID_ACTION.EDIT.ICON,
    //           },
    //           {
    //             name: GRID_ACTION.DUPLICATE.TITLE,
    //             icon: GRID_ACTION.DUPLICATE.ID,
    //             operationName: GRID_ACTION.DUPLICATE.ID,
    //             path: GRID_ACTION.DUPLICATE.ICON,
    //           },
    //           {
    //             name: GRID_ACTION.DELETE.TITLE,
    //             icon: GRID_ACTION.DELETE.ID,
    //             operationName: GRID_ACTION.DELETE.ID,
    //             path: GRID_ACTION.DELETE.ICON,
    //           },
    //         ]
    //       : [
    //           {
    //             name: GRID_ACTION.VIEW.TITLE,
    //             icon: GRID_ACTION.VIEW.ID,
    //             operationName: GRID_ACTION.VIEW.ID,
    //             path: GRID_ACTION.VIEW.ICON,
    //           },
    //         ],
    //   };
    // }),
    if (data?.FullAccess === 1) {
      data?.menus.forEach((e: any) => {
        e.operations = [
          {
            name: CONSTANTS.EDIT_OPERATION,
            icon: CONSTANTS.EDIT,
            operationName: CONSTANTS.EDIT,
            path: 'assets/images/edit.svg',
          },
          {
            name: GRID_ACTION.DUPLICATE.TITLE,
            icon: GRID_ACTION.DUPLICATE.ID,
            operationName: GRID_ACTION.DUPLICATE.ID,
            path: GRID_ACTION.DUPLICATE.ICON,
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
      var index = this.columns.findIndex(function (element: any) {
        return element.field == 'actions';
      });
      if (index !== -1) {
        this.columns.splice(index, 1);
      }
    }
    this.tableConfig.rows = data.menus;
  }
  initializeTable() {
    this.tableConfig = {
      id: 'CustomPages',
      tablename: 'All Pages',
      columns: this.columns,
      rows: [],
      tools: [],
      totalRowsCount: 0,
      pageCnt: 0,
      isPaginationRequired: true,
      showActions: true,
    };
  }
  onToolbarClick(event: any) {
    this.filterData = {
      label: event.name,
      columns: this.tableConfig.columns,
      status: this.filterData?.status ? this.filterData.status : null,
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
          status:
            event.filter.searchValue ||
            event.filter.searchValue == '' ||
            event.filter.searchValue == null
              ? null
              : this.filterData.status,
        };
        this.loadTableData(this.filter);
        break;
      case GRID_TOOLBAR.FILTER.NAME:
        break;
      case GRID_TOOLBAR.COLUMN.NAME:
        break;
      case GRID_TOOLBAR.EXPORT.NAME:
        this.filter = {
          ...this.filter,
          PerPage: 'all',
        };
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
      id: data.rowData.MenuId,
      label: data.rowData.Title,
      access: this.pageDetails.FullAccess,
    };
    switch (data.operation) {
      case GRID_ACTION.EDIT.ID:
        // this.pageBuilderService.setPage(data.rowData);
        this.changeRoute(this.portalUrl + ROUTE.BUILDER, formConfig);
        break;
      case GRID_ACTION.VIEW.ID:
        break;
      case GRID_ACTION.DELETE.ID:
        const dialogRef = this.commonService.showModal(
          'Delete',
          CONSTANTS.CUSTOMPAGES_DELETE_CONFIRMATION
        );
        dialogRef.afterClosed().subscribe((action: any) => {
          if (action) {
            // Call delete page API
            this.deletePage(data.rowData.MenuId);
          }
        });
        break;
      case GRID_ACTION.DUPLICATE.ID:
        this.duplicatePage(data.rowData.MenuId);
        break;
    }
  }
  onActionClick(event: any) {}
  openDialog(data: any) {
    // const dialogRef = this.dialog.open(IntegratedReportDialogComponent, {
    //   data: this.filterData,
    // });
    // dialogRef.afterClosed().subscribe((result: any) => {
    //   if (result) {
    //     this.filterData = result?.data;
    //     switch (result?.data?.label) {
    //       case GRID_TOOLBAR.FILTER.NAME:
    //         this.filter = {
    //           ...this.filter,
    //           Search: result.clear ? '' : result.data.status,
    //         };
    //         this.loadTableData(this.filter);
    //         break;
    //       case GRID_TOOLBAR.COLUMN.NAME:
    //         this.tableConfig = {
    //           ...this.tableConfig,
    //           columns: result.clear ? this.columns : result.data.columns,
    //         };
    //         break;
    //     }
    //   }
    // });
  }
  changeRoute(route: any, formConfig: any) {
    this.commonStoreService.setFormConfig(formConfig);
    this.router.navigate([route]);
  }
  createPage() {
    const dialogRef = this.dialog
      .open(PageFormComponent, {
        data: { Portal: this.portalId },
        minWidth: '40vw',
        minHeight: '50vh',
      })
      .afterClosed()
      .subscribe({
        next: (result: any) => {
          if (result) {
            let formConfig: any = {
              label: result.Title,
              mode: FORM_MODE.CREATE,
              id: undefined,
              access: this.pageDetails.FullAccess,
            };
            this.pageBuilderService.setPage(result);
            this.changeRoute(this.portalUrl + ROUTE.BUILDER, formConfig);
          }
        },
        error: (error: any) => {
          console.error('Error :: creating page:', error);
        },
        complete: () => {
          dialogRef.unsubscribe();
        },
      });
  }
  duplicatePage(id: number) {
    this.pageBuilderService.duplicatePage(id).subscribe({
      next: (res: any) => {
        this.toasterService.success(res.message);
        this.loadTableData(this.filter);
      },
      error: (error: any) => {
        this.toasterService.error(error.error.message);
        console.error('Error :: duplicating page:', error);
      },
    });
  }
  deletePage(id: number) {
    this.pageBuilderService.deletePage(id).subscribe({
      next: (res: any) => {
        this.toasterService.success(res.message);
        this.loadTableData(this.filter);
      },
      error: (error: any) => {
        this.toasterService.error(error.error.message);
        console.error('Error :: deleting page:', error);
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
