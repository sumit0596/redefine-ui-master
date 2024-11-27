import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnitMediaFormComponent } from './unit-media-form.component';

describe('UnitMediaFormComponent', () => {
  let component: UnitMediaFormComponent;
  let fixture: ComponentFixture<UnitMediaFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UnitMediaFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UnitMediaFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
