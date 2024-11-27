import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnitPreviewComponent } from './unit-preview.component';

describe('UnitPreviewComponent', () => {
  let component: UnitPreviewComponent;
  let fixture: ComponentFixture<UnitPreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UnitPreviewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UnitPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
