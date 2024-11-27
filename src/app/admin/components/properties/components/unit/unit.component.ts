import { Component } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import {
  FORM_MODE,
  PATTERN,
  ROUTE,
  SESSION,
  UNIT_FEATURES_FORM,
  UNIT_FORM,
} from 'src/app/models/constants';
import { CommonStoreService } from 'src/app/services/common-store.service';
import { LoaderService } from 'src/app/shared/services/loader/loader.service';
import { StepperService } from '../../../../services/stepper.service';
import { IMedia } from 'src/app/interfaces/media';
import { Observable, of } from 'rxjs';
import { UnitService } from 'src/app/admin/services/unit.service';
import { PropertyService } from 'src/app/admin/services/property.service';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/shared/services/common.service';

@Component({
  selector: 'app-unit',
  templateUrl: './unit.component.html',
  styleUrls: ['./unit.component.scss'],
})
export class UnitComponent {
  formStep!: any;
  formConfig: any;
  unitForm!: FormGroup;
  route = ROUTE;

  media: IMedia = {
    Id: '',
    Type: '',
    Name: '',
    Url: '',
    CreatedOn: '',
    IsFile: false,
  };
  unitDetails: any;
  propertyId: any;
  PropertyUnitId: any;
  accessNoteList!: any[];
  accessNoteList$!: Observable<any>;
  tenantIncentivesList!: any[];
  tenantIncentivesList$!: Observable<any>;
  propertyFeaturesAmenities$!: Observable<any[]>;
  unitFeaturesAmenities$!: Observable<any[]>;
  mergedFeaturesAmenitiesList!: any[];
  propertyDetails: any;
  backUpGenerator: any[] = [
    {
      Id: 1,
      Name: 'Diesel charged pro-rata based on usage',
    },
    {
      Id: 2,
      Name: 'Yes, charge to be confirmed',
    },
  ];
  backUpGenerator$: Observable<any> = of(this.backUpGenerator);

  formSteps: any[] = [
    {
      stepNumber: 1,
      stepRoute: 'unit-details',
      stepName: 'Unit Details',
    },
    {
      stepNumber: 2,
      stepRoute: 'unit-media',
      stepName: 'Unit Media',
    },
    {
      stepNumber: 3,
      stepRoute: 'unit-features',
      stepName: 'Features/Amenities',
    },
  ];
  threeYearMeterSquare: any = '';
  fiveyearMeterSquare: any = '';
  showBaseOpsCost: boolean = false;
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
  backUpGeneratorId!: any;
  standByWater: any[] = [
    {
      Id: 1,
      Name: 'Water charged pro-rata based on usage',
    },
    {
      Id: 2,
      Name: 'Yes, charge to be confirmed',
    },
  ];
  standByWaters$: Observable<any> = of(this.standByWater);
  standByWaterId!: any;

  constructor(
    public fb: FormBuilder,
    public loaderService: LoaderService,
    public stepperService: StepperService,
    public unitService: UnitService,
    public commonStoreService: CommonStoreService,
    public router: Router,
    public propertyService: PropertyService,
    public toasterService: ToastrService,
    public commonService: CommonService
  ) {
    this.getPropertyDetails();
  }

  async ngOnInit() {
    this.commonStoreService.formConfig$.subscribe(
      (res) => (this.formConfig = res)
    );
    this.setForm();
    this.configureForm();
    await this.getAccessNotes();
    await this.getTenantIncentives();
    this.unitService.getUnitDetails().subscribe((result: any) => {
      this.unitDetails = result;
    });
  }

  ngOnDestroy(): void {
    sessionStorage.removeItem(SESSION.FORM_CONFIG);
  }

  getPropertyDetails() {
    this.propertyService.getPropertyDetails().subscribe((result: any) => {
      this.propertyDetails = result;
      this.propertyId = this.propertyDetails?.details?.PropertyId;
    });
  }

  onAccessNoteDeSelect(event: any) {}

  async getAccessNotes() {
    this.accessNoteList$ = await this.unitService.getAccessNotes();
    this.accessNoteList$.subscribe({
      next: (res) => {
        this.accessNoteList = res.data;
      },
      error: (error) => {},
    });
  }

  async getTenantIncentives() {
    this.tenantIncentivesList$ = await this.unitService.getTenantIncentives();
    this.tenantIncentivesList$.subscribe({
      next: (res) => {
        this.tenantIncentivesList = res.data;
      },
      error: (error) => {},
    });
  }

  setForm() {
    this.unitForm = this.fb.group({
      UnitDetails: this.fb.group({
        PropertyId: [''],
        PropertyUnitId: [''],
        NameAndLocation: ['', [Validators.required, Validators.maxLength(100)]],
        UnitSize: [
          '',
          [
            Validators.required,
            Validators.maxLength(10),
            Validators.pattern(PATTERN.NUMERIC.PATTERN),
          ],
        ],
        UnitAvailableDate: [''],
        Type: [null],
        OfficeSize: [
          '',
          [
            Validators.maxLength(10),
            Validators.pattern(PATTERN.NUMERIC.PATTERN),
          ],
        ],
        WarehouseSize: [
          '',
          [
            Validators.maxLength(10),
            Validators.pattern(PATTERN.NUMERIC.PATTERN),
          ],
        ],
        UnitDescription: [''],
        BaseRental: [
          '',
          [
            Validators.required,
            Validators.maxLength(10),
            Validators.pattern(PATTERN.NUMBER_DECIMAL),
          ],
        ],
        OperationalCost: [
          '',
          [
            Validators.required,
            Validators.maxLength(10),
            Validators.pattern(PATTERN.NUMBER_DECIMAL),
          ],
        ],
        Rates: [
          '',
          [
            Validators.required,
            Validators.maxLength(10),
            Validators.pattern(PATTERN.NUMBER_DECIMAL),
          ],
        ],
        GrossRental: [
          { value: '', disabled: true },
          [
            Validators.required,
            Validators.maxLength(10),
            Validators.pattern(PATTERN.NUMBER_DECIMAL),
          ],
        ],
        CIDLevey: [
          { value: '', disabled: true },
          [
            Validators.maxLength(10),
            Validators.pattern(PATTERN.NUMBER_DECIMAL),
          ],
        ],
        AccessId: [null],
        AccessNoteOther: ['', [Validators.maxLength(255)]],
        AddtionalInformation: [''],
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
        TenentAllowance: [{ value: '', disabled: true }, [Validators.required]],
        NetRental: [null, Validators.required],
        OpsRental: [null, Validators.required],
        ThreeYearsLease: [{ value: '', disabled: true }],
        FiveYearsLease: [{ value: '', disabled: true }],
        PropertyIncentives: [''],
        BrokerIncentives: [null],
        CommentDisclaimers: [''],
      }),
      UnitMedia: this.fb.group({
        Image: this.fb.array([]),
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
      }),
      UnitFeatures: this.fb.group({
        FeatureAmenitiesAddtionalDetails: ['', [Validators.maxLength(700)]],
        FeaturesAmenitiesSectorId: this.fb.array([]),
      }),
    });
  }

  get unitDetailsForm() {
    return this.unitForm.get('UnitDetails') as FormGroup;
  }
  get unitMediaForm() {
    return this.unitForm.get('UnitMedia') as FormGroup;
  }
  get unitFeaturesForm() {
    return this.unitForm.get('UnitFeatures') as FormGroup;
  }
  get imageForms() {
    return this.unitMediaForm.get('Image') as FormArray;
  }
  get videoForm() {
    return this.unitMediaForm.get('Video') as FormGroup;
  }
  get floorPlanForm() {
    return this.unitMediaForm.get('FloorPlan') as FormGroup;
  }
  get unitFeaturesAmenitiesForm() {
    return this.unitFeaturesForm.get('FeaturesAmenitiesSectorId') as FormArray;
  }

  async configureForm() {
    this.formConfig = await this.commonStoreService.getFormConfig();
    if (this.formConfig) {
      sessionStorage.setItem(
        SESSION.FORM_CONFIG,
        JSON.stringify(this.formConfig)
      );
    } else {
      this.formConfig = JSON.parse(
        sessionStorage.getItem(SESSION.FORM_CONFIG) || 'undefined'
      );
    }
    //this.formConfig = await this.commonStoreService.getFormConfig();
    switch (this.formConfig.mode) {
      case FORM_MODE.CREATE:
        this.propertyDetailsById(this.formConfig.id);
        break;
      case FORM_MODE.ADD_UNIT:
        this.propertyDetailsById(this.formConfig.id);
        break;
      case FORM_MODE.EDIT:
        // this.showBaseOpsCost = true;
        this.getUnitDetails();
        break;
      case FORM_MODE.VIEW:
        // this.showBaseOpsCost = true;
        this.getUnitDetails();
        break;
    }
  }

  propertyDetailsById(propertyId: any) {
    this.propertyService.getPropertyDetailsById(propertyId).subscribe((res) => {
      this.propertyDetails = res.data;
      this.propertyId = res.data.details.PropertyId;
      this.unitDetailsForm.patchValue({
        ParkingRatio: this.propertyDetails.details.ParkingRatio,
        BasementBays: this.propertyDetails.details.BasementBays,
        ShadedBays: this.propertyDetails.details.ShadedBays,
        OpenBays: this.propertyDetails.details.OpenBays,
      });
      this.unitDetailsForm.controls['BasementBays'].enable();
      this.unitDetailsForm.controls['ShadedBays'].enable();
      this.unitDetailsForm.controls['OpenBays'].enable();
    });
  }

  disableForms() {
    this.unitDetailsForm.disable();
  }

  getUnitDetails() {
    this.loaderService.show();
    this.unitService.getUnitDetailsById(this.formConfig.id).subscribe({
      next: (res) => {
        this.loaderService.hide();
        this.unitService.setUnitDetails(res.data);
        // this.unitDetails = res.data;
        this.propertyId = res.data.details?.PropertyId;
        this.PropertyUnitId = res.data.details.PropertyUnitId;
        if (
          res.data.details.NetRental != null &&
          res.data.details.OpsRental != null
        ) {
          this.showBaseOpsCost = true;
        }
        this.fillFormData();
        this.getFeaturesAmenitiesByProperty();
      },
      error: (error) => {
        this.loaderService.hide();
      },
    });
  }

  fillFormData() {
    let formControl;
    Object.keys(this.unitDetailsForm.controls).forEach((control) => {
      formControl = this.unitDetailsForm.get(control);
      this.setControlValue(control, formControl);
    });
    Object.keys(this.unitDetailsForm.controls).forEach((control) => {
      formControl = this.unitDetailsForm.get(control);
      this.setControlValue(control, formControl);
    });
    Object.keys(this.unitMediaForm.controls).forEach((control) => {
      formControl = this.unitMediaForm.get(control);
      this.setControlValue(control, formControl);
    });
  }

  setControlValue(controlName: any, formControl: any) {
    switch (controlName) {
      case UNIT_FORM.NAME_LOACTION.NAME:
        if (!this.isUndefinedOrEmpty(this.unitDetails?.details)) {
          this.setFormValue(
            formControl,
            this.unitDetails?.details[controlName]
          );
        }
        break;

      case UNIT_FORM.UNIT_SIZE.NAME:
        if (!this.isUndefinedOrEmpty(this.unitDetails?.details)) {
          this.setFormValue(
            formControl,
            this.unitDetails?.details[controlName]
          );
        }
        break;

      case UNIT_FORM.UNIT_AVAILABLE_DATE.NAME:
        if (!this.isUndefinedOrEmpty(this.unitDetails?.details)) {
          this.setFormValue(
            formControl,
            this.unitDetails?.details[controlName]
          );
        }
        break;

      case UNIT_FORM.OFFICE_SIZE.NAME:
        if (!this.isUndefinedOrEmpty(this.unitDetails?.details)) {
          this.setFormValue(
            formControl,
            this.unitDetails?.details[controlName]
          );
        }
        break;
      case UNIT_FORM.WAREHOUSE_SIZE.NAME:
        if (!this.isUndefinedOrEmpty(this.unitDetails?.details)) {
          this.setFormValue(
            formControl,
            this.unitDetails?.details[controlName]
          );
        }
        break;

      case UNIT_FORM.UNIT_DESCRIPTION.NAME:
        if (!this.isUndefinedOrEmpty(this.unitDetails?.details)) {
          this.setFormValue(
            formControl,
            this.unitDetails?.details[controlName]
          );
        }
        break;

      case UNIT_FORM.BASE_RENTAL.NAME:
        if (!this.isUndefinedOrEmpty(this.unitDetails?.details)) {
          this.setFormValue(
            formControl,
            this.unitDetails?.details[controlName]
          );
        }
        break;

      case UNIT_FORM.OPERATIONAL_COST.NAME:
        if (!this.isUndefinedOrEmpty(this.unitDetails?.details)) {
          this.setFormValue(
            formControl,
            this.unitDetails?.details[controlName]
          );
        }
        break;

      case UNIT_FORM.RATES.NAME:
        if (!this.isUndefinedOrEmpty(this.unitDetails?.details)) {
          this.setFormValue(
            formControl,
            this.unitDetails?.details[controlName]
          );
        }
        break;

      case UNIT_FORM.GROSS_RENTAL.NAME:
        if (!this.isUndefinedOrEmpty(this.unitDetails?.details)) {
          this.setFormValue(
            formControl,
            this.unitDetails?.details[controlName]
          );
        }
        break;

      case UNIT_FORM.CID_LEVEY.NAME:
        if (!this.isUndefinedOrEmpty(this.unitDetails?.details)) {
          this.setFormValue(
            formControl,
            this.unitDetails?.details[controlName]
          );
          this.toggleUnitBays(formControl, this.unitDetails[controlName] != '');
        }
        break;

      case UNIT_FORM.TENENT_ALLOWANCE.NAME:
        if (!this.isUndefinedOrEmpty(this.unitDetails?.details)) {
          this.setFormValue(
            formControl,
            this.unitDetails?.details[controlName]
          );
        }
        break;

      case UNIT_FORM.PROPERTY_INCENTIVES.NAME:
        if (!this.isUndefinedOrEmpty(this.unitDetails)) {
          this.setFormValue(formControl, this.unitDetails[controlName]);
        }
        break;

      case UNIT_FORM.NET_RENTAL_ESCALATION.NAME:
        if (this.unitDetails?.details.OpsRental != '0.00') {
          let netRental = this.unitDetails?.details.NetRental;
          this.unitDetails.details.NetRental = !netRental?.includes('%')
            ? netRental?.concat('%')
            : netRental;
          if (!this.isUndefinedOrEmpty(this.unitDetails?.details)) {
            this.setFormValue(
              formControl,
              this.unitDetails?.details[controlName]
            );
          }
        }
        break;
      case UNIT_FORM.OPS_RENTAL_ESCALATION.NAME:
        if (this.unitDetails?.details.OpsRental != '0.00') {
          let opsRental = this.unitDetails?.details.OpsRental;
          this.unitDetails.details.OpsRental = !opsRental?.includes('%')
            ? opsRental?.concat('%')
            : opsRental;
          if (!this.isUndefinedOrEmpty(this.unitDetails?.details)) {
            this.setFormValue(
              formControl,
              this.unitDetails?.details[controlName]
            );
          }
        }
        break;

      case UNIT_FORM.BROKER_INCENTIVES.NAME:
        if (this.unitDetails?.details.BrokerIncentives != null) {
          let brokerIncentives =
            this.unitDetails?.details.BrokerIncentives.toString();
          this.unitDetails.details.BrokerIncentives =
            !brokerIncentives.includes('%')
              ? brokerIncentives.concat('%')
              : brokerIncentives;
        }
        if (!this.isUndefinedOrEmpty(this.unitDetails?.details)) {
          this.setFormValue(
            formControl,
            this.unitDetails?.details[controlName]
          );
        }
        break;
      case UNIT_FORM.COMMENT_DISCLAIMERS.NAME:
        if (!this.isUndefinedOrEmpty(this.unitDetails?.details)) {
          this.setFormValue(
            formControl,
            this.unitDetails?.details[controlName]
          );
        }
        break;

      case UNIT_FORM.BASEMENT_BAYS.NAME:
        if (!this.isUndefinedOrEmpty(this.unitDetails?.details)) {
          this.setFormValue(
            formControl,
            this.unitDetails?.details[controlName]
          );
          this.toggleUnitBays(formControl, this.unitDetails[controlName] != '');
        }
        break;
      case UNIT_FORM.SHADED_BAYS.NAME:
        if (!this.isUndefinedOrEmpty(this.unitDetails?.details)) {
          this.setFormValue(
            formControl,
            this.unitDetails?.details[controlName]
          );
          this.toggleUnitBays(formControl, this.unitDetails[controlName] != '');
        }
        break;
      case UNIT_FORM.OPEN_BAYS.NAME:
        if (!this.isUndefinedOrEmpty(this.unitDetails?.details)) {
          this.setFormValue(
            formControl,
            this.unitDetails?.details[controlName]
          );
          this.toggleUnitBays(formControl, this.unitDetails[controlName] != '');
        }
        break;
      default:
        if (
          (this.unitDetailsForm.contains(controlName) ||
            this.unitDetailsForm.contains(controlName)) &&
          !this.isUndefinedOrEmpty(this.unitDetails?.details)
        ) {
          this.setFormValue(
            formControl,
            this.unitDetails?.details[controlName]
          );
        } else if (
          this.unitMediaForm.contains(controlName) &&
          !this.isUndefinedOrEmpty(this.unitDetails?.media)
        ) {
          this.setFormValue(formControl, this.unitDetails?.media[controlName]);
        } else if (this.unitFeaturesForm.contains(controlName)) {
          if (
            controlName == UNIT_FEATURES_FORM.FEATURE_AMENITIES_SECTOR_ID.NAME
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
                if (d.Title == 'Backup generator') {
                  if (
                    this.backUpGenerator.some(
                      (backUp: any) => backUp.Name == d.Value
                    )
                  ) {
                    featureForm.addControl('BackUp', new FormControl(d.Value));
                    this.backUpGeneratorId = undefined;
                    featureForm
                      .get('Value')
                      ?.setValue('Diesel charged pro-rata based on usage');
                  } else {
                    featureForm.addControl(
                      'BackUp',
                      // new FormControl('Diesel charged pro-rata based on usage')
                      new FormControl()
                    );
                    if (
                      d.Value === 'Yes, pro-rata diesel charge' ||
                      d.Value === 'Yes, charge to be confirmed'
                    ) {
                      featureForm
                        .get('Value')
                        ?.setValue('Diesel charged pro-rata based on usage');
                    }
                    // this.backUpGeneratorId = 1;
                    // featureForm
                    //   .get('Value')
                    //   ?.setValue('Diesel charged pro-rata based on usage');
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
                    featureForm
                      .get('Value')
                      ?.setValue('Water charged pro-rata based on usage');
                  } else {
                    featureForm.addControl(
                      'Stand',
                      // new FormControl('Water charged pro-rata based on usage')
                      new FormControl()
                    );
                    
                    if (
                      d.Value === 'Yes, pro-rata water usage charged' ||
                      d.Value === 'Yes, charge to be confirmed'
                    ) {
                      
                      featureForm
                      .get('Value')
                      ?.setValue('Water charged pro-rata based on usage');
                    }
           
                    // this.standByWaterId = 1;
                    // featureForm
                    //   .get('Value')
                    //   ?.setValue('Water charged pro-rata based on usage');
                  }
                }
                featureForm
                  .get('Value')
                  ?.setValidators([Validators.maxLength(255)]);
                formControl.push(featureForm);
                if (this.formConfig.mode === FORM_MODE.VIEW) {
                  featureForm.get('Value')?.disable();
                }
              }
            });
          } else {
            if (!this.isUndefinedOrEmpty(this.unitDetails?.featureamenities)) {
              this.setFormValue(
                formControl,
                this.unitDetails?.featureamenities[controlName]
              );
            }
          }
        } else if (this.formConfig.mode === FORM_MODE.VIEW) {
          this.disableForms();
        }
        break;
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

  async getFeaturesAmenitiesByProperty() {
    this.propertyFeaturesAmenities$ =
      await this.unitService.getFeaturesAmenitiesByProperty(this.propertyId);
    this.propertyFeaturesAmenities$.subscribe((result: any) => {
      this.updateFeaturesAmenities(result);
    });
  }

  updateFeaturesAmenities(featureAmenitiesList: any[]) {
    this.mergedFeaturesAmenitiesList = featureAmenitiesList.map(
      (feature: any) => {
        let selectedFeature = [
          ...this.unitDetails.featureamenities.features,
        ].find((f: any) => f.Id == feature.FeaturesAmenitiesSectorId);
        return Object.assign(feature, {
          Value: selectedFeature?.Value || feature.Value,
          Checked: selectedFeature?.Checked || 1,
        });
      }
    );
    Object.keys(this.unitFeaturesForm.controls).forEach((control) => {
      let formControl = this.unitFeaturesForm.get(control);
      this.setControlValue(control, formControl);
    });
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

  isUndefinedOrEmpty(data: any): any {
    return data == undefined || data == null || data == '';
  }

  toggleUnitBays(formControl: any, enable: boolean) {
    if (enable) {
      formControl.enable();
    } else {
      formControl.disable();
    }
  }

  onChange(event: any) {
    this.validateFormField(event);
    if (
      event.control === UNIT_FORM.BASE_RENTAL.NAME ||
      event.control === UNIT_FORM.OPERATIONAL_COST.NAME ||
      event.control === UNIT_FORM.RATES.NAME ||
      event.control === UNIT_FORM.UNIT_SIZE.NAME
    ) {
      this.calculateGrossRental();
      this.onNetRentalSelect(event);
    }
  }

  getFieldValues(data: any) {
    return isNaN(parseFloat(data))
      ? parseFloat('0.0')
      : parseFloat(parseFloat(data).toFixed(2));
  }

  sum(num1: number, num2: number, num3: number) {
    return num1 + num2 + num3;
  }

  getFormValues() {
    const unitValues: any = {};
    unitValues['baseRental'] = this.getFieldValues(
      this.unitDetailsForm.get('BaseRental')?.value
    );
    unitValues['operationalCost'] = this.getFieldValues(
      this.unitDetailsForm.get('OperationalCost')?.value
    );
    unitValues['rates'] = this.getFieldValues(
      this.unitDetailsForm.get('Rates')?.value
    );
    unitValues['unitSize'] = this.unitDetailsForm.get('UnitSize')?.value;
    unitValues['netRental'] = this.unitDetailsForm
      .get('NetRental')
      ?.value?.replace('%', '');
    unitValues['opsRental'] = this.unitDetailsForm
      .get('OpsRental')
      ?.value?.replace('%', '');

    return unitValues;
  }

  calculateGrossRental() {
    const unitValues = this.getFormValues();
    this.unitDetailsForm
      .get('GrossRental')
      ?.setValue(
        this.sum(
          unitValues.baseRental,
          unitValues.operationalCost,
          unitValues.rates
        ).toFixed(2)
      );
  }

  yearOneCalculation() {
    const unitValues = this.getFormValues();
    const monthValue =
      unitValues.baseRental * unitValues.unitSize +
      unitValues.operationalCost * unitValues.unitSize +
      unitValues.rates * unitValues.unitSize;

    return (monthValue * 12)?.toFixed(2);
  }

  yearTwoCalculation() {
    const unitValues = this.getFormValues();
    const baseRentalSize = unitValues.baseRental * unitValues.unitSize;
    const operationalCostSize =
      unitValues.operationalCost * unitValues.unitSize;

    const monthValue =
      (baseRentalSize * unitValues.netRental) / 100 +
      baseRentalSize +
      ((operationalCostSize * unitValues.opsRental) / 100 +
        operationalCostSize) +
      unitValues.rates * unitValues.unitSize;

    return (monthValue * 12)?.toFixed(2);
  }

  toatalLeaseValue(percent: number) {
    return (
      ((this.getFieldValues(this.yearOneCalculation()) +
        this.getFieldValues(this.yearTwoCalculation())) *
        percent) /
      100
    )?.toFixed(2);
  }

  ratePerMeter(percent: number) {
    const unitValues = this.getFormValues();
    return (
      this.getFieldValues(this.toatalLeaseValue(percent)) / unitValues.unitSize
    ).toFixed(2);
  }

  onNetRentalSelect(event: any) {
    const unitValues = this.getFormValues();
    if (
      unitValues.netRental != '0.00' &&
      unitValues.netRental !== undefined &&
      unitValues.opsRental != '0.00' &&
      unitValues.opsRental !== undefined &&
      unitValues.unitSize != '' &&
      unitValues.baseRental != '0' &&
      unitValues.netRental != '0' &&
      unitValues.rates != '0'
    ) {
      this.unitDetailsForm
        .get('ThreeYearsLease')
        ?.setValue(this.toatalLeaseValue(30));
      this.unitDetailsForm
        .get('FiveYearsLease')
        ?.setValue(this.toatalLeaseValue(50));
      this.threeYearMeterSquare = this.ratePerMeter(30);
      this.fiveyearMeterSquare = this.ratePerMeter(50);
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
    let result: any = Object.values(UNIT_FORM).find(
      (res: any) => res.NAME == control
    );
    return result ? result.LABEL : control;
  }

  getControlPatternMessage(control: string): any {
    let result: any = Object.values(UNIT_FORM).find(
      (res: any) => res.NAME == control
    );
    return result
      ? result.PATTERN_MESSAGE
        ? result.PATTERN_MESSAGE
        : `Please provide valid ${control}`
      : `Please provide valid ${control}`;
  }

  getControl(form: any, control: string): FormControl {
    return form.get(control) as FormControl;
  }

  displayError(error: any) {
    let errors = JSON.parse(error);
    Object.keys(errors).forEach((err: any) => {
      this.toasterService.error(errors[err][0]);
    });
  }

  ngAfterViewInit(): void {
    this.stepperService.getStep.subscribe((result) => {
      Promise.resolve().then(() => (this.formStep = result));
    });
    document.getElementsByClassName('rd-container')[0].scrollTo(0, 0);
  }

  changeStep(route: string, message?: any) {
    this.router.navigate([route]).then((m) => {
      this.toasterService.success(message);
    });
  }

  nextStep(route: string, message?: any) {
    this.router.navigate([route]).then((m) => {
      this.toasterService.success(message);
    });
  }
  prevStep(route: string) {
    this.router.navigate([route]);
  }
  goToManage() {
    this.router.navigate([ROUTE.MANAGE_PROPERTY]);
  }

  async setFormConfig(propertyUnitId: number, mode: string) {
    this.formConfig = {
      id: propertyUnitId,
      mode: mode,
    };
    await this.commonStoreService.setFormConfig(this.formConfig);
  }

  goToPropertyConfirmation(message?: any) {
    if (this.formConfig.mode == FORM_MODE.ADD_UNIT) {
      if (message != undefined) {
        this.router.navigate([ROUTE.MANAGE_PROPERTY]).then((m) => {
          this.toasterService.success(message);
        });
      } else {
        this.router.navigate([ROUTE.MANAGE_PROPERTY]);
      }
    } else {
      this.setFormConfig(this.propertyId, FORM_MODE.VIEW);
      if (message != undefined) {
        this.router.navigate([ROUTE.PROPERTY_CONFIRMATION]).then((m) => {
          this.toasterService.success(message);
        });
      } else {
        this.router.navigate([ROUTE.PROPERTY_CONFIRMATION]);
      }
    }
  }

  // setStepCompleted(value: any) {
  //   this.firstStepComplteted = value? true: false;
  // }

  // enableStep() {
  //  return this.formConfig.mode == 'create' && !this.firstStepComplteted;
  // }
}
