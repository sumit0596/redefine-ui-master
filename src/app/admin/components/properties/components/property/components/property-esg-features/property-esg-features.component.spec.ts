import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertyEsgFeaturesComponent } from './property-esg-features.component';

describe('PropertyEsgFeaturesComponent', () => {
  let component: PropertyEsgFeaturesComponent;
  let fixture: ComponentFixture<PropertyEsgFeaturesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PropertyEsgFeaturesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PropertyEsgFeaturesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
