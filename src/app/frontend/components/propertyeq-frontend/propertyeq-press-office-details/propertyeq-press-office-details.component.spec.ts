import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertyeqPressOfficeDetailsComponent } from './propertyeq-press-office-details.component';

describe('PropertyeqPressOfficeDetailsComponent', () => {
  let component: PropertyeqPressOfficeDetailsComponent;
  let fixture: ComponentFixture<PropertyeqPressOfficeDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PropertyeqPressOfficeDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PropertyeqPressOfficeDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
