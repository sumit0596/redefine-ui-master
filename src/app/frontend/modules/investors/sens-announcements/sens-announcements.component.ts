import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { SensService } from 'src/app/admin/services/sens.service';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { DatePipe } from '@angular/common';
import { CareerService } from 'src/app/frontend/services/career.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonStoreService } from 'src/app/services/common-store.service';
import { EventService } from 'src/app/admin/services/event.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { CookieService } from 'ngx-cookie-service';
import { MatDialog } from '@angular/material/dialog';
import { DripDialogComponent } from '../drip-dialog/drip-dialog.component';
import { EncryptionService } from 'src/app/services/encryption.service';
import isEqual from 'lodash-es/isEqual';
import omit from 'lodash-es/omit';
import { Filter } from 'src/app/admin/models/interfaces';
import { ROUTE } from 'src/app/models/constants';

export const MY_DATE_FORMATS = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'DD MMMM YYYY',
    monthYearLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-sens-announcements',
  templateUrl: './sens-announcements.component.html',
  styleUrls: ['./sens-announcements.component.scss'],
  providers: [{ provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS }],
})
export class SensAnnouncementsComponent {
  filterForm!: FormGroup;
  totalRowsCount: any;
  pageCnt: any;
  pageNumber = 1;
  pageSize = 6;
  sensDetails: any;
  searchText: any = '';

  initialFilter: Filter = {
    PageNo: 1,
    PerPage: 6,
    Search: '',
    StartDate: null,
    EndDate: null
  };
  filter!: Filter;
  pageIndex: any = 0;
  bannerDetails: any;
  quickLinks: any;
  breadcrumbLinks: any;
  bannerText = 'SENS announcements';
  pagination: boolean = false;
  errorMessage: string = '';
  decryptedFilters!: any;
  encryptedFilters!: any;

  constructor(
    private fb: FormBuilder,
    private sensService: SensService,
    private eventService: EventService,
    private toasterService: ToastrService,
    private datepipe: DatePipe,
    private careerService: CareerService,
    private router: Router,
    private commonStoreService: CommonStoreService,
    private commonService: CommonService,
    private cookieService: CookieService,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private encryptionService: EncryptionService
  ) {  
    this.resetFilterForm();
    this.route.queryParams.subscribe((params) => {
    if (params?.['f']) {
      const urlSafeFilters = params?.['f'];
      const encryptedFilters = decodeURIComponent(urlSafeFilters);
      this.filter = this.encryptionService.decrypt(encryptedFilters);
      this.selectedFilters(this.filter);
    }
  });
}

selectedFilters(filter: any) {
  if (filter) {
    this.decryptedFilters = filter;
    if(filter.StartDate && filter.EndDate){
    this.filterForm.get('StartDate')?.setValue(filter.StartDate);
    this.filterForm.get('EndDate')?.setValue(filter.EndDate);
    }
    if(filter.Search){
      this.filterForm.get('Search')?.setValue(filter.Search);
      this.searchText = filter.Search;
    }
  }
}
  ngOnInit() {
    this.breadcrumbLinks =
      this.eventService.getInvestorsRouterLinks('sens-announcements');
      this.filter = this.initialFilter;
    this.getAllSensannouncements();
    this.getBanner();
    this.quicklinks();
  }

  resetFilterForm() {
    this.filterForm = this.fb.group({
      StartDate: [null],
      EndDate: [null],
      Search: [''],
    });
  }

  getBanner() {
    this.careerService
      .getBanner('SENS_PAGE_BANNER')
      .subscribe((res: any) => (this.bannerDetails = res.data.Value));
  }

  quicklinks() {
    this.sensService
      .getQuickLinks()
      .subscribe((res: any) => (this.quickLinks = res.data));
  }

  getAllSensannouncements() {
    this.sensService.getAllFrontendSens(this.getFilterObject()).subscribe({
      next: (res) => {
        this.sensData(res);
      },
      error: (error) => {
        this.toasterService.error(error.error.message);
      },
      complete: () => {},
    });
  }

  sensData(res: any) {
    if (res) {
      this.totalRowsCount = res.totalCount;
      this.pageCnt = res.pageCount;
      this.sensDetails = res.sensannouncements;
    } else {
      this.totalRowsCount = 0;
      this.pageCnt = 0;
    }
  }

  paginate(event: any) {
    if(this.errorMessage == ''){
      this.pageIndex = event.pageIndex;
      this.filter = this.decryptedFilters = {
        ...this.filter,
        ...this.decryptedFilters,
        PageNo: event.pageIndex + 1,
        PerPage: event.pageSize,
      };
      this.getAllSensannouncements();
      window.scrollTo(0, 0);
    }
  }

  onChange(event: any) {
    this.errorMessage = '';
    if (
      this.filterForm.get('StartDate')?.value != null &&
      this.filterForm.get('EndDate')?.value != null
    ) {
      this.filterForm
        .get('StartDate')
        ?.setValue(
          this.datepipe.transform(
            this.filterForm.get('StartDate')?.value,
            'yyyy-MM-dd'
          )
        );
      this.filterForm
        .get('EndDate')
        ?.setValue(
          this.datepipe.transform(
            this.filterForm.get('EndDate')?.value,
            'yyyy-MM-dd'
          )
        );
      if (this.filterForm.get('StartDate')?.value != null && this.filterForm.get('EndDate')?.value != null) {
        if (this.filterForm.get('StartDate')?.value >  this.filterForm.get('EndDate')?.value) {
          this.errorMessage = '** Start Date should be less than  End Date';
        }
      }
      if (this.errorMessage == '') {
        this.updateFilter(this.filterForm, 'Date');
      }
    }
  }
  

  search(event: any) {
    if (event.key?.toUpperCase() == 'ENTER' && this.errorMessage == '') {
      this.filter.PageNo = 1;
      this.filterForm.get('Search')?.setValue(event.target.value);
      this.updateFilter(this.filter, 'Search');
    }
  }

  searchValue(event: any) {
    if(this.errorMessage == ''){
      this.filterForm.get('Search')?.setValue(this.searchText);
      this.updateFilter(this.filter, 'Search');
    }
  }

  clear() {
    this.searchText = '';
    this.errorMessage = '';
    this.resetFilterForm();
    this.filter.PageNo = 1;
    this.filter.PerPage = 6;
    this.filter.StartDate = null;
    this.filter.EndDate = null;
    this.filter.Search = this.filterForm.get('Search')?.value.toString();
    this.filter = { ...this.initialFilter };
    this.decryptedFilters = { ...this.initialFilter };
    this.router.navigate([], { queryParams: {} });
    this.getAllSensannouncements();
  }

  getHovercolor(index: any) {
    this.commonService.getHovercolor(index, 'sens-data');
  }

  getLeavecolor(index: any) {
    this.commonService.getLeavecolor(index, 'sens-data');
  }

  sensDetailsPage(sens: any) {
    let formConfig = {
      id: sens.Slug,
    };
    this.commonStoreService.setFormConfig(formConfig);
    if (
      (this.cookieService.get('DRIP_FILTER') == 'Success' &&
        sens.Drip == 'Yes') ||
      sens.Drip == 'No'
    ) {
      this.router.navigate([ROUTE.SENS_ANNOUNCEMENTS, sens.Slug]);
    } else if (this.cookieService.get('DRIP_FILTER') == '') {
      let data = {
        sens: sens,
        page: 'sens-announcement',
      };
      const dialogRef = this.dialog.open(DripDialogComponent, {
        minHeight: '500px',
        maxHeight: '80vh',
        data: data,
      });
      dialogRef.afterClosed().subscribe((result: any) => {
        if (result) {
          this.router.navigate([result]);
        }
      });
    }
  }

  updateFilter(data: any, type: any) {
    this.filter = this.decryptedFilters = {
      ...this.filter,
      ...this.decryptedFilters,
      PageNo: 1,
    };
    switch (type) {
      case 'Paginate':
        this.pageIndex = data.pageIndex;
        this.filter = this.decryptedFilters = {
          ...this.filter,
          ...this.decryptedFilters,
          PerPage: data.pageSize,
          PageNo: data.pageIndex + 1,
      };
        break;
      case 'Search':
        this.filter = this.decryptedFilters = {
          ...this.filter,
          ...this.decryptedFilters,
          Search: this.filterForm.get('Search')?.value
        };
        break;
      case 'Date':
        this.filter = this.decryptedFilters = {
          ...this.filter,
          ...this.decryptedFilters,
          StartDate: this.filterForm.get('StartDate')?.value,
          EndDate: this.filterForm.get('EndDate')?.value
        };
        break;
       
      default:
        break;
    }
    this.encryptedFilters = this.encryptionService.encrypt(this.filter);
   // this.clear();
    this.getAllSensannouncements();
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: this.isFilterEqual() ? null : { f: this.encryptedFilters },
      queryParamsHandling: this.isFilterEqual() ? null : 'merge', // This will merge new filters with existing query params
    });
  }

  isFilterEqual() {
    return isEqual(
      omit(this.filter, ['PerPage', 'PageNo']),
       omit(this.initialFilter, ['PerPage', 'PageNo'])
    );
  }

  getFilterObject() {
    return this.isFilterEqual() && this.decryptedFilters
      ? this.decryptedFilters
      : this.filter;
  }

}
