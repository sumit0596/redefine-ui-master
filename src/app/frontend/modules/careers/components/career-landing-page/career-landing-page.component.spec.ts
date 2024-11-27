import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CareerLandingPageComponent } from './career-landing-page.component';

describe('CareerLandingPageComponent', () => {
  let component: CareerLandingPageComponent;
  let fixture: ComponentFixture<CareerLandingPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CareerLandingPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CareerLandingPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
