import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertyEqDialogComponent } from './property-eq-dialog.component';

describe('PropertyEqDialogComponent', () => {
  let component: PropertyEqDialogComponent;
  let fixture: ComponentFixture<PropertyEqDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PropertyEqDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PropertyEqDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
