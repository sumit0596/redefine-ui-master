import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertyEqTagFormComponent } from './property-eq-tag-form.component';

describe('PropertyEqTagFormComponent', () => {
  let component: PropertyEqTagFormComponent;
  let fixture: ComponentFixture<PropertyEqTagFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PropertyEqTagFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PropertyEqTagFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
