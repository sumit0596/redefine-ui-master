import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertyEqPreviewComponent } from './property-eq-preview.component';

describe('PropertyEqPreviewComponent', () => {
  let component: PropertyEqPreviewComponent;
  let fixture: ComponentFixture<PropertyEqPreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PropertyEqPreviewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PropertyEqPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
