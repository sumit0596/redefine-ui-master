import { Component } from '@angular/core';
import { MapDirectionsService } from '@angular/google-maps';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, map } from 'rxjs';
import { FePropertiesService } from 'src/app/admin/services/fe-properties.service';
import { UnitPreviewService } from 'src/app/admin/services/unit-preview.service';
import { ContextContainer } from 'src/app/core/context/context-container';
import { HomePageService } from 'src/app/frontend/services/home-page.service';
import { CarouselDialogComponent } from 'src/app/frontend/shared/carousel-dialog/carousel-dialog.component';
import { MarkerConfig } from 'src/app/interfaces/map';
import { CONSTANTS, FEATURE_AMENITIES } from 'src/app/models/constants';

@Component({
  selector: 'app-international-property-details',
  templateUrl: './international-property-details.component.html',
  styleUrls: ['./international-property-details.component.scss'],
})
export class InternationalPropertyDetailsComponent {
  breeamCertificationRating: any[] = [
    {
      Id: '1',
      Name: 'Outstanding',
    },
    {
      Id: '2',
      Name: 'Excellent',
    },
    {
      Id: '3',
      Name: 'Very good',
    },
    {
      Id: '4',
      Name: 'Good Pass',
    },
    {
      Id: '5',
      Name: 'Unclassified',
    },
  ];
  tab!: number;
  propertyType = 2;
  propertyDetails: any;
  imagePlaceholder: string = 'assets/images/property-default-image.jpg';
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

  propertyId!: any;
  slug!: any;
  media: any;
  currentLat: any;
  currentLang: any;
  directionsResults$!: Observable<google.maps.DirectionsResult | undefined>;
  urlData: any;

  constructor(
    private unitPreviewService: UnitPreviewService,
    private feproperties: FePropertiesService,
    private route: ActivatedRoute,
    private router: Router,
    private mapDirectionsService: MapDirectionsService,
    public dialogRef: MatDialog,
    private homePageService: HomePageService,
    private context: ContextContainer,
    public dialog: MatDialog
  ) {
    //this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.route.paramMap.subscribe((params) => {
      this.slug = params.get(CONSTANTS.ROUTE_ID);
      this.getPropertyPreviewDetails();
    });
    this.feproperties.unitTab$.subscribe((data) => (this.tab = data));
    //this.getPropertyPreviewDetails();
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

  getPropertyPreviewDetails() {
    this.unitPreviewService.propertyDetails(this.slug).subscribe({
      next: (res: any) => {
        res.data?.featureamenities?.map((y: any) => {
          this.breeamCertificationRating.map((x: any) => {
            if (x.Id == y.Value && y.FeaturesAmenitiesSectorId == 27) {
              y.Value = x.Name;
            }
          });
        });
        this.propertyDetails = res.data;
        this.urlData = {
          url: res.data.details.Slug,
          replacedUrl: res.data.details.PropertyName,
        };
        this.propertyId = res.data.details.PropertyId;
        this.media = res.data.media;
        this.markLocation(
          this.propertyDetails.details.Latitude,
          this.propertyDetails.details.Longitude
        );
      },
      error: (error: any) => {},
    });
  }

  center!: google.maps.LatLngLiteral;
  markerPositions!: MarkerConfig[];

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
      case FEATURE_AMENITIES.NUMBER_OF_TENANTS:
        return 'tenants.svg';
      case FEATURE_AMENITIES.OCCUPANCY:
        return 'occupancy.svg';
      case FEATURE_AMENITIES.BREEAM_CERTIFICATION_RATING:
        return 'breeam.svg';
      case FEATURE_AMENITIES.PARKING:
        return 'parking.svg';

      default:
        return '';
    }
  }

  isNumber(data: any) {
    return typeof data == 'number';
  }

  getDirections() {
    const request: google.maps.DirectionsRequest = {
      origin: new google.maps.LatLng(this.currentLat, this.currentLang),
      destination: new google.maps.LatLng(
        parseFloat(this.propertyDetails.details.Latitude),
        parseInt(this.propertyDetails.details.Longitude)
      ),
      travelMode: google.maps.TravelMode.WALKING,
    };
    this.directionsResults$ = this.mapDirectionsService
      .route(request)
      .pipe(map((response) => response.result));
  }

  openCarousel(index: any): void {
    if (this.propertyDetails.media?.Image) {
      const dialogRef = this.dialog.open(CarouselDialogComponent, {
        data: {
          images: this.propertyDetails.media?.Image,
          startIndex: index,
        },
        height: '100vh',
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

  RedefineEurope() {
    window.open('https://www.redefineeurope.nl/', '_blank');
  }
}
