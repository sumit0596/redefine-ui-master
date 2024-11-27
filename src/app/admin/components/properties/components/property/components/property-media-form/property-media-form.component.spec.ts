import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertyMediaFormComponent } from './property-media-form.component';

describe('PropertyMediaFormComponent', () => {
  let component: PropertyMediaFormComponent;
  let fixture: ComponentFixture<PropertyMediaFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PropertyMediaFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PropertyMediaFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
