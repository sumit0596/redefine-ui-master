import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PresentationService } from './../../../../../services/presentation.service';
import { Component } from '@angular/core';
import { CONSTANTS, FORM_MODE, ROUTE, SESSION } from 'src/app/models/constants';
import { CommonStoreService } from 'src/app/services/common-store.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { LoaderService } from 'src/app/shared/services/loader/loader.service';
import { MEDIA_TYPES, PRESENTATION_TYPE } from 'src/app/models/enum';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-manage-presentations',
  templateUrl: './manage-presentations.component.html',
  styleUrls: ['./manage-presentations.component.scss'],
})
export class ManagePresentationsComponent {
  rows: any;
  totalRowsCount: any;
  pageCnt: any;
  columns: any;
  tableSettings: any;
  pageNumber = 1;
  pageSize = 10;
  type = 1;
  activeTab : number = 0;

  presentationStatus$: Observable<any[]> = of([
    {
      Id: 0,
      Name: 'Draft',
    },
    {
      Id: 1,
      Name: 'Published',
    },
    {
      Id: 2,
      Name: 'Archived',
    },
  ]);

  filterColumns: any;
  activeRoute: string = '';
  tabName: any = MEDIA_TYPES.PRESENTATION;
  access: any;
  presentationStatus: any;
  webcastStatus: any;
  params : any;
  Webcastparams: any;
  formConfig: any;
  constructor(
    private presentationService: PresentationService,
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
  setTimeout(() => {
    this.getAllPresentations();
  }, 500);
  }

  getAllPresentations(pageSize?: any, pageNumber?: any, type?: any) {
    this.loaderService.show();
    type = (this.activeTab == 0) ? 1 : 2;

    this.presentationService
      .getAllPresentations(this.pageSize, this.pageNumber, type)
      .subscribe({
        next: (res) => {
          this.presentationData(res);
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

  getTabType(): any {
    if (this.tabName === MEDIA_TYPES.PRESENTATION) {
      return 1;
    } else if (this.tabName === MEDIA_TYPES.WEBCAST) {
      return 2;
    }
  }

  setColumnHeaders() {
    this.columns = [
      {
        field: 'Year',
        header: 'Year Published',
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
        field: 'Title',
        header: 'Title',
        sort: true,
        visible: true,
        show: true,
      },
      {
        field: 'PresentationCategoryName',
        header: 'Category',
        sort: true,
        visible: true,
        show: true,
      },
      {
        field: 'AddedBy',
        header: 'Created by',
        sort: true,
        visible: true,
        show: true,
      },

      {
        field: 'PresentationsStatus',
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
      tablename: 'All Presentations',
    };
  }

  presentationData(res: any) {
    this.initializeTableSettings();
    if (res.data) {
      this.totalRowsCount = res.data.totalCount;
      this.pageCnt = res.data.pageCount;
      this.access = res.data.FullAccess ;
      if (res.data.FullAccess === 1) {
        res.data.presentations.forEach((e: any) => {
          if (e.PresentationsStatus == 'Published') {
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
        res.data.presentations.forEach((e: any) => {
          e.operations = [
            {
              name: CONSTANTS.VIEW,
              icon: CONSTANTS.DETAILS_ICON,
              operationName: CONSTANTS.VIEW,
              path: 'assets/images/eye.svg',
            }
          ];
        });
      }

      this.rows = res.data.presentations;
      this.tableSettings = {
        rows: this.rows,
        columns: this.columns,
        id: 'PresentationsId',
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
    } else {
      this.rows = [];
      this.totalRowsCount = 0;
      this.pageCnt = 0;
    }
  }

  tableDataPresentations(event: any) {
    this.getPresentationData(event);
  }

  tableDataWebcasts(event: any) {
    this.getWebcastData(event);
  }

  getTablename(): any {
    if (this.tabName === MEDIA_TYPES.PRESENTATION) {
      return 'All Presentations';
    } else if (this.tabName == MEDIA_TYPES.WEBCAST) {
      return 'All Webcast';
    } else {
      return 'All Presentations';
    }
  }

  getPresentationData(event: any): void {
    this.params = event;
    this.loaderService.show();
    event.type = this.getTabType();
    this.presentationStatus = event.statusIds;
    this.presentationService
      .getAllPresentations(
        event.pageSize,
        event.pageNumber,
        event.type,
        this.presentationStatus,
        event.searchValue,
        event.sortBy,
        event.sortOrder
      )
      .subscribe({
        next: (res) => {
          this.presentationData(res);
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


  getWebcastData(event: any): void {
    this.Webcastparams = event;
    this.loaderService.show();
    event.type = this.getTabType();
    this.webcastStatus = event.statusIds;
    this.presentationService
      .getAllPresentations(
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
          this.presentationData(res);
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
    let presentation: any = {
      mode: data.operation,
      id: data.rowData.PresentationsId,
      access:this.access,
      tab : this.getTabType()
    };
    await this.commonStoreService.setFormConfig(presentation);
    if (data.operation === CONSTANTS.EDIT) {
      this.router.navigate([ROUTE.EDIT_PRESENTATION]);
    } else if (data.operation === CONSTANTS.VIEW.toLowerCase()) {
      this.router.navigate([ROUTE.VIEW_PRESENTATION]);
    } else if (data.operation === CONSTANTS.ARCHIVE_OPERATION.toLowerCase()) {
      const dialogRef = this.commonService.showModal(
        'Delete',
        CONSTANTS.PRESENTATION_DELETE_CONFIRMATION,
      );
      dialogRef.afterClosed().subscribe((action: any) => {
        if (action) {
          this.loaderService.show();
          this.presentationService
            .updateStatus(data.rowData.PresentationsId, 2)
            .subscribe({
              next: (res: any) => {
                this.toasterService.success(res.message);
                if(this.getTabType() == 1){
                this.params ?  this.getPresentationData(this.params) : this.getAllPresentations(data.pageSize, data.activePageNumber, this.getTabType());
                }
               else if(this.getTabType() == 2){
                  this.Webcastparams ?  this.getPresentationData(this.Webcastparams) : this.getAllPresentations(data.pageSize, data.activePageNumber, this.getTabType());
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

  createPresentation() {
    let formConfig = {
      id: undefined,
      mode: FORM_MODE.CREATE,
      tab : this.getTabType()
    };
    this.commonStoreService.setFormConfig(formConfig);
    this.router.navigate([`${ROUTE.CREATE_PRESENTATION}`]);
  }

  onTabChange(event: any) {
    this.tabName = event.tab.textLabel;
    if (event.tab.textLabel == MEDIA_TYPES.PRESENTATION) {
      let obj = {
        pageSize: (this.params) ? this.params.pageSize : 10,
        pageNumber: 1,
        type: 1,
        statusIds : this.presentationStatus
      };
      this.getPresentationData(obj);
    } else if (event.tab.textLabel == MEDIA_TYPES.WEBCAST) {
      let obj = {
        pageSize: (this.Webcastparams) ? this.Webcastparams.pageSize : 10,
        pageNumber: 1,
        type: 2,
        statusIds : this.webcastStatus
      };
      this.getWebcastData(obj);
    }
  }
  ngOnDestroy(){
    sessionStorage.removeItem(SESSION.FORM_CONFIG);
  }
}
