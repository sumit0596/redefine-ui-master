import {
  AfterViewInit,
  Component,
  ContentChild,
  ElementRef,
  Input,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { LoaderService } from 'src/app/shared/services/loader/loader.service';
import { ToastrService } from 'ngx-toastr';
import {
  DASHBOARD_FILTER_TYPE,
  PROPERTY_GROUP_TYPE,
} from 'src/app/models/enum';
import { DashboardService } from 'src/app/admin/services/dashboard.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Observable, Subject, of, takeUntil } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { Options, LabelType } from '@angular-slider/ngx-slider';
import { groupBy, isEqual, omit, unionBy, uniq } from 'lodash-es';
import { IUnitFilter } from 'src/app/admin/models/interfaces';
import { FePropertiesService } from 'src/app/admin/services/fe-properties.service';
import { ROUTE } from 'src/app/models/constants';
import { EncryptionService } from 'src/app/services/encryption.service';
import { MarkerConfig } from 'src/app/interfaces/map';
import { SECTOR } from 'src/app/models/sector';
import { DecimalPipe } from '@angular/common';
import { valid } from 'node-html-parser';

interface ISearch {
  type: string;
  items: any[];
}

@Component({
  selector: 'rd-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss'],
})
export class GridComponent implements OnInit, AfterViewInit {
  //inputs for Property Type
  @Input() propertyType: any;

  userInfo: any;
  clear = false;
  pageIndex: any = 0;
  loadingCards!: any[];
  totalPropertiesCount: any;
  destroySubject: Subject<void> = new Subject<void>();
  listView = true;
  space2SpecCheck = false;
  encryptedFilters!: any;

  decryptedFilters!: any;
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
    GrossRentalStart: 0,
    GrossRentalEnd: 0,
    BrokerIncentivesStart: undefined,
    BrokerIncentivesEnd: undefined,
    HoldingCompanyId: '',
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

  intPropertysort$: Observable<any[]> = of([
    {
      Name: 'PropertyName',
      Id: 'Property Name',
    },
  ]);

  filterType = DASHBOARD_FILTER_TYPE;

  propertyUnits$: Observable<any> | undefined;
  propertyUnits: any;
  propertyUnitIds: any;

  internationalProperties$: Observable<any> | undefined;
  internationalProperties: any;

  SAProperties$: Observable<any> | undefined;
  SAProperties: any;

  allProperties: any[] = [];

  //for left filter
  sectorList!: any[]; // Sector
  attributeList: any;
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

  showSearchBar: boolean = false;
  showFilterIcon: boolean = false;
  zoomSize: number = 3;
  maxGrossRentaal: any;
  maxUnitSize: any;
  initialList!: any[];
  sectorList$!: Observable<any[]>;
  sectorData: any = [];
  attributeList$!: Observable<any>;
  attributeData: any = [];
  incentivesList$!: Observable<any>;
  incentiveData: any = [];
  esgFeatureList$: any;
  esgData: any = [];
  allFeatures: any;
  @ContentChild(TemplateRef) optionTemplate: TemplateRef<any> | undefined;
  @ContentChild(TemplateRef) labelTemplate: TemplateRef<any> | undefined;
  @ContentChild(TemplateRef) optionGroupTemplate!: TemplateRef<any>;
  minUnitSize: any;
  minGrossRental: any;

  clickedSearchIcon(event: Event) {
    this.showSearchBar = !this.showSearchBar;
  }

  clickedFilterIcon(event: Event) {
    this.showFilterIcon = !this.showFilterIcon;
  }

  //For size slider
  options: Options = {
    floor: 0,
    ceil: 10000000000,
    //step: 50,
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
  // For Gross Rental slider
  grossRentalOptions: Options = {
    floor: 0,
    ceil: 10000000000,
    //step: 50,
    showTicks: false,
    translate: (value: number, label: LabelType): any => {
      switch (label) {
        case LabelType.Low:
          return value + '';
        case LabelType.High:
          return value + '';
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

  // for Maps
  center!: google.maps.LatLngLiteral | any;
  zoom = 3;
  markerClusterer: boolean = false;
  markerPositions: any = [];
  markerList: MarkerConfig[] = [];
  icon = 'assets/images/attribute.png';
  holdingCompanyList: any;
  esgFeatureList!: any;
  url!: string;

  gMap!: google.maps.Map;
  map!: google.maps.Map;
  infoWindow!: google.maps.InfoWindow;

  constructor(
    private dashboardService: DashboardService,
    private feProperties: FePropertiesService,
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private loaderService: LoaderService,
    private toasterService: ToastrService,
    private encryptionService: EncryptionService,
    private deciamlPipe: DecimalPipe
  ) {
    this.route.queryParams.subscribe((params) => {
      if (params?.['f']) {
        const urlSafeFilters = params?.['f'];
        const encryptedFilters = decodeURIComponent(urlSafeFilters);
        // this.initialFilter = this.encryptionService.decrypt(encryptedFilters);
        this.filter = this.encryptionService.decrypt(encryptedFilters);
        if (this.filter.Space2Spec == 1) {
          this.space2SpecCheck = true;
        }
        this.selectedFilters(this.filter);
        // setTimeout(() => {
        //   document.getElementById('targetSearch')?.scrollIntoView({
        //     behavior: 'smooth',
        //     block: 'start',
        //     inline: 'nearest',
        //   });
        // }, 1000);
      }
    });
  }

  selectedFilters(filter: any) {
    if (filter) {
      this.decryptedFilters = filter;
    }
  }

  ngOnInit(): void {
    this.url = this.router.url;
    this.loadingCards = Array(this.initialFilter.PerPage).fill(
      this.initialFilter.PerPage
    );
    this.filter = this.initialFilter;
    this.filterForm = this.fb.group({
      Sectors: [],
      Attributes: [],
      sort: [null],
      Incentives: [],
      holdingCompanies: this.fb.array([]),
      grossRental: [[0, 10000000000]],
      size: [[0, 10000000000]],
      esgFeature: [],
      // subFeatures: this.fb.array([]),
    });
    this.getDropdown();
    this.getProperties();
  }

  ngAfterViewInit(): void {}

  getProperties() {
    // international properties
    if (this.listView == false) {
      this.resetMap();
      this.filter.Map = 1;
      this.filter.PerPage = 'all';
      if (this.decryptedFilters != undefined) {
        this.decryptedFilters.Map = 1;
        this.decryptedFilters.PerPage = 'all';
      }
    }
    if (this.propertyType == 2) {
      this.internationalProperties$ =
        this.feProperties.getAllFEInternationalProperties(
          this.getFilterObject()
        );
      this.internationalProperties$
        .pipe(takeUntil(this.destroySubject))
        .subscribe({
          next: (result: any) => {
            this.loaderService.hide();
            this.internationalProperties = result.properties;
            this.totalPropertiesCount = result.totalProperty;
            this.allProperties = result.properties;
            this.mapLocation(this.allProperties);
          },
          error: (error: any) => {
            this.loaderService.hide();
            error.error.errors
              ? this.displayError(error.error.errors)
              : this.toasterService.error(error.error.message);
          },
        });
    } else if (this.propertyType == 1) {
      this.SAProperties$ = this.feProperties.getAllFESouthAfricanProperties(
        this.getFilterObject()
      );
      this.SAProperties$.pipe(takeUntil(this.destroySubject)).subscribe({
        next: (result: any) => {
          this.loaderService.hide();
          this.SAProperties = result.properties;
          this.totalPropertiesCount = result.totalProperty;
          this.allProperties = result.properties;
          this.mapLocation(this.allProperties);
        },
        error: (error: any) => {
          this.loaderService.hide();
          error.error.errors
            ? this.displayError(error.error.errors)
            : this.toasterService.error(error.error.message);
        },
      });
    } else {
      this.propertyUnits$ = this.feProperties.getAllPropertyUnits(
        this.getFilterObject()
      );
      this.propertyUnits$.pipe(takeUntil(this.destroySubject)).subscribe({
        next: (result: any) => {
          this.loaderService.hide();
          this.propertyUnits = result.properties;
          this.totalPropertiesCount = result.totalProperty;
          this.propertyUnitIds = result.allunits;
          this.allProperties = [...result.properties].filter(
            (obj, index, self) =>
              index ===
              self.findIndex((t) => t.PropertyName === obj.PropertyName)
          );
          this.mapLocation(this.allProperties);
        },
        error: (error: any) => {
          this.loaderService.hide();
          error.error.errors
            ? this.displayError(error.error.errors)
            : this.toasterService.error(error.error.message);
        },
      });
    }
  }

  // groupByCountry(markerPositions: any, markerList: any) {
  //   for (var i = 0; i < markerPositions.length; i++) {
  //     markerPositions[i].setMap(null);
  //   }
  //   const countryMarker = groupBy(
  //     markerList,
  //     (property: any) => property.Country
  //   );
  //   Object.keys(countryMarker).forEach((x: any) => {
  //     this.markLocation(
  //       countryMarker[x][0],
  //       this.getIcons('Country'),
  //       countryMarker[x]?.length.toString()
  //     );
  //   });
  // }

  /**
   *
   * @param propertyUnits
   * @param key
   * @param groupType
   */
  mapLocation(
    propertyUnits: any[],
    key: string = 'Country',
    groupType: number = PROPERTY_GROUP_TYPE.COUNTRY
  ) {
    if (!this.listView) {
      if (this.propertyUnits?.length == 1) {
        this.zoom = 12;
      }
      this.markerPositions = this.groupByKey(propertyUnits, key);
      if (groupType === PROPERTY_GROUP_TYPE.SECTOR) {
        // this.markerClusterer = true;
        this.markerList = this.markerPositions.map((unit: any) => {
          return {
            type: groupType,
            title: unit.PropertyName,
            position: { lat: unit.Latitude, lng: unit.Longitude },
            style: {
              color: this.getSectorColor(unit.SectorName),
              height: '35',
              width: '35',
            },
            content: this.getInfoWindowContent(unit),
            data: unit,
          };
        });
      } else {
        this.markerList = Object.values(this.markerPositions).map(
          (units: any) => {
            if (units?.length == 1) {
              return {
                type: PROPERTY_GROUP_TYPE.SECTOR,
                ...this.getMarker(units),
              };
            }
            return {
              type: groupType,
              ...this.getMarker(units),
            };
          }
        );
      }
    }
  }
  resetMap() {
    this.zoom = 3;
  }
  /**
   *
   * @param unit
   * @returns
   */
  getInfoWindowContent(unit: any): string {
    return `
    <div class="map-info-container p-2 ">
      <div style="font-weight: 600;font-size: 15px;color:${this.getSectorColor(
        unit.SectorName
      )}">${unit.SectorName}</div>
      <div class="position-relative mt-2 mb-4">
        <div class="rd-heading rd-heading-xs">${unit.PropertyName}</div>
        <span class="rd-indicator rd-indicator-sm">
        <span class="rd-indicator-content rd-indicator-primary"></span>
        </span>
      </div>
      <div>
        <div class="mb-2">
          <small class="rd-text-grey-mid">${unit.Province}, ${unit.City}</small>
        </div>
        <div class="d-flex flex-wrap gap-2">
          <small class="rd-text-grey-mid">Lat: ${unit.Latitude}</small>
          <small class="rd-text-grey-mid">Lng: ${unit.Longitude}</small>
        </div>
      </div>
      <div class="d-flex justify-content-end mt-2 ">
        <button class="rd-btn rd-btn-text rd-btn-sm w-auto">View Details</button>
      </div>
    </div>
    `;
  }

  /**
   *
   * @param units
   * @returns
   */
  getMarker(units: any[]): MarkerConfig {
    if (units?.length && units?.length < 2) {
      return {
        title: units[0].PropertyName,
        position: { lat: units[0].Latitude, lng: units[0].Longitude },
        style: {
          color: this.getSectorColor(units[0].SectorName),
          height: '35',
          width: '35',
        },
        content: this.getInfoWindowContent(units[0]),
        data: units[0],
      };
    } else if (units?.length > 1) {
      return {
        count: units.length,
        data: units,
        style: {
          height: '40',
          width: '40',
        },
        position: this.calculateCentroid(
          units.map((unit: any) => {
            return { lat: unit.Latitude, lng: unit.Longitude };
          })
        ),
      };
    } else {
      return {
        position: this.center,
      };
    }
  }
  /**
   *
   * @param event
   */
  onMarkerClick(event: any) {
    switch (event.markerInfo.type) {
      case PROPERTY_GROUP_TYPE.COUNTRY:
        this.zoom = 5;
        this.mapLocation(
          this.allProperties,
          'Province',
          PROPERTY_GROUP_TYPE.PROVINCE
        );
        this.center = event.position;
        break;
      case PROPERTY_GROUP_TYPE.PROVINCE:
        this.zoom = 8;
        this.mapLocation(this.allProperties, 'City', PROPERTY_GROUP_TYPE.CITY);
        this.center = event.position;
        break;
      case PROPERTY_GROUP_TYPE.CITY:
        this.zoom = 12;
        this.mapLocation(this.allProperties, '', PROPERTY_GROUP_TYPE.SECTOR);
        this.center = event.position;
        break;
      case PROPERTY_GROUP_TYPE.SECTOR:
        break;
      default:
        break;
    }
    this.center = event.position;
  }
  /**
   *
   * @param event
   */
  onInfoWindowClick(event: any) {
    this.propertyDetails(event.data);
  }
  /**
   *
   * @param zoom
   */
  zoomChangeEvent(event: any) {
    if (event.zoom && event.zoom !== this.zoom) {
      if (event.zoom <= 3) {
        this.mapLocation(
          this.allProperties,
          'Country',
          PROPERTY_GROUP_TYPE.COUNTRY
        );
      } else if (event.zoom == 4) {
        this.mapLocation(
          this.allProperties,
          'Province',
          PROPERTY_GROUP_TYPE.PROVINCE
        );
      } else if (event.zoom > 5 && event.zoom < 8) {
        this.mapLocation(this.allProperties, 'City', PROPERTY_GROUP_TYPE.CITY);
      } else if (event.zoom > 9) {
        this.mapLocation(this.allProperties, '', PROPERTY_GROUP_TYPE.SECTOR);
      }
    } else {
    }
    if (this.zoom !== event.zoom) {
      // this.zoom = event.zoom;
    }
    // this.center = event.position;
  }
  /**
   * Groups the data based on the specified type.
   *
   * This method organizes the input data into groups according to the provided type parameter.
   * If the type is not specified or is null, the method will default to returning the data in its
   * original, ungrouped format. This is useful for handling data dynamically based on optional
   * grouping criteria.
   *
   * @param data The collection of data to be grouped.
   * @param key The type parameter used for grouping the data. If this is null or not provided,
   *             the original data is returned without any grouping.
   * @return The grouped data if a valid type is provided; otherwise, returns the original data.
   */
  groupByKey(data: any[], key: string) {
    if (data?.length && key) {
      return groupBy(data, (property: any) => property[key]);
    }
    return data;
  }
  /**
   *
   * @param positions
   * @returns
   */
  calculateCentroid(positions: any[]): google.maps.LatLngLiteral {
    let center = {
      lat: parseFloat(positions[0].lat),
      lng: parseFloat(positions[0].lng),
    };
    // let sumLat = 0;
    // let sumLng = 0;

    // positions.forEach((pos) => {
    //   sumLat += parseFloat(pos.lat);
    //   sumLng += parseFloat(pos.lng);
    // });

    // const count = positions.length;
    // this.center = {
    //   lat: sumLat / count,
    //   lng: sumLng / count,
    // };
    return center;
  }
  getSectorColor(sector: string | any) {
    switch (sector.toUpperCase()) {
      case SECTOR.OFFICE.toUpperCase():
      case SECTOR.COMMERCIAL.toUpperCase():
        return '#017D67';
      case SECTOR.INDUSTRIAL.toUpperCase():
        return '#5C676D';
      case SECTOR.RETAIL.toUpperCase():
        return '#004B6A';
      case SECTOR.SPECIALISED.toUpperCase():
      case SECTOR.OTHER_SPACES.toUpperCase():
        return '#555d8b';
      default:
        return '#017D67';
    }
  }
  // markLocation(unit: any, icon: string, count: any) {
  //   this.center = {
  //     lat: parseFloat(unit.Latitude),
  //     lng: parseFloat(unit.Longitude),
  //   };

  //   const newMarker = {
  //     lat: parseFloat(unit.Latitude),
  //     lng: parseFloat(unit.Longitude),
  //   };

  //   const markerDetails = new google.maps.Marker({
  //     position: new google.maps.LatLng(newMarker.lat, newMarker.lng),
  //     map: this.map,
  //     draggable: false,
  //     icon: icon,
  //     label: {
  //       color: '#000',
  //       fontSize: '9px',
  //       fontWeight: '600',
  //       className: 'marker-label',
  //       text: count,
  //     },
  //     title: unit.PropertyName,
  //   });

  //   this.markerPositions.push(markerDetails);

  //   const self = this;
  //   markerDetails.addListener('click', function (marker: any, i: any) {
  //     if (self.map.getZoom() == 3) {
  //       self.map.setZoom(4);
  //     } else if (self.map.getZoom() == 4) {
  //       self.map.setZoom(5);
  //     } else if (self.map.getZoom() == 5) {
  //       self.map.setZoom(6);
  //     } else if (self.map.getZoom() == 6) {
  //       self.map.setZoom(7);
  //     } else if (self.map.getZoom() == 7) {
  //       self.map.setZoom(8);
  //     } else if (self.map.getZoom() == 8) {
  //       self.map.setZoom(9);
  //     }
  //     if (self.zoomSize >= 9) {
  //       self.infoWindow?.close();
  //       const contentString = `
  //   <div class="map-info-container" style="width: 250px">
  //     <p class="rd-text-grey-mid mb-1">${unit.PropertyName}</p>
  //     <div class="mt-2" style="width : 250px; height: 3px; background-color:#ce171e;"></div>
  //     <h4 class="rd-heading rd-heading-sm">${unit.Province}, ${unit.City}</h4>
  //     <button class="details-button" style="float:right" onMouseOut="this.style.color='#000000'" onMouseOver="this.style.color='#e6001c'" id="btn-click">View Details
  //     </button>
  //   </div>
  //   `;
  //       self.infoWindow = new google.maps.InfoWindow({
  //         content: contentString,
  //       });
  //       // marker.setAnimation(google.maps.Animation.BOUNCE);
  //       self.infoWindow.open(markerDetails.getMap(), markerDetails);
  //       google.maps.event.addListener(self.infoWindow, 'domready', function () {
  //         document
  //           .getElementsByClassName('details-button')[0]
  //           .addEventListener('click', function details() {
  //             self.propertyDetails(unit);
  //           });
  //       });
  //     }
  //   });
  // }

  getPropertyList() {
    if (this.propertyType == 1) {
      return this.SAProperties;
    } else if (this.propertyType == 2) {
      return this.internationalProperties;
    } else if (this.propertyType == 'need-space') {
      return this.propertyUnits;
    }
  }

  onSliderChange(event: any, type: string) {
    this.updateFilter(event, type);
  }

  getDropdown() {
    let type;
    if (this.propertyType == 'need-space') {
      type = 2;
    } else if (this.propertyType == 1) {
      type = 1;
    } else if (this.propertyType == 2) {
      type = 3;
    }
    this.getGrossrentalmax(type);
    this.dashboardService
      .getPropTypeDropdown(this.propertyType)
      .pipe(takeUntil(this.destroySubject))
      .subscribe({
        next: (result: any) => {
          this.sectorList = result.data;
          this.sectorList$ = of(this.sectorList);
          const currentFilter = this.decryptedFilters ?? this.filter;
          if (currentFilter?.SectorId != '') {
            const filteredSectors =
              currentFilter?.SectorId?.split(',').map(Number);
            this.filterForm.get('Sectors')?.setValue(filteredSectors);
            this.clearFilterValue();
          }
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
          this.attributeList = [...result.data]?.map((d: any) => {
            return { ...d, Name: d.Title };
          });
          this.attributeList$ = of(this.attributeList);
          const currentFilter = this.decryptedFilters ?? this.filter;
          if (currentFilter?.Attributes != '') {
            const filteredAttributes =
              currentFilter?.Attributes?.split(',').map(Number);
            this.clearFilterValue();
          }
          if (!this.attributeList || this.attributeList.length == 0) {
            this.filterForm.get('Attributes')?.disable();
          }
        },
        error: (error: any) => {
          error.error.errors
            ? this.displayError(error.error.errors)
            : this.toasterService.error(error.error.message);
        },
      });
    this.dashboardService
      .getPropertyIncentiveDropdown(1)
      .pipe(takeUntil(this.destroySubject))
      .subscribe({
        next: (result: any) => {
          this.incentiveList = result.data?.map((obj: any) => ({
            ...obj,
            Name: obj.Title,
          }));
          this.incentivesList$ = of(this.incentiveList);
          const currentFilter = this.decryptedFilters ?? this.filter;
          if (currentFilter?.Incentives != '') {
            const filteredIncentives =
              currentFilter?.Incentives?.split(',').map(Number);
            this.filterForm.get('Incentives')?.setValue(filteredIncentives);
            this.clearFilterValue();
          }
          if (!this.incentiveList || this.incentiveList.length == 0) {
            this.filterForm.get('Incentives')?.disable();
          }
        },
        error: (error: any) => {
          error.error.errors
            ? this.displayError(error.error.errors)
            : this.toasterService.error(error.error.message);
        },
      });
    this.feProperties
      .getESGDropdown()
      .pipe(takeUntil(this.destroySubject))
      .subscribe({
        next: (result: any) => {
          this.esgFeatureList = result?.data.map((obj: any) => ({
            ...obj,
            Name: obj.name,
          }));
          this.esgFeatureList.forEach((x: any, index: number) => {
            x.features.forEach((y: any) => {
              y['Feature'] = x.Name;
              y['FeatureId'] = index;
            });
            delete x.Name;
            delete x.name;
          });

          const features = this.esgFeatureList.map((z: any) => z.features);
          this.allFeatures = features.flat(1);
          this.esgFeatureList$ = of(this.allFeatures);
          if (currentFilter?.EsgFeatures != '') {
            const filteredEsgFeatures =
              currentFilter?.EsgFeatures?.split(',').map(Number);
            this.filterForm.get('esgFeature')?.setValue(filteredEsgFeatures);
            this.clearFilterValue();
          }
          if (!this.allFeatures || this.allFeatures.length === 0) {
            this.filterForm.get('esgFeature')?.disable();
          }
        },
        error: (error: any) => {
          error.error.errors
            ? this.displayError(error.error.errors)
            : this.toasterService.error(error.error.message);
        },
      });
    const currentFilter = this.decryptedFilters ?? this.filter;
    this.filterForm.patchValue({
      grossRental: [
        currentFilter.GrossRentalStart ? currentFilter.GrossRentalStart : 0,
        currentFilter.GrossRentalEnd
          ? currentFilter.GrossRentalEnd
          : 10000000000,
      ],
    });

    this.filterForm.patchValue({
      size: [
        currentFilter.SizeStart ? currentFilter.SizeStart : 0,
        currentFilter.SizeEnd ? currentFilter.SizeEnd : 10000000000,
      ],
    });
    this.clearFilterValue();
    this.getProvinces();
    this.getCity();
    this.getSuburb();
  }

  async getProvinces() {
    const currentFilter = this.decryptedFilters;
    const filteredProvinces = currentFilter?.ProvinceId?.split(',');
    // provinces for International
    if (this.propertyType == 2) {
      (await this.feProperties.getProvinces(this.propertyType))
        .pipe(takeUntil(this.destroySubject))
        .subscribe({
          next: (res: any) => {
            this.provinceList = [...res].map((province: any) => {
              return { ...province, Type: 'Province', Id: 'p' + province.Id };
            });
            this.provinceList$ = of(this.provinceList);

            this.searchData = [
              ...this.searchData,
              ...this.provinceList.filter((p: any) =>
                filteredProvinces?.includes(
                  p.Id?.replace(
                    this.getElementIndicatorByType(p?.Type),
                    ''
                  )?.toString()
                )
              ),
            ];

            this.searchData = [
              ...new Map(
                this.searchData.map((item: any) => [item['Id'], item])
              ).values(),
            ];

            this.searchList = unionBy(this.searchList, this.provinceList);
          },
          error: (error: any) => {
            error.error.errors
              ? this.displayError(error.error.errors)
              : this.toasterService.error(error.error.message);
          },
        });
    } else {
      (await this.feProperties.getSAProvinces(1))
        .pipe(takeUntil(this.destroySubject))
        .subscribe({
          next: (res: any) => {
            this.provinceList = [...res].map((province: any) => {
              return { ...province, Type: 'Province', Id: 'p' + province.Id };
            });
            this.provinceList$ = of(this.provinceList);
            this.searchData = [
              ...this.searchData,
              ...this.provinceList.filter((p: any) =>
                filteredProvinces?.includes(
                  p.Id?.replace(
                    this.getElementIndicatorByType(p?.Type),
                    ''
                  )?.toString()
                )
              ),
            ];

            this.searchData = [
              ...new Map(
                this.searchData.map((item: any) => [item['Id'], item])
              ).values(),
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
  }

  async getCity() {
    // this.cityList = [];
    // this.initialList = [];
    const currentFilter = this.decryptedFilters;
    const filteredCities = currentFilter?.CityId?.split(',');
    // cities for International
    if (this.propertyType == 2) {
      (await this.feProperties.getCityInternational(this.propertyType))
        .pipe(takeUntil(this.destroySubject))
        .subscribe({
          next: (res: any) => {
            this.cityList = [...res].map((city: any) => {
              return { ...city, Type: 'City', Id: 'c' + city.Id };
            });
            this.cityList$ = of(this.cityList);
            // this.initialList = this.cityList;
            this.searchData = [
              ...this.searchData,
              ...this.cityList.filter((x) =>
                filteredCities?.includes(
                  x.Id?.replace(
                    this.getElementIndicatorByType(x?.Type),
                    ''
                  )?.toString()
                )
              ),
            ];

            this.searchData = [
              ...new Map(
                this.searchData.map((item: any) => [item['Id'], item])
              ).values(),
            ];

            this.searchList = unionBy(this.searchList, this.cityList);
          },
          complete: () => {},
          error: (error: any) => {
            error.error.errors
              ? this.displayError(error.error.errors)
              : this.toasterService.error(error.error.message);
          },
        });
    } else {
      (await this.feProperties.getSACities(1))
        .pipe(takeUntil(this.destroySubject))
        .subscribe({
          next: (res: any) => {
            this.cityList = [...res].map((city: any) => {
              return { ...city, Type: 'City', Id: 'c' + city.Id };
            });
            this.cityList$ = of(this.cityList);
            // this.initialList = this.cityList;
            this.searchData = [
              ...this.searchData,
              ...this.cityList.filter((x) =>
                filteredCities?.includes(
                  x.Id?.replace(
                    this.getElementIndicatorByType(x?.Type),
                    ''
                  )?.toString()
                )
              ),
            ];
            this.searchData = [
              ...new Map(
                this.searchData.map((item: any) => [item['Id'], item])
              ).values(),
            ];

            this.searchList = unionBy(this.searchList, this.cityList);
          },
          complete: () => {},
          error: (error: any) => {
            error.error.errors
              ? this.displayError(error.error.errors)
              : this.toasterService.error(error.error.message);
          },
        });
    }
  }

  async getSuburb() {
    this.initialList = [];
    const currentFilter = this.decryptedFilters;
    const filteredSuburbs = currentFilter?.SuburbId?.split(',');
    // suburb for International
    if (this.propertyType == 2) {
      (await this.feProperties.getSuburbInternational(this.propertyType))
        .pipe(takeUntil(this.destroySubject))
        .subscribe({
          next: (res: any) => {
            this.suburbList = [...res].map((suburb: any) => {
              return { ...suburb, Type: 'Suburb', Id: 's' + suburb.Id };
            });
            this.suburbList$ = of(this.suburbList.sort(this.sortByName));

            this.initialList =
              this.suburbList.length > 0 ? this.suburbList : this.cityList;

            this.searchData = [
              ...this.searchData,
              ...this.suburbList.filter((x) =>
                filteredSuburbs?.includes(
                  x.Id?.replace(
                    this.getElementIndicatorByType(x?.Type),
                    ''
                  )?.toString()
                )
              ),
            ];

            this.searchData = [
              ...new Map(
                this.searchData.map((item: any) => [item['Id'], item])
              ).values(),
            ];

            this.searchList = unionBy(this.searchList, this.suburbList);
          },
          error: (error: any) => {
            error.error.errors
              ? this.displayError(error.error.errors)
              : this.toasterService.error(error.error.message);
          },
        });
    } else {
      (await this.feProperties.getSASuburb(1))
        .pipe(takeUntil(this.destroySubject))
        .subscribe({
          next: (res: any) => {
            this.suburbList = [...res].map((suburb: any) => {
              return { ...suburb, Type: 'Suburb', Id: 's' + suburb.Id };
            });
            this.suburbList$ = of(this.suburbList.sort(this.sortByName));

            this.initialList =
              this.suburbList.length > 0 ? this.suburbList : this.cityList;

            this.searchData = [
              ...this.searchData,
              ...this.suburbList.filter((x) =>
                filteredSuburbs?.includes(
                  x.Id?.replace(
                    this.getElementIndicatorByType(x?.Type),
                    ''
                  )?.toString()
                )
              ),
            ];

            this.searchData = [
              ...new Map(
                this.searchData.map((item: any) => [item['Id'], item])
              ).values(),
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
  }

  onSearchSelect(event: any) {
    this.searchData = [...this.searchData, event];
    this.updateFilter(this.searchData, 'Search');
  }

  onSearchDeSelect(event: any) {
    this.searchData = this.searchData.filter(
      (d: any) => !(d.Id === event.Id && d.Type === event.Type)
    );
    this.initialList =
      this.suburbList.length > 0 ? this.suburbList : this.cityList;
    this.updateFilter(this.searchData, 'Search');
  }

  onClearSearch() {
    this.searchData = [];
    this.initialList =
      this.suburbList.length > 0 ? this.suburbList : this.cityList;
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
    this.filter = this.decryptedFilters = {
      ...this.filter,
      ...this.decryptedFilters,
      PageNo: 1,
      SortBy: event.Name,
      SortOrder: 'Asc',
    };
    this.getProperties();
  }

  // RIGHT SIDE FILTER METHODS
  onSectorSelect(event: any) {
    this.sectorData = [];
    this.decryptedSectors();
    this.sectorData.push(event);
    this.updateFilter(this.sectorData, 'Sector');
  }
  onSectorDeSelect(event: any) {
    this.decryptedSectors();
    this.sectorData = this.sectorData.filter(
      (sector: any) => !(sector.Id === event.Id && sector.Name === event.Name)
    );
    this.updateFilter(this.sectorData, 'Sector');
  }

  onSectorClear(event?: any) {
    this.sectorData = [];
    this.updateFilter(this.sectorData, 'Sector');
  }

  // Attribute dropdown
  onAttributeSelect(event: any) {
    this.attributeData = [];
    this.decryptedAttributes();
    this.attributeData.push(event);
    this.updateFilter(this.attributeData, 'Attribute');
  }
  onAttributeDeSelect(event: any) {
    this.decryptedAttributes();
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
    // if(event.Name == 'Space2Spec'){
    //   this.updateFilter(1, 'Space2Spec');
    // }
    // else{
    this.incentiveData = [];
    this.decryptedIncentives();
    this.incentiveData.push(event);
    this.updateFilter(this.incentiveData, 'Incentive');
    // }
  }
  onIncentivesDeSelect(event: any) {
    // if(event.Name == 'Space2Spec'){
    //   this.updateFilter(0, 'Space2Spec');
    // }
    // else{
    this.decryptedIncentives();
    this.incentiveData = this.incentiveData.filter(
      (incentive: any) =>
        !(incentive.Id === event.Id && incentive.Name === event.Name)
    );
    this.updateFilter(this.incentiveData, 'Incentive');
    // }
  }

  onIncentivesClear(event?: any) {
    this.incentiveData = [];
    // this.filter.Space2Spec = 0;
    this.updateFilter(this.incentiveData, 'Incentive');
  }

  //esg dropdown
  onEsgSelect(event: any) {
    this.esgData = event;
    this.updateFilter(this.esgData, 'EsgFeature');
  }
  onEsgDeSelect(event: any) {
    this.esgData = this.esgData.filter(
      (esg: any) =>
        !(esg.EsgFeaturesId === event.EsgFeaturesId && esg.Name === event.Name)
    );
    this.updateFilter(this.esgData, 'EsgFeature');
  }

  onEsgClear() {
    this.esgData = [];
    this.updateFilter(this.esgData, 'EsgFeature');
  }

  onSpace2SpecCheck(event: any) {
    if (event.target.checked) {
      this.space2SpecCheck = true;
      this.updateFilter(1, 'Space2Spec');
    } else {
      this.space2SpecCheck = false;
      this.updateFilter(0, 'Space2Spec');
    }
  }

  updateFilter(data: any, type: any) {
    this.filter = this.decryptedFilters = {
      ...this.filter,
      ...this.decryptedFilters,
      PageNo: 1,
    };
    this.filter.BrokerIncentivesEnd =
      this.filter.BrokerIncentivesEnd ?? undefined;
    this.filter.BrokerIncentivesStart =
      this.filter.BrokerIncentivesStart ?? undefined;
    ///const basicFilter = this.initialFilter;
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
        data = [...new Set(data.map((item: any) => item))];
        this.filter = this.decryptedFilters = {
          ...this.filter,
          ...this.decryptedFilters,
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
        this.filter = this.decryptedFilters = {
          ...this.filter,
          ...this.decryptedFilters,
          ProvinceId: data
            .filter((d: any) => d.Type === 'Province')
            .map((d: any) =>
              d.Id.replace(this.getElementIndicatorByType(d?.Type), '')
            )
            .toString(),
        };
        break;
      case 'City':
        this.filter = this.decryptedFilters = {
          ...this.filter,
          ...this.decryptedFilters,
          CityId: data
            .filter((d: any) => d.Type === 'City')
            .map((d: any) =>
              d.Id.replace(this.getElementIndicatorByType(d?.Type), '')
            )
            .toString(),
        };
        break;
      case 'Suburb':
        this.filter = this.decryptedFilters = {
          ...this.filter,
          ...this.decryptedFilters,
          SuburbId: data
            .filter((d: any) => d.Type === 'Suburb')
            .map((d: any) =>
              d.Id.replace(this.getElementIndicatorByType(d?.Type), '')
            )
            .toString(),
        };
        break;
      case 'Sector':
        this.filter = this.decryptedFilters = {
          ...this.filter,
          ...this.decryptedFilters,
          SectorId: data.map((d: any) => d.Id).toString(),
        };
        break;
      case 'Attribute':
        this.filter = this.decryptedFilters = {
          ...this.filter,
          ...this.decryptedFilters,
          Attributes: data.map((d: any) => d.Id).toString(),
        };
        break;
      case 'Incentive':
        this.filter = this.decryptedFilters = {
          ...this.filter,
          ...this.decryptedFilters,
          Incentives: data.map((d: any) => d.Id).toString(),
        };
        break;
      case 'Size':
        this.filter = this.decryptedFilters = {
          ...this.filter,
          ...this.decryptedFilters,
          SizeStart: data.value,
          SizeEnd: data.highValue,
        };
        break;
      case 'GrossRental':
        this.filter = this.decryptedFilters = {
          ...this.filter,
          ...this.decryptedFilters,
          GrossRentalStart: data.value,
          GrossRentalEnd: data.highValue,
        };
        break;
      case 'HoldingCompany':
        this.filter = this.decryptedFilters = {
          ...this.filter,
          ...this.decryptedFilters,
          HoldingCompanyId: data.filter((d: any) => d).toString(),
        };
        break;
      case 'EsgFeature':
        this.filter = this.decryptedFilters = {
          ...this.filter,
          ...this.decryptedFilters,
          EsgFeatures: data.map((d: any) => d.EsgFeaturesId).toString(),
        };
        break;
      case 'Space2Spec':
        this.filter = this.decryptedFilters = {
          ...this.filter,
          ...this.decryptedFilters,
          Space2Spec: data,
        };
        break;
      default:
        break;
    }
    this.encryptedFilters = this.encryptionService.encrypt(this.filter);
    this.clearFilterValue();
    this.getProperties();
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: this.isFilterEqual() ? null : { f: this.encryptedFilters },
      queryParamsHandling: this.isFilterEqual() ? null : 'merge', // This will merge new filters with existing query params
    });
  }

  isFilterEqual() {
    return isEqual(
      omit(this.filter, ['PerPage', 'Map', 'PageNo', 'Type']),
      omit(this.initialFilter, ['PerPage', 'Map', 'PageNo', 'Type'])
    );
  }

  paginate(event: any): void {
    // this.updateFilter(event, 'Paginate');
    this.pageIndex = event.pageIndex;
    this.filter = this.decryptedFilters = {
      ...this.filter,
      ...this.decryptedFilters,
      PageNo: event.pageIndex + 1,
      PerPage: event.pageSize,
    };
    this.getProperties();
    window.scrollTo(0, 200);
  }

  isAllCheck(data: any[]) {
    return data.every((d: any) => d.completed);
  }

  clearFilter() {
    this.filterForm.reset({
      Sectors: [],
      grossRental: [this.minGrossRental, this.maxGrossRentaal],
      size: [
        this.minUnitSize.toString().includes(',')
          ? parseInt(this.minUnitSize?.replace(/,/g, ''))
          : this.minUnitSize,
        this.maxUnitSize.toString().includes(',')
          ? parseInt(this.maxUnitSize?.replace(/,/g, ''))
          : this.maxUnitSize,
      ],
    });
    this.filter = { ...this.initialFilter };
    this.searchData = [];
    this.space2SpecCheck = false;
    this.decryptedFilters = { ...this.initialFilter };
    //this.route.queryParams = null;
    this.router.navigate([], { queryParams: {} });
    this.getProperties();
    this.clear = false;
  }

  isExists(data: any[], value: any, key: string): boolean {
    return data.some((d: any) => d[key] === value);
  }

  preview(event: any) {
    if (this.propertyType == 2) {
      this.router.navigate([
        ROUTE.FRONTEND_INTERNATIONAL_PROPERTY_DETAILS,
        event.Slug,
      ]);
      this.feProperties.setDefaultTab(0);
    } else if (this.propertyType == 1) {
      this.router.navigate([ROUTE.FRONTEND_SA_PROPERTIES, event.Slug]);
      this.feProperties.setDefaultTab(0);
    } else {
      let tab = 1
      this.router.navigate([ROUTE.NEED_SPACE, event.Slug]
        , { queryParams: { tab: tab } });
      this.feProperties.setDefaultTab(1);
    }
  }

  onSwitchToggle(event: any) {
    this.getFilterObject();
    if (event.checked) {
      this.listView = false;
      this.markerPositions = [];
      this.markerList = [];
      this.filter.PerPage = 'all';
      if (this.decryptedFilters != undefined) {
        this.decryptedFilters.PerPage = 'all';
      }
      this.getProperties();
    } else {
      this.zoom = 3;
      this.listView = true;
      this.filter.PerPage = 12;
      if (this.decryptedFilters != undefined) {
        this.decryptedFilters.PerPage = 12;
      }
      this.getProperties();
    }
  }

  displayError(error: any) {
    let errors = JSON.parse(error);
    Object.keys(errors).forEach((err: any) => {
      this.toasterService.error(errors[err][0]);
    });
  }

  getPlaceHolder(): any {
    if (this.propertyType == 2) {
      return 'Search for suburb, city or state';
    } else {
      return 'Search for suburb, city or province';
    }
  }
  // getIcons(sector: any): any {
  //   switch (sector) {
  //     case 'Industrial':
  //       return {
  //         url: '/assets/images/industrial_map_marker.svg',
  //       };
  //     case 'Retail':
  //       return {
  //         url: '/assets/images/retail_map_marker.svg',
  //       };
  //     case 'Office':
  //       return {
  //         url: '/assets/images/office_map_marker.svg',
  //         //  scaledSize: new google.maps.Size(50, 50)
  //       };
  //     case 'Other Spaces':
  //       return {
  //         url: '/assets/images/otherspaces_map_marker.svg',
  //         // scaledSize: new google.maps.Size(50, 50)
  //       };
  //     case 'Country':
  //       return {
  //         url: '/assets/images/all_map_marker.svg',
  //         // labelOrigin: new google.maps.Point(30, 25)
  //         labelOrigin: new google.maps.Point(25, 22),
  //       };
  //   }
  // }

  getFilterObject() {
    return this.isFilterEqual() && this.decryptedFilters
      ? this.decryptedFilters
      : this.filter;
  }

  propertyDetails(unit: any) {
    this.preview(unit);
  }

  spaceSpecPage() {
    this.router.navigate(['/space-2-spec']);
  }

  getGrossrentalmax(type: any) {
    this.feProperties.getGrossRentalMax(type).subscribe((res) => {
      if (res.MaxGrossRental != undefined) {
        this.maxGrossRentaal = res?.MaxGrossRental;
        this.minGrossRental = res?.MINGrossRental;
        this.grossRentalOptions = {
          floor: this.minGrossRental,
          ceil: this.maxGrossRentaal,
          //step: 50,
          showTicks: false,
          translate: (value: number, label: LabelType): any => {
            switch (label) {
              case LabelType.Low:
                return (
                  this.deciamlPipe.transform(value)?.replaceAll(',', ' ') + ' '
                );
              case LabelType.High:
                return (
                  this.deciamlPipe.transform(value)?.replaceAll(',', ' ') + ' '
                );
              default:
                return '';
            }
          },
        };
      }
      if (res.MaxUnitSize != undefined) {
        this.maxUnitSize = res?.MaxUnitSize;
        this.minUnitSize = res?.MINUnitSize;
        this.options = {
          floor: this.minUnitSize,
          ceil: this.maxUnitSize,
          //step: 50,
          showTicks: false,
          translate: (value: number, label: LabelType): any => {
            switch (label) {
              case LabelType.Low:
                return (
                  this.deciamlPipe.transform(value)?.replaceAll(',', ' ') + ' '
                );
              case LabelType.High:
                return (
                  this.deciamlPipe.transform(value)?.replaceAll(',', ' ') + ' '
                );
              default:
                return '';
            }
          },
        };
      }
      if (res.MaxGla != undefined) {
        this.maxUnitSize = res?.MaxGla;
        this.minUnitSize = res?.MinGla;
        this.options = {
          floor: res?.MinGla,
          //ceil: parseInt(res?.MaxGla?.replace(/,/g, '')),
          ceil: res?.MaxGla,
          //step: 50,
          showTicks: false,
          translate: (value: number, label: LabelType): any => {
            switch (label) {
              case LabelType.Low:
                return (
                  this.deciamlPipe.transform(value)?.replaceAll(',', ' ') + ' '
                );
              case LabelType.High:
                return (
                  this.deciamlPipe.transform(value)?.replaceAll(',', ' ') + ' '
                );
              default:
                return '';
            }
          },
        };
      }
    });
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
      (this.decryptedFilters &&
        isEqual(omit(this.decryptedFilters,['PerPage', 'Map', 'PageNo', 'Type']), omit(this.initialFilter,['PerPage', 'Map', 'PageNo', 'Type']))) ||
      (!this.decryptedFilters && isEqual(this.filter, this.initialFilter))
    ) {
      this.clear = false;
    } else {
      this.clear = true;
    }
 
}

  decryptedSectors() {
    if (this.decryptedFilters && this.decryptedFilters.SectorId) {
      const sectors = this.decryptedFilters.SectorId.split(',');
      this.sectorList.map((x) => {
        sectors.map((y: any) => {
          if (y == x.Id.toString()) {
            this.sectorData.push(x);
          }
        });
      });
    }
  }

  decryptedAttributes() {
    if (this.decryptedFilters && this.decryptedFilters.Attributes) {
      const attributes = this.decryptedFilters.Attributes.split(',');
      this.attributeList.map((x: any) => {
        attributes.map((y: any) => {
          if (y == x.Id.toString()) {
            this.attributeData.push(x);
          }
        });
      });
    }
  }

  decryptedIncentives() {
    if (this.decryptedFilters && this.decryptedFilters.Incentives) {
      const incentives = this.decryptedFilters.Incentives.split(',');
      this.incentiveList.map((x: any) => {
        incentives.map((y: any) => {
          if (y == x.Id.toString()) {
            this.incentiveData.push(x);
          }
        });
      });
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
}
