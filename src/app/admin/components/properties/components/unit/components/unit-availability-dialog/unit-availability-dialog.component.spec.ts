import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnitAvailabilityDialogComponent } from './unit-availability-dialog.component';

describe('UnitAvailabilityDialogComponent', () => {
  let component: UnitAvailabilityDialogComponent;
  let fixture: ComponentFixture<UnitAvailabilityDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UnitAvailabilityDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UnitAvailabilityDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
