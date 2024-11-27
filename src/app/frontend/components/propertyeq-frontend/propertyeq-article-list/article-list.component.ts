import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { BannerBreadcrumbComponent } from 'src/app/frontend/shared/banner-breadcrumb/banner-breadcrumb.component';
import { BreadcrumbsComponent } from 'src/app/frontend/shared/breadcrumbs/breadcrumbs.component';

import { FormControl } from '@angular/forms';
import { MatPaginatorModule } from '@angular/material/paginator';
import { CustomMatPaginatorDirective } from 'src/app/shared/directives/custom-mat-paginator/custom-mat-paginator.directive';
import { CommonModule } from '@angular/common';
import { CommonStoreService } from 'src/app/services/common-store.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CareerService } from 'src/app/frontend/services/career.service';
import { EncryptionService } from 'src/app/services/encryption.service';
import isEqual from 'lodash-es/isEqual';
import omit from 'lodash-es/omit';
import { CalendarComponent } from 'src/app/shared/components/form-elements/calender/calendar.component';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ShareButtonComponent } from 'src/app/frontend/shared/share-button/share-button.component';
import { PropertyEqService } from 'src/app/frontend/services/property-eq.service';
import { NgSelectModule } from '@ng-select/ng-select';
import { IUnitFilter } from 'src/app/admin/models/interfaces';
import { QuickLinksComponent } from 'src/app/frontend/shared/quick-links/quick-links.component';
import { SelectModule } from 'src/app/shared/modules/select/select.module';
import { Observable, map, of } from 'rxjs';

@Component({
  selector: 'app-article-list',
  templateUrl: './article-list.component.html',
  styleUrls: ['./article-list.component.scss'],
  imports: [
    SelectModule,
    BreadcrumbsComponent,
    BannerBreadcrumbComponent,
    MatPaginatorModule,
    CustomMatPaginatorDirective,
    CommonModule,
    CalendarComponent,
    MatCheckboxModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    ShareButtonComponent,
    NgSelectModule,
    QuickLinksComponent
  ],
  standalone: true,
})
export class ArticleListComponent implements OnInit {
  loadingData: boolean = true;
  isDropdownClassActiveSortby = true;
  isDropdownClassActiveCategory = true;
  filterValue: any;
  filter: {
    SortBy: string | undefined;
    SortOrder: string;
    StartDate: string;
    EndDate: string;
    CategoryId: number | undefined;
    TypeId: number;
    PageNo: number;
    PerPage: number;
    Search: string;
    // Featured: number;
  } = {
      SortBy: '',
      SortOrder: '',
      StartDate: '',
      EndDate: '',
      CategoryId: undefined,
      TypeId: 2,
      PageNo: 1,
      PerPage: 6,
      Search: '',
      // Featured: 1,
    };
  initialFilter = {
    SortBy: '',
    SortOrder: 'Asc',
    StartDate: '',
    EndDate: '',
    CategoryId: undefined,
    TypeId: 2,
    PageNo: 1,
    PerPage: 6,
    Search: '',
  };
  articles: any[] = []; // Using any array for articles
  bannerText = 'Articles';
  bannerDetails: any;
  breadcrumbLinks: any;
  currentPage = 1;
  decryptedFilters!: any;
  encryptedFilters!: any;
  totalRowsCount: any;
  errorMessage: string = '';
  searchText: any = '';
  pageIndex: any;
  pageCnt: any;
  filterForm!: FormGroup;
  categorydropdown: any;
  categorydropdown$!: Observable<any>;
  // showShareIcon: boolean = false;
  imagePlaceholderImage: string = 'assets/images/property-default-image.jpg';
  categoryColors: string[] = [
    '#78C36C',
    '#289889',
    '#555D8B',
    '#004B6A',
    '#68C9D0',
  ];
  /* categoryColors: string[] = [
    '#78C36C',
    '#289889',
    '#195C54', 
    '#555D8B',
    '#004B6A',
    '#68C9D0',
  ];*/
  showShareIcon: { [key: string]: boolean } = {};
  currentOpenShareIcon: string | null = null;
  selectedCategories: any;
  selectedSortby: any;
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

  constructor(
    private fb: FormBuilder,
    private articleService: PropertyEqService,
    private router: Router,
    private commonStoreService: CommonStoreService,
    private careerService: CareerService,
    private encryptionService: EncryptionService,
    private route: ActivatedRoute,
    private elementRef: ElementRef
  ) {
    this.resetFilterForm();
    this.route.queryParams.subscribe((params) => {
      if (params?.['f']) {
        const urlSafeFilters = params?.['f'];
        const encryptedFilters = decodeURIComponent(urlSafeFilters);
        this.filter = this.encryptionService.decrypt(encryptedFilters);
        this.selectedFilters(this.filter);
      } else {
        this.filter = this.initialFilter;
        this.filterForm.get('SortBy')?.setValue(null);
      }
    });
  }

  @ViewChild('savePage', { static: true }) savePage!: ElementRef;

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const clickedInside = this.savePage?.nativeElement.contains(event.target);
    if (!clickedInside) {
      this.onClickedOutside();
    }
  }


  onClickedOutside(): void {
    if (this.currentOpenShareIcon !== null) {
      this.showShareIcon[this.currentOpenShareIcon] = false;
      this.currentOpenShareIcon = null;
    }
  }


  ngOnInit(): void {

    this.loadCategoryDropdown().then(() => {

    });
    this.getBanner();

    // this.showShareIcon = this.articles.map(() => false);
    this.selectedCategories =
      this.filterForm?.get('CategoryId')?.value || 'Select category';
    this.selectedSortby = this.filterForm?.get('SortBy')?.value || 'Sort by';

  }



  //category & categorydropdown//
  precomputeCategoryColors(): void {
    if (this.categorydropdown) {
      this.categorydropdown.forEach((category: any, index: number) => {
        if (!this.categoryColorMap.hasOwnProperty(category.Title)) {
          this.categoryColorMap[category.Title] = this.getNextColor(index);
        }
      });
    }
  }

  getNextColor(index: number): string {
    return this.categoryColors[index % this.categoryColors.length];
  }

  async loadCategoryDropdown(): Promise<void> {
    this.categorydropdown$ = of(undefined);
    this.categorydropdown$ = this.articleService.getCategoryDropdown().pipe(map(e => {
      this.categorydropdown = e;
      this.precomputeCategoryColors();
      this.colorsLoaded = true;
      this.loadArticles();
      return e;
    }
    ))
    /*return new Promise((resolve) => {
      this.articleService.getCategoryDropdown().subscribe((response: any) => {
        this.categorydropdown = response;
        this.precomputeCategoryColors();
        this.colorsLoaded = true;
        resolve();
      });
    });*/
  }

  //category & categorydropdown//
  // search //
  search(event: any) {
    if (event.key?.toUpperCase() == 'ENTER' && this.errorMessage == '') {
      this.filter.PageNo = 1;
      this.filterForm.get('Search')?.setValue(event.target.value);
      this.updateFilter(this.filter, 'Search');
    }
  }

  searchValue(event: any) {
    if (this.errorMessage == '') {
      this.filterForm?.get('Search')?.setValue(this.searchText);
      this.updateFilter(this.filter, 'Search');
    }
  }
  // search //
  //filter//
  selectedFilters(filter: any) {
    if (filter) {
      this.decryptedFilters = filter;
      if (filter.SortBy) {
        this.filterForm.get('SortBy')?.setValue(filter.SortBy);
      } else {
        this.filterForm?.get('SortBy')?.setValue(null);
      }
      /* this.articleService.getCategoryDropdown().subscribe((response: any) => {
         const selectedCategory = response.find((category: any) => category.Id === filter.CategoryId);
         this.selectedCategories = selectedCategory ? selectedCategory.Title : 'Select category';
       });*/
      if (filter.CategoryId) {
        this.filterForm.get('CategoryId')?.setValue(filter.CategoryId);
        this.selectedCategories = filter.CategoryId;
      }

      //  this.selectedSortby = filter.SortBy || 'Sort by';

      if (filter.Search) {
        this.filterForm?.get('Search')?.setValue(filter.Search);
        this.searchText = filter.Search;
      }

      if (filter.CategoryId) {
        this.isDropdownClassActiveCategory = false;
      } else if (filter.SortBy) {
        this.isDropdownClassActiveSortby = false;
      }
    }
  }


  resetFilterForm() {
    this.filterForm = this.fb.group({
      Search: [''],
      SortBy: [''],
      CategoryId: [null],
    });
  }

  getFilterObject() {
    return this.isFilterEqual() && this.decryptedFilters
      ? this.decryptedFilters
      : this.filter;
  }

  isFilterEqual() {
    return isEqual(
      omit(this.filter, ['PerPage', 'PageNo']),
      omit(this.initialFilter, ['PerPage', 'PageNo'])
    );
  }

  clear() {
    this.searchText = '';
    this.errorMessage = '';
    this.resetFilterForm();
    this.filter.PageNo = 1;
    this.filter.PerPage = 6;
    this.filter.Search = '';
    this.filter.CategoryId = undefined;
    this.filter.SortBy = undefined;
    this.filter = { ...this.filter };
    this.decryptedFilters = { ...this.filter };
    this.router.navigate([], { queryParams: {} });
    this.loadArticles();
    this.isDropdownClassActiveCategory = true;
    this.isDropdownClassActiveSortby = true;
    this.selectedCategories = 'Select category';
    this.selectedSortby = 'Sort by';
  }
  //filter//
  //pagination//
  paginate(event: any) {
    if (this.errorMessage == '') {
      this.pageIndex = event.pageIndex;
      this.filter = this.decryptedFilters = {
        ...this.filter,
        ...this.decryptedFilters,
        PageNo: event.pageIndex + 1,
        PerPage: event.pageSize,
      };
      this.loadArticles();
      window.scrollTo(0, 0);
    }
  }
  //pagination//

  clickedShareIcon(event: Event, index: any) {
    // Close the currently open share icon if it's different from the clicked index
    if (
      this.currentOpenShareIcon !== null &&
      this.currentOpenShareIcon !== index
    ) {
      this.showShareIcon[this.currentOpenShareIcon] = false;
    }
    // Toggle the visibility of the clicked share icon
    this.showShareIcon[index] = !this.showShareIcon[index];
    // Update the currently open share icon
    this.currentOpenShareIcon = this.showShareIcon[index] ? index : null;
    event.stopPropagation();
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
          Search: this.filterForm.get('Search')?.value,
        };
        break;
      case 'Select category':
        this.filter = this.decryptedFilters = {
          ...this.filter,
          ...this.decryptedFilters,
          CategoryId: data,
          SortOrder: 'Asc',
        };
        break;

      case 'SortBy':
        this.filter = this.decryptedFilters = {
          ...this.filter,
          ...this.decryptedFilters,
          SortBy: data,
          SortOrder: 'Asc',
        };
        break;
      default:
        break;
    }
    if (this.filter.SortBy != undefined || this.filter.CategoryId != undefined || this.filter.Search != undefined) {
      this.encryptedFilters = this.encryptionService.encrypt(this.filter);
      this.loadArticles();
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: this.isFilterEqual() ? null : { f: this.encryptedFilters },
        queryParamsHandling: this.isFilterEqual() ? null : 'merge',
      });
    } else {
      this.router.navigate(['/propertyeq/articles']);
    }
  }

  //load article data//
  loadArticles(): void {
    this.loadingData = true;
    if (!this.colorsLoaded) {
      return;
    }
    if (this.filter.SortBy == "Date") {
      this.filter.SortBy = "CreatedOn";
    }
    this.articleService.getArticles(this.filter).subscribe({
      next: (response: any) => {
        this.articles = response.PropertyEq.map((article: any) => ({
          ...article,
          bgColor:
            this.categoryColorMap[article.PropertyEqCategory] || '#cccccc',
            //this.categoryColorMap[article.PropertyEqCategory] || '#545454',
        }));
        this.totalRowsCount = response.totalCount;
        this.loadingData = false;
        this.showShareIcon = {};
      },
      error: (error: any) => {
        console.error('Error fetching articles', error);
        this.loadingData = false;
      },
    });
  }

  //load article data//

  onChangeSortBy(event: any) {
    this.updateFilter(event.Name, 'SortBy');
  }

  onCategoryChange(event: any) {
    this.updateFilter(event.Id, 'Select category');
  }

  getBanner() {
    this.careerService
      .getBanner('PEQ_VIDEO_PAGE_BANNER')
      .subscribe((res: any) => (this.bannerDetails = res.data.Value));
  }

  onPageChange(pageNumber: number): void {
    this.currentPage = pageNumber;
    this.filter = { ...this.filter, PageNo: pageNumber };
    this.loadArticles();
  }

  articlesDetailsPage(article: any) {
    let formConfig = {
      id: article.Slug,
    };
    this.commonStoreService.setFormConfig(formConfig);
    this.router.navigate(['/propertyeq/articles/' + article.Slug]);
  }

  onFilterTags(tagid: any, str: any) {
    this.filter = {
      ...this.filterValue,
      Type: 2,
      PropertyEqCategoryId: str == 'EqCategoryId' ? tagid : null,
      Author: str == 'Author' ? tagid : null,
    }
    const encryptedTagId = this.encryptionService.encrypt(this.filter);
    this.router.navigate(['/propertyeq'], { queryParams: { f: encryptedTagId } });
  }
}
