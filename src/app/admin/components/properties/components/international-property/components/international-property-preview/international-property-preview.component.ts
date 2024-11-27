import { Component, Inject } from '@angular/core';
import { PropertyService } from 'src/app/admin/services/property.service';

import { LoaderService } from 'src/app/shared/services/loader/loader.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { InternationalPropertyConfirmationComponent } from '../international-property-confirmation/international-property-confirmation.component';
import { FEATURE_AMENITIES } from 'src/app/models/constants';
import { MarkerConfig } from 'src/app/interfaces/map';

@Component({
  selector: 'app-international-property-preview',
  templateUrl: './international-property-preview.component.html',
  styleUrls: ['./international-property-preview.component.scss'],
})
export class InternationalPropertyPreviewComponent {
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
  media: any;
  featureAmenities: any;

  //maps
  center!: google.maps.LatLngLiteral;
  markers: MarkerConfig[] = [];

  constructor(
    private propertyService: PropertyService,
    private loaderService: LoaderService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<InternationalPropertyConfirmationComponent>
  ) {
    this.getPropertyPreviewDetails();
  }

  getPropertyPreviewDetails() {
    this.loaderService.show();
    this.propertyService.propertyPreviewDetails(this.data.id).subscribe({
      next: (res: any) => {
        this.loaderService.hide();
        this.propertyDetails = res.data;
        this.media = res.data.media;
        this.featureAmenities = res.data.featureamenities;
        this.featureAmenities = this.featureAmenities.map((features: any) => {
          if (features.Title == 'BREEAM Certification rating') {
            switch (features.Value) {
              case '1':
                features.Value = 'Outstanding';
                break;
              case '2':
                features.Value = 'Excellent';
                break;
              case '3':
                features.Value = 'Very Good';
                break;
              case '4':
                features.Value = 'Good Pass';
                break;
              case '5':
                features.Value = 'Unclassified';
                break;
            }
          }
          if (features.Title == 'Occupancy') {
            features.Value = features.Value + '%';
          }
          return features;
        });
        this.markLocation(
          this.propertyDetails.details.Latitude,
          this.propertyDetails.details.Longitude
        );
      },
      error: (error: any) => {
        this.loaderService.hide();
      },
    });
  }

  markLocation(Latitude: any, Longitude: any) {
    this.center = {
      lat: parseFloat(Latitude),
      lng: parseFloat(Longitude),
    };
    this.markers = [
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

  closeModal() {
    this.dialogRef.close();
  }
}
