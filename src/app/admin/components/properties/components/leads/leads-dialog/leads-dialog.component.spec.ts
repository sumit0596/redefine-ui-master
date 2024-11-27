import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeadsDialogComponent } from './leads-dialog.component';

describe('LeadsDialogComponent', () => {
  let component: LeadsDialogComponent;
  let fixture: ComponentFixture<LeadsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LeadsDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeadsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
