import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeadingPickerComponent } from './heading-picker.component';

describe('HeadingPickerComponent', () => {
  let component: HeadingPickerComponent;
  let fixture: ComponentFixture<HeadingPickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HeadingPickerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeadingPickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
