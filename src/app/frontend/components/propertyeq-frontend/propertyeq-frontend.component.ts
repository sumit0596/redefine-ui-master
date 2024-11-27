import { Component, OnInit } from '@angular/core';
import { BreadcrumbsComponent } from '../../shared/breadcrumbs/breadcrumbs.component';
import { BannerBreadcrumbComponent } from '../../shared/banner-breadcrumb/banner-breadcrumb.component';
import { CommonModule, DatePipe } from '@angular/common';
import { CommonService } from 'src/app/shared/services/common.service';
import { QuickLinksComponent } from '../../shared/quick-links/quick-links.component';
import { PropertyEqService } from '../../services/property-eq.service';
import { CommonStoreService } from 'src/app/services/common-store.service';
import { ActivatedRoute, Router } from '@angular/router';
import { PropertyeqVideoDialogComponent } from './propertyeq-video-dialog/propertyeq-video-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { HeaderBannerBreadcrumbComponent } from '../../shared/header-banner-breadcrumb/header-banner-breadcrumb.component';
import { filter, isEqual, omit } from 'lodash';
import { EncryptionService } from 'src/app/services/encryption.service';
import { NgSelectModule } from '@ng-select/ng-select';
import { SelectModule } from 'src/app/shared/modules/select/select.module';
import { Observable, map, of } from 'rxjs';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-propertyeq-frontend',
  templateUrl: './propertyeq-frontend.component.html',
  styleUrls: ['./propertyeq-frontend.component.scss'],
  imports: [
    SelectModule,
    NgSelectModule,
    BreadcrumbsComponent,
    HeaderBannerBreadcrumbComponent,
    BannerBreadcrumbComponent,
    CommonModule,
    QuickLinksComponent,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
  ],
  standalone: true,
})
export class PropertyeqFrontendComponent implements OnInit {
  isDropdownClassActiveCategory = true;
  isDropdownClassActiveTag = true;
  isDropdownClassActiveAuthor = true;
  decryptedFilters!: any;
  encryptedFilters!: any;
  bannerText = '';
  breadcrumbLinks: any;
  bannerDetails: any;
  bannerData: any;
  author: any = {
    name: '',
    posted: '',
  };
  articleList: any;
  videoList: any;
  pressDetails: any;
  articleListLength!: number;
  date: Date = new Date();
  loadingData: boolean = true;
  loadingDataVideo: boolean = true;
  loadingDataPress: boolean = true;
  noRecords: boolean = false;
  searchText: any = '';
  filterForm!: FormGroup;

  imagePlaceholder: string = 'assets/images/property-default-image.jpg';
  imagePlaceholderImage: string = 'assets/images/image-placeholder.png';

  PropertyEqTypeId: any = '';
  selectedCategories: any;

  showContent: boolean = false;
  PageNo: number = 1;
  decryptedTagId: any;
  PerPage: number = 3;

  selectedCategory: any = null;
  selectedAuthor: any = null;
  selectedTag: any = null;
  searchInput: string = '';
  searchResults: any = {
    articles: [],
    videos: [],
    pressReleases: [],
  };
  loadData: boolean = false;
  searchActive: boolean = false;
  categorydropdown = [];
  categorydropdown$!: Observable<any>;
  authordropdown = [];
  authordropdown$!: Observable<any>;
  tagsdropdown$!: Observable<any>;
  tagsdropdown = [];
  errorMessage: string = '';
  filterValue: any;
  filter: any = {
    Search: '',
    Type: 2,
    PropertyEqTypeId: this.selectedFilters,
    PropertyEqCategoryId: this.selectedCategory,
    Author: this.selectedAuthor,
    PropertyEqTagId: this.selectedTag,
    PageNo: this.PageNo,
    PerPage: this.PerPage,
  };
  initialFilter = {
    Search: '',
    Type: 2,
    PropertyEqTypeId: '',
    PropertyEqCategoryId: '',
    Author: '',
    PropertyEqTagId: null,
    PageNo: 1,
    PerPage: 3,
  };

  hideBanner: boolean = false;
  showBreadcrumb: boolean = false;

  constructor(
    private fb: FormBuilder,
    private PropertyEqList: PropertyEqService,
    private CommonService: CommonService,
    private encryptionService: EncryptionService,
    private commonStoreService: CommonStoreService,
    private router: Router,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private datePipe: DatePipe
  ) {
    this.resetFilterForm();
    this.route.queryParams.subscribe((params) => {
      if (params?.['f']) {
        const urlSafeFilters = params?.['f'];
        const encryptedFilters = decodeURIComponent(urlSafeFilters);
        this.filter = this.encryptionService.decrypt(encryptedFilters);
        this.filter.PageNo = 1;
        this.filter.PerPage = 3;
        this.selectedFilters(this.filter);

        // this.searchActive = true;
        if (this.loadData == false) {
          this.performSearch();
        }
      } else {
        this.filter = this.initialFilter;
        this.searchActive = false;
        this.filterForm.get('Author')?.setValue(null);
        this.filterForm.get('PropertyEqCategoryId')?.setValue(null);
        this.filterForm.get('PropertyEqTagId')?.setValue(null);
        this.searchInput = '';
        this.getpropertyeqFrontendGrid();
      }
    });
  }

  ngOnInit(): void {
    // this.getArticleBanner();
    this.loadCategoryDropdown();
    this.loadTagDropdown();
    this.loadAuthorDropdown();


    this.selectedTag =
      this.filterForm.get('PropertyEqTagId')?.value || null;
    this.selectedCategory =
      this.filterForm.get('PropertyEqCategoryId')?.value || null;
    this.selectedAuthor =
      this.filterForm.get('Author')?.value || null;

  }

  search(event: any) {
    if (event.key?.toUpperCase() == 'ENTER' && this.errorMessage == '') {
      // this.filter.PageNo = 1;
      this.searchText = event.target.value;
      // this.filter.Search = event.target.value;
      this.filterForm.get('Search')?.setValue(this.searchText);
      this.updateFilter(this.searchText, 'Search');
    }
  }

  searchValue(val: any) {
    if (this.errorMessage == '') {
      this.searchText = val;
      this.filterForm.get('Search')?.setValue(this.searchText);
      this.updateFilter(this.searchText, 'Search');
    }
  }

  performSearch(): void {
    //this.searchActive = true;
    this.loadingData = true;
    this.loadingDataPress = true;
    this.loadingDataVideo = true;

    this.PropertyEqList.getPropertyEqFrontendSearchList(this.filter).subscribe({
      next: (data: any) => {
        if (data) {
          if (this.PropertyEqTypeId) {
            if (data.data?.PropertyEqArticle?.data?.length > 0) {
              this.searchResults.articles.pageNumber =
                data.data.PropertyEqArticle.pageNumber;
              this.searchResults.articles.pageCount =
                data.data.PropertyEqArticle.pageCount;
              this.searchResults.articles.totalCount =
                data.data.PropertyEqArticle.totalCount;
              this.searchResults.articles.data = [
                ...this.searchResults.articles.data,
                ...data.data.PropertyEqArticle.data,
              ];
            }
            if (data.data?.PropertyEqPress?.data?.length > 0) {
              this.searchResults.pressReleases.pageNumber =
                data.data.PropertyEqPress.pageNumber;
              this.searchResults.pressReleases.pageCount =
                data.data.PropertyEqPress.pageCount;
              this.searchResults.pressReleases.totalCount =
                data.data.PropertyEqPress.totalCount;
              this.searchResults.pressReleases.data = [
                ...this.searchResults.pressReleases.data,
                ...data.data.PropertyEqPress.data,
              ];
            }
            if (data.data?.PropertyEqVideo?.data?.length > 0) {
              this.searchResults.videos.pageNumber =
                data.data.PropertyEqVideo.pageNumber;
              this.searchResults.videos.pageCount =
                data.data.PropertyEqVideo.pageCount;
              this.searchResults.videos.totalCount =
                data.data.PropertyEqVideo.totalCount;
              this.searchResults.videos.data = [
                ...this.searchResults.videos.data,
                ...data.data.PropertyEqVideo.data,
              ];
            }
            this.PropertyEqTypeId = '';
            this.filter.PropertyEqTypeId = '';
            //this.searchResults.pressReleases = data.data.PropertyEqPress || [];
            //this.searchResults.videos = data.data.PropertyEqVideo || [];
          } else {
            if (data.data.Pin) {
              this.hideBanner = true;
              this.bannerDetails = data.data.Pin.MediaUrl;
              this.bannerText = data.data.Pin.Title;
              this.bannerData = data.data.Pin;
              this.showContent = true;
              this.author = {
                name: data.data.Pin.Author,
                posted: data.data.Pin.CreatedOn,
              };
            } else {
              this.hideBanner = false;
              this.showBreadcrumb = true;
            }
            this.searchResults.articles = data.data.PropertyEqArticle || [];
            this.searchResults.pressReleases = data.data.PropertyEqPress || [];
            this.searchResults.videos = data.data.PropertyEqVideo || [];
          }

          // Reset loading flags
          this.loadingData = false;
          this.loadingDataPress = false;
          this.loadingDataVideo = false;
          this.searchActive = true;
          if (
            data.data?.PropertyEqArticle?.data?.length === 0 &&
            data.data?.PropertyEqPress?.data?.length === 0 &&
            data.data?.PropertyEqVideo?.data?.length === 0
          ) {
            // If no search results, keep searchActive true to show no results message
          }
        }
      },
      error: () => {
        this.loadingData = false;
        this.loadingDataVideo = false;
        this.loadingDataPress = false;
        this.noRecords = true;
      },
    });
  }

  clearSearch() {
    this.selectedTag = null;
    this.selectedCategory = null;
    this.selectedAuthor = null;
    this.searchInput = '';
    this.resetFilterForm();
    this.noRecords = false;
    this.searchResults = { articles: [], videos: [], pressReleases: [] };
    this.searchActive = false;
    this.filter.PageNo = 1;
    this.filter = {
      ...this.initialFilter,
      PageNo: 1,
    };

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { f: null },
      queryParamsHandling: 'merge',
    });
  }

  loadMore(sectionType: number, pno: any) {
    this.PropertyEqTypeId = sectionType;
    this.filter.PropertyEqTypeId = sectionType;
    this.filter.PageNo = parseInt(pno) + 1;

    this.performSearch();
  }

  getpropertyeqFrontendGrid() {
    this.loadingData = true;
    this.loadingDataVideo = true;
    this.loadingDataPress = true;
    this.PropertyEqList.getPropertyEqFrontendList().subscribe({
      next: (data: any) => {
        if (data.Pin) {
          this.hideBanner = true;
          this.bannerDetails = data.Pin.MediaUrl;
          this.bannerText = data.Pin.Title;
          this.bannerData = data.Pin;
          this.showContent = true;
          this.author = {
            name: data.Pin.Author,
            posted: data.Pin.CreatedOn,
          };
        } else {
          this.hideBanner = false;
          this.showBreadcrumb = true;
        }

        this.articleList = data.PropertyEqArticle;
        this.videoList = data.PropertyEqVideo;
        this.pressDetails = data.PropertyEqPress;
        this.loadingData = false;
        this.loadingDataVideo = false;
        this.loadingDataPress = false;
      },
      error: (error) => {
        this.loadingData = false;
        this.loadingDataVideo = false;
        this.loadingDataPress = false;
        this.noRecords = true;
      },
    });
  }

  async loadCategoryDropdown() {
    this.categorydropdown$ = await this.PropertyEqList.getCategoryDropdown();
    this.loadData = true;
  }
  async loadAuthorDropdown() {
    this.authordropdown$ = await this.PropertyEqList.getAuthorDropdown();
  }

  async loadTagDropdown() {
    this.tagsdropdown$ = await this.PropertyEqList.getTagDropdown()
  }

  getTopicDetails(str: any) {
    let id: any;
    let url: any;
    switch (str.PropertyEqType) {
      case 'Article':
        id = str.Slug;
        url = 'articles';
        break;
      case 'Press Release':
        id = str.Slug;
        url = 'press-office';
        break;
    }
    this.router.navigate(['/propertyeq/' + url + '/' + id]);
  }

  formatDate(dateString: string): string {
    if (dateString) {
      let [day, month, year] = dateString.split('/');
      const date = new Date(+year, +month - 1, +day);
      const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      };
      const dateTimeFormat = new Intl.DateTimeFormat('en-US', options);
      const parts = dateTimeFormat.formatToParts(date);
      const partValues = parts.map((p) => p.value);
      //Array(5) [ "June", " ", "5", ", ", "2024" ]
      return partValues[2] + ' ' + partValues[0] + ', ' + partValues[4];
    }
    return '';
  }

  getHovercolor(index: any) {
    this.CommonService?.getHovercolor(index, 'sens-data');
  }

  getLeavecolor(index: any) {
    this.CommonService?.getLeavecolor(index, 'sens-data');
  }

  viewMoreAction(link: any) {
    let url: any;
    switch (link) {
      case 'article-list':
        url = 'articles';
        break;
      case 'video-list':
        url = 'videos';
        break;
      case 'press-office-list':
        url = 'press-office';
        break;
    }
    this.router.navigate(['/propertyeq/' + url]);
  }

  videoDetailsPage(propertyVideo: any) {
    let formConfig = {
      id: propertyVideo.Slug,
    };
    this.commonStoreService.setFormConfig(formConfig);
    this.router.navigate(['/propertyeq/videos/' + propertyVideo.Slug]);
  }

  resetFilterForm() {
    this.filterForm = this.fb.group({
      Search: [''],
      PropertyEqTagId: [null],
      PropertyEqCategoryId: [null],
      Author: [null],
    });
  }

  selectedFilters(filter: any) {
    if (filter) {
      this.decryptedFilters = filter;
      this.searchInput = filter.Search;

      if (filter.PropertyEqTagId) {
        this.filterForm.get('PropertyEqTagId')?.setValue(filter.PropertyEqTagId);
        this.selectedTag = filter.PropertyEqTagId;
      }
      if (filter.PropertyEqCategoryId) {
        this.filterForm.get('PropertyEqCategoryId')?.setValue(filter.PropertyEqCategoryId);
        this.selectedCategory = filter.PropertyEqCategoryId;
      }

      if (filter.Author) {
        this.filterForm.get('Author')?.setValue(filter.Author);
        this.selectedAuthor = filter.Author;
      } else {
        this.filterForm.get('Author')?.setValue(null);
      }

      if (filter.Search) {
        this.filterForm?.get('Search')?.setValue(filter.Search);
        this.searchText = filter.Search;
      }
    }
  }


  updateFilter(data: any, type: any) {
    switch (type) {
      case 'Search':
        this.filter = {
          ...this.filter,
          Search: data,
          PageNo: 1,
        };
        break;
      case 'Tag':
        this.filter = {
          ...this.filter,
          PropertyEqTagId: data,
          PageNo: 1,
        };
        break;
      case 'Category':
        this.filter = {
          ...this.filter,
          PropertyEqCategoryId: data,
          PageNo: 1,
        };
        break;
      case 'Author':
        this.filter = {
          ...this.filter,
          Author: data,
          PageNo: 1,
        };
        break;
      default:
        break;
    }
    if (this.filter.Search || this.filter.PropertyEqTagId || this.filter.PropertyEqCategoryId || this.filter.Author) {
      this.encryptedFilters = this.encryptionService.encrypt(this.filter);
      this.performSearch();
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: this.isFilterEqual() ? null : { f: this.encryptedFilters },
        queryParamsHandling: this.isFilterEqual() ? null : 'merge',
      });
    } else {
      this.router.navigate(['/propertyeq']);
    }

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

  appliedFilter(filterBy: any, event: any): void {
    if (event != undefined) {
      this.decryptedFilters = filter;
      if (filterBy == 'Tag') {
        this.updateFilter(event.Id, 'Tag');
      } else if (filterBy == 'Category') {
        this.updateFilter(event.Id, 'Category');
      } else if (filterBy == 'Author') {
        this.updateFilter(event.Author, 'Author');
      }
    }
  }

  onFilterTags(tagid: any, str: any) {
    this.filter = {
      ...this.filterValue,
      Type: 2,
      Author: str == 'Author' ? tagid : null,
    }
    this.loadData =false;
    const encryptedTagId = this.encryptionService.encrypt(this.filter);
    this.router.navigate(['/propertyeq'], { queryParams: { f: encryptedTagId } });
  }

}
