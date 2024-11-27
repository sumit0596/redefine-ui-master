import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertyeqFrontendComponent } from './propertyeq-frontend.component';

describe('PropertyeqFrontendComponent', () => {
  let component: PropertyeqFrontendComponent;
  let fixture: ComponentFixture<PropertyeqFrontendComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PropertyeqFrontendComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PropertyeqFrontendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
