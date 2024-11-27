import { Component } from '@angular/core';
import { CareerService } from '../../../services/career.service';
import { BannerBreadcrumbComponent } from '../../../shared/banner-breadcrumb/banner-breadcrumb.component';
import { BreadcrumbsComponent } from '../../../shared/breadcrumbs/breadcrumbs.component';
import { CommonModule, DatePipe } from '@angular/common';
import { CommonService } from 'src/app/shared/services/common.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Filter } from 'src/app/admin/models/interfaces';
import { ActivatedRoute, Router } from '@angular/router';
import { CalendarComponent } from "../../../../shared/components/form-elements/calender/calendar.component";
import isEqual from 'lodash-es/isEqual';
import omit from 'lodash-es/omit';
import { EncryptionService } from 'src/app/services/encryption.service';
import { MatPaginatorModule } from '@angular/material/paginator';
import { CustomMatPaginatorDirective } from 'src/app/shared/directives/custom-mat-paginator/custom-mat-paginator.directive';
import { PropertyEqService } from '../../../services/property-eq.service';
import { ToastrService } from 'ngx-toastr';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { CommonStoreService } from 'src/app/services/common-store.service';
import { QuickLinksComponent } from 'src/app/frontend/shared/quick-links/quick-links.component';


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
  selector: 'app-propertyeq-press-office',
  templateUrl: './propertyeq-press-office.component.html',
  styleUrls: ['./propertyeq-press-office.component.scss'],
  providers: [{ provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS }],
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CalendarComponent,
    MatPaginatorModule,
    CustomMatPaginatorDirective,
    BannerBreadcrumbComponent,
    BreadcrumbsComponent,
    CommonModule,
    QuickLinksComponent
  ]
})
export class PropertyeqPressOfficeComponent {
  loadingData: boolean = false;
  bannerText = 'Press office';
  bannerDetails: any;
  breadcrumbLinks: any;
  errorMessage: string = '';
  searchText: any = '';
  initialFilter: Filter = {
    PageNo: 1,
    PerPage: 6,
    Search: '',
    StartDate: null,
    EndDate: null
  };
  filter!: Filter;
  pageIndex: any;
  decryptedFilters!: any;
  encryptedFilters!: any;
  totalRowsCount: any;
  pageCnt: any;
  pressDetails: any;
  filterForm!: FormGroup;
  constructor(private careerService: CareerService,
    private CommonService: CommonService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private encryptionService: EncryptionService,
    private datepipe: DatePipe,
    private propertyEQService: PropertyEqService,
    private toasterService: ToastrService,
    private commonStoreService: CommonStoreService,
  ) {
    this.resetFilterForm();
    this.route.queryParams.subscribe((params) => {
      if (params?.['f']) {
        const urlSafeFilters = params?.['f'];
        const encryptedFilters = decodeURIComponent(urlSafeFilters);
        this.filter = this.encryptionService.decrypt(encryptedFilters);
        this.selectedFilters(this.filter);
      }else {
        this.filter = this.initialFilter;
      }
    });
  }

  ngOnInit() {
    this.resetFilterForm();
    if (this.filter) {
      this.selectedFilters(this.filter);
    }
    this.getBanner();
    this.getAllPress();
  }
  

  getBanner() {
    this.careerService
      .getBanner('PRESS_OFFICE_PAGE_BANNER')
      .subscribe((res: any) => (this.bannerDetails = res.data.Value));
  }

  getHovercolor(index: any) {
    this.CommonService.getHovercolor(index, 'sens-data');
  }

  getLeavecolor(index: any) {
    this.CommonService.getLeavecolor(index, 'sens-data');
  }

  resetFilterForm() {
    this.filterForm = this.fb.group({
      StartDate: [null],
      EndDate: [null],
      Search: [''],
    });
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
    this.getAllPress();
  }

  search(event: any) {
    if (event.key?.toUpperCase() == 'ENTER' && this.errorMessage == '') {
      this.filter.PageNo = 1;
      this.filterForm.get('Search')?.setValue(event.target.value);
      this.updateFilter(this.filter, 'Search');
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
    this.getAllPress();
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

  searchValue(event: any) {
    if (this.errorMessage == '') {
      this.filterForm.get('Search')?.setValue(this.searchText);
      this.updateFilter(this.filter, 'Search');
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
        if (this.filterForm.get('StartDate')?.value > this.filterForm.get('EndDate')?.value) {
          this.errorMessage = '** Start Date should be less than  End Date';
        }
      }
      if (this.errorMessage == '') {
        this.updateFilter(this.filterForm, 'Date');
      }
    }
  }

  selectedFilters(filter: any) {
    if (filter) {
      this.decryptedFilters = filter;
      if (filter.StartDate && filter.EndDate) {
        this.filterForm.get('StartDate')?.setValue(filter.StartDate);
        this.filterForm.get('EndDate')?.setValue(filter.EndDate);
      }
      if (filter.Search) {
        this.filterForm?.get('Search')?.setValue(filter.Search);
        this.searchText = filter.Search;
      }
    }
  }

  getFilterObject() {
    return this.isFilterEqual() && this.decryptedFilters
      ? this.decryptedFilters
      : this.filter;
  }
  getAllPress() {
    this.loadingData = true;
    this.propertyEQService.getAllPropertyEQPressRelease(this.getFilterObject(), 3).subscribe({
      next: (res) => {
        this.sensData(res);
        this.loadingData = false;
      },
      error: (error) => {
        this.toasterService.error(error.error.message);
        this.loadingData = false;
      },
      complete: () => { },
    });
  }

  sensData(res: any) {
    if (res) {
      this.totalRowsCount = res.totalCount;
      this.pageCnt = res.pageCount;
      this.pressDetails = res.PropertyEq;
    } else {
      this.totalRowsCount = 0;
      this.pageCnt = 0;
    }
  }

  paginate(event: any) {
    if (this.errorMessage == '') {
      this.pageIndex = event.pageIndex;
      this.filter = this.decryptedFilters = {
        ...this.filter,
        ...this.decryptedFilters,
        PageNo: event.pageIndex + 1,
        PerPage: event.pageSize,
      };
      this.getAllPress();
      window.scrollTo(0, 0);
    }
  }

  pressDetailsPage(press: any) {
    let formConfig = {
      id: press.Slug,
    };
    this.commonStoreService.setFormConfig(formConfig);
    this.router.navigate(['/propertyeq/press-office/' + press.Slug]);
  }
}
