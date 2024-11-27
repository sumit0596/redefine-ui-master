import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancialResultsComponent } from './financial-results.component';

describe('FinancialResultsComponent', () => {
  let component: FinancialResultsComponent;
  let fixture: ComponentFixture<FinancialResultsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FinancialResultsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FinancialResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
