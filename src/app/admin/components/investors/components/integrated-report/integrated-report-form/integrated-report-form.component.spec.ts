import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IntegratedReportFormComponent } from './integrated-report-form.component';

describe('IntegratedReportFormComponent', () => {
  let component: IntegratedReportFormComponent;
  let fixture: ComponentFixture<IntegratedReportFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IntegratedReportFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IntegratedReportFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
