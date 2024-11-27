import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
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
import { LeadsDialogComponent } from '../leads-dialog/leads-dialog.component';
import * as XLSX from 'xlsx';
import { PropertyService } from 'src/app/admin/services/property.service';
import { Observable, map, of } from 'rxjs';
import { PROPERTY_TYPE } from 'src/app/models/enum';
import { UserService } from 'src/app/admin/services/user.service';

@Component({
  selector: 'app-manage-leads',
  templateUrl: './manage-leads.component.html',
  styleUrls: ['./manage-leads.component.scss'],
})
export class ManageLeadsComponent {
  filterData: any;
  tableConfig: any;
  access: any;
  columns: any[] = [
    {
      field: 'LeadName',
      header: 'Name',
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
      field: 'Campaign',
      header: 'Campaign',
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
      header: 'Date Sent',
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
    {
      field: 'actions',
      header: 'Actions',
      sort: false,
      visible: false,
      show: true,
    },
  ];
  actions: any[] = [{}];
  filterColumns: any;
  filter: any = {
    PageNo: 1,
    PerPage: 10,
    Search: undefined,
    SortBy: undefined,
    SortOrder: 'Desc',
    Type: 1,
    SectorId: undefined,
    Medium: undefined,
    Campaign: undefined,
    Source: undefined,
    Status: undefined,
  };
  leadsList: any;
  tabName: any;
  userDetails: any;

  leadCompaigns$!: Observable<any[]>;
  leadSource$!: Observable<any[]>;
  leadMedium$!: Observable<any[]>;
  sectorList$!: Observable<any[]>;
  sectorList!: any[];
  constructor(
    private router: Router,
    private dialog: MatDialog,
    private propertyService: PropertyService,
    private commonStoreService: CommonStoreService,
    private datePipe: DatePipe,
    private toasterService: ToastrService,
    private userService: UserService,
  ) {}
  ngOnInit(): void {
    let user: any = sessionStorage.getItem(SESSION.USER);
    this.userDetails = JSON.parse(user);
    this.initializeTable();
    this.loadTableData(this.filter);

    this.getSectors();
    this.getCompaigns();
    this.getSource();
    this.getMedium();
  }
  initializeTable() {
    this.tableConfig = {
      id: 'LeadId',
      tablename: 'Leads',
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
    this.propertyService.getAllLeads(filter).subscribe({
      next: (result: any) => {
        this.leadsList = result;
        this.createTableConfig(result);
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
    this.propertyService.getAllLeads(filter).subscribe({
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
    let sheetData = data.map((d: any) => {
      return {
        Name: d.LeadName,
        'Property Name': d.BuildingName,
        SectorName: d.SectorName,
        Campaign: d.Campaign,
        Source: d.Source,
        Medium: d.Medium,
        'Date Sent': d.CreatedOn,
        Status: d.LeadStatus,
      };
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
  }
  onToolbarClick(event: any) {
    this.filterData = {
      label: event.name,
      columns: this.tableConfig.columns,
      SectorId: this.filterData?.SectorId ? this.filterData.SectorId : null,
      Medium: this.filterData?.Medium ? this.filterData.Medium : null,
      Source: this.filterData?.Source ? this.filterData.Source : null,
      Campaign: this.filterData?.Campaign ? this.filterData.Campaign : null,
      sectorList : this.sectorList$,
      leadCompaigns : this.leadCompaigns$,
      leadSource : this.leadSource$,
      leadMedium : this.leadMedium$
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
  onActionClick(event: any) {}
  openDialog(data: any) {
    const dialogRef = this.dialog.open(LeadsDialogComponent, {
      data: this.filterData,
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.filterData = result?.data;
        switch (result?.data?.label) {
          case GRID_TOOLBAR.FILTER.NAME:
            this.filter = {
              ...this.filter,
              SectorId: result.clear ? '' : result.data.SectorId,
              Medium: result.clear ? '' : result.data.Medium,
              Source: result.clear ? '' : result.data.Source,
              Campaign: result.clear ? '' : result.data.Campaign,
            };
            this.loadTableData(this.filter);
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
  displayError(error: any) {
    let errors = JSON.parse(error);
    Object.keys(errors).forEach((err: any) => {
      this.toasterService.error(errors[err][0]);
    });
  }

  onTabChange(event: any) {
    this.tabName = event.tab.textLabel;
    // this.filterColumns.forEach((element:any) => {
    //   element.checked = true;
    // });
    if (event.tab.textLabel == 'MyProperties') {
      this.filter.Type = 2;
      this.loadTableData(this.filter);
    } else if (event.tab.textLabel == 'AllProperties') {
      this.filter.Type = 1;
      this.loadTableData(this.filter);
    }
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
    this.sectorList$ = await this.userService.getSectors(
      PROPERTY_TYPE.SOUTH_AFRICA
    );
    this.sectorList$.subscribe({
      next: (res) => {
        this.sectorList = res;
      },
      error: (error) => {},
    });
  }
  getCompaigns() {
    this.propertyService
      .getLeadCompaigns()
      .pipe(
        map((res: any) => {
          let arr = [];
          for (const key in res.data) {
            if (res.data.hasOwnProperty(key)) {
              arr.push({ ...res.data[key] });
            }
          }
          this.leadCompaigns$ = of(arr);
        })
      )
      .subscribe();
  }

  getSource() {
    this.propertyService
      .getLeadSources()
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
    this.propertyService
      .getLeadMedium()
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
}
