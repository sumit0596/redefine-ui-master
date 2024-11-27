import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancialResultFormComponent } from './financial-result-form.component';

describe('FinancialResultFormComponent', () => {
  let component: FinancialResultFormComponent;
  let fixture: ComponentFixture<FinancialResultFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FinancialResultFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FinancialResultFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
