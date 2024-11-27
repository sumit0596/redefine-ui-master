import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancialResultDialogComponent } from './financial-result-dialog.component';

describe('FinancialResultDialogComponent', () => {
  let component: FinancialResultDialogComponent;
  let fixture: ComponentFixture<FinancialResultDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FinancialResultDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FinancialResultDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
