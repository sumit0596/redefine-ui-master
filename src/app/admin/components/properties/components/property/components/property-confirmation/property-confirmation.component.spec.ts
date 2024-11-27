import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertyConfirmationComponent } from './property-confirmation.component';

describe('PropertyConfirmationComponent', () => {
  let component: PropertyConfirmationComponent;
  let fixture: ComponentFixture<PropertyConfirmationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PropertyConfirmationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PropertyConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
