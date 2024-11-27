import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CircularFormComponent } from './circular-form.component';

describe('CircularFormComponent', () => {
  let component: CircularFormComponent;
  let fixture: ComponentFixture<CircularFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CircularFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CircularFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
