import {
  Component,
  ElementRef,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { UnitPreviewService } from 'src/app/admin/services/unit-preview.service';
import { UnitService } from 'src/app/admin/services/unit.service';
import { CONSTANTS, FEATURE_AMENITIES, ROUTE } from 'src/app/models/constants';
import { EnquiryDialogComponent } from '../enquiry-dialog/enquiry-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { FePropertiesService } from 'src/app/admin/services/fe-properties.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { CarouselDialogComponent } from '../carousel-dialog/carousel-dialog.component';
import { Observable, map } from 'rxjs';
import { PROPERTY_FILE_UPLOADS, SECTOR_TYPES } from 'src/app/models/enum';
import { CommonStoreService } from 'src/app/services/common-store.service';
import { BreadcrumbsComponent } from '../breadcrumbs/breadcrumbs.component';
import { MatTabsModule } from '@angular/material/tabs';
import { CommonModule } from '@angular/common';
import { MatDividerModule } from '@angular/material/divider';
import { RatingComponent } from 'src/app/shared/components/rating/rating.component';
import { FeaturedPropertiesCarouselComponent } from '../featured-properties-carousel/featured-properties-carousel.component';
import { SharedModule } from 'src/app/shared/shared.module';
import * as fs from 'file-saver-es';
import { MapModule } from 'src/app/shared/modules/map/map.module';
import { MarkerConfig } from 'src/app/interfaces/map';
import { CommonService } from 'src/app/shared/services/common.service';
@Component({
  selector: 'app-property-details',
  standalone: true,
  templateUrl: './property-details.component.html',
  styleUrls: ['./property-details.component.scss'],
  imports: [
    CommonModule,
    BreadcrumbsComponent,
    RatingComponent,
    FeaturedPropertiesCarouselComponent,
    SharedModule,
    MatTabsModule,
    MatDividerModule,
    MapModule,
  ],
  //encapsulation: ViewEncapsulation.None,
})
export class PropertyDetailsComponent implements OnInit {
  @ViewChild('yourImage') yourImage!: ElementRef;
  propertyType = 1;
  tab!: number;
  unitDetails: any;
  propertyDetails: any;
  availableUnitDetails: any;
  imagePlaceholder: string = 'assets/images/property-default-image.webp';
  dummyImageUrl: string = 'https://example.com/dummy-image.jpg';
  imagePlaceholders: any[] = [
    {
      Url: this.imagePlaceholder,
    },
    {
      Url: this.imagePlaceholder,
    },
    {
      Url: this.imagePlaceholder,
    },
  ];

  currentLat: any;
  currentLang: any;
  directionsResults$!: Observable<google.maps.DirectionsResult | undefined>;
  propertyFileUploads = PROPERTY_FILE_UPLOADS;

  headingPictures: any[] = [
    { Id: 1, path: 'assets/images/green-star-rating.png' },
    { Id: 2, path: 'assets/images/net-zero.png' },
    { Id: 3, path: 'assets/images/net-positive.png' },
  ];

  colors: any[] = [
    { Id: 1, color: '#004D38' },
    { Id: 2, color: '#A1998F' },
    { Id: 3, color: '#A1998F' },
    { Id: 4, color: '#A1998F' },
    { Id: 5, color: '#A1998F' },
    { Id: 6, color: '#A1998F' },
    { Id: 7, color: '#859C99' },
    { Id: 8, color: '#085F86' },

    { Id: 9, color: '#BA634F' },
    { Id: 10, color: '#D47D1F' },
    { Id: 11, color: '#A1998F' },
    { Id: 12, color: '#A1998F' },
    { Id: 13, color: '#D2AF1F' },
    { Id: 14, color: '#004D38' },
    { Id: 15, color: '#085F86' },
    { Id: 16, color: '#085F86' },

    { Id: 7, color: '#004D38' },
    { Id: 21, color: '#FFBE00' },
    { Id: 17, color: '#FFBE00' },
    { Id: 26, color: '#289889' },
    { Id: 18, color: '#5B9AD4' },
    { Id: 22, color: '#5B9AD4' },
    { Id: 23, color: '#A96B31' },
    { Id: 19, color: '#A96B31' },
    { Id: 20, color: '#40A955' },
    { Id: 24, color: '#40A955' },
  ];
  tabIndex = 1;
  tabName: any;
  urlData: any;
  url: string;
  utm_campaign: any;
  getColor(id: any) {
    var rm = '';
    this.colors.forEach((x) => {
      if (x.Id == id) {
        rm = x.color;
      }
    });
    return rm;
  }

  getPicture(id: any) {
    var rm = '';
    this.headingPictures.forEach((x) => {
      if (x.Id == id) {
        rm = x.path;
      }
    });
    return rm;
  }

  media: any;
  unitmedia: any;
  leaseValues: any;
  expandedIndex!: number;
  unitAvailable = false;
  propertyId!: any;
  slug!: any;

  // maps
  center!: google.maps.LatLngLiteral;
  zoom = 17;
  markerOptions: google.maps.MarkerOptions = {
    draggable: false,
  };
  markerPositions!: MarkerConfig[];
  urlVideoSafe!: SafeResourceUrl;
  sectorTypes = SECTOR_TYPES;

  ngOnInit() {
    // Set the dummy URL in the developer tools
    //  this.setDummyUrl();
    this.route.queryParams.subscribe((params) => {
      const tab = params['tab'];
      this.tab = tab ? +tab : 0;
    });
  }

  setDummyUrl() {
    // Dynamically set the dummy URL in the developer tools
    const imgElement = this.yourImage.nativeElement as HTMLImageElement;
    this.renderer.setAttribute(imgElement, 'src', this.dummyImageUrl);
  }

  constructor(
    private renderer: Renderer2,
    private unitPreviewService: UnitPreviewService,
    private feproperties: FePropertiesService,
    private unitService: UnitService,
    private route: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog,
    private sanitizer: DomSanitizer,
    private commonStoreService: CommonStoreService,
    private commonService: CommonService
  ) {

    this.utm_campaign = this.commonService.getCompaign();
    this.url = this.router.url;
    if (this.url.includes('need-space')) {
      this.unitAvailable = true;
    }
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    // this.route.queryParams.subscribe((params) => {
    //   const urlSafeFilters = params?.['f'];
    //   this.utm_campaign = params?.['utm_campaign'];
    //   if (this.utm_campaign) {
    //     this.commonService.setCompaign(
    //       this.utm_campaign,
    //       params?.['utm_medium'],
    //       params?.['utm_source'],
    //       params?.['utm_content'],
    //       params?.['utm_term'],
    //       params?.['gclid'] ? params?.['gclid'] : params?.['fbclid']
    //     );
    //   } else if (this.commonService.getCompaign()) {
    //     this.utm_campaign = this.commonService.getCompaign();
    //   }
    // });
    this.route.paramMap.subscribe((params) => {
      this.slug = params.get(CONSTANTS.ROUTE_ID);
      this.getPropertyPreviewDetails();
    });
    this.feproperties.unitTab$.subscribe((data) => (this.tab = data));
    // this.getPropertyPreviewDetails();
    this.getCurrentLocation();
  }

  getCurrentLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position: any) => {
        if (position) {
          this.currentLat = position.coords.latitude;
          this.currentLang = position.coords.longitude;
        }
      });
    }
  }

  toggleTile(index: number): void {
    this.expandedIndex = this.expandedIndex === index ? -1 : index;
  }

  getPropertyPreviewDetails() {
    this.unitPreviewService
      .propertyDetails(this.slug, this.utm_campaign)
      .subscribe({
        next: (res: any) => {
          this.propertyDetails = res.data;
          this.urlData = {
            url: res.data.details.Slug,
            replacedUrl: res.data.details.PropertyName,
          };
          this.propertyId = res.data.details.PropertyId;
          this.media = res.data.media;
          if (res.data.media.Video != undefined) {
            this.media.Video.Url = this.getYoutubeEmbedUrl(
              res.data.media.Video.Url
            );
            this.urlVideoSafe = this.sanitizer.bypassSecurityTrustResourceUrl(
              this.media.Video.Url
            );
          }
          this.markLocation(
            this.propertyDetails.details.Latitude,
            this.propertyDetails.details.Longitude
          );
          this.getAvailableUnits(res.data.details.PropertyId);
        },
        error: (error: any) => {},
      });
  }

  getAvailableUnits(id: any) {
    this.unitPreviewService.getAvailableUnitDetails(id).subscribe({
      next: (res: any) => {
        if (res.data != null) {
          this.availableUnitDetails = res.data;
          this.unitAvailable = true;
          this.unitmedia = res?.data?.media;
          this.unitmedia = res.data.media;
        } else {
          this.unitAvailable = false;
        }
        // this.formatUnitDetails(res.data)
      },
      error: (error: any) => {
        if (error.error.message == 'Unable to find') {
          this.unitAvailable = false;
        } else {
        }
      },
    });
  }
  formatUnitDetails(unitDetails: any) {
    this.availableUnitDetails = [...unitDetails].map((unit: any) => {
      let leaseValues = this.unitService.onNetRentalSelect(
        unit.details.BaseRental,
        unit.details.OperationalCost,
        unit.details.Rates,
        unit.details.UnitSize,
        unit.details.NetRental,
        unit.details.OpsRental
      );
      return {
        ...unit,
        details: { ...unit.details, leaseValues: leaseValues },
      };
    });
  }
  calculateLease(unit: any) {
    return this.unitService.onNetRentalSelect(
      unit.details.BaseRental,
      unit.details.OperationalCost,
      unit.details.Rates,
      unit.details.UnitSize,
      unit.details.NetRental,
      unit.details.OpsRental
    );
  }

  getYoutubeEmbedUrl(url: any) {
    let urlParts = url.split('/');
    let vidid = urlParts[urlParts.length - 1]
      .replace('watch?v=', '')
      .split('&')[0];
    return `https://www.youtube.com/embed/${vidid}`;
  }

  openCarousel(index: any): void {
    if (this.propertyDetails.media.Image) {
      const dialogRef = this.dialog.open(CarouselDialogComponent, {
        data: {
          images: this.propertyDetails.media?.Image,
          startIndex: index,
        },
        height: '100vh',
        maxHeight: '100vh',
        width: '100vw',
        maxWidth: '100vw',
      });
      dialogRef.afterClosed().subscribe((action: any) => {
        if (action === 'send') {
          // Handle any actions after closing the dialog if needed
        }
      });
    }
  }
  // openUnitMediaCarousel(index: any ): void {
  //   if (this.unitDetails.UnitMedia &&
  //     this.unitDetails.UnitMedia.Image &&
  //     this.unitDetails.UnitMedia.Image.length > 1) {
  //     const dialogRef = this.dialog.open(CarouselDialogComponent, {
  //       data: {
  //         images: this.unitDetails.UnitMedia?.Image,
  //         startIndex: index,
  //       },
  //       height: '100vh',
  //       width: '100vw',
  //       maxWidth: '100vw',
  //     });
  //     dialogRef.afterClosed().subscribe((action: any) => {
  //       if (action === 'send') {
  //         // Handle any actions after closing the dialog if needed
  //       }
  //     });
  //   }
  // }
  openUnitMediaCarousel(index: any, unitDetails: any) {
    if (unitDetails?.UnitMedia?.Image) {
      const dialogRef = this.dialog.open(CarouselDialogComponent, {
        data: {
          images: unitDetails?.UnitMedia?.Image,
          startIndex: index,
        },
        height: '100vh',
        width: '100vw',
        maxWidth: '100vw',
      });
      dialogRef.afterClosed().subscribe((action: any) => {
        if (action === 'send') {
        }
      });
    }
  }

  markLocation(Latitude: any, Longitude: any) {
    this.center = {
      lat: parseFloat(Latitude),
      lng: parseFloat(Longitude),
    };
    this.markerPositions = [
      {
        position: {
          lat: parseFloat(Latitude),
          lng: parseFloat(Longitude),
        },
      },
    ];
  }

  getFeatureIcon(name: string): string {
    switch (name) {
      case FEATURE_AMENITIES.PIT:
        return 'barricade.svg';
      case FEATURE_AMENITIES.BALCONIES:
        return 'stairs.svg';
      case FEATURE_AMENITIES.CRANES:
      case FEATURE_AMENITIES.CRANE_MAKE:
      case FEATURE_AMENITIES.TONNAGE_ALLOCATION:
        return 'crane.svg';
      case FEATURE_AMENITIES.DEDICATED_TANKS:
      case FEATURE_AMENITIES.DIESEL_BOWSERS:
        return 'cylinder.svg';
      case FEATURE_AMENITIES.OUTSIDE_GANTRIES:
        return 'gantries.svg';
      case FEATURE_AMENITIES.GENERATOR:
      case FEATURE_AMENITIES.BACKUP_GENERATOR:
        return 'lightning.svg';
      case FEATURE_AMENITIES.SOLAR_PV:
        return 'sun.svg';
      case FEATURE_AMENITIES.SECURITY:
        return 'shield.svg';
      case FEATURE_AMENITIES.SPRINKLERS:
        return 'shower.svg';
      case FEATURE_AMENITIES.WEIGH_BRIDGE:
        return 'truck.svg';
      case FEATURE_AMENITIES.STOREROOMS:
        return 'warehouse.svg';
      case FEATURE_AMENITIES.STANDBY_WATER:
        return 'water-drop.svg';
      case FEATURE_AMENITIES.FIBRE:
        return 'fibre.svg';
      case FEATURE_AMENITIES.WIFI:
        return 'wifi.svg';
      case FEATURE_AMENITIES.ROOF:
        return 'roof.svg';
      default:
        return '';
    }
  }

  isNumber(data: any) {
    return typeof data == 'number';
  }

  clearFilter() {}

  enquiry() {
    let formConfig = {
      selectedUnits: '',
      propertyDetails: this.propertyDetails.details,
    };
    this.commonStoreService.setFormConfig(formConfig);
    this.router.navigate(['enquiry/user-details'], { relativeTo: this.route });
    // const dialogRef = this.dialog.open(EnquiryDialogComponent, {
    //   data: {
    //     id: this.propertyDetails,
    //   },
    // });
    // dialogRef.afterClosed().subscribe((result: any) => {
    //   let formConfig = {
    //     selectedUnits: [],
    //     propertyDetails: this.propertyDetails.details,
    //   };
    //   this.commonStoreService.setFormConfig(formConfig);
    //   if (result == 'option1') {
    //     this.router.navigate(['enquiry'], {
    //       relativeTo: this.route,
    //     });
    //     this.feproperties.setDefaultTab(0);
    //   } else if (result == 'option2') {
    //     this.router.navigate([ROUTE.CONTACT_US]);
    //   }
    // });
  }

  download(event: MouseEvent, url: string) {
    event.preventDefault();
    this.commonService.pdfDownload(url);
  }

  view(url: any) {
    this.commonService.viewPdf(url);
  }

  onTabChange(event: any) {
    this.tabIndex = event.index;
    this.tabName = event.tab.textLabel;
  }

  isObject(val: any): boolean {
    if (val instanceof Array) return false;
    else return true;
  }
}
