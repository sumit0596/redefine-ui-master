import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicationDetailsFormComponent } from './application-details-form.component';

describe('ApplicationDetailsFormComponent', () => {
  let component: ApplicationDetailsFormComponent;
  let fixture: ComponentFixture<ApplicationDetailsFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApplicationDetailsFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApplicationDetailsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
