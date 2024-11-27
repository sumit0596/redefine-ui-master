import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageLearnershipApplicationsComponent } from './manage-learnership-applications.component';

describe('ManageLearnershipApplicationsComponent', () => {
  let component: ManageLearnershipApplicationsComponent;
  let fixture: ComponentFixture<ManageLearnershipApplicationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageLearnershipApplicationsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageLearnershipApplicationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
