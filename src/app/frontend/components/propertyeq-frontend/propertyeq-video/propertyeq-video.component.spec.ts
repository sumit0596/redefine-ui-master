import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertyeqVideoComponent } from './propertyeq-video.component';

describe('PropertyeqVideoComponent', () => {
  let component: PropertyeqVideoComponent;
  let fixture: ComponentFixture<PropertyeqVideoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ PropertyeqVideoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PropertyeqVideoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
