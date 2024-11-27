import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertyEqDropdownDialogComponent } from './property-eq-dropdown-dialog.component';

describe('PropertyEqDropdownDialogComponent', () => {
  let component: PropertyEqDropdownDialogComponent;
  let fixture: ComponentFixture<PropertyEqDropdownDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PropertyEqDropdownDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PropertyEqDropdownDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
