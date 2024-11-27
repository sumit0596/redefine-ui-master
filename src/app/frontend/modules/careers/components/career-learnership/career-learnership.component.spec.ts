import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CareerLearnershipComponent } from './career-learnership.component';

describe('CareerLearnershipComponent', () => {
  let component: CareerLearnershipComponent;
  let fixture: ComponentFixture<CareerLearnershipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CareerLearnershipComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CareerLearnershipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
