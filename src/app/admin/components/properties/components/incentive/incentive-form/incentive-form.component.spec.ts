import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncentiveFormComponent } from './incentive-form.component';

describe('IncentiveFormComponent', () => {
  let component: IncentiveFormComponent;
  let fixture: ComponentFixture<IncentiveFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IncentiveFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IncentiveFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
