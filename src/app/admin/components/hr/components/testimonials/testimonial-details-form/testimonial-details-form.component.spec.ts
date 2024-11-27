import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestimonialDetailsFormComponent } from './testimonial-details-form.component';

describe('TestimonialDetailsFormComponent', () => {
  let component: TestimonialDetailsFormComponent;
  let fixture: ComponentFixture<TestimonialDetailsFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TestimonialDetailsFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestimonialDetailsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
