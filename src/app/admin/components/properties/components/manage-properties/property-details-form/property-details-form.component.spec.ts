import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertyDetailsFormComponent } from './property-details-form.component';

describe('PropertyDetailsFormComponent', () => {
  let component: PropertyDetailsFormComponent;
  let fixture: ComponentFixture<PropertyDetailsFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PropertyDetailsFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PropertyDetailsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
