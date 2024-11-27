import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LearnershipApplicationFormComponent } from './learnership-application-form.component';

describe('LearnershipApplicationFormComponent', () => {
  let component: LearnershipApplicationFormComponent;
  let fixture: ComponentFixture<LearnershipApplicationFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LearnershipApplicationFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LearnershipApplicationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
