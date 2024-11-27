import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobListingDetailsFormComponent } from './job-listing-details-form.component';

describe('JobListingDetailsFormComponent', () => {
  let component: JobListingDetailsFormComponent;
  let fixture: ComponentFixture<JobListingDetailsFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JobListingDetailsFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JobListingDetailsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
