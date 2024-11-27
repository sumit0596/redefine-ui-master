import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarouselPickerComponent } from './carousel-picker.component';

describe('CarouselPickerComponent', () => {
  let component: CarouselPickerComponent;
  let fixture: ComponentFixture<CarouselPickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CarouselPickerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CarouselPickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
