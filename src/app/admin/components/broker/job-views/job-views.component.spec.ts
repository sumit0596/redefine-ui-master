import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobViewsComponent } from './job-views.component';

describe('JobViewsComponent', () => {
  let component: JobViewsComponent;
  let fixture: ComponentFixture<JobViewsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JobViewsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JobViewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
