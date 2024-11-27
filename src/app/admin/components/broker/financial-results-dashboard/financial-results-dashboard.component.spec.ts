import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancialResultsDashboardComponent } from './financial-results-dashboard.component';

describe('FinancialResultsDashboardComponent', () => {
  let component: FinancialResultsDashboardComponent;
  let fixture: ComponentFixture<FinancialResultsDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FinancialResultsDashboardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FinancialResultsDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
