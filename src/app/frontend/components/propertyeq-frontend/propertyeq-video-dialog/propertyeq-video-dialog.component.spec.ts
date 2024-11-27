import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertyeqVideoDialogComponent } from './propertyeq-video-dialog.component';

describe('PropertyeqVideoDialogComponent', () => {
  let component: PropertyeqVideoDialogComponent;
  let fixture: ComponentFixture<PropertyeqVideoDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PropertyeqVideoDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PropertyeqVideoDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
