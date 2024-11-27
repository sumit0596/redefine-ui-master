import { Component } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { FORM_MODE, GRID_ACTION, GRID_TOOLBAR, ROUTE, SESSION } from 'src/app/models/constants';
import { CommonStoreService } from 'src/app/services/common-store.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { LoaderService } from 'src/app/shared/services/loader/loader.service';
import { DatePipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { SettingService } from 'src/app/admin/services/setting.service';
import { IncentivesDialogComponent } from '../../../properties/components/incentive/incentives-dialog/incentives-dialog.component';

@Component({
  selector: 'app-manage-settings',
  templateUrl: './manage-settings.component.html',
  styleUrls: ['./manage-settings.component.scss']
})
export class ManageSettingsComponent {
  filterData: any;
  tableConfig: any;
  isCampaignTab : boolean = false
  columns: any[] = [
    {
      field: 'Name', 
      header: 'Name', 
      sort: true, 
      visible: true, 
      show: true
    },
    {
      field: 'Value',
      header: 'Value',
      sort: false,
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
  tabName: any;
  formConfig: any;
  activeTab : number = 0;
  constructor(
    private settingService:SettingService,
    private router: Router,
    private loaderService: LoaderService,
    private commonService: CommonService,
    private toasterService: ToastrService,
    private commonStoreService: CommonStoreService,
    private datePipe: DatePipe,
    private dialog: MatDialog
  ) { }
  async ngOnInit() {
    this.formConfig = await this.commonStoreService.getFormConfig();
    if(this.formConfig?.tab == '1'){
      this.activeTab = 0;
    }
    else if(this.formConfig?.tab == '2'){
      this.activeTab = 1;
    }
    else{                                             
      this.activeTab = 0;
    }
    sessionStorage.removeItem(SESSION.FORM_CONFIG);
    this.initializeTable();
    this.loadTableData(this.filter);
  }
  initializeTable() {
    this.tableConfig = {
      id: 'Setting',
      tablename: 'Generals',
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
    this.settingService.getAllSettings(filter).subscribe({
      next: (result: any) => {
        this.loaderService.hide();
        this.settingDetails = result;
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
    data.setting.forEach((element: any) => {
      element.CreatedOn = new Date(element.CreatedOn);
      element.CreatedOn = moment(element.CreatedOn).format('DD/MM/YYYY');
    });
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
      rows: [...data.setting].map((d: any) => {
        return {
          ...d,
          operations: data.FullAccess
            ? [
              {
                name: GRID_ACTION.EDIT.TITLE,
                icon: GRID_ACTION.EDIT.ID,
                operationName: GRID_ACTION.EDIT.ID,
                path: GRID_ACTION.EDIT.ICON,
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
    };
    this.loadTableData(this.filter);
  }
  changeRoute(route: string, formConfig: any) {
    this.commonStoreService.setFormConfig(formConfig);
    this.router.navigate([route]);
  }
  onActionClick(event: any) { }
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
      id: data.rowData.SettingId,
      name: data.rowData.Name,
      access: this.settingDetails.FullAccess,
    };
    await this.commonStoreService.setFormConfig(formConfig);
    switch (data.operation) {
      case GRID_ACTION.EDIT.ID:
        this.router.navigate([ROUTE.EDIT_SETTINGS]);
        break;
    }
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

  onTabChange(event:any){
    if(event.tab.textLabel=="campaignContact"){
      this.activeTab = 1
    }else{
      this.activeTab = 0;
    }
  }

  createCampaignContact(){
    let formConfig = {
      id: undefined,
      mode: FORM_MODE.CREATE,
      tab : this.getTabType()
    };
    this.commonStoreService.setFormConfig(formConfig);
    this.router.navigate([`${ROUTE.ADD_CAMPAIGN_CONTACT_DETAILS}`]);
  }

  getTabType(): any {
    if (this.tabName === "Setting") {
        return 1;
    } else if (this.tabName === "campaignContact") {
        return 2;
    }
  }
  
}
