import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable, of } from 'rxjs';
import { PropertyService } from 'src/app/admin/services/property.service';
import { UserService } from 'src/app/admin/services/user.service';
import {
  CONSTANTS,
  FORM_MODE,
  GRID_ACTION,
  GRID_TOOLBAR,
  ROUTE,
} from 'src/app/models/constants';
import { CommonStoreService } from 'src/app/services/common-store.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { LoaderService } from 'src/app/shared/services/loader/loader.service';
import * as XLSX from 'xlsx';
import { InternationalSeoFormComponent } from '../international-property/components/international-seo-form/international-seo-form.component';
import { InternationalpropertydialogComponent } from '../internationalpropertydialog/internationalpropertydialog.component';
import { SeoFormComponent } from '../property/components/seo-form/seo-form.component';
import { PROPERTY_TYPE } from 'src/app/models/enum';

@Component({
  selector: 'app-manage-international-properties',
  templateUrl: './manage-international-properties.component.html',
  styleUrls: ['./manage-international-properties.component.scss'],
})
export class ManageInternationalPropertiesComponent {
  filterData: any;
  tableConfig: any;
  columns: any[] = [
    {
      field: 'PropertyName',
      header: 'Name',
      sort: true,
      visible: true,
      show: true,
    },
    {
      field: 'Address',
      header: 'Address',
      sort: false,
      visible: true,
      show: true,
    },
    {
      field: 'SectorName',
      header: 'Sector',
      sort: false,
      visible: true,
      show: true,
    },
    {
      field: 'HoldingCompanyName',
      header: 'Holding Company',
      sort: false,
      visible: true,
      show: true,
    },
    {
      field: 'CompletionType',
      header: 'Build Completion Status',
      sort: false,
      visible: true,
      show: true,
    },
    {
      field: 'IsFeatured',
      header: 'Featured',
      sort: false,
      visible: true,
      show: true,
    },
    {
      field: 'PropertyStatus',
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
    Type: 2,
    SectorId: '',
    HoldingCompanyId: '',
    CompletionType: '',
    Search: undefined,
    SortBy: undefined,
    SortOrder: 'Desc',
  };
  propertyDetails: any;
  sectorList$!: Observable<any[]>;
  sectorList!: any[];
  constructor(
    private userService: UserService,
    private propertyService: PropertyService,
    private router: Router,
    private loaderService: LoaderService,
    private commonService: CommonService,
    private toasterService: ToastrService,
    private commonStoreService: CommonStoreService,
    public dialog: MatDialog,
    private datePipe: DatePipe
  ) {}
  ngOnInit(): void {
    this.initializeTable();
    this.getSectors();
    this.loadTableData(this.filter);
  }

  async getSectors() {
    this.sectorList$ = await this.userService.getSectors(
      PROPERTY_TYPE.INTERNATIONAL
    );
    this.sectorList$.subscribe({
      next: (res) => {
        this.sectorList = res;
      },
      error: (error) => {},
    });
  }

  initializeTable() {
    this.tableConfig = {
      id: 'PropertyId',
      tablename: 'All International Properties',
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
    this.propertyService.getAllInternationalProperties(filter).subscribe({
      next: (result: any) => {
        this.loaderService.hide();
        this.propertyDetails = result;
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
  deleteProperty(id: number) {
    this.loaderService.show();
    this.propertyService.deleteProperty(id).subscribe({
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
  createTableConfig(data: any) {
    this.tableConfig = {
      ...this.tableConfig,
      totalRowsCount: data.totalProperty,
      totalFeaturedProperty: data.totalFeaturedProperty,
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
      rows: [...data.properties].map((d: any) => {
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
                  name: GRID_ACTION.EDIT.TITLE,
                  icon: GRID_ACTION.EDIT.ID,
                  operationName: GRID_ACTION.EDIT.ID,
                  path: GRID_ACTION.EDIT.ICON,
                },
                {
                  name: CONSTANTS.EDIT_SEO_OPERATION,
                  icon: CONSTANTS.EDIT,
                  operationName: CONSTANTS.EDITSEO,
                  path: 'assets/images/edit.svg',
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
      PageNo: event.pageNumber ? event.pageNumber : event.PageNo,
      PerPage: event.pageSize,
      Type: 2,
      Search: event.searchValue,
      SortBy: event.sortBy ? event.sortBy : undefined,
      SortOrder: event.sortOrder ? event.sortOrder : undefined,
    };
    this.loadTableData(this.filter);
  }

  createInternationalProperty() {
    let formConfig = {
      id: undefined,
      mode: FORM_MODE.CREATE,
      access: this.propertyDetails.FullAccess,
    };
    this.commonStoreService.setFormConfig(formConfig);
    this.router.navigate([ROUTE.CREATE_INTERNATIONAL_PROPERTY_DETAILS]);
  }

  changeRoute(route: string, formConfig: any) {
    this.commonStoreService.setFormConfig(formConfig);
    this.router.navigate([route]);
  }
  getExcelData(filter: any) {
    this.loaderService.show();
    this.propertyService.getAllInternationalProperties(filter).subscribe({
      next: (res: any) => {
        this.loaderService.hide();
        this.exportExcel(res.properties);
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
    // let sheetData = data.map((d: any) => {
    //   return {
    //     'Property Code': d.BuildingCode,
    //     Name: d.PropertyName,
    //     'Address': d.Address,
    //     'Sector': d.SectorName,
    //     'Holding Company': d.HoldingCompanyName,
    //     'Build Completion Status': d.CompletionType,
    //     Status: d.PropertyStatus,
    //     'Is Featured': d.IsFeatured
    //   };
    // });
    var activeColumns = this.tableConfig.columns.filter(
      (x: any) => x.show && x.field != 'actions'
    );
    var excelDataList: any = [];
    data.map((x: any) => {
      var excelData: any = {};
      activeColumns.map((y: any) => {
        excelData[y.header] = x[y.field];
      });
      excelDataList.push(excelData);
    });
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(excelDataList);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, `Intenational Properties`);
    XLSX.writeFile(
      wb,
      `Inernational Properties-${this.datePipe.transform(
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
      HoldingCompanyId: this.filterData?.HoldingCompanyId
        ? this.filterData.HoldingCompanyId
        : null,
      CompletionType: this.filterData?.CompletionType
        ? this.filterData.CompletionType
        : null,
      sectors: of(this.sectorList),
    };
    this.filter = {
      ...this.filter,
      PageNo: event.filter.pageNumber,
      PerPage: event.filter.pageSize,
      Search: event.filter.searchValue,
      // SectorId: event.filter.SectorId,
      // HoldingCompanyId: event.filter.HoldingCompanyId,
      // CompletionType: event.filter.CompletionType,
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
          // HoldingCompanyId:
          //     event.filter.searchValue ||
          //       event.filter.searchValue == '' ||
          //       event.filter.searchValue == null
          //       ? null
          //       : this.filterData.HoldingCompanyId,
          //  CompletionType:
          //     event.filter.searchValue ||
          //       event.filter.searchValue == '' ||
          //       event.filter.searchValue == null
          //       ? null
          //       : this.filterData.CompletionType,
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
        if (this.propertyDetails?.properties?.length) {
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
      id: data.rowData.PropertyId,
      access: this.propertyDetails.FullAccess,
    };
    this.commonStoreService.setFormConfig(formConfig);
    switch (data.operation) {
      case CONSTANTS.EDIT_SEO_OPERATION.toLocaleLowerCase():
        const seodialogRef = this.dialog.open(
          InternationalSeoFormComponent,
          {}
        );
        seodialogRef.afterClosed().subscribe((result: any) => {});
        break;
      case GRID_ACTION.EDIT.ID:
        this.changeRoute(ROUTE.CREATE_INTERNATIONAL_PROPERTY, formConfig);
        break;

      case GRID_ACTION.VIEW.ID:
        this.changeRoute(ROUTE.INTERNATIONAL_PROPERTY_CONFIRMATION, formConfig);
        break;

      case GRID_ACTION.DELETE.ID:
        let dialogRef = this.commonService.showModal(
          'Delete',
          `Are you sure you want to delete this property?`
        );
        dialogRef.afterClosed().subscribe((result) => {
          if (result) {
            this.deleteProperty(data.rowData.PropertyId);
          }
        });
        break;
    }
  }
  onActionClick(event: any) {}
  openDialog(data: any) {
    const dialogRef = this.dialog.open(InternationalpropertydialogComponent, {
      data: this.filterData,
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.filterData = result?.data;
        switch (result?.data?.label) {
          case GRID_TOOLBAR.FILTER.NAME:
            this.filter = {
              ...this.filter,
              // Search: result.clear ? '' : result.data.Search,
              SectorId: result.clear ? '' : result.data.SectorId,
              HoldingCompanyId: result.clear
                ? ''
                : result.data.HoldingCompanyId,
              CompletionType: result.clear ? '' : result.data.CompletionType,
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

  isFeatureUpdate(data: any) {
    let isFeatured = data.rowData.IsFeatured == 'No' ? 1 : 0;
    this.filter.pageSize = data.pageSize;
    this.filter.PageNo = data.activePageNumber;

    this.loaderService.show();
    this.propertyService
      .propertyIsFeatured(data.rowData.PropertyId, isFeatured, 2)
      .subscribe({
        next: (res) => {
          this.toasterService.success(res.message);
          this.tableData(this.filter);
          this.loaderService.hide();
        },
        error: (error) => {
          this.loaderService.hide();
          this.toasterService.error(error.error.message);
          this.tableData(this.filter);
        },
      });
  }
}
