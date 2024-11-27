import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertyEqTagDialogComponent } from './property-eq-tag-dialog.component';

describe('PropertyEqTagDialogComponent', () => {
  let component: PropertyEqTagDialogComponent;
  let fixture: ComponentFixture<PropertyEqTagDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PropertyEqTagDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PropertyEqTagDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
