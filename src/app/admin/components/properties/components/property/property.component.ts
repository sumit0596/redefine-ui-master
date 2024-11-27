import { Component, OnDestroy } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable, of } from 'rxjs';
import {
  CONSTANTS,
  FORM_MODE,
  PATTERN,
  PROPERTY_FEATURES_FORM,
  PROPERTY_FORM,
  ROUTE,
  SESSION,
} from 'src/app/models/constants';
import { PROPERTY_STATUS } from 'src/app/models/enum';
import { CommonStoreService } from 'src/app/services/common-store.service';
import { LoaderService } from 'src/app/shared/services/loader/loader.service';
import { PropertyPreviewComponent } from './components/property-preview/property-preview.component';
import { StepperService } from '../../../../services/stepper.service';
import { PropertyService } from 'src/app/admin/services/property.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { TenantIncentivesFormComponent } from '../unit/components/tenant-incentives-form/tenant-incentives-form.component';
import { BrokerCommissionIncentivesFormComponent } from '../unit/components/broker-commission-incentives-form/broker-commission-incentives-form.component';
import { UnitAvailabilityDialogComponent } from '../unit/components/unit-availability-dialog/unit-availability-dialog.component';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { IMedia } from 'src/app/interfaces/media';
import { MarkerConfig } from 'src/app/interfaces/map';

export const MY_DATE_FORMATS = {
  parse: {
    dateInput: 'MM/YYYY',
  },
  display: {
    dateInput: 'MM/YYYY',
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};
@Component({
  selector: 'app-property',
  templateUrl: './property.component.html',
  styleUrls: ['./property.component.scss'],
  providers: [{ provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS }],
})
export class PropertyComponent implements OnDestroy {
  route = ROUTE;
  formStep!: any;
  formConfig: any;
  propertyId: any;
  sector!: string;
  propertyDetails: any;
  propertyForm!: FormGroup;
  propertyStatus = PROPERTY_STATUS;
  validationMessages: string[] = [];
  ratingArr: any = [];
  mergedEsgFeatureList: any[] = [];
  mergedFeaturesAmenitiesList!: any[];

  sectors$!: Observable<any[]>;
  countries$!: Observable<any[]>;
  provinces$!: Observable<any[]>;
  brokerLiaison$!: Observable<any>;
  leasingExecutives$!: Observable<any[]>;
  sectorFeaturesAmenities$!: Observable<any[]>;
  propertyFeaturesAmenities$!: Observable<any[]>;

  media: IMedia = {
    Id: '',
    Type: '',
    Name: '',
    Url: '',
    CreatedOn: '',
    IsFile: false,
  };

  formSteps: any[] = [
    {
      stepNumber: 1,
      stepRoute: 'property-details',
      stepName: 'Property Details',
    },
    {
      stepNumber: 2,
      stepRoute: 'property-media',
      stepName: 'Media',
    },
    {
      stepNumber: 3,
      stepRoute: 'contact-details',
      stepName: 'Property Contacts',
    },
    {
      stepNumber: 4,
      stepRoute: 'property-features',
      stepName: 'Features/Amenities',
    },
    {
      stepNumber: 5,
      stepRoute: 'property-esg-features',
      stepName: 'ESG Certification',
    },
    {
      stepNumber: 6,
      stepRoute: 'property-confirmation',
      stepName: 'Confirm',
    },
  ];

  address: string = '';
  types = [
    'route',
    'sublocality',
    'administrative_area_level_2',
    'administrative_area_level_1',
    'country',
    'locality',
    'postal_code',
  ];
  city: string = '';
  suburb: string = '';
  country: string = '';
  province: string = '';
  center!: google.maps.LatLngLiteral;
  markerPositions!: MarkerConfig[];
  columns: any;
  tableSettings: any;
  rows: any;
  totalRowsCount: any;
  pageCnt: any;
  pageNumber = 1;
  pageSize = 10;
  filterColumns: any;
  sprinklerSpec: any[] = [
    {
      Id: 1,
      Name: 'AISB',
    },
    {
      Id: 2,
      Name: 'ESFR',
    },
    {
      Id: 3,
      Name: 'Other',
    },
  ];
  sprinklerSpecs$: Observable<any> = of(this.sprinklerSpec);
  sprinklerSpecId!: any;

  standByWater: any[] = [
    {
      Id: 1,
      Name: 'Yes, pro-rata water usage charged',
    },
    {
      Id: 2,
      Name: 'Yes, charge to be confirmed',
    },
  ];
  standByWaters$: Observable<any> = of(this.standByWater);
  standByWaterId!: any;

  backUpGenerator: any[] = [
    {
      Id: 1,
      Name: 'Yes, pro-rata diesel charged',
    },
    {
      Id: 2,
      Name: 'Yes, charge to be confirmed',
    },
  ];
  backUpGenerator$: Observable<any> = of(this.backUpGenerator);
  backUpGeneratorId!: any;

  access: any;
  postalCode: any;
  selectedRows: any;
  message: any;
  toastMessage: any;
  constructor(
    public fb: FormBuilder,
    public loaderService: LoaderService,
    public stepperService: StepperService,
    public propertyService: PropertyService,
    public commonStoreService: CommonStoreService,
    public router: Router,
    public toasterService: ToastrService,
    public dialog: MatDialog,
    public commonService: CommonService
  ) {}

  ngOnInit(): void {
    this.commonStoreService.formConfig$.subscribe(
      (res) => (this.formConfig = res)
    );
    this.setForm();
    this.configureForm();
    this.propertyService.getPropertyDetails().subscribe((result: any) => {
      this.propertyDetails = result;
      if (this.propertyDetails.details?.Gla != 0) {
        this.propertyDetailsForm.get('Gla')?.disable();
      }
    });
  }

  ngOnDestroy(): void {
    sessionStorage.removeItem(SESSION.FORM_CONFIG);
    //  sessionStorage.removeItem(SESSION.PROPERTY_DETAILS);
    sessionStorage.removeItem(SESSION.LEASING_EXECUTIVES);
    sessionStorage.removeItem(SESSION.BROKER_LIAISONS);
    sessionStorage.removeItem(SESSION.SECTOR_FEATURES_AMENITIES);
    sessionStorage.removeItem(SESSION.PROPERTY_ESG_FEATURES);
    sessionStorage.removeItem(SESSION.PROPERTY_ATTRIBUTES);
    sessionStorage.removeItem(SESSION.PROPERTY_ADVERTISEMENT);
    sessionStorage.removeItem(SESSION.COUNTRIES);
    sessionStorage.removeItem(SESSION.PROPERTY_GRADES);
    sessionStorage.removeItem(SESSION.PROVINCES);
    sessionStorage.removeItem(SESSION.SECTORS);
  }

  ngAfterViewInit(): void {
    this.stepperService.getStep.subscribe((result) => {
      Promise.resolve().then(() => (this.formStep = result));
    });
  }

  setForm() {
    this.propertyForm = this.fb.group({
      PropertyDetails: this.fb.group({
        PropertyId: [''],
        BuildingCode: [null],
        PropertyName: ['', [Validators.required, Validators.maxLength(100)]],
        SectorId: [{ value: null, disabled: true }, [Validators.required]],
        Gla: [
          '',
          [
            Validators.required,
            Validators.maxLength(50),
            Validators.pattern(PATTERN.GLA_PATTERN),
          ],
        ],
        Grade: [''],
        WebsiteUrl: ['', [Validators.maxLength(255)]],
        PropertyDescription: [''],
        Latitude: [
          '',
          [
            Validators.required,
            Validators.maxLength(20),
            Validators.pattern(PATTERN.LATITUDE_LONGITUDE_PATTERN),
          ],
        ],
        Longitude: [
          '',
          [
            Validators.required,
            Validators.maxLength(20),
            Validators.pattern(PATTERN.LATITUDE_LONGITUDE_PATTERN),
          ],
        ],
        Address: ['', [Validators.required, Validators.maxLength(100)]],
        City: [
          { value: '', disabled: true },
          [Validators.required, Validators.maxLength(50)],
        ],
        Suburb: [
          { value: '', disabled: true },
          [Validators.required, Validators.maxLength(50)],
        ],
        Province: [{ value: '', disabled: true }, [Validators.required]],
        Country: [{ value: '', disabled: true }, [Validators.required]],
        PostCode: [
          null,
          [
            Validators.required,
            Validators.maxLength(4),
            Validators.pattern(PATTERN.NUMERIC.PATTERN),
          ],
        ],
        PropertyAttributes: [''],
        ParkingRatio: [
          '',
          [
            Validators.maxLength(10),
            Validators.pattern(PATTERN.NUMERIC.PATTERN),
          ],
        ],
        BasementBays: [
          { value: '', disabled: true },
          [
            Validators.maxLength(10),
            Validators.pattern(PATTERN.NUMBER_DECIMAL),
          ],
        ],
        ShadedBays: [
          { value: '', disabled: true },
          [
            Validators.maxLength(10),
            Validators.pattern(PATTERN.NUMBER_DECIMAL),
          ],
        ],
        OpenBays: [
          { value: '', disabled: true },
          [
            Validators.maxLength(10),
            Validators.pattern(PATTERN.NUMBER_DECIMAL),
          ],
        ],
        Density: ['', [Validators.maxLength(50)]],
        GradeId: [null],
        AnnualFootCount: [
          '',
          [
            Validators.maxLength(100),
            Validators.pattern(PATTERN.NUMBER_DECIMAL),
          ],
        ],
        AnchorTenant: ['', [Validators.maxLength(100)]],
        TotalTenants: [
          '',
          [Validators.maxLength(10), Validators.pattern(PATTERN.GLA_PATTERN)],
        ],
      }),
      PropertyMedia: this.fb.group({
        Image: this.fb.array([]),
        Brochure: this.fb.group({
          Id: [''],
          Type: ['Brochure'],
          Name: [''],
          Url: ['', [Validators.maxLength(255)]],
          CreatedOn: [''],
          IsFile: false,
        }),
        RateCard: this.fb.group({
          Id: [''],
          Type: ['RateCard'],
          Name: [''],
          Url: ['', [Validators.maxLength(255)]],
          CreatedOn: [''],
          IsFile: false,
        }),
        Video: this.fb.group({
          Id: [''],
          Type: ['Video'],
          Name: [''],
          Url: ['', [Validators.maxLength(255)]],
          CreatedOn: [''],
          IsFile: false,
        }),
        FloorPlan: this.fb.group({
          Id: [''],
          Type: ['FloorPlan'],
          Name: [''],
          Url: ['', [Validators.maxLength(255)]],
          CreatedOn: [''],
          IsFile: false,
        }),
        FactSheet: this.fb.group({
          Id: [''],
          Type: ['FactSheet'],
          Name: [''],
          Url: ['', [Validators.maxLength(255)]],
          CreatedOn: [''],
          IsFile: false,
        }),
        MallMap: this.fb.group({
          Id: [''],
          Type: ['MallMap'],
          Name: [''],
          Url: ['', [Validators.maxLength(255)]],
          CreatedOn: [''],
          IsFile: false,
        }),
        Advertising: this.fb.array([]),
      }),
      ContactDetails: this.fb.group({
        LeasingExecutiveId: [null, [Validators.required]],
        BrokerLiaisonId: [null, [Validators.required]],
      }),
      PropertyFeatures: this.fb.group({
        FeatureAmenitiesAddtionalDetails: ['', [Validators.maxLength(700)]],
        FeaturesAmenitiesSectorId: this.fb.array([], [Validators.required]),
      }),
      PropertyEsgFeatures: this.fb.group({
        EsgFeatures: this.fb.array([]),

        OffsetPercentage: [''],
        ValidityStartDate: [''],
        ValidityEndDate: [''],
        AdditionalInformation: [''],
        LevelType: [''],
      }),
    });
  }

  get propertyDetailsForm() {
    return this.propertyForm.get('PropertyDetails') as FormGroup;
  }
  get propertyContactDetailsForm() {
    return this.propertyForm.get('ContactDetails') as FormGroup;
  }
  get propertyMediaForm() {
    return this.propertyForm.get('PropertyMedia') as FormGroup;
  }
  get propertyFeaturesForm() {
    return this.propertyForm.get('PropertyFeatures') as FormGroup;
  }
  get propertyEsgFeaturesForm() {
    return this.propertyForm.get('PropertyEsgFeatures') as FormGroup;
  }
  get esgFeaturesForm() {
    return this.propertyEsgFeaturesForm.get('EsgFeatures') as FormArray;
  }
  get imageForms() {
    return this.propertyMediaForm.get('Image') as FormArray;
  }
  get brochureForm() {
    return this.propertyMediaForm.get('Brochure') as FormGroup;
  }
  get rateCardForm() {
    return this.propertyMediaForm.get('RateCard') as FormGroup;
  }
  get videoForm() {
    return this.propertyMediaForm.get('Video') as FormGroup;
  }
  get floorPlanForm() {
    return this.propertyMediaForm.get('FloorPlan') as FormGroup;
  }
  get factSheetForm() {
    return this.propertyMediaForm.get('FactSheet') as FormGroup;
  }
  get mallMapForm() {
    return this.propertyMediaForm.get('MallMap') as FormGroup;
  }
  get propertyFeaturesAmenitiesForm() {
    return this.propertyFeaturesForm.get(
      'FeaturesAmenitiesSectorId'
    ) as FormArray;
  }

  async configureForm() {
    this.formConfig = await this.commonStoreService.getFormConfig();
    if(this.formConfig.mode === 'availability'|| this.formConfig.mode=='broker commission incentive' || this.formConfig.mode=='tenant incentive'){
      this.formConfig.mode = 'view';
    }
    switch (this.formConfig.mode) {
      case FORM_MODE.CREATE:
        this.getMdaPropertyDetails();
        break;
      case FORM_MODE.EDIT:
        this.getPropertyDetails();
        if(this.formConfig.page=='confirmation'){
          this.setColumnHeaders();
          this.initializeTableSettings();
        }
        break;
      case FORM_MODE.VIEW:
        this.getPropertyDetails();
        this.setColumnHeaders();
        this.initializeTableSettings();
        break;
    }
  }
  async getMdaPropertyDetails() {
    this.propertyService.getPropertyDetails().subscribe((result: any) => {
      this.propertyDetails = result;
      this.getEsgFeatures();
      this.fillFormData();
    });
  }
  getPropertyDetails() {
  
    this.loaderService.show();
    this.propertyService.getPropertyDetailsById(this.formConfig.id).subscribe({
      next: (res) => {
        this.loaderService.hide();
        this.propertyService.setPropertyDetails(res.data);
        this.propertyId = this.propertyDetails.details.PropertyId;
        this.fillFormData();
        this.getBrokerLiaison();
        this.getLeasingExecutives();
        this.getFeaturesAmenitiesBySector();
        this.getEsgFeatures();
        if (this.formConfig.mode == FORM_MODE.VIEW || this.formConfig.mode=='availability' || this.formConfig.mode=="broker commission incentive" || this.formConfig.mode=="tenant incentive" || this.formConfig.page=='confirmation') {
          this.getUnits();
        }
      },
      error: (error) => {
        this.loaderService.hide();
      },
    });
  }

  onSave(status: any = undefined) {
    this.validationMessages = [];
    switch (status) {
      case PROPERTY_STATUS.PUBLISH:
        this.validateFormControls(this.propertyForm);
        if (this.validationMessages.length > 0) {
          this.showNotification(false, this.validationMessages);
        } else {
          this.updatePropertyStatus(status);
        }
        break;
      case PROPERTY_STATUS.DRAFT:
        this.updatePropertyStatus(status);
        break;
      default:
        this.previewFrontend();
        break;
    }
    if (status == PROPERTY_STATUS.DRAFT || status == PROPERTY_STATUS.PUBLISH) {
    } else {
      this.previewFrontend();
    }
  }
  showNotification(isSuccess: boolean, message: any) {
    if (message instanceof Array) {
      if (message.length > 1) {
        message = message.map((m: any, index: number) => {
          return `${index + 1}. ${m}`;
        });
      }
      message = message.join('<br/>');
    }
    if (isSuccess) {
      this.toasterService.success(message);
    } else {
      this.toasterService.error(message, 'Error', {
        timeOut: 8000,
        enableHtml: true,
      });
    }
  }
  validateFormControls(form: any) {
    Object.keys(form.controls).forEach((control: any) => {
      let formControl = form.get(control);
      if (formControl instanceof FormGroup) {
        this.validateFormControls(formControl);
      } else if (formControl instanceof FormArray) {
        this.validateFormControls(formControl);
      } else if (formControl instanceof FormControl) {
        if (formControl.hasError('required')) {
          this.validationMessages.push(
            `${this.getControlLabel(control)} is required`
          );
        }
      }
    });
  }
  updatePropertyStatus(status: any) {
    this.propertyId = this.getControl(
      this.propertyDetailsForm,
      'PropertyId'
    ).value;
    this.loaderService.show();
    this.propertyService
      .updatePropertyStatus(this.propertyId, status)
      .subscribe({
        next: (res: any) => {
          this.loaderService.hide();
          this.toastMessage = res.message;
          // this.toasterService.success(res.message);
        },
        complete: () => {
          // this.goToManage();
          const dialogRef = this.dialog.open(UnitAvailabilityDialogComponent, {
            data: {
              text1:
                this.formConfig.mode === FORM_MODE.CREATE
                  ? `${this.propertyDetails.details.PropertyName} has been created`
                  : `${this.propertyDetails.details.PropertyName} has been updated`,
              text2: 'Would you like to create a unit for this property?',
              label: 'Property Created',
              btn1Text: CONSTANTS.CANCEL,
              btn2Text: CONSTANTS.YES,
              tablename: '',
            },
          });
          dialogRef.afterClosed().subscribe((action: any) => {
            if (action === CONSTANTS.YES) {
              this.setFormConfig(this.propertyId, FORM_MODE.CREATE);
              this.router
                .navigate([`${ROUTE.CREATE_UNIT_DETAILS}`])
                .then((m) => {
                  this.toasterService.success(this.toastMessage);
                });
            } else {
              this.router.navigate([ROUTE.MANAGE_PROPERTY]).then((m) => {
                this.toasterService.success(this.toastMessage);
              });
            }
          });
        },
        error: (error: any) => {
          this.loaderService.hide();
          this.toasterService.error(error.error.message);
        },
      });
  }
  async getLeasingExecutives() {
    this.leasingExecutives$ = await this.propertyService.getLeasingExecutive(
      this.propertyId
    );
  }
  async getBrokerLiaison() {
    this.brokerLiaison$ = await this.propertyService.getBrokerLiaison(
      this.propertyId
    );
  }
  async getEsgFeatures() {
    let esgFeatures$ = await this.propertyService.getEsgFeatures();
    esgFeatures$.subscribe({
      next: (result: any) => {
        this.mapDefaultEsgFeatures(this.propertyDetails.esgfeatures, result);
      },
      error: (error: any) => {},
    });
  }
  mapDefaultEsgFeatures(features: any[], featuresList: any[]) {
    let ids = features?.filter((feature: any) => feature.EsgFeaturesId);
    this.mergedEsgFeatureList = featuresList.map((feature: any) => {
      let subFeatures = feature.features.map((f: any) => {
        let featureData = features?.find(
          (fd: any) => fd.EsgFeaturesId == f.EsgFeaturesId
        );
        return {
          EsgFeaturesId: f.EsgFeaturesId,
          Name: f.Name,
          Rating: featureData?.Rating ? featureData.Rating : null,
          File: featureData?.File,
          Checked: featureData != undefined,
          OffsetPercentage: new FormControl(
            featureData?.OffsetPercentage ? featureData.OffsetPercentage : null,
            [Validators.pattern(PATTERN.NUMERIC.PATTERN)]
          ),
          ValidityStartDate: featureData?.ValidityStartDate
            ? featureData.ValidityStartDate
            : null,
          ValidityEndDate: featureData?.ValidityEndDate
            ? featureData.ValidityEndDate
            : null,
          AdditionalInformation: featureData?.AdditionalInformation
            ? featureData.AdditionalInformation
            : null,
          LevelType: featureData?.LevelType ? featureData.LevelType : null,
        };
      });
      return {
        Name: feature.name,
        Features: subFeatures,
        Checked: subFeatures.some((fd: any) => fd.Checked),
      };
    });
    this.mergedEsgFeatureList.forEach((feature) => {
      this.esgFeaturesForm.push(
        this.fb.group({
          Name: [feature.Name],
          Checked: [feature.Checked],
          Features: this.fb.array(
            feature.Features.map((sb: any) => this.createForm(sb, 'group'))
          ),
        })
      );
    });
  }
  async getFeaturesAmenitiesByProperty() {
    this.propertyFeaturesAmenities$ =
      await this.propertyService.getFeaturesAmenitiesByProperty(
        this.propertyId
      );
    this.propertyFeaturesAmenities$.subscribe((res: any) => {});
  }
  async getFeaturesAmenitiesBySector() {
    this.sectorFeaturesAmenities$ =
      await this.propertyService.getFeaturesAmenitiesBySector(
        this.propertyDetails.details.SectorId
      );
    this.sectorFeaturesAmenities$.subscribe((result: any) => {
      this.updateFeaturesAmenities(result);
    });
  }
  updateFeaturesAmenities(featureAmenitiesList: any[]) {
    this.mergedFeaturesAmenitiesList = featureAmenitiesList.map(
      (feature: any) => {
        let selectedFeature = [
          ...this.propertyDetails.featureamenities.features,
        ].find((f: any) => f.Id == feature.FeaturesAmenitiesSectorId);
        return Object.assign(feature, {
          Value: selectedFeature?.Value || null,
          Checked: selectedFeature?.Checked || 0,
        });
      }
    );
    Object.keys(this.propertyFeaturesForm.controls).forEach((control) => {
      let formControl = this.propertyFeaturesForm.get(control);
      this.setControlValue(control, formControl);
    });
  }
  fillFormData() {
    let formControl;
    Object.keys(this.propertyDetailsForm.controls).forEach((control) => {
      formControl = this.propertyDetailsForm.get(control);

      this.setControlValue(control, formControl);
    });
    Object.keys(this.propertyContactDetailsForm.controls).forEach((control) => {
      formControl = this.propertyContactDetailsForm.get(control);
      this.setControlValue(control, formControl);
    });
    Object.keys(this.propertyMediaForm.controls).forEach((control) => {
      formControl = this.propertyMediaForm.get(control);
      this.setControlValue(control, formControl);
    });
    this.configureMap();
  }
  configureMap() {
    if (
      this.propertyDetails?.details?.Latitude != '' &&
      this.propertyDetails?.details?.Longitude != ''
    ) {
      this.center = {
        lat: parseFloat(this.propertyDetails?.details?.Latitude),
        lng: parseFloat(this.propertyDetails?.details?.Longitude),
      };
      this.markerPositions = [
        {
          position: {
            lat: parseFloat(this.propertyDetails?.details?.Latitude),
            lng: parseFloat(this.propertyDetails?.details?.Longitude),
          },
        },
      ];
      this.propertyDetailsForm
        .get('Longitude')
        ?.setValue(parseFloat(this.propertyDetails?.details?.Longitude));
      this.propertyDetailsForm
        .get('Latitude')
        ?.setValue(parseFloat(this.propertyDetails?.details?.Latitude));
      this.getAddress(
        parseFloat(this.propertyDetails?.details?.Latitude),
        parseFloat(this.propertyDetails?.details?.Longitude)
      );
    }
  }
  toggleSectorFields(key: string) {
    this.sector = key;
    switch (key) {
      case 'Commercial':
        this.propertyDetailsForm
          .get(PROPERTY_FORM.PARKING_RATIO.NAME)
          ?.enable();
        this.propertyDetailsForm
          .get(PROPERTY_FORM.ANNUAL_FOOT_COUNT.NAME)
          ?.disable();
        this.propertyDetailsForm
          .get(PROPERTY_FORM.ANCHOR_TENANT.NAME)
          ?.disable();
        this.propertyDetailsForm
          .get(PROPERTY_FORM.TOTAL_TENANTS.NAME)
          ?.disable();
        this.propertyDetailsForm.get(PROPERTY_FORM.GRADE.NAME)?.disable();
        this.propertyDetailsForm.get(PROPERTY_FORM.DENSITY.NAME)?.disable();
        break;
      case 'Industrial':
        this.propertyDetailsForm
          .get(PROPERTY_FORM.PARKING_RATIO.NAME)
          ?.disable();
        this.propertyDetailsForm
          .get(PROPERTY_FORM.ANNUAL_FOOT_COUNT.NAME)
          ?.disable();
        this.propertyDetailsForm
          .get(PROPERTY_FORM.ANCHOR_TENANT.NAME)
          ?.disable();
        this.propertyDetailsForm
          .get(PROPERTY_FORM.TOTAL_TENANTS.NAME)
          ?.disable();
        this.propertyDetailsForm.get(PROPERTY_FORM.GRADE.NAME)?.enable();
        this.propertyDetailsForm.get(PROPERTY_FORM.DENSITY.NAME)?.enable();
        break;
      case 'Retail':
        this.propertyDetailsForm
          .get(PROPERTY_FORM.PARKING_RATIO.NAME)
          ?.enable();
        this.propertyDetailsForm
          .get(PROPERTY_FORM.ANNUAL_FOOT_COUNT.NAME)
          ?.enable();
        this.propertyDetailsForm
          .get(PROPERTY_FORM.ANCHOR_TENANT.NAME)
          ?.enable();
        this.propertyDetailsForm
          .get(PROPERTY_FORM.TOTAL_TENANTS.NAME)
          ?.enable();
        this.propertyDetailsForm.get(PROPERTY_FORM.GRADE.NAME)?.disable();
        this.propertyDetailsForm.get(PROPERTY_FORM.DENSITY.NAME)?.disable();
        break;
    }
  }
  setControlValue(controlName: any, formControl: any) {
    switch (controlName) {
      case PROPERTY_FORM.LATITUDE.NAME:
      case PROPERTY_FORM.LONGITUDE.NAME:
        break;
      case PROPERTY_FORM.BUILDING_CODE.NAME:
        if (!this.isUndefinedOrEmpty(this.propertyDetails?.details)) {
          this.setFormValue(
            formControl,
            this.propertyDetails?.details[controlName]
          );
          this.propertyDetailsForm
            .get(PROPERTY_FORM.BUILDING_CODE.NAME)
            ?.disable();
        }
        break;
      case PROPERTY_FORM.SECTOR_ID.NAME:
        sessionStorage.removeItem(SESSION.PROPERTY_FEATURES_AMENITIES);
        sessionStorage.removeItem(SESSION.SECTOR_FEATURES_AMENITIES);
        if (!this.isUndefinedOrEmpty(this.propertyDetails?.details)) {
          this.setFormValue(
            formControl,
            this.propertyDetails?.details[controlName]
          );
          this.toggleSectorFields(this.propertyDetails?.sector?.Name);
        }
        break;
      case PROPERTY_FORM.GLA.NAME:
        this.propertyDetailsForm
          .get('Gla')
          ?.setValue(
            this.commonService.numberWithCommas(
              this.propertyDetails.details.Gla
            )
          );
        break;
      case PROPERTY_FORM.GRADE.NAME:
        if (
          this.propertyDetails.details.Grade != null &&
          this.propertyDetails.details.Grade != ''
        ) {
          this.propertyDetailsForm
            .get('Grade')
            ?.setValue(this.propertyDetails.details.Grade);
          this.propertyDetailsForm.get('Grade')?.disable();
        }
        break;
      case PROPERTY_FORM.PROPERTY_ATTRIBUTES.NAME:
        if (!this.isUndefinedOrEmpty(this.propertyDetails)) {
          this.setFormValue(formControl, this.propertyDetails[controlName]);
        }
        break;
      case PROPERTY_FORM.BASEMENT_BAYS.NAME:
        if (!this.isUndefinedOrEmpty(this.propertyDetails?.details)) {
          this.setFormValue(
            formControl,
            this.propertyDetails?.details[controlName]
          );
          this.togglePropertyBays(
            formControl,
            this.propertyDetails[controlName] != ''
          );
        }
        break;
      case PROPERTY_FORM.SHADED_BAYS.NAME:
        if (!this.isUndefinedOrEmpty(this.propertyDetails?.details)) {
          this.setFormValue(
            formControl,
            this.propertyDetails?.details[controlName]
          );
          this.togglePropertyBays(
            formControl,
            this.propertyDetails[controlName] != ''
          );
        }
        break;
      case PROPERTY_FORM.OPEN_BAYS.NAME:
        if (!this.isUndefinedOrEmpty(this.propertyDetails?.details)) {
          this.setFormValue(
            formControl,
            this.propertyDetails?.details[controlName]
          );
          this.togglePropertyBays(
            formControl,
            this.propertyDetails[controlName] != ''
          );
        }
        break;
      case PROPERTY_FORM.COUNTRY_ID.NAME:
        this.propertyDetailsForm
          .get('Country')
          ?.setValue(this.propertyDetails?.details.Country);
        break;
      case PROPERTY_FORM.SUBURB.NAME:
        this.propertyDetailsForm
          .get('Suburb')
          ?.setValue(this.propertyDetails?.details.Suburb);
        break;
      case PROPERTY_FORM.CITY.NAME:
        this.propertyDetailsForm
          .get('City')
          ?.setValue(this.propertyDetails?.details.City);
        break;
      case PROPERTY_FORM.PROVINCE_ID.NAME:
        this.propertyDetailsForm
          .get('Province')
          ?.setValue(this.propertyDetails?.details.Province);
        break;
      default:
        if (
          (this.propertyDetailsForm.contains(controlName) ||
            this.propertyContactDetailsForm.contains(controlName)) &&
          !this.isUndefinedOrEmpty(this.propertyDetails?.details)
        ) {
          this.setFormValue(
            formControl,
            this.propertyDetails?.details[controlName]
          );
        } else if (
          this.propertyMediaForm.contains(controlName) &&
          !this.isUndefinedOrEmpty(this.propertyDetails?.media)
        ) {
          this.setFormValue(
            formControl,
            this.propertyDetails?.media[controlName]
          );
        } else if (this.propertyFeaturesForm.contains(controlName)) {
          if (
            controlName ==
            PROPERTY_FEATURES_FORM.FEATURE_AMENITIES_SECTOR_ID.NAME
          ) {
            this.mergedFeaturesAmenitiesList.forEach((d: any) => {
              if (
                !formControl.value.some(
                  (c: any) =>
                    c.FeaturesAmenitiesSectorId == d.FeaturesAmenitiesSectorId
                )
              ) {
                let featureForm = this.createForm(d, 'group') as FormGroup;
                if (d.Title == 'Sprinklers') {
                  if (
                    this.sprinklerSpec.some((spec: any) => spec.Name == d.Value)
                  ) {
                    featureForm.addControl('Spec', new FormControl(d.Value));
                    this.sprinklerSpecId = undefined;
                    featureForm.get('Value')?.setValue(d.Value);
                  } else {
                    featureForm.addControl('Spec', new FormControl('Other'));
                    this.sprinklerSpecId = 3;
                    featureForm.get('Value')?.setValue(d.Value);
                  }
                }
                if (d.Title == 'Standby water') {
                  if (
                    this.standByWater.some(
                      (stand: any) => stand.Name == d.Value
                    )
                  ) {
                    featureForm.addControl('Stand', new FormControl(d.Value));
                    this.standByWaterId = undefined;
                    featureForm.get('Value')?.setValue(d.Value);
                  } else {
                    featureForm.addControl(
                      'Stand',
                      new FormControl('Yes, pro-rata water usage charged')
                    );
                    this.standByWaterId = 1;
                    // featureForm.get('Value')?.setValue(d.Value);
                    featureForm
                      .get('Value')
                      ?.setValue('Yes, pro-rata water usage charged');
                  }
                }
                if (d.Title == 'Backup generator') {
                  if (
                    this.backUpGenerator.some(
                      (backUp: any) => backUp.Name == d.Value
                    )
                  ) {
                    featureForm.addControl('BackUp', new FormControl(d.Value));
                    this.backUpGeneratorId = undefined;
                    featureForm.get('Value')?.setValue(d.Value);
                  } else {
                    featureForm.addControl(
                      'BackUp',
                      new FormControl('Yes, pro-rata diesel charge')
                    );
                    this.backUpGeneratorId = 1;
                    // featureForm.get('Value')?.setValue(d.Value);
                    featureForm
                      .get('Value')
                      ?.setValue('Yes, pro-rata diesel charge');
                  }
                }
                featureForm
                  .get('Value')
                  ?.setValidators([Validators.maxLength(255)]);
                formControl.push(featureForm);
              }
            });
          } else if (
            this.propertyEsgFeaturesForm.contains(controlName) &&
            !this.isUndefinedOrEmpty(this.propertyDetails?.esgfeatures)
          ) {
            this.setFormValue(
              formControl,
              this.propertyDetails?.esgfeatures[controlName]
            );
          } else {
            if (
              !this.isUndefinedOrEmpty(this.propertyDetails?.featureamenities)
            ) {
              this.setFormValue(
                formControl,
                this.propertyDetails?.featureamenities[controlName]
              );
            }
          }
        }
        break;
    }
  }
  isUndefinedOrEmpty(data: any): any {
    return data == undefined || data == null || data == '';
  }
  togglePropertyBays(formControl: any, enable: boolean) {
    if (enable) {
      formControl.enable();
    } else {
      formControl.disable();
    }
  }
  setFormValue(control: any, data: any) {
    if (data) {
      if (control instanceof FormArray) {
        data?.forEach((d: any) => control.push(this.createForm(d, 'group')));
      } else if (control instanceof FormGroup) {
        control.patchValue(data);
      } else if (control instanceof FormControl) {
        control.setValue(data);
      }
    }
  }
  createForm(
    data: any,
    type: string
  ): FormGroup | FormArray | FormControl | any {
    switch (type) {
      case 'group':
        return this.fb.group(data);
      case 'array':
        return this.fb.array(data);
      case 'control':
        return this.fb.control(data);
      default:
        return null;
    }
  }
  formatMultiselectData(data: any[]) {
    return data.map((d) => d.Id);
  }
  /**************************************************************************
   *                             HELPERS                                     *
   **************************************************************************/
  getControl(form: any, control: string): FormControl {
    return form.get(control) as FormControl;
  }
  previewFrontend() {
    const dialogRef = this.dialog.open(PropertyPreviewComponent, {
      data: {
        id: this.propertyId,
      },
    });
    dialogRef.afterClosed().subscribe((result: any) => {});
  }
  changeStep(route: string, message?: any) {
    message
      ? this.router.navigate([route]).then((res) => {
          this.toasterService.success(message);
        })
      : this.router.navigate([route]);
  }
  goToManage() {
    this.router.navigate([ROUTE.MANAGE_PROPERTY]);
  }
  async setFormConfig(propertyId: number, mode: string) {
    this.formConfig = {
      id: propertyId,
      mode: mode,
    };
    await this.commonStoreService.setFormConfig(this.formConfig);
  }
  editBuilding() {
    this.setFormConfig(this.propertyId, FORM_MODE.EDIT);
    this.changeStep(ROUTE.CREATE_PROPERTY_DETAILS);
  }
  getAddress(latitude: any, longitude: any) {
    this.propertyDetailsForm.get('Longitude')?.setValue(longitude);
    this.propertyDetailsForm.get('Latitude')?.setValue(latitude);
    if (this.formConfig.mode == FORM_MODE.CREATE) {
      this.getAddressDetails(latitude, longitude);
    }
  }
  async getAddressDetails(latitude: any, longitude: any) {
    const { Geocoder } = (await google.maps.importLibrary(
      'geocoding'
    )) as google.maps.GeocodingLibrary;
    var geocoder = new Geocoder();
    geocoder.geocode(
      { location: { lat: latitude, lng: longitude } },
      (results: any, status: any) => {
        if (status === 'OK') {
          if (results[0]) {
            const places: any = [];
            results[0].address_components.forEach((element: any) => {
              element.types.filter((o: any) =>
                this.types.some(
                  (place) =>
                    o === place && places.push({ [place]: element.long_name })
                )
              );
            });
            this.address = (
              places.find((x: any) => x['route'])
                ? places.find((x: any) => x['route'])['route']
                : ''
            )
              .concat(',')
              .concat(
                places.find((x: any) => x['sublocality'])
                  ? places.find((x: any) => x['sublocality'])['sublocality']
                  : ''
              );
            this.city = places.find((x: any) => x['locality'])
              ? places.find((x: any) => x['locality'])['locality']
              : '';
            if (this.city == '') {
              this.propertyDetailsForm.get('City')?.enable();
            }
            this.suburb = places.find((x: any) => x['sublocality'])
              ? places.find((x: any) => x['sublocality'])['sublocality']
              : '';
            if (this.suburb == '') {
              this.propertyDetailsForm.get('Suburb')?.enable();
            }
            this.country = places.find((x: any) => x['country'])
              ? places.find((x: any) => x['country'])['country']
              : '';
            if (this.country == '') {
              this.propertyDetailsForm.get('Country')?.enable();
            }
            this.province = places.find(
              (x: any) => x['administrative_area_level_1']
            )
              ? places.find((x: any) => x['administrative_area_level_1'])[
                  'administrative_area_level_1'
                ]
              : '';
            if (this.province == '') {
              this.propertyDetailsForm.get('Province')?.enable();
            }
            this.postalCode = places.find((x: any) => x['postal_code'])
              ? places.find((x: any) => x['postal_code'])['postal_code']
              : '';
            // if (this.formConfig.mode == FORM_MODE.CREATE) {
            //   this.countries$.subscribe((res) => {
            //     res.forEach((country: any) => {
            //       if (country.Name === this.country) {
            //         this.propertyDetailsForm
            //           .get('CountryId')
            //           ?.setValue(country.Id);
            //       }
            //     });
            //   });
            //   this.provinces$.subscribe((res) => {
            //     res.forEach((province: any) => {
            //       if (province.Name === this.province) {
            //         this.propertyDetailsForm
            //           .get('ProvinceId')
            //           ?.setValue(province.Id);
            //       }
            //     });
            //   });
            //   this.propertyDetailsForm.get('Address')?.setValue(this.address);
            //   this.propertyDetailsForm.get('Suburb')?.setValue(this.suburb);
            //   this.propertyDetailsForm.get('City')?.setValue(this.city);
            // }

            // if (this.formConfig.mode == FORM_MODE.CREATE) {
            this.propertyDetailsForm.get('Country')?.setValue(this.country);
            this.propertyDetailsForm.get('Province')?.setValue(this.province);
            this.propertyDetailsForm.get('Suburb')?.setValue(this.suburb);
            this.propertyDetailsForm.get('City')?.setValue(this.city);
            this.propertyDetailsForm.get('PostCode')?.setValue(this.postalCode);
            // }
          } else {
            this.toasterService.error(status);
          }
        } else {
          this.toasterService.error(status);
        }
      }
    );
  }
  displayError(error: any) {
    let errors = JSON.parse(error);
    Object.keys(errors).forEach((err: any) => {
      this.toasterService.error(errors[err][0]);
    });
  }
  onChange(event: any) {
    this.validateFormField(event);
    if (event.control === PROPERTY_FORM.GLA.NAME) {
      let modifiedValue = this.commonService.keyUpValue(event.value);
      if (modifiedValue != event.value) {
        this.propertyDetailsForm.get('Gla')?.setValue(modifiedValue);
      }
    }
  }
  validateFormField(data: any) {
    let control: FormControl = this.getControl(data.form, data.control);
    if (control.hasError('required')) {
      control?.setErrors({
        ...control.errors,
        invalid: `${this.getControlLabel(data.control)} is required`,
      });
    } else if (control.hasError('minlength')) {
      control?.setErrors({
        ...control.errors,
        invalid: `Minimum ${
          control.getError('minlength')?.requiredLength
        }  characters are allowed`,
      });
    } else if (control.hasError('maxlength')) {
      control?.setErrors({
        ...control.errors,
        invalid: `Maximum ${
          control.getError('maxlength')?.requiredLength
        } characters are allowed`,
      });
    } else if (control.hasError('pattern')) {
      control?.setErrors({
        ...control.errors,
        invalid: this.getControlPatternMessage(data.control),
      });
    }
  }
  getControlLabel(control: string) {
    let result: any = Object.values(PROPERTY_FORM).find(
      (res: any) => res.NAME == control
    );
    return result ? result.LABEL : control;
  }
  getControlPatternMessage(control: string): any {
    let result: any = Object.values(PROPERTY_FORM).find(
      (res: any) => res.NAME == control
    );
    return result
      ? result.PATTERN_MESSAGE
        ? result.PATTERN_MESSAGE
        : `Please provide valid ${control}`
      : `Please provide valid ${control}`;
  }

  markLocation(Latitude: any, Longitude: any) {
    this.center = {
      lat: parseFloat(this.propertyDetailsForm.get('Latitude')?.value),
      lng: parseFloat(this.propertyDetailsForm.get('Longitude')?.value),
    };
    this.markerPositions = [
      {
        position: {
          lat: parseFloat(this.propertyDetailsForm.get('Latitude')?.value),
          lng: parseFloat(this.propertyDetailsForm.get('Longitude')?.value),
        },
      },
    ];
    this.getAddressDetails(this.center.lat, this.center.lng);
  }

  setColumnHeaders() {
    this.columns = [
      {
        field: 'checkbox',
        header: '',
        sort: false,
        visible: false,
        show: true,
      },
      {
        field: 'NameAndLocation',
        header: 'Unit Name',
        sort: true,
        visible: true,
        show: true,
      },
      {
        field: 'UnitSize',
        header: 'Unit Size(sqm)',
        sort: false,
        visible: true,
        show: true,
      },
      {
        field: 'GrossRental',
        header: 'Gross(R/sqm)',
        sort: false,
        visible: true,
        show: true,
      },
      {
        field: 'BrokerIncentives',
        header: 'Broker Commission Incentive',
        sort: false,
        visible: true,
        show: true,
      },
      {
        field: 'IncentiveStatus',
        header: 'Tenant Incentive',
        sort: false,
        visible: true,
        show: true,
      },
      {
        field: 'UnitStatus',
        header: 'Availability',
        sort: false,
        visible: true,
        show: true,
      },
      {
        field: 'actions',
        header: 'Actions',
        sort: false,
        visible: false,
        show: true,
      },
    ];
    this.filterColumns = this.columns;
  }

  initializeTableSettings(): void {
    this.tableSettings = {
      rows: [],
      columns: this.columns,
      tablename: 'Units Created',
    };
  }

  getUnits(pageSize?: any, pageNumber?: any) {
    this.loaderService.show();
    if (pageSize != undefined && pageNumber != undefined) {
      this.pageSize = pageSize;
      this.pageNumber = pageNumber;
    }
    this.propertyService
      .getAllUnitsbyProperty(this.pageSize, this.pageNumber, this.propertyId)
      .subscribe({
        next: (res) => {
          this.unitsData(res);
        },
        error: (error) => {
          this.loaderService.hide();
          this.toasterService.error(error.error.message);
        },
        complete: () => {
          this.loaderService.hide();
        },
      });
  }

  unitsData(res: any) {
    this.initializeTableSettings();
    if (res.data) {
      this.totalRowsCount = res.data.totalCount;
      this.pageCnt = res.data.pageCount;
      this.access = res.data.FullAccess;
      if (res.data.FullAccess === 1) {
        res.data.units.forEach((e: any) => {
          e.checkbox = '';
          e.operations = [
            {
              name: CONSTANTS.VIEW,
              icon: CONSTANTS.DETAILS_ICON,
              operationName: CONSTANTS.VIEW,
              path: 'assets/images/eye.svg',
            },
            {
              name: CONSTANTS.EDIT_OPERATION,
              icon: CONSTANTS.EDIT,
              operationName: CONSTANTS.EDIT,
              path: 'assets/images/edit.svg',
            },
            {
              name: CONSTANTS.EDIT_BROKER_INCENTIVE,
              icon: CONSTANTS.EDIT,
              operationName: CONSTANTS.EDIT_BROKER_INCENTIVE,
              path: 'assets/images/user.svg',
            },
            {
              name: CONSTANTS.EDIT_TENANT_INCENTIVE,
              icon: CONSTANTS.EDIT,
              operationName: CONSTANTS.EDIT_TENANT_INCENTIVE,
              path: 'assets/images/user.svg',
            },
            {
              name: CONSTANTS.DELETE,
              icon: CONSTANTS.DELETE_ICON,
              operationName: CONSTANTS.DELETE,
              path: 'assets/images/delete.svg',
            },
          ];
        });
      } else {
        res.data.units.forEach((e: any) => {
          e.operations = [
            {
              name: CONSTANTS.VIEW,
              icon: CONSTANTS.DETAILS_ICON,
              operationName: CONSTANTS.VIEW,
              path: 'assets/images/eye.svg',
            },
          ];
        });
      }
      this.rows = res.data.units;
      this.tableSettings = {
        rows: this.rows,
        columns: this.columns,
        id: 'PropertyUnitId',
        Id: 'PropertyId',
        totalRowsCount: this.totalRowsCount,
        pageCnt: this.pageCnt,
        tablename: 'Units Created',
        isPaginationRequired: true,
        // isFilterRequired: true,
        isSearchRequired: true,
        isColumnGroupRequired: true,
        isDownloadRequired: true,
        showActions: true,
      };
    } else {
      this.rows = [];
      this.totalRowsCount = 0;
      this.pageCnt = 0;
    }
  }

  tableData(event: any) {
    this.getUnitsData(event);
  }

  getUnitsData(event: any): void {
    this.loaderService.show();
    this.pageNumber = event.pageNumber;
    this.propertyService
      .getAllUnitsbyProperty(
        event.pageSize,
        event.pageNumber,
        this.propertyId,
        event.searchValue,
        event.sortBy,
        event.sortOrder
      )
      .subscribe({
        next: (res) => {
          this.unitsData(res);
        },
        error: (error: ErrorEvent) => {
          this.toasterService.error(error.error.message);
          this.loaderService.hide();
        },
        complete: () => {
          this.loaderService.hide();
        },
      });
  }

  async rowActions(data: any) {
    let unit: any = {
      mode: data.operation,
      id:
        data.rowData.rowData instanceof Array
          ? data.rowData.rowData[0].PropertyUnitId
          : data.rowData.PropertyUnitId,
    };
    await this.commonStoreService.setFormConfig(unit);
    if (data.operation === 'availability') {
      this.formConfig.mode = 'view';
      this.getUnits(data.pageSize, data.activePageNumber);
    }

    if (data.operation === CONSTANTS.EDIT_BROKER_INCENTIVE.toLowerCase()) {
      {
        this.formConfig.mode = 'view';
        const dialogRef = this.dialog.open(
          BrokerCommissionIncentivesFormComponent,
          {
            data: {
              row: data.rowData,
              PropertyId: this.propertyId,
            },
          }
        );
        dialogRef.afterClosed().subscribe((result: any) => {
          if (result === CONSTANTS.YES) {
            this.getUnits(data.pageSize, data.activePageNumber);
            this.selectedRows = [];
          }
        });
      }
    }
    if (data.operation === CONSTANTS.EDIT_TENANT_INCENTIVE.toLowerCase()) {
      {
        this.formConfig.mode = 'view';
        const dialogRef = this.dialog.open(TenantIncentivesFormComponent, {
          data: {
            row: data.rowData,
            PropertyId: this.propertyId,
          },
        });
        dialogRef.afterClosed().subscribe((result: any) => {
          if (result === CONSTANTS.YES) {
            this.getUnits(data.pageSize, data.activePageNumber);
            this.selectedRows = [];
          }
        });
      }
    } else if (data.operation === CONSTANTS.EDIT) {
      this.router.navigate([`${ROUTE.CREATE_UNIT_DETAILS}`]);
    } else if (data.operation === CONSTANTS.VIEW.toLowerCase()) {
      this.router.navigate([`${ROUTE.CREATE_UNIT_DETAILS}`]);
    } else if (data.operation === CONSTANTS.DELETE.toLowerCase()) {
      this.formConfig.mode = 'view';
      const dialogRef = this.dialog.open(UnitAvailabilityDialogComponent, {
        data: {
          text1: CONSTANTS.UNIT_DELETE_CONFIRMATION_TEXT1,
          text2: CONSTANTS.UNIT_DELETE_CONFIRMATION_TEXT2,
          label: 'Delete Unit',
          btn1Text: CONSTANTS.CANCEL,
          btn2Text: CONSTANTS.YES,
          tablename: '',
        },
      });
      dialogRef.afterClosed().subscribe((action: any) => {
        if (action === CONSTANTS.YES) {
          this.loaderService.show();
          this.propertyService
            .deleteUnit(data.rowData.PropertyUnitId)
            .subscribe({
              next: (res) => {
                this.toasterService.success(res.message);
                this.getUnits(data.pageSize, data.activePageNumber);
                this.loaderService.hide();
              },
              error: (error) => {
                this.loaderService.hide();
                this.toasterService.error(error.error.message);
              },
            });
        }
      });
    }
  }

  unitFunctions(event: any) {
    this.selectedRows = event;
  }

  // changeAvailability(data: any) {
  //   const dialogRef = this.dialog.open(UnitAvailabilityDialogComponent, {
  //     data: {
  //       text1:
  //         data === 'Available'
  //           ? CONSTANTS.UNIT_AVAILABILITY_TEXT1
  //           : CONSTANTS.UNIT_AVAILABILITY_UNAVAILABLE,
  //       text2: CONSTANTS.UNIT_AVAILABILITY_TEXT2,
  //       label: 'Setting Availability',
  //       btn1Text: CONSTANTS.CANCEL,
  //       btn2Text: CONSTANTS.YES,
  //       tablename: 'Units Created',
  //     },
  //   });
  //   dialogRef.afterClosed().subscribe((action: any) => {
  //     const units = [];
  //     units.push(this.selectedRows.map((x: any) => x.PropertyUnitId));
  //     var unitObject = {
  //       PropertyId: this.selectedRows[0].PropertyId,
  //       Status: data === 'Available' ? 1 : 2,
  //       Units: units[0],
  //     };
  //     if (action === CONSTANTS.YES) {
  //       this.loaderService.show();
  //       this.propertyService.unitStatusUpdate(unitObject).subscribe({
  //         next: (res: any) => {
  //           this.toasterService.success(res.message);
  //           this.loaderService.hide();
  //           var data = {
  //             operation: 'availability',
  //             rowData: unitObject,
  //           };
  //           this.rowActions(data);
  //           this.selectedRows = [];
  //         },
  //         error: (error: any) => {
  //           this.loaderService.hide();
  //           this.toasterService.error(error.error.message);
  //         },
  //       });
  //     } else {
  //     }
  //   });
  // }
  changeAvailability(status: string) {
    const newStatus = status;

    const dialogRef = this.dialog.open(UnitAvailabilityDialogComponent, {
      data: {
        text1: [
          'Available',
          'Under Offer',
          'Under Negotiation',
          'Let',
        ].includes(newStatus)
          ? `Are you sure you want to set this availability to ${newStatus}?`
          : CONSTANTS.UNIT_AVAILABILITY_UNAVAILABLE,
        text2: CONSTANTS.UNIT_AVAILABILITY_TEXT2,
        label: 'Setting Availability',
        btn1Text: CONSTANTS.CANCEL,
        btn2Text: CONSTANTS.YES,
        tablename: 'Units Created',
        rowId: newStatus,
      },
    });

    dialogRef.afterClosed().subscribe((action: any) => {
      if (
        [
          'Available',
          'Unavailable',
          'Under Offer',
          'Under Negotiation',
          'Let',
        ].includes(action)
      ) {
        const units = this.selectedRows.map((x: any) => x.PropertyUnitId);
        const unitObject = {
          PropertyId: this.selectedRows[0].PropertyId,
          Status: this.getStatusValue(newStatus),
          Units: units,
        };
        this.loaderService.show();
        this.propertyService.unitStatusUpdate(unitObject).subscribe({
          next: (res: any) => {
            this.toasterService.success(res.message);
            this.loaderService.hide();
            const data = {
              operation: 'availability',
              rowData: unitObject,
              activePageNumber: this.pageNumber,
              pageSize: this.pageSize,
            };
            this.rowActions(data);
            this.selectedRows = [];
          },
          error: (error: any) => {
            this.loaderService.hide();
            this.toasterService.error(error.error.message);
          },
        });
      }
    });
  }

  getStatusByValue(value: string): string {
    switch (value) {
      case '1':
        return 'Available';
      case '2':
        return 'Unavailable';
      case '3':
        return 'Under Offer';
      case '4':
        return 'Under Negotiation';
      case '5':
        return 'Let';
      default:
        return '';
    }
  }

  getStatusValue(status: string): number {
    switch (status) {
      case 'Available':
        return 1;
      case 'Unavailable':
        return 2;
      case 'Under Offer':
        return 3;
      case 'Under Negotiation':
        return 4;
      case 'Let':
        return 5;
      default:
        return 0;
    }
  }

  updateBrokerCommissionIncentive() {
    var data = {
      operation: 'broker commission incentive',
      rowData: this.selectedRows,
    };
    this.rowActions(data);
  }
  updateTenantIncentive() {
    let rowData = {
      rowData: this.selectedRows,
    };
    var data = {
      operation: 'tenant incentive',
      rowData: rowData,
    };
    this.rowActions(data);
  }
}
