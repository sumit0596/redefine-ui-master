import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageIntegratedReportComponent } from './manage-integrated-report.component';

describe('ManageIntegratedReportComponent', () => {
  let component: ManageIntegratedReportComponent;
  let fixture: ComponentFixture<ManageIntegratedReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageIntegratedReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageIntegratedReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
