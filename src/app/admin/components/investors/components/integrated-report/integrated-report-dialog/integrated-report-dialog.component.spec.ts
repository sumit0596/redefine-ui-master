import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IntegratedReportDialogComponent } from './integrated-report-dialog.component';

describe('IntegratedReportDialogComponent', () => {
  let component: IntegratedReportDialogComponent;
  let fixture: ComponentFixture<IntegratedReportDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IntegratedReportDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IntegratedReportDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
