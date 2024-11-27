import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CircularDialogComponent } from './circular-dialog.component';

describe('CircularDialogComponent', () => {
  let component: CircularDialogComponent;
  let fixture: ComponentFixture<CircularDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CircularDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CircularDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
