import { Component, ElementRef, HostListener, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { LoaderService } from 'src/app/shared/services/loader/loader.service';
import { ToastrService } from 'ngx-toastr';
import { DASHBOARD_FILTER_TYPE, PROPERTY_TYPE } from 'src/app/models/enum';
import { DashboardService } from 'src/app/admin/services/dashboard.service';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Observable, Subject, of, takeUntil } from 'rxjs';
import { SECTOR } from 'src/app/models/sector';
import {
  OFFICE_HEADER,
  INDUSTRIAL_HEADER,
  RETAIL_HEADER,
  NUMBER_COLUMNS,
  HTML_COLUMNS,
} from 'src/app/models/table-headers';
import { ExcelService } from 'src/app/services/excel.service';
import { UserService } from 'src/app/admin/services/user.service';
import { Router } from '@angular/router';
import { CommonStoreService } from 'src/app/services/common-store.service';
import { Options, LabelType } from '@angular-slider/ngx-slider';
import { UserStoreService } from 'src/app/services/user-store.service';
import { unionBy, isEqual, omit } from 'lodash-es';
import { IUnitFilter } from 'src/app/admin/models/interfaces';
import { DatePipe, DecimalPipe } from '@angular/common';
import { FePropertiesService } from 'src/app/admin/services/fe-properties.service';
import { SafeHtmlPipe } from 'src/app/shared/pipes/safe-html.pipe';
import { environment } from 'src/environments/environment.dev';

interface ISearch {
  type: string;
  items: any[];
}
@Component({
  selector: 'app-broker-dashboard',
  templateUrl: './broker-dashboard.component.html',
  styleUrls: ['./broker-dashboard.component.scss'],
})
export class BrokerDashboardComponent implements OnInit, OnDestroy {
  userInfo: any;
  clear = false;
  pageIndex: any = 0;
  loadingCards!: any[];
  totalPropertiesCount: any;
  destroySubject: Subject<void> = new Subject<void>();
  initialList!: any[];
  disclaimerMessage: string = `'My Properties' shows the properties of area and sector chosen in broker profile and 'All Properties' shows the properties in all existing areas and sectors.`;
  maxUnitSize: any;
  otherSectors: any = [];
  minUnitSize: any;
  dropDownOpen: boolean = false;
  isSearchByProperty: boolean = false;
  constructor(
    private dashboardService: DashboardService,
    private loaderService: LoaderService,
    private toasterService: ToastrService,
    private excelService: ExcelService,
    private userService: UserService,
    private fb: FormBuilder,
    private router: Router,
    private commonStoreService: CommonStoreService,
    private userStore: UserStoreService,
    private datePipe: DatePipe,
    private feproperties: FePropertiesService,
    private deciamlPipe: DecimalPipe,
    private eRef: ElementRef,
    private renderer: Renderer2
  ) {
    this.getUserInfo();
  }
  ngOnDestroy(): void {
    this.searchData = [];
    this.destroySubject.next();
    this.destroySubject.complete();
  }

  recentlyUpdatedUnits$: any;
  activeButton = 2;
  activeTabType = 2;
  type: any = 'units';
  environment: any = environment;
  initialFilter: IUnitFilter = {
    PageNo: 1,
    PerPage: 12,
    Search: null,
    SectorId: '',
    ProvinceId: '',
    SortBy: 'Asc',
    SortOrder: '',
    Type: 2,
    CityId: '',
    SuburbId: '',
    Attributes: '',
    Incentives: '',
    SizeStart: 0,
    SizeEnd: 0,
    BrokerIncentivesStart: 0,
    BrokerIncentivesEnd: 0,
    GrossRentalStart: undefined,
    GrossRentalEnd: undefined,
    HoldingCompanyId: 0,
    EsgFeatures: '',
    Map: 0,
    Space2Spec: 0,
  };
  filter!: IUnitFilter;
  sort$: Observable<any[]> = of([
    {
      Name: 'PropertyName',
      Id: 'Property Name',
    },
    {
      Name: 'UnitName',
      Id: 'Unit Name',
    },
    {
      Name: 'UnitSize',
      Id: 'Unit Size',
    },
    {
      Name: 'GrossRental',
      Id: 'Gross Rental',
    },
  ]);

  filterType = DASHBOARD_FILTER_TYPE;

  propertyUnits$: Observable<any> | undefined;
  propertyUnits: any;
  propertyUnitIds: any;
  propertyUnitCount: any;

  //for left filter
  sectorList!: any[]; // Sector
  attributeList!: any[];
  incentiveList: any;
  selectedSectorIDs: any[] = []; // selected Sector ID/ property type
  selectedIncentiveIDs: any[] = [];
  selectedAttributeIDs: any[] = [];
  selectedIDs: any[] = [];

  //for Search
  provinceList!: any[];
  provinceList$!: Observable<any[]>;
  cityList!: any[];
  cityList$!: Observable<any[]>;
  suburbList!: any[];
  suburbList$!: Observable<any[]>;
  selectedProvinceIDs: any[] = [];
  // selectedCity: any[] = [];
  // selectedSuburb: any[] = [];

  selectedValues: any[] = [];
  searchList!: any[];

  filterForm!: FormGroup;
  sectorList$!: Observable<any[]>;
  sectorData: any = [];
  atrributesList$!: Observable<any>;
  attributeData: any = [];
  incentivesList$!: Observable<any>;
  incentiveData: any = [];
  selectedPropertyList: any[] = [];
  originalPropertyList: any[] = [];
  propertyListData: any[] = []; // Store the full API response data
  filteredPropertyList: any[] = [];
  propertyList: any;
  listOpen: boolean = false;
  selectedProperty: any;
  //For size slider
  options: Options = {
    floor: 0,
    ceil: 99999999999999,
    step: 50,
    showTicks: false,
    translate: (value: number, label: LabelType): any => {
      switch (label) {
        case LabelType.Low:
          return value + ' ';
        case LabelType.High:
          return value + ' ';
        default:
          return '';
      }
    },
  };
  // For broker commission slider
  commissionOptions: Options = {
    floor: 0,
    ceil: 300,
    //step: 5,
    showTicks: false,
    translate: (value: number, label: LabelType): any => {
      switch (label) {
        case LabelType.Low:
          return value + '% ';
        case LabelType.High:
          return value + '% ';
        default:
          return '';
      }
    },
  };
  //  NEW SEARCH IMPLEMENTATION
  searchDropdownList: ISearch[] = [];
  selectedProvinceList: any = [
    {
      Id: 2,
      Name: 'Free State',
      Type: 'Province',
    },
  ];
  selectedSuburbList: string[] = [];
  selectedCityList: string[] = [];
  searchData: any[] = [];
  chartData$!: Observable<any>;
  counter: number = 0;
  ngOnInit(): void {
    this.loadingCards = Array(this.initialFilter.PerPage).fill(
      this.initialFilter.PerPage
    );
    this.filter = this.initialFilter;
    this.filterForm = this.fb.group({
      sectors: [{ disabled: true, value: [] }],
      attributes: [],
      sort: [null],
      incentives: [],
      brokerCommission: [[0, 300]],
      size: [[0, 99999999999999]],
    });
    this.getPropertyList();
    // this.onPropertySelected(this.propertyUnits);
    this.loadPropertyCount(this.filterType.MY_PROPERTIES);
    this.loadRecentlyUpdatedUnits(this.filterType.MY_PROPERTIES);
    this.getDropdown();
    this.getProperties();
    this.getSizeGrossRentalMax();
  }

  onPropertySelected(event: any) {
    if (event && event.PropertyId) {
      this.filter = {
        ...this.filter,
        PageNo: 1,
        PropertyId: [...(this.filter.PropertyId || []), event.PropertyId],
      };
      this.getProperties();
      this.clear = true;
    }
  }
  onPropertySearch(event: any) {
    if (event && event.PropertyId) {
      this.filter = {
        ...this.filter,
        PageNo: 1,
        PropertyId: [...(this.filter.PropertyId || []), event.PropertyId],
      };
      this.getProperties();
    }
  }

  onClearProperty() {
    // Clear the selected property filter
    this.filter = { ...this.filter, PropertyId: [] };
    // Optionally, clear selected items array
    this.selectedPropertyList = [];
    this.getProperties();
    this.clear = true;
  }

  onPropertyDeSelect(event: any) {
    if (event && event.PropertyId) {
      if (Array.isArray(this.filter.PropertyId)) {
        this.filter.PropertyId = this.filter.PropertyId.filter(
          (id) => id !== event.PropertyId
        );
      }
      this.getProperties();
    }
  }

  getSizeGrossRentalMax() {
    this.feproperties.getGrossRentalMax(2).subscribe((res) => {
      if (res.MaxUnitSize != undefined) {
        this.maxUnitSize = res.MaxUnitSize;
        this.minUnitSize = res.MINUnitSize;
        this.options = {
          floor: this.minUnitSize,
          ceil: this.maxUnitSize,
          //step: 50,
          showTicks: false,
          translate: (value: number, label: LabelType): any => {
            switch (label) {
              case LabelType.Low:
                return this.deciamlPipe.transform(value) + ' ';
              case LabelType.High:
                return this.deciamlPipe.transform(value) + ' ';
              default:
                return '';
            }
          },
        };
        // this.filterForm.patchValue({ size: [0, this.maxUnitSize] });
      }
    });
  }

  get sectorsForm() {
    return this.filterForm.get('sectors') as FormArray;
  }
  get attributesForm() {
    return this.filterForm.get('attributes') as FormArray;
  }
  get incentivesForm() {
    return this.filterForm.get('incentives') as FormArray;
  }
  async getUserInfo() {
    let userInfo$ = await this.userStore.getUser();
    userInfo$.pipe(takeUntil(this.destroySubject)).subscribe({
      next: (result: any) => {
        // this.initialFilter.SectorId = result.Sector;
        // this.initialFilter.SuburbId = result.Areas;
        this.userInfo = {
          ...result,
          Sector: result.Sector.split(','),
          Areas: result.Areas.split(','),
        };
      },
    });
  }
  filterPropertyList() {
    if (this.activeTabType === this.filterType.MY_PROPERTIES) {
      this.filteredPropertyList = this.propertyListData.filter(item => item.Type === 'MY_PROPERTIES');
    } else if (this.activeTabType === this.filterType.ALL_PROPERTIES) {
      this.filteredPropertyList = this.propertyListData.filter(item => item.Type === 'ALL_PROPERTIES');
    } else if (this.activeTabType === this.filterType.RECENTLY_UPDATED_PROP) {
      this.filteredPropertyList = this.propertyListData.filter(item => item.Type === 'RECENTLY_UPDATED_PROP');
    }
  }
  displayProperties(filter_type: number) {
    this.activeTabType = filter_type;
    this.filterPropertyList();
    this.isSearchByProperty = false;
    this.filter = {
      ...this.filter,
      PageNo: 1,
      Type: filter_type,
    };
    this.getPropertyList();
    if (
      filter_type == this.filterType.RECENTLY_UPDATED_PROP ||
      filter_type == this.filterType.ALL_PROPERTIES
    ) {
      this.filterForm.get('sectors')?.enable();
      this.clearFilter();
    } else if (filter_type == this.filterType.MY_PROPERTIES) {
      let sectors = this.userInfo?.Sector?.map(Number)?.toString();
      // let sectors = this.sectorList.map((sector: any) => {
      //   if ([...this.userInfo.Sector].some((id: any) => +id === sector.Id)) {
      //     return sector.Id;
      //   }
      // else {
      //   return false;
      // }
      // });
      this.filterForm.get('sectors')?.disable();
      this.searchData = [
        ...this.suburbList.filter((s: any) =>
          this.userInfo.Areas.includes(
            `${s.Id.replace(this.getElementIndicatorByType(s?.Type), '')}`
          )
        ),
      ];
      this.filter = {
        ...this.filter,
        SectorId: sectors && sectors.length ? sectors : '',
        SuburbId:
          this.searchData && this.searchData.length
            ? this.searchData
              .map((suburb: any) => {
                return suburb.Id?.replace(
                  this.getElementIndicatorByType(suburb?.Type),
                  ''
                );
              })
              .join(',')
            : '',
      };
      this.filterForm.reset({
        sectors: this.userInfo?.Sector?.map(Number),
      });
      this.sectorData = this.sectorList.filter((s: any) =>
        this.userInfo?.Sector.includes(`${s.Id}`)
      );
      this.clearFilter();
    }
  }

  propertyOverView(filter_Type: number) {
    this.activeButton = filter_Type;
    this.loadPropertyCount(filter_Type);
    this.loadRecentlyUpdatedUnits(filter_Type);
  }

  toggleSearchByProperty(event: any) {
    this.isSearchByProperty = event.checked; // Use event.checked from the switch
    this.clearFilter();
  
    if (!this.isSearchByProperty) {
      this.onClearProperty();
      this.clear = false;
    }
  }

  getPropertyList() {
    this.dashboardService.getBrokpPropListDropdown(this.activeTabType).subscribe((res: any) => {
      this.propertyListData = res;  // Store the full data
      this.filterPropertyList(); // Apply initial filter for the active tab
    });

  }


  getProperties() {
    this.loaderService.show();
    const filterWithPagination = {
      ...this.filter,
      PageNo: 1,
    };
    this.propertyUnits$ = this.dashboardService.getAllPropertyUnits(
      this.filter
    );
    this.propertyUnits$.pipe(takeUntil(this.destroySubject)).subscribe({
      next: (result: any) => {
        this.loaderService.hide();
        this.propertyUnitCount = result.totalProperty;
        this.propertyUnits = result.properties;

        this.totalPropertiesCount = result.totalProperty;
        this.propertyUnitIds = result.allunits;
      },
      error: (error: any) => {
        this.loaderService.hide();
        error.error.errors
          ? this.displayError(error.error.errors)
          : this.toasterService.error(error.error.message);
      },
    });
  }

  loadRecentlyUpdatedUnits(type: number) {
    this.recentlyUpdatedUnits$ =
      this.dashboardService.getRecentlyUpdatedUnits(type);
  }

  loadPropertyCount(type: number) {
    this.chartData$ = of(undefined);
    this.chartData$ = this.dashboardService.getPropertyCount(type);
  }

  onSliderChange(event: any, type: string) {
    this.updateFilter(event, type);
  }

  onBrokerIncentiveChange(event: any) {
    this.filter = {
      ...this.filter,
      BrokerIncentivesStart: event.value,
      BrokerIncentivesEnd: event.highValue,
    };
    this.getProperties();
  }

  getDropdown() {
    this.dashboardService
      .getPropTypeDropdown(PROPERTY_TYPE.SOUTH_AFRICA)
      .pipe(takeUntil(this.destroySubject))
      .subscribe({
        next: (result: any) => {
          this.sectorList = result.data;
          this.sectorList$ = of(this.sectorList);
          this.filterForm
            .get('sectors')
            ?.setValue(this.userInfo?.Sector?.map(Number));
          this.sectorData = this.sectorList.filter((s: any) =>
            this.userInfo?.Sector.includes(`${s.Id}`)
          );
        },
        error: (error: any) => {
          error.error.errors
            ? this.displayError(error.error.errors)
            : this.toasterService.error(error.error.message);
        },
      });
    this.dashboardService
      .getPropAttributeDropdown(1)
      .pipe(takeUntil(this.destroySubject))
      .subscribe({
        next: (result: any) => {
          this.attributeList = [...result.data].map((d: any) => {
            return { ...d, Name: d.Title };
          });
          this.atrributesList$ = of(this.attributeList);
        },
        error: (error: any) => {
          error.error.errors
            ? this.displayError(error.error.errors)
            : this.toasterService.error(error.error.message);
        },
      });
    this.dashboardService
      .getPropertyIncentiveDropdown()
      .pipe(takeUntil(this.destroySubject))
      .subscribe({
        next: (result: any) => {
          this.incentiveList = result.data.map((obj: any) => ({
            ...obj,
            Name: obj.Title,
          }));
          this.incentivesList$ = of(this.incentiveList);
        },
        error: (error: any) => {
          error.error.errors
            ? this.displayError(error.error.errors)
            : this.toasterService.error(error.error.message);
        },
      });
    this.getProvinces();
    this.getCity();
    this.getSuburb();
  }

  async getProvinces() {
    (await this.userService.getProvinces(1))
      .pipe(takeUntil(this.destroySubject))
      .subscribe({
        next: (res: any) => {
          this.provinceList = [...res].map((province: any) => {
            return { ...province, Type: 'Province', Id: 'p' + province.Id };
          });
          this.provinceList$ = of(this.provinceList);
          this.searchData = [
            ...this.searchData,
            ...this.provinceList.filter(
              (p: any) =>
                p.Id.replace(this.getElementIndicatorByType(p?.Type), '') ===
                this.userInfo.ProvinceId &&
                !this.searchData.some(
                  (province: any) =>
                    province.Id === p.Id && province.Type === 'Province'
                )
            ),
          ];
          this.searchList = unionBy(this.searchList, this.provinceList);
        },
        error: (error: any) => {
          error.error.errors
            ? this.displayError(error.error.errors)
            : this.toasterService.error(error.error.message);
        },
      });
  }

  async getCity() {
    // this.initialList  = [];
    (await this.dashboardService.getCities(1))
      .pipe(takeUntil(this.destroySubject))
      .subscribe({
        next: (res: any) => {
          this.cityList = [...res].map((city: any) => {
            return { ...city, Type: 'City', Id: 'c' + city.Id };
          });
          this.cityList$ = of(this.cityList);
          // this.initialList = this.cityList;
          this.searchList = unionBy(this.searchList, this.cityList);
        },
        complete: () => { },
        error: (error: any) => {
          error.error.errors
            ? this.displayError(error.error.errors)
            : this.toasterService.error(error.error.message);
        },
      });
  }

  async getSuburb() {
    this.initialList = [];
    (await this.dashboardService.getSuburb(1))
      .pipe(takeUntil(this.destroySubject))
      .subscribe({
        next: (res: any) => {
          this.suburbList = [...res].map((suburb: any) => {
            return { ...suburb, Type: 'Suburb', Id: 's' + suburb.Id };
          });
          this.suburbList$ = of(this.suburbList.sort(this.sortByName));
          this.initialList = this.suburbList;
          this.searchData = [
            ...this.searchData,
            ...this.suburbList.filter(
              (s: any) =>
                this.userInfo.Areas.includes(
                  `${s.Id.replace(this.getElementIndicatorByType(s?.Type), '')}`
                ) &&
                !this.searchData.some(
                  (suburb: any) =>
                    suburb.Id === s.Id && suburb.Type === 'Suburb'
                )
            ),
          ];
          this.searchList = unionBy(this.searchList, this.suburbList);
        },
        error: (error: any) => {
          error.error.errors
            ? this.displayError(error.error.errors)
            : this.toasterService.error(error.error.message);
        },
      });
  }

  onSearchSelect(event: any) {
    this.searchData = [...this.searchData, event];
    this.updateFilter(this.searchData, 'Search');
  }

  onSearchDeSelect(event: any) {
    this.searchData = this.searchData.filter(
      (d: any) => !(d.Id === event.Id && d.Type === event.Type)
    );
    this.initialList = this.suburbList;
    this.updateFilter(this.searchData, 'Search');
  }

  onClearSearch() {
    this.searchData = [];
    this.initialList = this.suburbList;
    this.updateFilter(this.searchData, 'Search');
  }
  onProvinceSelect(event: any) {
    this.searchData = [...this.searchData, { ...event, Type: 'Province' }];
    this.updateFilter(this.searchData, 'Province');
  }

  onProvinceDeSelect(event: any) {
    this.searchData = this.searchData.filter(
      (province: any) =>
        !(
          province.Id === event.Id &&
          province.Type === 'Province' &&
          province.Name === event.Name
        )
    );
    this.updateFilter(this.searchData, 'Province');
  }

  onProvinceClear(event?: any) {
    this.searchData = this.searchData.filter((d: any) => d.Type !== 'Province');
    this.updateFilter(this.searchData, 'Province');
  }

  onCitySelect(event: any) {
    this.searchData = [...this.searchData, { ...event, Type: 'City' }];
    this.updateFilter(this.searchData, 'City');
  }

  onCityDeSelect(event: any) {
    this.searchData = this.searchData.filter(
      (city: any) =>
        !(
          city.Id === event.Id &&
          city.Type === 'City' &&
          city.Name === event.Name
        )
    );
    this.updateFilter(this.searchData, 'City');
  }

  onCityClear(event?: any) {
    this.searchData = this.searchData.filter((d: any) => d.Type !== 'City');
    this.updateFilter(this.searchData, 'City');
  }

  onSuburbSelect(event: any) {
    this.searchData = [...this.searchData, { ...event, Type: 'Suburb' }];
    this.updateFilter(this.searchData, 'Suburb');
  }

  onSuburbDeSelect(event: any) {
    this.searchData = this.searchData.filter(
      (suburb: any) =>
        !(
          suburb.Id === event.Id &&
          suburb.Type === 'Suburb' &&
          suburb.Name === event.Name
        )
    );
    this.updateFilter(this.searchData, 'Suburb');
  }

  onSuburbClear(event?: any) {
    this.searchData = this.searchData.filter((d: any) => d.Type !== 'Suburb');
    this.updateFilter(this.searchData, 'Suburb');
  }

  sortBy(event: any) {
    this.filter = {
      ...this.filter,
      PageNo: 1,
      SortBy: event.Name,
      SortOrder: 'Asc',
    };
    this.getProperties();
  }
  // RIGHT SIDE FILTER METHODS
  onSectorSelect(event: any) {
    this.activeTabType == this.filterType.MY_PROPERTIES
      ? this.sectorData.push(event)
      : this.otherSectors.push(event);
    this.activeTabType == this.filterType.MY_PROPERTIES
      ? this.updateFilter(this.sectorData, 'Sector')
      : this.updateFilter(this.otherSectors, 'Sector');
  }
  onSectorDeSelect(event: any) {
    if (this.activeTabType == this.filterType.MY_PROPERTIES) {
      this.sectorData = this.sectorData.filter(
        (sector: any) => !(sector.Id === event.Id && sector.Name === event.Name)
      );
      this.updateFilter(this.sectorData, 'Sector');
    } else {
      this.otherSectors = this.otherSectors.filter(
        (sector: any) => !(sector.Id === event.Id && sector.Name === event.Name)
      );
      this.updateFilter(this.otherSectors, 'Sector');
    }
  }

  onSectorClear(event?: any) {
    this.sectorData = [];
    this.updateFilter(this.sectorData, 'Sector');
  }

  // Attribute dropdown
  onAttributeSelect(event: any) {
    this.attributeData.push(event);
    this.updateFilter(this.attributeData, 'Attribute');
  }
  onAttributeDeSelect(event: any) {
    this.attributeData = this.attributeData.filter(
      (attribute: any) =>
        !(attribute.Id === event.Id && attribute.Name === event.Name)
    );
    this.updateFilter(this.attributeData, 'Attribute');
  }

  onAttributeClear(event?: any) {
    this.attributeData = [];
    this.updateFilter(this.attributeData, 'Attribute');
  }

  // Incentives Dropdown
  onIncentivesSelect(event: any) {
    this.incentiveData.push(event);
    this.updateFilter(this.incentiveData, 'Incentive');
  }
  onIncentivesDeSelect(event: any) {
    this.incentiveData = this.incentiveData.filter(
      (incentive: any) =>
        !(incentive.Id === event.Id && incentive.Name === event.Name)
    );
    this.updateFilter(this.incentiveData, 'Incentive');
  }

  onIncentivesClear(event?: any) {
    this.incentiveData = [];
    this.updateFilter(this.incentiveData, 'Incentive');
  }

  updateFilter(data: any, type: any) {
    this.filter = { ...this.filter, PageNo: 1 };
    switch (type) {
      case 'Paginate':
        setTimeout(() => {
          document.getElementById('targetSearch')?.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
            inline: 'nearest',
          });
        }, 500);
        this.pageIndex = data.pageIndex;
        this.filter = {
          ...this.filter,
          PerPage: data.pageSize,
          PageNo: data.pageIndex + 1,
        };
        break;
      case 'Search':
        this.filter = {
          ...this.filter,
          ProvinceId: data
            .filter((d: any) => d.Type === 'Province')
            .map((d: any) =>
              d.Id.replace(this.getElementIndicatorByType(d?.Type), '')
            )
            .toString(),
          CityId: data
            .filter((d: any) => d.Type === 'City')
            .map((d: any) =>
              d.Id.replace(this.getElementIndicatorByType(d?.Type), '')
            )
            .toString(),
          SuburbId: data
            .filter((d: any) => d.Type === 'Suburb')
            .map((d: any) =>
              d.Id.replace(this.getElementIndicatorByType(d?.Type), '')
            )
            .toString(),
        };
        break;
      case 'Province':
        this.filter = {
          ...this.filter,
          ProvinceId: data
            .filter((d: any) => d.Type === 'Province')
            .map((d: any) =>
              d.Id.replace(this.getElementIndicatorByType(d?.Type), '')
            )
            .toString(),
        };
        break;
      case 'City':
        this.filter = {
          ...this.filter,
          CityId: data
            .filter((d: any) => d.Type === 'City')
            .map((d: any) =>
              d.Id.replace(this.getElementIndicatorByType(d?.Type), '')
            )
            .toString(),
        };
        break;
      case 'Suburb':
        this.filter = {
          ...this.filter,
          SuburbId: data
            .filter((d: any) => d.Type === 'Suburb')
            .map((d: any) =>
              d.Id.replace(this.getElementIndicatorByType(d?.Type), '')
            )
            .toString(),
        };
        break;
      case 'Sector':
        this.filter = {
          ...this.filter,
          SectorId: data.map((d: any) => d.Id).toString(),
        };
        break;
      case 'Property':
        this.filter = {
          ...this.filter,
          PropertyId: data.map((d: any) => d.Id).toString(),
        };
        break;
      case 'Attribute':
        this.filter = {
          ...this.filter,
          Attributes: data.map((d: any) => d.Id).toString(),
        };
        break;
      case 'Incentive':
        this.filter = {
          ...this.filter,
          Incentives: data.map((d: any) => d.Id).toString(),
        };
        break;
      case 'Size':
        this.filter = {
          ...this.filter,
          SizeStart: data.value,
          SizeEnd: data.highValue,
        };
        break;
      case 'BrokerCommission':
        this.filter = {
          ...this.filter,
          BrokerIncentivesStart: data.value,
          BrokerIncentivesEnd: data.highValue,
        };
        break;

      default:
        break;
    }
    this.getProperties();
    this.clearFilterValue();
  }

  displayError(error: any) {
    let errors = JSON.parse(error);
    Object.keys(errors).forEach((err: any) => {
      this.toasterService.error(errors[err][0]);
    });
  }

  paginate(event: any): void {
    this.updateFilter(event, 'Paginate');
  }

  isAllCheck(data: any[]) {
    return data.every((d: any) => d.completed);
  }

  clearFilter() {
    this.selectedPropertyList = [];
    this.otherSectors = [];
    this.attributeData = [];
    this.incentiveData = [];
    this.filterForm.reset({
      sectors:
        this.activeTabType == this.filterType.MY_PROPERTIES
          ? this.userInfo?.Sector?.map(Number)
          : [],
      incentives: [],
      attributes: [],
      sort: null,
      brokerCommission: [0, 300],
      size: [this.minUnitSize, this.maxUnitSize],
    });
    this.filter = {
      ...this.initialFilter,
      SectorId: '',
      SuburbId: '',
      Type: this.activeTabType,
    };
    if (this.activeTabType != this.filterType.MY_PROPERTIES) {
      this.searchData = [];
    }
    this.getProperties();
    this.clear = false;
  }

  isExists(data: any[], value: any, key: string): boolean {
    return data.some((d: any) => d[key] === value);
  }

  // EXPORT VACANCY SCHEDULE
  getVacancyData(type: number | null) {
    this.loaderService.show();
    let unitIds: any = [...this.propertyUnitIds]
      .map((d: any) => d.Id)
      .toString();
    this.dashboardService
      .getVacancyExcelData(unitIds, type)
      .pipe(takeUntil(this.destroySubject))
      .subscribe({
        next: (res: any) => {
          this.exportExcel(res);
        },
        complete: () => {
          this.loaderService.hide();
        },
        error: (error: any) => {
          this.loaderService.hide();
        },
      });

  }

  exportExcel(data: any) {
    let date = new Date();
    let typeLabel = data.type == 1 ? 'Cities' : data.type == 2 ? 'Suburbs' : '';
    data.cities = [...data.cities].map((city: any) => {
      return {
        ...city,
        sector: [...city.sector].map((sector: any) => {
          return {
            ...sector,
            properties: [...sector.properties].map((property: any) => {
              return {
                ...property,
                contactDetails: [
                  {
                    role: 'Broker Liaison',
                    name: this.isNullOrEmpty(
                      `${this.isNullOrEmpty(
                        property.details.BrokerLiaisonFirstName
                      )} ${this.isNullOrEmpty(
                        property.details.BrokerLiaisonLastName
                      )}`
                    ),
                    email: this.isNullOrEmpty(
                      property.details.BrokerLiaisonEmail
                    ),
                    phone: this.isNullOrEmpty(
                      property.details.BrokerLiaisonCellNumber
                    ),
                  },
                  {
                    role: 'Leasing Executive',
                    name: this.isNullOrEmpty(
                      `${property.details.LeasingExecutiveFirstName} ${property.details.LeasingExecutiveLastName}`
                    ),
                    email: this.isNullOrEmpty(
                      property.details.LeasingExecutiveEmail
                    ),
                    phone: this.isNullOrEmpty(
                      property.details.LeasingExecutiveCellNumber
                    ),
                  },
                ],
                units: [...property.units].map((unit: any) => {
                  return this.formatUnitDataSectorWise(unit, sector.name);
                }),
                featuresamenities: [...property.featuresamenities]
                  .filter(
                    (feature: any) =>
                      feature.Value != null &&
                      feature.Value != undefined &&
                      feature.Value != ''
                  )
                  .map((feature: any) => {
                    return {
                      ...feature,
                      Value: this.isNullOrEmpty(feature.Value),
                    };
                  }),
              };
            }),
          };
        }),
      };
    });
    this.excelService.exportVacancyScheduleExcel({
      title: `Redefine_Properties_${this.datePipe.transform(
        new Date(),
        'dd-MMM-yyyy'
      )}_${typeLabel}`,
      data: data.cities,
      description: data.vacancy_schedule_text,
    });
  }

  formatUnitDataSectorWise(data: any, sector: string) {
    switch (sector) {
      case SECTOR.OFFICE:
      case SECTOR.COMMERCIAL:
        return Object.keys(OFFICE_HEADER).reduce((accumulator, key, index) => {
          return {
            ...accumulator,
            [key]: this.isNullOrEmpty(
              key === 'AccessName' && data[key]?.toUpperCase() === 'OTHERS'
                ? data['AccessNoteOther']
                : this.formatData(data, key),
              key
            ),
          };
        }, {});
      case SECTOR.INDUSTRIAL:
        return Object.keys(INDUSTRIAL_HEADER).reduce(
          (accumulator, key, index) => {
            return {
              ...accumulator,
              [key]: this.isNullOrEmpty(
                key === 'AccessName' && data[key]?.toUpperCase() === 'OTHERS'
                  ? data['AccessNoteOther']
                  : data[key],
                key
              ),
            };
          },
          {}
        );
      case SECTOR.RETAIL:
        return Object.keys(RETAIL_HEADER).reduce((accumulator, key, index) => {
          return {
            ...accumulator,
            [key]: this.isNullOrEmpty(
              key === 'AccessName' && data[key]?.toUpperCase() === 'OTHERS'
                ? data['AccessNoteOther']
                : data[key],
              key
            ),
          };
        }, {});
      default:
        return Object.keys(OFFICE_HEADER).reduce((accumulator, key, index) => {
          return {
            ...accumulator,
            [key]: this.isNullOrEmpty(
              key === 'AccessName' && data[key]?.toUpperCase() === 'OTHERS'
                ? data['AccessNoteOther']
                : data[key]
            ),
          };
        }, {});
    }
  }

  formatData(data: any, key: string) {
    switch (key) {
      case 'TenantIncentive':
        if (data?.ThreeYearsLease && data.FiveYearsLease) {
          return 'Space 2 Spec';
        }
        return data[key];
      case 'TenentAllowance':
        if (data?.ThreeYearsLease && data.FiveYearsLease) {
          return `3 Years: ${data?.ThreeYearsLease} | 5 years:  ${data.FiveYearsLease}`;
        }
        return data[key];

      default:
        return data[key];
    }
  }

  isNullOrEmpty(data: any, type?: string): any {
    if (type && NUMBER_COLUMNS.includes(type)) {
      return data == undefined || data == null || data == '' ? 'N/A' : data;
    }
    return data == undefined || data == null || data == '' ? 'N/A' : data;
  }

  async goToUnitPreview(unitDetails: any) {
    let unit: any = {
      mode: undefined,
      id: unitDetails.PropertyUnitId,
    };
    await this.commonStoreService.setFormConfig(unit);
    this.router.navigate(['/admin/unit-preview']);
    // ,{ queryParams: {unitId: unitDetails.PropertyUnitId}});
  }

  searchFilter(search: any) {
    if (search === '' || search == undefined) {
      this.initialList =
        this.suburbList.length > 0
          ? this.searchList.filter((x: any) => x.Type == 'Suburb')
          : this.searchList.filter((x: any) => x.Type == 'City');
    } else {
      this.searchList = [
        ...new Map(
          unionBy(
            this.searchList,
            this.suburbList.length > 0 ? this.suburbList : this.cityList
          ).map((item: any) => [item['Id'], item])
        ).values(),
      ];
      this.initialList = this.searchList.filter((x: any) =>
        x.Name?.toLowerCase().includes(search?.toLowerCase())
      );
    }
  }

  clearFilterValue(): any {
    if (
      isEqual(
        omit(this.filter, ['PerPage', 'Map', 'PageNo', 'Type']),
        omit(this.initialFilter, ['PerPage', 'Map', 'PageNo', 'Type'])
      )
    ) {
      this.clear = false;
    } else {
      this.clear = true;
    }
  }

  getElementIndicatorByType(type: string) {
    switch (type) {
      case 'City':
        return 'c';
      case 'Province':
        return 'p';
      case 'Suburb':
        return 's';
      default:
        return '';
    }
  }

  sortByName(a: any, b: any) {
    var nameA = a.Name.toUpperCase(); // ignore upper and lowercase
    var nameB = b.Name.toUpperCase(); // ignore upper and lowercase
    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }

    // names must be equal
    return 0;
  }

  dropdownAction(event: Event): void {
    event.preventDefault();
    this.dropDownOpen = !this.dropDownOpen;
  }

  onDropDownOpen(event: Event) {
    this.listOpen = !this.listOpen;
    event.stopPropagation();
  }

  @HostListener('document:click', ['$event'])
  clickOutside(event: Event) {
    const clickedInside = (event.target as HTMLElement).closest('.downlod-btn-vacany');
    if (!clickedInside) {
      this.listOpen = false;
    }
  }

}
