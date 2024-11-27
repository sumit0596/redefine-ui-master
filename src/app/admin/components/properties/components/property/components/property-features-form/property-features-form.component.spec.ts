import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertyFeaturesFormComponent } from './property-features-form.component';

describe('PropertyFeaturesFormComponent', () => {
  let component: PropertyFeaturesFormComponent;
  let fixture: ComponentFixture<PropertyFeaturesFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PropertyFeaturesFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PropertyFeaturesFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
