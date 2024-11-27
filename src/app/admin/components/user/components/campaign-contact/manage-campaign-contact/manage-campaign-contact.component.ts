import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { IncentivesDialogComponent } from 'src/app/admin/components/properties/components/incentive/incentives-dialog/incentives-dialog.component';
import { SettingService } from 'src/app/admin/services/setting.service';
import { GRID_ACTION, GRID_TOOLBAR, ROUTE } from 'src/app/models/constants';
import { CommonStoreService } from 'src/app/services/common-store.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { LoaderService } from 'src/app/shared/services/loader/loader.service';

@Component({
  selector: 'app-manage-campaign-contact',
  templateUrl: './manage-campaign-contact.component.html',
  styleUrls: ['./manage-campaign-contact.component.scss']
})
export class ManageCampaignContactComponent {
  filterData: any;
  tableConfig: any;
  columns: any[] = [
    {
      field: 'CampaignName',
      header: 'Campaign Name',
      sort: true,
      visible: true,
      show: true
    },
    {
      field: 'Name',
      header: 'Name',
      sort: true,
      visible: true,
      show: true
    },
    {
      field: 'Email',
      header: 'Email',
      sort: true,
      visible: true,
      show: true
    },
    {
      field: 'Mobile',
      header: 'Mobile',
      sort: true,
      visible: true,
      show: true
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
    }
  ];

  actions: any[] = [{}];
  settingDetails: any;
  filterColumns: any;
  filter: any = {
    PageNo: 1,
    PerPage: 10,
    Search: undefined,
    SortBy: undefined,
    SortOrder: 'Desc',
  };
  activeTab: any;
  constructor(
    private settingService: SettingService,
    private router: Router,
    private loaderService: LoaderService,
    private commonService: CommonService,
    private toasterService: ToastrService,
    private commonStoreService: CommonStoreService,
    private datePipe: DatePipe,
    private dialog: MatDialog
  ) { 
    
  }
  ngOnInit() : void{
    this.initializeTable();
    this.loadTableData(this.filter);
  }
  initializeTable() {
    this.tableConfig = {
      id: 'CampaignContact',
      tablename: 'Campaign Contacts',
      columns: this.columns,
      rows: [],
      tools: [],
      totalRowsCount: 0,
      pageCnt: 0,
      isPaginationRequired: true,
      showActions: true
    };
  }
  loadTableData(filter: any) {
    this.loaderService.show();
    this.settingService.getCampaignSettingsData(this.filter).subscribe({
      next: (result: any) => {
        this.loaderService.hide();
        this.settingDetails = result;
        this.createtableConfig(result);
      },
      error: (error: any) => {
        this.loaderService.hide();
        error.error.errors
          ? this.displayError(error.error.errors)
          : this.toasterService.error(error.error.message);
      },
    });
  }


  createtableConfig(data: any) {
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
          name: 'Column',
          id: 'column',
          disabled: false,
          icon: 'assets/images/grid-columns.svg',
        }
      ],
      rows: [...data.CampaignContact].map((d: any) => ({
        ...d,
        operations: data.FullAccess
          ? [
            {
              name: GRID_ACTION.EDIT.TITLE,
              icon: GRID_ACTION.EDIT.ID,
              operationName: GRID_ACTION.EDIT.ID,
              path: GRID_ACTION.EDIT.ICON,
            },
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
      })),
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
  changeRoute(route: string, formConfig: any, CampaignContactId: any) {
    this.settingService.setCampaignID(CampaignContactId);
    this.commonStoreService.setFormConfig(formConfig);
    this.router.navigate([route]);
  }
  onActionClick(event: any) {
 
  }
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
      case GRID_TOOLBAR.COLUMN.NAME:
        this.openDialog(this.filterData);
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
  async rowActions(data: any) {
    let formConfig: any = {
      mode: data.operation,
      id: data.rowData.CampaignContactId,
      name: data.rowData.Name,
      access: this.settingDetails.FullAccess,
    };
    await this.commonStoreService.setFormConfig(formConfig);
    switch (data.operation) {
      case GRID_ACTION.EDIT.ID:
        this.router.navigate([ROUTE.EDIT_CAMPAIGN_CONTACT_DETAILS]);
        break;
      case GRID_ACTION.VIEW.ID:
        this.changeRoute( 
          ROUTE.GET_CAMPAIGN_CONTACT_DETAILS,
          formConfig,
          data.rowData.CampaignContactId
        );
      break;
      case GRID_ACTION.DELETE.ID: {
        const dialogRef = this.commonService.showModal(
          'Delete',
          'Are you sure you want to delete this campaign contact?'
        );
        dialogRef.afterClosed().subscribe((result: any) => {
          if (result) {
            this.deleteCampaignContact(data.rowData.CampaignContactId);
          }
        });
      }
    }
  }

  deleteCampaignContact(id: number) {
    this.loaderService.show();
    this.settingService.deleteCampaignContact(id).subscribe({
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

  openDialog(data: any) {
    const dialogRef = this.dialog.open(IncentivesDialogComponent, {
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
            this.filterData.columns = result.clear ? this.columns : result.data.columns;
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
