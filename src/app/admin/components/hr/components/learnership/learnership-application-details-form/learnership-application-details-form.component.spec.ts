import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LearnershipApplicationDetailsFormComponent } from './learnership-application-details-form.component';

describe('LearnershipApplicationDetailsFormComponent', () => {
  let component: LearnershipApplicationDetailsFormComponent;
  let fixture: ComponentFixture<LearnershipApplicationDetailsFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LearnershipApplicationDetailsFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LearnershipApplicationDetailsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
