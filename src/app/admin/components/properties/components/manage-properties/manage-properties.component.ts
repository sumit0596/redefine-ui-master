import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subject, takeUntil } from 'rxjs';
import { CONSTANTS, FORM_MODE, ROUTE } from 'src/app/models/constants';
import { CommonStoreService } from 'src/app/services/common-store.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { LoaderService } from 'src/app/shared/services/loader/loader.service';
import { PropertyService } from '../../../../services/property.service';
import { UserService } from '../../../../services/user.service';
import { MdaLookupComponent } from '../property/components/mda-lookup/mda-lookup.component';
import { SeoFormComponent } from '../property/components/seo-form/seo-form.component';
import { VacancyScheduleContentComponent } from '../property/components/vacancy-schedule-content/vacancy-schedule-content.component';
import { PROPERTY_TYPE, ROLE } from 'src/app/models/enum';
import { UserStoreService } from 'src/app/services/user-store.service';

@Component({
  selector: 'app-properties',
  templateUrl: './manage-properties.component.html',
  styleUrls: ['./manage-properties.component.scss'],
})
export class ManagePropertiesComponent {
  roles = ROLE;
  userInfo: any;
  rows: any;
  totalRowsCount: any;
  pageCnt: any;
  columns: any;
  tableSettings: any;
  pageNumber = 1;
  pageSize = 10;
  sectorList!: any[];
  sectorList$!: Observable<any>;
  filterColumns: any;
  activeRoute: string = '';
  access: any;
  type: any;
  destroySubject: Subject<void> = new Subject<void>();
  params: any;
  constructor(
    private userService: UserService,
    private propertyService: PropertyService,
    private router: Router,
    private loaderService: LoaderService,
    private commonService: CommonService,
    private toasterService: ToastrService,
    private commonStoreService: CommonStoreService,
    public dialog: MatDialog,
    private userStore: UserStoreService
  ) {
    this.activeRoute = router.url;
    this.setColumnHeaders();
    this.initializeTableSettings();
    this.getUserInfo();
  }
  async ngOnInit() {
    this.getAllProperties();
    await this.getSectors();
  }

  async getUserInfo() {
    let userInfo$ = await this.userStore.getUser();
    userInfo$.pipe(takeUntil(this.destroySubject)).subscribe({
      next: (result: any) => {
        this.userInfo = {
          ...result,
        };
      },
    });
  }

  getAllProperties(pageSize?: any, pageNumber?: any, type?: any) {
    this.type = this.router.url == ROUTE.MANAGE_PROPERTY ? 1 : 2;

    this.loaderService.show();
    if (pageSize != undefined && pageNumber != undefined && type != undefined) {
      this.pageSize = pageSize;
      this.pageNumber = pageNumber;
      this.type = type;
    }
    this.propertyService
      .getAllProperties(this.pageSize, this.pageNumber, this.type)
      .subscribe({
        next: (res) => {
          this.propertiesData(res);
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
        field: 'BuildingCode',
        header: 'Property Code',
        sort: false,
        visible: true,
        show: true,
      },
      {
        field: 'PropertyName',
        header: 'Name',
        sort: true,
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
        field: 'Address',
        header: 'Address',
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
        field: 'UnitCount',
        header: 'Units',
        sort: false,
        visible: true,
        show: false,
      },
      {
        field: 'ImageCount',
        header: 'Photos',
        sort: false,
        visible: true,
        show: true,
      },
      {
        field: 'VideoCount',
        header: 'Videos',
        sort: false,
        visible: true,
        show: false,
      },
      {
        field: 'BrochureCount',
        header: 'Brochures',
        sort: false,
        visible: true,
        show: false,
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
    this.filterColumns = this.columns;
  }

  initializeTableSettings(): void {
    this.tableSettings = {
      rows: [],
      columns: this.columns,
      tablename: 'All South African Properties',
    };
  }

  propertiesData(res: any) {
    this.initializeTableSettings();
    if (res.data) {
      this.totalRowsCount = res.data.totalProperty;
      this.pageCnt = res.data.pageCount;
      this.access = res.data.FullAccess;
      res.data.properties.forEach((property: any) => {
        //if (property.UnitVacancyCount > 0)
        property.PropertyStatus =
          property.PropertyStatus == 'Units Available' &&
          property.UnitVacancyCount != null
            ? property.PropertyStatus +
              ' ' +
              '(' +
              property.UnitVacancyCount +
              ')'
            : property.PropertyStatus == 'Units Available' &&
              property.UnitVacancyCount == null
            ? 'Published'
            : property.PropertyStatus;
      });
      if (res.data.FullAccess === 1) {
        res.data.properties.forEach((e: any) => {
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
              name: CONSTANTS.EDIT_UNITS_OPERATION,
              icon: CONSTANTS.EDIT,
              operationName: CONSTANTS.EDITSEO,
              path: 'assets/images/edit.svg',
            },
            {
              name: CONSTANTS.EDIT_SEO_OPERATION,
              icon: CONSTANTS.EDIT,
              operationName: CONSTANTS.EDITSEO,
              path: 'assets/images/edit.svg',
            },
            {
              name: CONSTANTS.DELETE,
              icon: CONSTANTS.DELETE_ICON,
              operationName: CONSTANTS.DELETE,
              path: 'assets/images/delete.svg',
            },
            // {
            //   name: CONSTANTS.IS_FEATURED,
            //   operationName: CONSTANTS.IS_FEATURED,
            //   path: 'assets/images/Is Featured.svg',
            // },
          ];
        });
      } else {
        res.data.properties.forEach((e: any) => {
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
      this.rows = res.data.properties;
      this.tableSettings = {
        rows: this.rows,
        columns: this.columns,
        id: 'PropertyId',
        totalRowsCount: this.totalRowsCount,
        pageCnt: this.pageCnt,
        tablename: 'All South African Properties',
        tableid: 'sa-properties',
        isPaginationRequired: true,
        isFilterRequired: true,
        isSearchRequired: true,
        isColumnGroupRequired: true,
        isDownloadRequired: true,
        showActions: true,
        totalFeaturedProperty: res.data.totalFeaturedProperty,
      };
    } else {
      this.rows = [];
      this.totalRowsCount = 0;
      this.pageCnt = 0;
    }
  }

  tableData(event: any) {
    this.getPropertiesData(event);
  }

  getPropertiesData(event: any): void {
    this.params = event;
    this.loaderService.show();
    this.propertyService
      .getAllProperties(
        event.pageSize,
        event.pageNumber,
        1,
        event.sectorIds,
        event.propertyIds,
        event.searchValue,
        event.sortBy,
        event.sortOrder
      )
      .subscribe({
        next: (res) => {
          this.propertiesData(res);
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
    let property: any = {
      mode: data.operation,
      id: data.rowData.PropertyId,
      access: this.access,
    };
    await this.commonStoreService.setFormConfig(property);
    if (data.operation === CONSTANTS.EDIT_SEO_OPERATION.toLocaleLowerCase()) {
      {
        const dialogRef = this.dialog.open(SeoFormComponent, {});
        dialogRef.afterClosed().subscribe((result: any) => {});
      }
    } else if (data.operation === CONSTANTS.EDIT) {
      this.router.navigate([ROUTE.CREATE_PROPERTY]);
    } else if (data.operation === CONSTANTS.ADD_UNITS) {
      this.router.navigate([ROUTE.CREATE_UNIT_DETAILS.toLowerCase()]);
    } else if (data.operation === CONSTANTS.VIEW.toLowerCase()) {
      this.router.navigate([ROUTE.PROPERTY_CONFIRMATION]);
    } else if (data.operation === CONSTANTS.DELETE.toLowerCase()) {
      const dialogRef = this.commonService.showModal(
        'Delete',
        CONSTANTS.PROPERTY_DELETE_CONFIRMATION,
      );
      dialogRef.afterClosed().subscribe((action: any) => {
        if (action) {
          this.loaderService.show();
          this.propertyService
            .deleteProperty(data.rowData.PropertyId)
            .subscribe({
              next: (res) => {
                this.toasterService.success(res.message);
                this.params
                  ? this.getPropertiesData(this.params)
                  : this.getAllProperties(data.pageSize, data.activePageNumber);
                //this.getAllProperties(data.pageSize, data.activePageNumber);
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

  createProperty() {
    let formConfig = {
      id: undefined,
      mode: FORM_MODE.CREATE,
    };
    this.commonStoreService.setFormConfig(formConfig);
    this.openMdaLookup();
  }

  openMdaLookup() {
    const dialogRef = this.dialog.open(MdaLookupComponent, {});
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.propertyService.setPropertyDetails(result.data);
        this.router.navigate([ROUTE.CREATE_PROPERTY_DETAILS]).then((m) => {
          this.toasterService.success(result.message);
        });
      }
    });
  }

  createVacancy() {
    let formConfig = {
      id: undefined,
      mode: FORM_MODE.CREATE,
    };
    this.commonStoreService.setFormConfig(formConfig);
    this.openVacancy();
  }
  openVacancy() {
    const dialogRef = this.dialog.open(VacancyScheduleContentComponent, {});
    dialogRef.afterClosed().subscribe((result: any) => {});
  }

  isFeatureUpdate(data: any) {
    let isFeatured = data.rowData.IsFeatured == 'No' ? 1 : 0;
    this.loaderService.show();
    this.propertyService
      .propertyIsFeatured(data.rowData.PropertyId, isFeatured, 1)
      .subscribe({
        next: (res) => {
          this.toasterService.success(res.message);
          this.params
            ? this.getPropertiesData(this.params)
            : this.getAllProperties(data.pageSize, data.activePageNumber);
          this.loaderService.hide();
        },
        error: (error) => {
          this.loaderService.hide();
          this.toasterService.error(error.error.message);
          this.params
            ? this.getPropertiesData(this.params)
            : this.getAllProperties(data.pageSize, data.activePageNumber);
        },
      });
  }
}
