import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertyeqVideoDetailsComponent } from './propertyeq-video-details.component';

describe('PropertyeqVideoDetailsComponent', () => {
  let component: PropertyeqVideoDetailsComponent;
  let fixture: ComponentFixture<PropertyeqVideoDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PropertyeqVideoDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PropertyeqVideoDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
