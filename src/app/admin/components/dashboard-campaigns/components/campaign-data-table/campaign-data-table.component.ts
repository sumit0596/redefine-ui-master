import { Component, Input, SimpleChanges, ViewChild } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import {
  FORM_MODE,
  GRID_ACTION,
  GRID_TOOLBAR,
  ROUTE,
  SESSION,
} from 'src/app/models/constants';
import { CommonStoreService } from 'src/app/services/common-store.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { LoaderService } from 'src/app/shared/services/loader/loader.service';
import * as XLSX from 'xlsx';
import { LeadsDialogComponent } from '../../../properties/components/leads/leads-dialog/leads-dialog.component';
import { DashboardCampaignsService } from 'src/app/admin/services/dashboard-campaigns.service';
import { CampaignLeadsDialogComponent } from './campaign-leads-dialog/campaign-leads-dialog.component';
import { Property } from 'grapesjs';
import { map, Observable, of } from 'rxjs';
import { PROPERTY_TYPE } from 'src/app/models/enum';
import { UserService } from 'src/app/admin/services/user.service';
import { DashboardService } from 'src/app/admin/services/dashboard.service';
import { DatatableComponent } from 'src/app/shared/modules/datatable/datatable.component';

@Component({
  selector: 'app-campaign-data-table',
  templateUrl: './campaign-data-table.component.html',
  styleUrls: ['./campaign-data-table.component.scss']
})
export class CampaignDataTableComponent {
  @Input() filter$!: string;
  @Input() resetFilter$!: any;
  @Input() appliedFilter$!: any;
  @ViewChild(DatatableComponent, { static: false }) datatableComponent!: DatatableComponent;
  @ViewChild(CampaignLeadsDialogComponent) campLeadsTable!: CampaignLeadsDialogComponent;
  filterData: any;
  tableConfig: any;
  access: any;
  columns: any[] = [
    {
      field: 'LeadName',
      header: 'Name of Lead',
      sort: true,
      visible: true,
      show: true,
    },
    {
      field: 'BuildingName',
      header: 'Property Name',
      sort: true,
      visible: true,
      show: true,
    },
    {
      field: 'SectorName',
      header: 'Sector',
      sort: true,
      visible: true,
      show: true,
    },
    {
      field: 'LeasingExecutive',
      header: 'Leasing Executive',
      sort: true,
      visible: true,
      show: true,
    },
    {
      field: 'Source',
      header: 'Source',
      sort: true,
      visible: true,
      show: true,
    },
    {
      field: 'SourceType',
      header: 'Source Type',
      sort: true,
      visible: true,
      show: true,
    },
    {
      field: 'Medium',
      header: 'Medium',
      sort: true,
      visible: true,
      show: true,
    },
    {
      field: 'CreatedOn',
      header: 'Date',
      sort: true,
      visible: true,
      show: true,
    },
    {
      field: 'LeadStatus',
      header: 'Status',
      sort: true,
      visible: true,
      show: true,
    },
    // {
    //   field: 'actions',
    //   header: 'Actions',
    //   sort: false,
    //   visible: false,
    //   show: true,
    // },
  ];
  actions: any[] = [{}];
  filterColumns: any;
  getFilter: any;
  filter: any = {
    PageNo: 1,
    PerPage: '',
    Search: '',
    SortBy: '',
    SortOrder: 'Desc',
    SectorId: '',
    Medium: '',
    Campaign: '',
    LeasingExecutiveId: '',
    PropertyId: '',
    Source: '',
    Status: '',
    StartDate: '',
    EndDate: '',
    Days: '',
  };
  leadsList: any;
  tabName: any;
  userDetails: any;
  previousAppliedFilter: any;
  leadsTableCampaignName!: string;
  leadLeasingExecutive$!: Observable<any[]>;
  leadProperty$!: Observable<any[]>;
  leadSource$!: Observable<any[]>;
  leadMedium$!: Observable<any[]>;
  sectorList$!: Observable<any[]>;
  sectorList!: any[];
  leasingList$!: Observable<any[]>;
  leasingList!: any[];
  propertyList$!: Observable<any[]>;
  propertyList!: any[];

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private dashboardCamp: DashboardCampaignsService,
    private commonService: CommonService,
    private commonStoreService: CommonStoreService,
    private datePipe: DatePipe,
    private toasterService: ToastrService,
    private userService: UserService,
    private dashboardService: DashboardService,
    private loaderService: LoaderService
  ) { }
  ngOnInit(): void {
    let user: any = sessionStorage.getItem(SESSION.USER);
    this.userDetails = JSON.parse(user);
    // this.initializeTable();
    // this.loadTableData(this.filter);
  }

  ngOnChanges(changes: SimpleChanges) {
    // if (changes['filter$'] && changes['filter$'] != undefined) {
    //   this.filter = {...this.filter,
    //     Campaign :this.filter$,
    //   }
    //   this.initializeTable();
    //   if( changes['filter$'].previousValue != undefined){
    //     this.loadTableData(this.filter);
    //   }
    // }
  }

  ngDoCheck() {

    if (this.appliedFilter$ !== this.previousAppliedFilter) {
      this.previousAppliedFilter = this.appliedFilter$;
      this.filter.Campaign = this.filter$;
      this.leadsTableCampaignName = this.filter$
      this.getFilter = this.previousAppliedFilter;
      this.filter = {
        ...this.filter,
        PropertyId: '',
        SectorId: '',
        Medium: '',
        Source: '',
        LeasingExecutiveId: '',
        StartDate: this.getFilter.StartDate,
        EndDate: this.getFilter.EndDate,
        Days: this.getFilter.Days,
        PerPage: 10
      }
      this.getSectors();
      this.getSource();
      this.getMedium();
      this.getLeasingExecutive();
      this.getPropertyList();
      this.initializeTable();
      this.loadTableData(this.filter);
    }
  }

  initializeTable() {
    this.tableConfig = {
      id: 'LeadId',
      tablename: this.leadsTableCampaignName,
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
    this.dashboardCamp.getCampaignLeads(filter).subscribe({
      next: (result: any) => {
        this.leadsList = result;
        this.createTableConfig(result);
        this.loaderService.hide();
      },
      error: (error: any) => {
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
      rows: [...data.lead].map((d: any) => {
        return {
          ...d,
          operations: data.FullAccess
            ? [
              {
                name:
                  GRID_ACTION.VIEW.TITLE + ' / ' + GRID_ACTION.RESPOND.TITLE,
                icon: GRID_ACTION.VIEW.ID,
                operationName: GRID_ACTION.VIEW.ID,
                path: GRID_ACTION.VIEW.ICON,
              },
              // {
              //   name: GRID_ACTION.EDIT.TITLE,
              //   icon: GRID_ACTION.EDIT.ID,
              //   operationName: GRID_ACTION.EDIT.ID,
              //   path: GRID_ACTION.EDIT.ICON,
              // },
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
      Status: event.status ? event.status : undefined,
    };
    this.loadTableData(this.filter);
  }

  changeRoute(route: string, formConfig: any) {
    this.commonStoreService.setFormConfig(formConfig);
    this.router.navigate([route]);
  }
  getExcelData(filter: any) {
    this.dashboardCamp.getCampaignLeads(filter).subscribe({
      next: (res: any) => {
        this.exportExcel(res.lead);
      },
      error: (error: any) => {
        error.error.errors
          ? this.displayError(error.error.errors)
          : this.toasterService.error(error.error.message);
      },
    });
  }
  exportExcel(data: any[]) {
    this.loaderService.show();
    let selectedColumns = this.tableConfig.columns
      .filter((column: any) => column.show)
      .map((column: any) => column.header);

    if (!selectedColumns.includes('Email Address')) {
      selectedColumns.push('Email Address');
    }
    if (!selectedColumns.includes('Phone Number')) {
      selectedColumns.push('Phone Number');
    }
    if (!selectedColumns.includes('Internal CRM ID')) {
      selectedColumns.push('Internal CRM ID');
    }
    if (!selectedColumns.includes('Click ID')) {
      selectedColumns.push('Click ID');
    }
    let sheetData = data.map((d: any) => {
      let rowData: any = {};
      selectedColumns.forEach((col: any) => {
        switch (col) {
          case 'Name of Lead':
            rowData['Name'] = d.LeadName;
            break;
          case 'Email Address':
            rowData['Email Address'] = d.Email;
            break;
          case 'Phone Number':
            rowData['Phone Number'] = d.Mobile;
            break;
          case 'Property Name':
            rowData['Property Name'] = d.BuildingName;
            break;
          case 'Sector':
            rowData['Sector'] = d.SectorName;
            break;
          case 'Campaign':
            rowData['Campaign'] = d.Campaign;
            break;
          case 'Leasing Executive':
            rowData['Leasing Executive'] = d.LeasingExecutive;
            break;
          case 'Source':
            rowData['Source'] = d.Source;
            break;
          case 'Medium':
            rowData['Medium'] = d.Medium;
            break;
          case 'Date':
            rowData['Date'] = d.CreatedOn;
            break;
          case 'Status':
            rowData['Status'] = d.LeadStatus;
            break;
          case 'Internal CRM ID':
            rowData['Internal CRM ID'] = d.IntCrmLeadId;
            break;
          case 'Click ID':
            rowData['Click ID'] = d.ClickId;
            break;
        }
      });

      return rowData;
    });
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(sheetData);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, `Leads`);
    XLSX.writeFile(
      wb,
      `Leads-${this.datePipe.transform(
        Date.now().toString(),
        'dd-MM-yyyy'
      )}.xlsx`
    );
    this.loaderService.hide();
  }
  onToolbarClick(event: any) {

    this.filterData = {
      label: event.name,
      columns: this.tableConfig.columns,
      PropertyId: this.filterData?.PropertyId ? this.filterData.PropertyId : null,
      SectorId: this.filterData?.SectorId ? this.filterData.SectorId : null,
      Medium: this.filterData?.Medium ? this.filterData.Medium : null,
      Source: this.filterData?.Source ? this.filterData.Source : null,
      LeasingExecutiveId: this.filterData?.LeasingExecutiveId ? this.filterData.LeasingExecutiveId : null,
      Campaign: this.filter$ ? this.filter$ : '',
      leadSource: this.leadSource$,
      propertyList: this.propertyList$,
      sectorList: this.sectorList$,
      leadMedium: this.leadMedium$,
      leasingList: this.leasingList$
    };
    this.filter = {
      ...this.filter,
      PageNo: event.filter.pageNumber,
      PerPage: event.filter.pageSize,
      Search: event.filter.searchValue,
      SortBy: event.filter.sortBy,
      SortOrder: event.filter.sortOrder,
      LeasingExecutive: this.filterData?.LeasingExecutive || '',
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
              : this.filterData.Search

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
        if (this.leadsList?.lead?.length) {
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
  rowActions(data: any) {
    let formConfig: any = {
      mode: data.operation,
      id: data.rowData.LeadId,
      access: this.leadsList.FullAccess,
    };
    switch (data.operation) {
      case GRID_ACTION.RESPOND.ID:
        this.changeRoute(ROUTE.VIEW_LEAD, formConfig);
        break;
      case GRID_ACTION.VIEW.ID:
        this.changeRoute(ROUTE.VIEW_LEAD, formConfig);
        break;
    }
  }
  onActionClick(event: any) { }
  openDialog(data: any) {
    const dialogRef = this.dialog.open(CampaignLeadsDialogComponent, {
      data: this.filterData,
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.filterData = result?.data;
        switch (result?.data?.label) {
          case GRID_TOOLBAR.FILTER.NAME:
            this.filter = {
              ...this.filter,
              Campaign: this.filter.Campaign ? this.filter.Campaign : '',
              //Search: result.clear ? '' : result.data.Search,
              PropertyId: result.clear ? '' : result.data.PropertyId,
              SectorId: result.clear ? '' : result.data.SectorId,
              Medium: result.clear ? '' : result.data.Medium,
              Source: result.clear ? '' : result.data.Source,
              LeasingExecutiveId: result.clear ? '' : result.data.LeasingExecutiveId,
            };
            this.loadTableData(this.filter);
            break;
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

  createLeads() {
    let formConfig = {
      id: undefined,
      mode: FORM_MODE.CREATE,
      access: this.leadsList.FullAccess,
    };
    this.commonStoreService.setFormConfig(formConfig);
    this.router.navigate([`${ROUTE.CREATE_LEAD}`]);
  }

  async getSectors() {
    this.sectorList$ = await this.userService.getSectorsCampaignDropdown(
      this.filter.Campaign
    );
    this.sectorList$.subscribe({
      next: (res) => {
        this.sectorList = res;
      },
      error: (error) => { },
    });
  }

  getLeasingExecutive() {
    this.dashboardCamp.getLeasing(
      this.filter.Campaign
    ).pipe(
      map((res: any) => {
        return res.data.map((item: any) => ({
          Id: item.UserId,
          Name: `${item.FirstName} ${item.LastName}`
        }));
      })
    ).subscribe((leasingList: any[]) => {
      this.leasingList$ = of(leasingList);
    });
  }

  getPropertyList() {

    this.dashboardCamp
      .getPropListDropdown(
        this.filter.Campaign
      )
      .pipe(
        map((res: any) => {
          let arr = [];
          for (const key in res.data) {
            if (res.data.hasOwnProperty(key)) {
              arr.push({ ...res.data[key] });
            }
          }
          this.propertyList$ = of(arr);
        })
      )
      .subscribe();
  }

  getSource() {
    this.dashboardCamp
      .getCampaignLeadSources(
        this.filter.Campaign
      )
      .pipe(
        map((res: any) => {
          let arr = [];
          for (const key in res.data) {
            if (res.data.hasOwnProperty(key)) {
              arr.push({ ...res.data[key] });
            }
          }
          this.leadSource$ = of(arr);
        })
      )
      .subscribe();
  }

  getMedium() {
    this.dashboardCamp
      .getCampaignLeadMedium(
        this.filter.Campaign
      )
      .pipe(
        map((res: any) => {
          let arr = [];
          for (const key in res.data) {
            if (res.data.hasOwnProperty(key)) {
              arr.push({ ...res.data[key] });
            }
          }
          this.leadMedium$ = of(arr);
        })
      )
      .subscribe();
  }
  triggerClearDataFilter() {
    if (this.datatableComponent) {
      this.datatableComponent.clearSearch(null);
      
    }
  }

  dialogClearDataFilter() {
    this.campLeadsTable.clearFilter();
  }
}
