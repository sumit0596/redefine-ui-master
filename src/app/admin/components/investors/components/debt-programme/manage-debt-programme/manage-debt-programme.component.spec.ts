import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageDebtProgrammeComponent } from './manage-debt-programme.component';

describe('ManageDebtProgrammeComponent', () => {
  let component: ManageDebtProgrammeComponent;
  let fixture: ComponentFixture<ManageDebtProgrammeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageDebtProgrammeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageDebtProgrammeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
