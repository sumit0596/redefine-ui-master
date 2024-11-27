import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BannerPickerComponent } from './banner-picker.component';

describe('BannerPickerComponent', () => {
  let component: BannerPickerComponent;
  let fixture: ComponentFixture<BannerPickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BannerPickerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BannerPickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
