import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewIntegratedReportComponent } from './preview-integrated-report.component';

describe('PreviewIntegratedReportComponent', () => {
  let component: PreviewIntegratedReportComponent;
  let fixture: ComponentFixture<PreviewIntegratedReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PreviewIntegratedReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PreviewIntegratedReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
