import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertyEqFormComponent } from './property-eq-form.component';

describe('PropertyEqFormComponent', () => {
  let component: PropertyEqFormComponent;
  let fixture: ComponentFixture<PropertyEqFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PropertyEqFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PropertyEqFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
