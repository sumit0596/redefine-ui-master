import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CommonStoreService } from 'src/app/services/common-store.service';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PropertyService } from 'src/app/admin/services/property.service';
import { StepperService } from '../../../../../../services/stepper.service';
import { ToastrService } from 'ngx-toastr';
import { ROUTE, FEATURE_AMENITIES, FORM_MODE } from 'src/app/models/constants';
import { LoaderService } from 'src/app/shared/services/loader/loader.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { InternationalPropertyComponent } from '../../international-property.component';

@Component({
  selector: 'app-international-property-confirmation',
  templateUrl: './international-property-confirmation.component.html',
  styleUrls: ['./international-property-confirmation.component.scss'],
})
export class InternationalPropertyConfirmationComponent extends InternationalPropertyComponent {
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
  fieldData: any = [
    {
      parentName: 'Property Details',
      isActive: true,
      formPath: ROUTE.CREATE_INTERNATIONAL_PROPERTY_DETAILS,
      childProperties: [
        {
          childName: 'Property Info',
          properties: [
            { label: 'Property Name:', path: 'PropertyName' },
            { label: 'Sector:', path: 'SectorName' },
            { label: 'GLA:', path: 'Gla' },
            { label: 'Website URL:', path: 'WebsiteUrl' },
            { label: 'Completion:', path: 'ProvideYear' },
          ],
        },
        {
          childName: 'Location',
          properties: [
            { label: 'Address:', path: 'Address' },
            { label: 'Suburb:', path: 'Suburb' },
            { label: 'City:', path: 'City' },
            { label: 'State:', path: 'Province' },
            { label: 'Country:', path: 'Country' },
            { label: 'Postal Code:', path: 'PostCode' },
          ],
        },
        {
          childName: 'GPS Coordinates',
          properties: [
            { label: 'Latitude', path: 'Latitude' },
            { label: 'Longitude', path: 'Longitude' },
          ],
        },
        {
          childName: 'Description',
          properties: {
            path: 'PropertyDescription',
          },
        },

        {
          childName: 'Property Attributes',
        },
      ],
    },

    {
      parentName: 'Additional Information',
      isActive: false,
      formPath: ROUTE.CREATE_INTERNATIONAL_PROPERTY_FEATURES,
      childProperties: [],
    },
  ];

  constructor(
    router: Router,
    fb: FormBuilder,
    loaderService: LoaderService,
    stepperService: StepperService,
    propertyService: PropertyService,
    commonStoreService: CommonStoreService,
    toasterService: ToastrService,
    dialog: MatDialog,
    commonService: CommonService
  ) {
    super(
      fb,
      loaderService,
      stepperService,
      propertyService,
      commonStoreService,
      router,
      toasterService,
      dialog,
      commonService
    );
    stepperService.setStep({ label: 'Confirm/Edit', active: false });
  }
  override ngOnDestroy(): void {}

  toggleAccordion(event: any, index: any) {
    const element = event.target;
    element.classList.toggle('active');
    if (this.fieldData[index].isActive) {
      this.fieldData[index].isActive = false;
    } else {
      this.fieldData[index].isActive = true;
    }
    const panel = element.nextElementSibling;
    if (panel.style.maxHeight) {
      panel.style.maxHeight = null;
    } else {
      panel.style.maxHeight = panel.scrollHeight + 'px';
    }
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
}
