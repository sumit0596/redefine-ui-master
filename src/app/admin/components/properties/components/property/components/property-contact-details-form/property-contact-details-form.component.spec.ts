import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertyContactDetailsFormComponent } from './property-contact-details-form.component';

describe('PropertyContactDetailsFormComponent', () => {
  let component: PropertyContactDetailsFormComponent;
  let fixture: ComponentFixture<PropertyContactDetailsFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PropertyContactDetailsFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PropertyContactDetailsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
