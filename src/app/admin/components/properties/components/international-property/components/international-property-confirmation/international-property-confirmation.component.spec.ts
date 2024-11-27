import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InternationalPropertyConfirmationComponent } from './international-property-confirmation.component';

describe('InternationalPropertyConfirmationComponent', () => {
  let component: InternationalPropertyConfirmationComponent;
  let fixture: ComponentFixture<InternationalPropertyConfirmationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InternationalPropertyConfirmationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InternationalPropertyConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
