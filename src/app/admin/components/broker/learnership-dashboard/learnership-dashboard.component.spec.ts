import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LearnershipDashboardComponent } from './learnership-dashboard.component';

describe('LearnershipDashboardComponent', () => {
  let component: LearnershipDashboardComponent;
  let fixture: ComponentFixture<LearnershipDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LearnershipDashboardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LearnershipDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
