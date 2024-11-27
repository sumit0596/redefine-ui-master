import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertyeqSearchComponent } from './propertyeq-search.component';

describe('PropertyeqSearchComponent', () => {
  let component: PropertyeqSearchComponent;
  let fixture: ComponentFixture<PropertyeqSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PropertyeqSearchComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PropertyeqSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
