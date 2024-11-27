import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LearnershipDialogComponent } from './learnership-dialog.component';

describe('LearnershipDialogComponent', () => {
  let component: LearnershipDialogComponent;
  let fixture: ComponentFixture<LearnershipDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LearnershipDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LearnershipDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
