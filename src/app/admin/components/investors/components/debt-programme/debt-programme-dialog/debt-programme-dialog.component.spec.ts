import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DebtProgrammeDialogComponent } from './debt-programme-dialog.component';

describe('DebtProgrammeDialogComponent', () => {
  let component: DebtProgrammeDialogComponent;
  let fixture: ComponentFixture<DebtProgrammeDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DebtProgrammeDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DebtProgrammeDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
