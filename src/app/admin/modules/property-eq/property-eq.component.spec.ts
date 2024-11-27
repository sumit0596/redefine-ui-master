import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertyEqComponent } from './property-eq.component';

describe('PropertyEqComponent', () => {
  let component: PropertyEqComponent;
  let fixture: ComponentFixture<PropertyEqComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PropertyEqComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PropertyEqComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
