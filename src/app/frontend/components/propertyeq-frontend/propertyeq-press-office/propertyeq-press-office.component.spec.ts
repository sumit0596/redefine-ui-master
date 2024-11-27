import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertyeqPressOfficeComponent } from './propertyeq-press-office.component';

describe('PropertyeqPressOfficeComponent', () => {
  let component: PropertyeqPressOfficeComponent;
  let fixture: ComponentFixture<PropertyeqPressOfficeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PropertyeqPressOfficeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PropertyeqPressOfficeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
