import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeasingExecutiveDashboardComponent } from './leasing-executive-dashboard.component';

describe('LeasingExecutiveDashboardComponent', () => {
  let component: LeasingExecutiveDashboardComponent;
  let fixture: ComponentFixture<LeasingExecutiveDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LeasingExecutiveDashboardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeasingExecutiveDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
