import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageJobListingsComponent } from './manage-job-listings.component';

describe('ManageJobListingsComponent', () => {
  let component: ManageJobListingsComponent;
  let fixture: ComponentFixture<ManageJobListingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageJobListingsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageJobListingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
