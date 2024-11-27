import { Component, OnDestroy, SimpleChanges } from '@angular/core';
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
import { IMedia } from 'src/app/interfaces/media';
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
import { StepperService } from '../../../../services/stepper.service';
import { PropertyService } from 'src/app/admin/services/property.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { InternationalPropertyPreviewComponent } from './components/international-property-preview/international-property-preview.component';
import { UnitAvailabilityDialogComponent } from '../unit/components/unit-availability-dialog/unit-availability-dialog.component';
import { toHtml } from '@fortawesome/fontawesome-svg-core';
import { MarkerConfig } from 'src/app/interfaces/map';

@Component({
  selector: 'app-international-property',
  templateUrl: './international-property.component.html',
  styleUrls: ['./international-property.component.scss'],
})
export class InternationalPropertyComponent implements OnDestroy {
  route = ROUTE;
  formStep!: any;
  formConfig: any;
  propertyForm!: FormGroup;
  propertyStatus = PROPERTY_STATUS;
  propertyId: any;
  sectors$!: Observable<any[]>;
  mergedFeaturesAmenitiesList!: any[];
  propertyFeaturesAmenities$!: Observable<any[]>;
  breeamCertificationRatingId: any;

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
  breeamCertificationRating$: Observable<any> = of(
    this.breeamCertificationRating
  );

  // countries$!: Observable<any[]>;
  center!: google.maps.LatLngLiteral;
  markerPositions!: MarkerConfig[];

  types = [
    'route',
    'sublocality',
    'administrative_area_level_2',
    'administrative_area_level_1',
    'country',
    'locality',
    'postal_code',
  ];

  completionType$: Observable<any> = of([
    {
      Id: 1,
      Name: 'Under Construction',
    },
    {
      Id: 2,
      Name: 'Asset Completed',
    },
  ]);

  range: any = [];
  range$: Observable<any[]> = of(this.range);
  holdingCompanyList$!: Observable<any>;
  holdingCompanyList: any;
  country: string = '';
  province: string = '';
  suburb: string = '';
  city: string = '';
  postalCode: any;
  address: any;
  showLocation: boolean = false;
  toastMessage: any;
  getYear() {
    var Year = new Date('1970-01-01').getFullYear();

    for (var i = 0; i <= 58; i++) {
      this.range.push({
        Id: i,
        Name: Year + i,
      });
    }
  }

  formSteps: any[] = [
    {
      stepNumber: 1,
      stepRoute: 'international-property-details',
      stepName: 'Property Details',
    },
    {
      stepNumber: 2,
      stepRoute: 'international-property-media',
      stepName: 'Media',
    },
    {
      stepNumber: 3,
      stepRoute: 'international-property-features',
      stepName: 'Additional Information',
    },
    {
      stepNumber: 4,
      stepRoute: 'international-property-confirmation',
      stepName: 'Confirm',
    },
  ];
  propertyDetails: any;
  media: IMedia = {
    Id: '',
    Type: '',
    Name: '',
    Url: '',
    CreatedOn: '',
    IsFile: false,
  };

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

  ngOnInit() {
    this.getYear();
    this.commonStoreService.formConfig$.subscribe(
      (res) => (this.formConfig = res)
    );
    this.getHoldingCompanies();
    this.setForm();
    this.configureForm();
    this.propertyService
      .getInternationalPropertyDetails()
      .subscribe((result: any) => {
        this.propertyDetails = result;
      });
  }

  async getHoldingCompanies() {
    this.holdingCompanyList$ =
      await this.propertyService.getPropertyHoldingCompanies();
    this.holdingCompanyList$.subscribe({
      next: (res: any) => {
        this.holdingCompanyList = res;
      },
      error: (error: any) => {},
    });
  }

  setForm() {
    this.propertyForm = this.fb.group({
      PropertyDetails: this.fb.group({
        PropertyId: [''],
        Type: [2],
        BuildingCode: [null],
        HoldingCompanyId: [null, [Validators.required]],
        PropertyName: ['', [Validators.required, Validators.maxLength(100)]],
        SectorId: [null, [Validators.required]],
        Gla: [
          '',
          [
            Validators.required,
            Validators.maxLength(50),
            Validators.pattern(PATTERN.GLA_PATTERN_INT),
          ],
        ],
        WebsiteUrl: ['', [Validators.maxLength(255)]],
        PropertyDescription: [''],
        CompletionType: [null, [Validators.required]],
        ProvideYear: [null, [Validators.required]],
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
        Suburb: ['', [Validators.maxLength(50)]],
        // ProvinceId: [null, [Validators.required]],
        Country: [{ value: '', disabled: true }, [Validators.required]],
        Province: [{ value: '', disabled: true }, , [Validators.required]],
        PostCode: [
          null,
          [
            Validators.required,
            Validators.maxLength(8),
            Validators.pattern(PATTERN.NUMBER_DASH),
          ],
        ],
        PropertyAttributes: [''],
      }),
      PropertyMedia: this.fb.group({
        Image: this.fb.array([]),
      }),

      PropertyFeatures: this.fb.group({
        FeaturesAmenitiesSectorId: this.fb.array([], [Validators.required]),
      }),
    });
  }

  get propertyDetailsForm() {
    return this.propertyForm.get('PropertyDetails') as FormGroup;
  }
  get propertyMediaForm() {
    return this.propertyForm.get('PropertyMedia') as FormGroup;
  }
  get propertyFeaturesForm() {
    return this.propertyForm.get('PropertyFeatures') as FormGroup;
  }
  get imageForms() {
    return this.propertyMediaForm.get('Image') as FormArray;
  }
  get propertyFeaturesAmenitiesForm() {
    return this.propertyFeaturesForm.get(
      'FeaturesAmenitiesSectorId'
    ) as FormArray;
  }

  getControl(form: any, control: string): FormControl {
    return form.get(control) as FormControl;
  }

  async configureForm() {
    this.formConfig = await this.commonStoreService.getFormConfig();
    switch (this.formConfig.mode) {
      case FORM_MODE.CREATE:
        break;
      case FORM_MODE.EDIT:
        this.showLocation = true;
        this.getPropertyDetails();
        break;
      case FORM_MODE.VIEW:
        this.getPropertyDetails();
        break;
    }
  }

  getPropertyDetails() {
    this.loaderService.show();
    this.propertyService.getPropertyDetailsById(this.formConfig.id).subscribe({
      next: (res) => {
        this.loaderService.hide();
        this.propertyService.setInternationalPropertyDetails(res.data);
        this.propertyDetails = res.data;
        this.propertyId = this.propertyDetails.details.PropertyId;
        this.fillFormData();
        this.getFeaturesAmenitiesByProperty();
      },
      error: (error) => {
        this.loaderService.hide();
      },
    });
  }

  async getFeaturesAmenitiesByProperty() {
    this.propertyFeaturesAmenities$ =
      await this.propertyService.getFeaturesAmenitiesByProperty(
        this.propertyId
      );
    this.propertyFeaturesAmenities$.subscribe((result: any) => {
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

  setControlValue(controlName: any, formControl: any) {
    switch (controlName) {
      case PROPERTY_FORM.LATITUDE.NAME:
        if (!this.isUndefinedOrEmpty(this.propertyDetails?.details)) {
          this.setFormValue(
            formControl,
            this.propertyDetails?.details[controlName]
          );
        }
        break;
      case PROPERTY_FORM.LONGITUDE.NAME:
        if (!this.isUndefinedOrEmpty(this.propertyDetails?.details)) {
          this.setFormValue(
            formControl,
            this.propertyDetails?.details[controlName]
          );
        }
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
        if (!this.isUndefinedOrEmpty(this.propertyDetails?.details)) {
          this.setFormValue(
            formControl,
            this.propertyDetails?.details[controlName]
          );
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
      case PROPERTY_FORM.PROPERTY_ATTRIBUTES.NAME:
        if (!this.isUndefinedOrEmpty(this.propertyDetails)) {
          this.setFormValue(formControl, this.propertyDetails[controlName]);
        }
        break;

      default:
        if (
          this.propertyDetailsForm.contains(controlName) &&
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

                featureForm
                  .get('Value')
                  ?.setValidators([
                    Validators.maxLength(10),
                    Validators.pattern(PATTERN.NUMERIC.PATTERN),
                  ]);
                formControl.push(featureForm);
              }
            });
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

  getAddress(latitude: any, longitude: any) {
    this.propertyDetailsForm.get('Longitude')?.setValue(longitude);
    this.propertyDetailsForm.get('Latitude')?.setValue(latitude);
    this.getAddressDetails(latitude, longitude);
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
                  (place: any) =>
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
            this.suburb = places.find((x: any) => x['sublocality'])
              ? places.find((x: any) => x['sublocality'])['sublocality']
              : '';
            this.country = places.find((x: any) => x['country'])
              ? places.find((x: any) => x['country'])['country']
              : '';
            this.province = places.find(
              (x: any) => x['administrative_area_level_1']
            )
              ? places.find((x: any) => x['administrative_area_level_1'])[
                  'administrative_area_level_1'
                ]
              : '';
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

            //if (this.formConfig.mode == FORM_MODE.CREATE) {
            this.propertyDetailsForm.get('Country')?.setValue(this.country);
            this.propertyDetailsForm.get('Province')?.setValue(this.province);
            this.propertyDetailsForm.get('Suburb')?.setValue(this.suburb);
            if (this.suburb == '') {
              this.propertyDetailsForm
                .get('Suburb')
                ?.setValue(this.propertyDetails?.details?.Suburb);
            }
            this.propertyDetailsForm.get('City')?.setValue(this.city);
            this.propertyDetailsForm.get('PostCode')?.setValue(this.postalCode);
            //  }
          } else {
            this.toasterService.error(status);
          }
        } else {
          this.toasterService.error(status);
        }
      }
    );
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

  async setFormConfig(propertyId: number, mode: string) {
    this.formConfig = {
      id: propertyId,
      mode: mode,
    };
    await this.commonStoreService.setFormConfig(this.formConfig);
  }

  ngAfterViewInit(): void {
    this.stepperService.getStep.subscribe((result) => {
      Promise.resolve().then(() => (this.formStep = result));
    });
    document.getElementsByClassName('rd-container')[0].scrollTo(0, 0);
  }

  ngOnDestroy(): void {}

  getControlLabel(control: string) {
    let result: any = Object.values(PROPERTY_FORM).find(
      (res: any) => res.NAME == control
    );
    return result ? result.LABEL : control;
  }
  getControlPatternMessage(control: string): any {
    if (control == 'PostCode') {
      return 'Only numeric characters(-) are allowed';
    } else {
      let result: any = Object.values(PROPERTY_FORM).find(
        (res: any) => res.NAME == control
      );
      return result
        ? result.PATTERN_MESSAGE
          ? result.PATTERN_MESSAGE
          : `Please provide valid ${control}`
        : `Please provide valid ${control}`;
    }
  }

  onSave(status: any = undefined) {
    // this.validationMessages = [];
    switch (status) {
      case PROPERTY_STATUS.PUBLISH:
        // this.validateFormControls(this.propertyForm);
        // if (this.validationMessages.length > 0) {
        //   this.showNotification(false, this.validationMessages);
        // } else {
        this.updatePropertyStatus(status);
        // }
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
          // this.toasterService.success(res.message);
          this.toastMessage = res.message;
        },
        complete: () => {
          if (
            status == PROPERTY_STATUS.DRAFT ||
            status == PROPERTY_STATUS.PUBLISH
          ) {
            const dialogRef = this.dialog.open(
              UnitAvailabilityDialogComponent,
              {
                data: {
                  text1: `${this.propertyDetails.details.PropertyName} has been created`,
                  text2: 'Would you like to create another property?',
                  label: 'Property Created',
                  btn1Text: CONSTANTS.CANCEL,
                  btn2Text: CONSTANTS.YES,
                  tablename: '',
                },
              }
            );
            dialogRef.afterClosed().subscribe((action: any) => {
              if (action === CONSTANTS.YES) {
                this.setFormConfig(this.propertyId, FORM_MODE.CREATE);
                this.router
                  .navigate([`${ROUTE.CREATE_INTERNATIONAL_PROPERTY_DETAILS}`])
                  .then((m) => {
                    this.toasterService.success(this.toastMessage);
                  });
              } else if (action === CONSTANTS.NO) {
                this.router
                  .navigate([`${ROUTE.MANAGE_INTERNATIONAL_PROPERTY}`])
                  .then((m) => {
                    this.toasterService.success(this.toastMessage);
                  });
              }
            });
          }
        },
        error: (error: any) => {
          this.loaderService.hide();
          this.toasterService.error(error.error.message);
        },
      });
  }

  displayError(error: any) {
    let errors = JSON.parse(error);
    Object.keys(errors).forEach((err: any) => {
      this.toasterService.error(errors[err][0]);
    });
  }

  onChange(event: any) {
    this.validateFormField(event);
    // if (event.control === PROPERTY_FORM.GLA.NAME) {
    //   this.propertyDetailsForm
    //     .get('Gla')
    //     ?.setValue(this.commonService.keyUpValue(event.value));
    // }
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

  changeStep(route: string, message?: any) {
    message != undefined
      ? this.router.navigate([route]).then((m) => {
          this.toasterService.success(message);
        })
      : this.router.navigate([route]);
  }

  markLocation(Latitude: any, Longitude: any) {
    this.showLocation = true;
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

  previewFrontend() {
    const dialogRef = this.dialog.open(InternationalPropertyPreviewComponent, {
      data: {
        id: this.propertyId,
      },
    });
    dialogRef.afterClosed().subscribe((result: any) => {});
  }

  editBuilding() {
    this.setFormConfig(this.propertyId, FORM_MODE.EDIT);
    this.changeStep(ROUTE.CREATE_INTERNATIONAL_PROPERTY_DETAILS);
  }
}
