import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageTestimonialsComponent } from './manage-testimonials.component';

describe('ManageTestimonialsComponent', () => {
  let component: ManageTestimonialsComponent;
  let fixture: ComponentFixture<ManageTestimonialsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageTestimonialsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageTestimonialsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
