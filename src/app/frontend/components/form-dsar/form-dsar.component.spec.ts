import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormDsarComponent } from './form-dsar.component';

describe('FormDsarComponent', () => {
  let component: FormDsarComponent;
  let fixture: ComponentFixture<FormDsarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormDsarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormDsarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
