import { PropertyConfirmationComponent } from './../property-confirmation/property-confirmation.component';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PropertyService } from 'src/app/admin/services/property.service';
import { UnitPreviewService } from 'src/app/admin/services/unit-preview.service';
import { UnitService } from 'src/app/admin/services/unit.service';
import { MarkerConfig } from 'src/app/interfaces/map';
import { FEATURE_AMENITIES } from 'src/app/models/constants';
import { PROPERTY_FILE_UPLOADS } from 'src/app/models/enum';
import { CommonService } from 'src/app/shared/services/common.service';
import { LoaderService } from 'src/app/shared/services/loader/loader.service';

@Component({
  selector: 'app-property-preview',
  templateUrl: './property-preview.component.html',
  styleUrls: ['./property-preview.component.scss'],
})
export class PropertyPreviewComponent {
  propertyDetails: any;
  availableUnitDetails: any;
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

  esg: boolean = true;

  headingPictures: any[] = [
    { Id: 1, path: 'assets/images/green-star-rating.png' },
    { Id: 2, path: 'assets/images/net-zero.png' },
    { Id: 3, path: 'assets/images/net-positive.png' },
    { Id: 4, path: '' },
    { Id: 5, path: '' },
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
    { Id: 17, color: '#FFBE00' },

    { Id: 18, color: '#5B9AD4' },
    { Id: 19, color: '#A96B31' },
    { Id: 20, color: '#40A955' },
    { Id: 21, color: '#FFBE00' },
    { Id: 22, color: '#5B9AD4' },
    { Id: 23, color: '#A96B31' },
    { Id: 24, color: '#40A955' },
    { Id: 26, color: '#289889' },
  ];
  tabName: any;
  tabIndex: any;
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
  expandedIndex = 0;
  unitAvailable = true;
  propertyFileUploads = PROPERTY_FILE_UPLOADS;

  constructor(
    private propertyService: PropertyService,
    private unitPreviewService: UnitPreviewService,
    private loaderService: LoaderService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<PropertyConfirmationComponent>,
    private unitService: UnitService,
    private commonService: CommonService
  ) {
    this.getPropertyPreviewDetails();
    this.getAvailableUnits();
  }

  toggleTile(index: number): void {
    this.expandedIndex = this.expandedIndex === index ? -1 : index;
  }

  getPropertyPreviewDetails() {
    this.loaderService.show();
    this.propertyService.propertyPreviewDetails(this.data.id).subscribe({
      next: (res: any) => {
        this.loaderService.hide();

        this.propertyDetails = res.data;
        this.media = res.data.media;
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

  getAvailableUnits() {
    this.loaderService.show();
    this.unitPreviewService.getAvailableUnitDetails(this.data.id).subscribe({
      next: (res: any) => {
        this.loaderService.hide();
        this.availableUnitDetails = res.data;
        this.unitAvailable = true;
        this.unitmedia = res.data.media;
        // this.formatUnitDetails(res.data)
      },
      error: (error: any) => {
        this.loaderService.hide();
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

  center!: google.maps.LatLngLiteral;
  zoom = 17;
  markerOptions: google.maps.MarkerOptions = {
    draggable: false,
  };
  markerPositions!: MarkerConfig[];

  closeModal() {
    this.dialogRef.close();
  }

  markLocation(Latitude: any, Longitude: any) {
    this.center = {
      lat: parseFloat(Latitude),
      lng: parseFloat(Longitude),
    };
    this.markerPositions = [
      {
        position: { lat: parseFloat(Latitude), lng: parseFloat(Longitude) },
      },
    ];
  }

  getFeatureIcon(name: string): string {
    return this.commonService.getFeatureIcons(name);
  }

  isNumber(data: any) {
    return typeof data == 'number';
  }

  onSliderChange(event: any) {}
  clearFilter() {}

  onTabChange(event: any) {
    this.tabIndex = event.index;
  }
}
