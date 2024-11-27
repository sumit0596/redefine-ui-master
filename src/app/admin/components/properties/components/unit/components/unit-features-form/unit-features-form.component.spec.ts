import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnitFeaturesFormComponent } from './unit-features-form.component';

describe('UnitFeaturesFormComponent', () => {
  let component: UnitFeaturesFormComponent;
  let fixture: ComponentFixture<UnitFeaturesFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UnitFeaturesFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UnitFeaturesFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
