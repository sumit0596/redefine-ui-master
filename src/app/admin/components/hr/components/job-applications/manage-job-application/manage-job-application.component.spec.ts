import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageJobApplicationComponent } from './manage-job-application.component';

describe('ManageJobApplicationComponent', () => {
  let component: ManageJobApplicationComponent;
  let fixture: ComponentFixture<ManageJobApplicationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageJobApplicationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageJobApplicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
