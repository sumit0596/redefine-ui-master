import { ComponentFixture, TestBed, fakeAsync } from '@angular/core/testing';

import { PropertyPreviewComponent } from './property-preview.component';
import { Observable } from 'rxjs';
import { PropertyService } from 'src/app/admin/services/property.service';

describe('PropertyPreviewComponent', () => {
  let component: PropertyPreviewComponent;
  let fixture: ComponentFixture<PropertyPreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PropertyPreviewComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PropertyPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  fit(`should fetch  PropertyData`, fakeAsync(() => {
    let propertyServiceSpy = fixture.debugElement.injector.get(PropertyService);
    const resp = {
      status: 'success',
      message: 'Data fetch from redis',
      esgfeatures: [],
      media: [],
      attributes: [],
      advertisments: [],
      featureamenities: [],
      details: {
        PropertyId: 60,
        SectorId: 2,
        BrokerLiaisonId: 0,
        LeasingExecutiveId: 0,
        BuildingCode: '156',
        PropertyName: '90 Rivonia Road',
        Gla: '37,133',
        WebsiteUrl: null,
        PropertyDescription: null,
        Longitude: '28.053899',
        Latitude: '-26.111614',
        Address: 'Rivonia Road Sandhurst Sandton Gauteng 2196',
        City: 'Sandhurst',
        Suburb: 'Sandton',
        ProvinceId: 4,
        CountryId: 1,
        ParkingRatio: null,
        BasementBays: null,
        ShadedBays: null,
        OpenBays: null,
        GreenStarRating: null,
        MetaTitle: null,
        MetaKeywords: null,
        MetaDescription: null,
        Density: null,
        OfficeSize: null,
        WarehouseSize: null,
        PerYearLease: null,
        AnnualFootCount: null,
        AnchorTenant: null,
        TotalTenants: null,
        IsDeleted: 0,
        Status: 0,
        BrokerName: null,
        LeasingExecutiveName: null,
        LeasingExecutiveCellNumber: null,
        LeasingExecutiveEmail: null,
        BrokerCellNumber: null,
        BrokerEmail: null,
        SectorName: 'Office',
        ProvinceName: 'Gauteng',
        FeatureAmenitiesAddtionalDetails: null,
        GradeName: null,
      },
    };
    const getStatusResponse = new Observable<any>((observer) => {
      observer.next(resp);
    });
    spyOn(propertyServiceSpy, 'propertyPreviewDetails')
      .withArgs(60)
      .and.returnValue(getStatusResponse);
    fixture.componentInstance.getPropertyPreviewDetails();
    fixture.detectChanges;
    expect(component.propertyDetails).toBe(resp);
  }));
});
