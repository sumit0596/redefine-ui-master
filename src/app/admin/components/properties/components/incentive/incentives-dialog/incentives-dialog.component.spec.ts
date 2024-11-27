import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncentivesDialogComponent } from './incentives-dialog.component';

describe('IncentivesDialogComponent', () => {
  let component: IncentivesDialogComponent;
  let fixture: ComponentFixture<IncentivesDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IncentivesDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IncentivesDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
