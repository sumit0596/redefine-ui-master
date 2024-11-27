import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IntegratedReportDetailsFormComponent } from './integrated-report-details-form.component';

describe('IntegratedReportDetailsFormComponent', () => {
  let component: IntegratedReportDetailsFormComponent;
  let fixture: ComponentFixture<IntegratedReportDetailsFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IntegratedReportDetailsFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IntegratedReportDetailsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
