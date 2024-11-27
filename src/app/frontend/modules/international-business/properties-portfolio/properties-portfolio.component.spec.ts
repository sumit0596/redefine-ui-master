import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertiesPortfolioComponent } from './properties-portfolio.component';

describe('PropertiesPortfolioComponent', () => {
  let component: PropertiesPortfolioComponent;
  let fixture: ComponentFixture<PropertiesPortfolioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PropertiesPortfolioComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PropertiesPortfolioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
