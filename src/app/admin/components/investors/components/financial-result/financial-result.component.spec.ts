import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancialResultComponent } from './financial-result.component';

describe('FinancialResultComponent', () => {
  let component: FinancialResultComponent;
  let fixture: ComponentFixture<FinancialResultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FinancialResultComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FinancialResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
