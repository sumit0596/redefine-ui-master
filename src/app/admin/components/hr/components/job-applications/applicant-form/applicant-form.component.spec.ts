import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicantFormComponent } from './applicant-form.component';

describe('JobApplicationFormComponent', () => {
  let component: ApplicantFormComponent;
  let fixture: ComponentFixture<ApplicantFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApplicantFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApplicantFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
