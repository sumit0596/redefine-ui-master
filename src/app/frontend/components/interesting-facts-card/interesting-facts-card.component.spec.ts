import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InterestingFactsCardComponent } from './interesting-facts-card.component';

describe('InterestingFactsCardComponent', () => {
  let component: InterestingFactsCardComponent;
  let fixture: ComponentFixture<InterestingFactsCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InterestingFactsCardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InterestingFactsCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
