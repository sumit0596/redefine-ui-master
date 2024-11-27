import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertyAdvertisingFormComponent } from './property-advertising-form.component';

describe('PropertyAdvertisingFormComponent', () => {
  let component: PropertyAdvertisingFormComponent;
  let fixture: ComponentFixture<PropertyAdvertisingFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PropertyAdvertisingFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PropertyAdvertisingFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
