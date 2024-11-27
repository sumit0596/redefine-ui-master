import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ButtonPickerComponent } from './button-picker.component';

describe('ButtonPickerComponent', () => {
  let component: ButtonPickerComponent;
  let fixture: ComponentFixture<ButtonPickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ButtonPickerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ButtonPickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
