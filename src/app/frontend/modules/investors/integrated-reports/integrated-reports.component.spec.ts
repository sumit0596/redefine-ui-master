import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IntegratedReportsComponent } from './integrated-reports.component';

describe('IntegratedReportsComponent', () => {
  let component: IntegratedReportsComponent;
  let fixture: ComponentFixture<IntegratedReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IntegratedReportsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IntegratedReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
