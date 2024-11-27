import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnitDetailsFormComponent } from './unit-details-form.component';

describe('UnitDetailsFormComponent', () => {
  let component: UnitDetailsFormComponent;
  let fixture: ComponentFixture<UnitDetailsFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UnitDetailsFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UnitDetailsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
