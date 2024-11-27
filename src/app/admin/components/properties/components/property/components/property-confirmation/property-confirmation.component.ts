import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CommonStoreService } from 'src/app/services/common-store.service';
import { Component } from '@angular/core';
import { PropertyPreviewComponent } from '../property-preview/property-preview.component';
import { MatDialog } from '@angular/material/dialog';
import { PropertyComponent } from '../../property.component';
import { PropertyService } from 'src/app/admin/services/property.service';
import { StepperService } from '../../../../../../services/stepper.service';
import { ToastrService } from 'ngx-toastr';
import {
  ROUTE,
  FEATURE_AMENITIES,
  FORM_MODE,
  SESSION,
} from 'src/app/models/constants';
import { LoaderService } from 'src/app/shared/services/loader/loader.service';
import { CommonService } from 'src/app/shared/services/common.service';

@Component({
  selector: 'app-property-confirmation',
  templateUrl: './property-confirmation.component.html',
  styleUrls: [
    './property-confirmation.component.scss',
    '../../property.component.scss',
  ],
})
export class PropertyConfirmationComponent extends PropertyComponent {
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
  status$ = [
    { value: 'Available', label: 'Available' },
    { value: 'Under Offer', label: 'Under Offer' },
    { value: 'Under Negotiation', label: 'Under Negotiation' },
    { value: 'Unavailable', label: 'Unavailable' },
    { value: 'Let', label: 'Let' },
  ];
  fieldData: any = [
    {
      parentName: 'Property Details',
      isActive: true,
      formPath: ROUTE.CREATE_PROPERTY_DETAILS,
      childProperties: [
        {
          childName: 'Property Info',
          properties: [
            { label: 'Property Code:', path: 'BuildingCode' },
            { label: 'Property Name:', path: 'PropertyName' },
            { label: 'Sector:', path: 'SectorName' },
            { label: 'GLA:', path: 'Gla' },
            { label: 'Website URL:', path: 'WebsiteUrl' },
          ],
        },
        {
          childName: 'Location',
          properties: [
            { label: 'Address:', path: 'Address' },
            { label: 'Suburb:', path: 'Suburb' },
            { label: 'City:', path: 'City' },
            { label: 'Province:', path: 'Province' },
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
          childName: 'Parking Details',
          properties: [
            { label: 'Parking Ratio:', path: 'ParkingRatio' },
            { label: 'Basement Bay:', path: 'BasementBays' },
            { label: 'Shaded Bay:', path: 'ShadedBays' },
            { label: 'Open Bay:', path: 'OpenBays' },
          ],
        },
        {
          childName: 'Property Attributes',
        },
      ],
    },
    {
      parentName: 'Media',
      isActive: false,
      formPath: ROUTE.CREATE_PROPERTY_MEDIA,
      childProperties: [
        { childName: 'Brochure', path: 'Brochure' },
        { childName: 'Rate Card', path: 'RateCard' },
        { childName: 'Video', path: 'Video' },
        { childName: 'Floor Plan', path: 'FloorPlan' },
        { childName: 'Mall Map', path: 'MallMap' },
        { childName: 'Fact Sheet', path: 'FactSheet' },
        {
          label: 'Advertising Opportunities (alternative income inventory)',
          childName: 'Advertisement',
          path: 'advertisments',
        },
      ],
    },
    {
      parentName: 'Contact Details',
      isActive: false,
      formPath: ROUTE.PROPERTY_CONTACT_DETAILS,
    },
    {
      parentName: 'Features and Amenities',
      isActive: false,
      formPath: ROUTE.PROPERTY_FEATURES,
      childProperties: [],
    },
    {
      parentName: 'ESG Certification',
      isActive: false,
      formPath: ROUTE.PROPERTY_ESG_FEATURES,
      childProperties: [],
    },
  ];
  setStatusAvailability: any;

  id: any;
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

  // samradhi function starts here
  override ngOnInit(): void {
    this.commonStoreService.formConfig$.subscribe(
      (res) => (this.formConfig = res)
    );
    let propId : any;
    this.propertyService.getPropertyDetails().subscribe((result: any) => {
      if (result.details?.PropertyId != 0) {
        propId =  result.details?.PropertyId;
      }
    });
    if(!this.formConfig.id){
        this.id = propId;
    }else{
      if(this.formConfig.mode=="broker commission incentive" || this.formConfig.mode=="tenant incentive"){
        this.id = propId;
      }else{
        this.id = this.formConfig.id;
      }
    }
    let formConfig = {
      id: this.id,
      mode: this.formConfig.mode,
      access : this.formConfig.access,
      page : 'confirmation'
    };
    this.commonStoreService.setFormConfig(formConfig);
    super.ngOnInit();
  }

  //samradhi function ends here

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
    return this.commonService.getFeatureIcons(name);
  }

  createNewUnit() {
    let formConfig = {
      id: this.propertyId,
      mode: FORM_MODE.CREATE,
    };
    this.commonStoreService.setFormConfig(formConfig);
    this.router.navigate([`${ROUTE.CREATE_UNIT_DETAILS}`]);
  }
}
