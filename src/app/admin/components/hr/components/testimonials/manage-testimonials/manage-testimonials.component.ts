import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable, of } from 'rxjs';
import { TestimonialService } from 'src/app/admin/services/testimonial.service';
import {
  CONSTANTS,
  GRID_ACTION,
  ROUTE,
  FORM_MODE,
} from 'src/app/models/constants';
import { CommonStoreService } from 'src/app/services/common-store.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { LoaderService } from 'src/app/shared/services/loader/loader.service';

@Component({
  selector: 'app-manage-testimonials',
  templateUrl: './manage-testimonials.component.html',
  styleUrls: ['./manage-testimonials.component.scss'],
})
export class ManageTestimonialsComponent {
  rows: any;
  totalRowsCount: any;
  pageCnt: any;
  columns: any;
  tableSettings: any;
  pageNumber = 1;
  pageSize = 10;
  date = new Date('2015-01-01');
  startYear = this.date.getFullYear();

  type$: Observable<any> = of([
    {
      id: 1,
      label: 'Redefiner Testimonials',
    },
    {
      id: 2,
      label: 'Learnership Testimonials',
    },
  ]);

  range: any = [];
  range$: Observable<any[]> = of(this.range);
  getYear() {
    var Year = new Date('2015-01-01').getFullYear();

    for (var i = 0; i <= 8; i++) {
      this.range.push({
        Id: i,
        Name: Year + i,
      });
    }

  }

  filterColumns: any;
  activeRoute: string = '';
  access: any;
  testimonial: any;
  params: any;
  constructor(
    private testimonialService: TestimonialService,
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
    this.getAllTestimonials();
    this.getYear();
  }

  getAllTestimonials(pageSize?: any, pageNumber?: any, type?: any) {
    this.loaderService.show();
    if (pageSize != undefined && pageNumber != undefined) {
      this.pageSize = pageSize;
      this.pageNumber = pageNumber;
    }
    this.testimonialService
      .getAllTestimonials(this.pageSize, this.pageNumber, type)
      .subscribe({
        next: (res) => {
          this.TestimonialData(res);
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
        field: 'Type',
        header: 'Testimonial Type',
        sort: true,
        visible: true,
        show: true,
      },
      {
        field: 'ReviewerName',
        header: 'Name of Reviewer',
        sort: true,
        visible: true,
        show: true,
      },
      {
        field: 'Testimonial',
        header: 'Testimonial',
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
      {
        field: 'CreatedOn',
        header: 'Date Published',
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
      tablename: 'All Applicants',
    };
  }

  TestimonialData(res: any) {
    this.initializeTableSettings();
    if (res.data) {
      this.totalRowsCount = res.data.totalCount;
      this.pageCnt = res.data.pageCount;
      this.access = res.data.FullAccess;
      if (res.data.FullAccess === 1) {
        res.data.testimonials.forEach((e: any) => {
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
        res.data.testimonials.forEach((e: any) => {
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
      this.rows = res.data.testimonials;
      this.tableSettings = {
        rows: this.rows,
        columns: this.columns,
        id: 'TestimonialsId',
        totalRowsCount: this.totalRowsCount,
        pageCnt: this.pageCnt,
        tablename: 'All Applicants',
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

  tableData(event: any) {
    this.getTestimonialData(event);
  }

  getTestimonialData(event: any): void {
    this.params = event;
    this.loaderService.show();
    this.testimonialService
      .getAllTestimonials(
        event.pageSize,
        event.pageNumber,
        event.yearsIds,
        event.typesIds,
        event.searchValue,
        event.sortBy,
        event.sortOrder
      )
      .subscribe({
        next: (res) => {
          this.TestimonialData(res);
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
    let testimonials: any = {
      mode: data.operation,
      id: data.rowData.TestimonialsId,
      access: this.access,
      page: 'testimonials',
    };
    await this.commonStoreService.setFormConfig(testimonials);
    if (data.operation === CONSTANTS.EDIT) {
      this.router.navigate([ROUTE.EDIT_TESTIMONIAL]);
    } else if (data.operation === CONSTANTS.VIEW.toLowerCase()) {
      this.router.navigate([ROUTE.VIEW_TESTIMONIAL]);
    } else if (data.operation === CONSTANTS.DELETE_OPERATION.toLowerCase()) {
      const dialogRef = this.commonService.showModal(
        'Delete',
        CONSTANTS.TESTIMONIAL_DELETE_CONFIRMATION,
      );
      dialogRef.afterClosed().subscribe((action: any) => {
        if (action) {
          this.loaderService.show();
          this.testimonialService
            .deleteTestimonial(data.rowData.TestimonialsId)
            .subscribe({
              next: (res: any) => {
                this.toasterService.success(res.message);
                this.params ?  this.getTestimonialData(this.params) : this.getAllTestimonials(data.pageSize, data.activePageNumber);
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

  createTestimonial() {
    let formConfig = {
      id: undefined,
      mode: FORM_MODE.CREATE,
    };
    this.commonStoreService.setFormConfig(formConfig);
    this.router.navigate([`${ROUTE.CREATE_TESTIMONIAL}`]);
  }
}
