import { Component } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { BannerBreadcrumbComponent } from '../../../shared/banner-breadcrumb/banner-breadcrumb.component';
import { CalendarComponent } from 'src/app/shared/components/form-elements/calender/calendar.component';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { MatPaginatorModule } from '@angular/material/paginator';
import { CustomMatPaginatorDirective } from 'src/app/shared/directives/custom-mat-paginator/custom-mat-paginator.directive';
import { EncryptionService } from 'src/app/services/encryption.service';
import isEqual from 'lodash-es/isEqual';
import omit from 'lodash-es/omit';
import { Filter } from 'src/app/admin/models/interfaces';
import { QuickLinksComponent } from '../../../shared/quick-links/quick-links.component';
import { PropertyEqService } from '../../../services/property-eq.service';
import { MatDialog } from '@angular/material/dialog';
import { CommonStoreService } from 'src/app/services/common-store.service';
import { NgSelectModule } from '@ng-select/ng-select';
import { SelectModule } from 'src/app/shared/modules/select/select.module';
import { Observable, map, of } from 'rxjs';
import { CareerService } from 'src/app/frontend/services/career.service';

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
  selector: 'app-propertyeq-video',
  standalone: true,
  imports: [
    SelectModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CalendarComponent,
    MatPaginatorModule,
    CustomMatPaginatorDirective,
    QuickLinksComponent,
    BannerBreadcrumbComponent,
    NgSelectModule,
  ],
  providers: [{ provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS }],
  templateUrl: './propertyeq-video.component.html',
  styleUrls: ['./propertyeq-video.component.scss'],
})
export class PropertyeqVideoComponent {
  filterForm!: FormGroup;
  bannerText = 'Videos';
  bannerDetails: any;
  breadcrumbLinks: any;
  searchText: any = '';
  errorMessage: string = '';
  propertyEqVideosList: any;
  decryptedFilters!: any;
  encryptedFilters!: any;
  totalRowsCount: any;
  pageCnt: any;
  pageNumber = 1;
  pressDetails: any;
  isDropdownClassActiveSortby = true;
  isDropdownClassActiveCategory = true;
  filterValue: any;

  filter: any = {
    SortBy: '',
    SortOrder: '',
    CategoryId: '',
    TypeId: 1,
    PageNo: 1,
    PerPage: 6,
    Search: '',
    // Featured: 1,
  };
  initialFilter = {
    SortBy: '',
    SortOrder: 'Asc',
    CategoryId: '',
    TypeId: 1,
    PageNo: 1,
    PerPage: 6,
    Search: '',
  };
  pageIndex: any;
  quickLinks: any;
  loadingData: boolean = true;
  imagePlaceholderImage: string = 'assets/images/image-placeholder.png';

  selectedSortby: any;
  selectedCategories: any;

  sortby$: Observable<any[]> = of([
    // {
    //   Id: 0,
    //   Name: 'Date',
    // },
    {
      Id: 1,
      Name: 'Title',
    },
  ]);
  categoryColorMap: { [key: string]: string } = {};
  colorsLoaded = false;
  categorydropdown: any;
  categorydropdown$!: Observable<any>;
  ngOnInit() {
    this.loadingData = true;
    
    this.getBanner();
    this.loadCategoryDropdown();
    this.getAllPropertyEqList();
    this.selectedCategories =
      this.filterForm?.get('CategoryId')?.value || null;
    this.selectedSortby = this.filterForm?.get('SortBy')?.value || null;
  }
  constructor(
    private propertyEqListFrontEndService: PropertyEqService,
    private fb: FormBuilder,
    private toasterService: ToastrService,
    private datepipe: DatePipe,
    private router: Router,
    private route: ActivatedRoute,
    private encryptionService: EncryptionService,
    public dialog: MatDialog,
    private commonStoreService: CommonStoreService,
    private articleService: PropertyEqService,
    private careerService: CareerService,
  ) {
    this.resetFilterForm();
    this.route.queryParams.subscribe((params) => {
      if (params?.['f']) {
        const urlSafeFilters = params?.['f'];
        const encryptedFilters = decodeURIComponent(urlSafeFilters);
        this.filter = this.encryptionService.decrypt(encryptedFilters);
        this.selectedFilters(this.filter);
      } else {
        this.filterForm.get('SortBy')?.setValue(null);
      }
    });
  }

  getBanner() {
      this.careerService
      .getBanner('PEQ_VIDEO_PAGE_BANNER')
      .subscribe((res: any) => (this.bannerDetails = res.data.Value));
  }

  selectedFilters(filter: any) {
    if (filter) {
      this.decryptedFilters = filter;

      if (filter.SortBy) {
        this.filterForm.get('SortBy')?.setValue(filter.SortBy);
      } else {
        this.filterForm?.get('SortBy')?.setValue(null);
      }
      if (filter.CategoryId) {
        this.filterForm.get('CategoryId')?.setValue(filter.CategoryId);
      }
      if (filter.Search) {
        this.filterForm?.get('Search')?.setValue(filter.Search);
        this.searchText = filter.Search;
      }
    }
  }


  resetFilterForm() {
    this.filterForm = this.fb.group({
      SortBy: [''],
      CategoryId: [null],
      Search: [''],
    });
  }

  getAllPropertyEqList() {
    let filter = this.getFilterObject();
    // if (filter.SortBy == 'Date') {
    //   filter.SortBy = 'CreatedOn';
    // }
    this.propertyEqListFrontEndService
      .getAllFrontendPropertyEq(filter)
      .subscribe({
        next: (res) => {
          this.sensData(res);
        },
        error: (error) => {
          this.toasterService.error(error.error.message);
        },
        complete: () => { },
      });
  }

  sensData(res: any) {
    this.loadingData = false;
    if (res) {
      this.totalRowsCount = res.totalCount;
      this.pageCnt = res.pageCount;
      this.propertyEqVideosList = res;
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
      this.getAllPropertyEqList();
      window.scrollTo(0, 0);
    }
  }

  search(event: any) {
    if (event.key?.toUpperCase() == 'ENTER' && this.errorMessage == '') {
      this.filter.PageNo = 1;
      this.filterForm?.get('Search')?.setValue(event.target.value);
      this.updateFilter(this.filter, 'Search');
    }
  }

  searchValue(event: any) {
    if (this.errorMessage == '') {
      this.filterForm?.get('Search')?.setValue(this.searchText);
      this.updateFilter(this.filter, 'Search');
    }
  }

  clear() {
    this.searchText = '';
    this.errorMessage = '';
    this.resetFilterForm();
    this.filter.PageNo = 1;
    this.filter.PerPage = 9;
    this.filter.Search = "";
    this.filter = { ...this.initialFilter };
    this.decryptedFilters = { ...this.initialFilter };
    this.router.navigate([], { queryParams: {} });
    this.getAllPropertyEqList();

    this.selectedCategories = 'Category';
    this.selectedSortby = 'Sort by';

    this.isDropdownClassActiveCategory = true;
    this.isDropdownClassActiveSortby = true;
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
          Search: this.filterForm?.get('Search')?.value,
        };
        break;
      case 'Category':
        this.filter = this.decryptedFilters = {
          ...this.filter,
          ...this.decryptedFilters,
          CategoryId: data,
          SortOrder: 'Asc',
        };
        this.isDropdownClassActiveCategory = false;
        break;

      case 'SortBy':
        this.filter = this.decryptedFilters = {
          ...this.filter,
          ...this.decryptedFilters,
          SortBy: data,
          SortOrder: 'Asc',
        };
        this.isDropdownClassActiveSortby = false;
        break;

      default:
        break;
    }

    if (this.filter.SortBy != undefined || this.filter.CategoryId != undefined || this.filter.Search != undefined) {
      this.encryptedFilters = this.encryptionService.encrypt(this.filter);
      // this.clear();
      this.getAllPropertyEqList();
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: this.isFilterEqual() ? null : { f: this.encryptedFilters },
        queryParamsHandling: this.isFilterEqual() ? null : 'merge', // This will merge new filters with existing query params
      });
    } else {
      this.router.navigate(['/propertyeq/videos']);
    }
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

  videoDetailsPage(propertyVideo: any) {
    let formConfig = {
      id: propertyVideo.Slug,
    };
    this.commonStoreService.setFormConfig(formConfig);
    this.router.navigate(['/propertyeq/videos/' + propertyVideo.Slug]);
  }

  onChangeSortBy(event: any) {
    this.updateFilter(event.Name, 'SortBy');
  }

  onCategoryChange(event: any) {
    this.updateFilter(event.Id, 'Category');
  }

  async loadCategoryDropdown() {
    this.categorydropdown$ = await this.articleService.getCategoryDropdown();
  }

  onFilterTags(tagid: any, str: any) {
    this.filter = {
      ...this.filterValue,
      Type: 2,
      Author: str == 'Author' ? tagid : null,
    }
    const encryptedTagId = this.encryptionService.encrypt(this.filter);
    this.router.navigate(['/propertyeq'], { queryParams: { f: encryptedTagId } });
  }
}
