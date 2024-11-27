import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DebtProgrammeFormComponent } from './debt-programme-form.component';

describe('DebtProgrammeFormComponent', () => {
  let component: DebtProgrammeFormComponent;
  let fixture: ComponentFixture<DebtProgrammeFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DebtProgrammeFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DebtProgrammeFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
