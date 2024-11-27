import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeadsFormComponent } from './leads-form.component';

describe('LeadsFormComponent', () => {
  let component: LeadsFormComponent;
  let fixture: ComponentFixture<LeadsFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LeadsFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeadsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
