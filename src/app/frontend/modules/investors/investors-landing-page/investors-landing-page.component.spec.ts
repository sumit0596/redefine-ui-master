import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvestorsLandingPageComponent } from './investors-landing-page.component';

describe('InvestorsLandingPageComponent', () => {
  let component: InvestorsLandingPageComponent;
  let fixture: ComponentFixture<InvestorsLandingPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvestorsLandingPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvestorsLandingPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
