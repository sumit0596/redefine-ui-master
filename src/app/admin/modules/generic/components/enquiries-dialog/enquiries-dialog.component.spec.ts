import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnquiriesDialogComponent } from './enquiries-dialog.component';

describe('EnquiriesDialogComponent', () => {
  let component: EnquiriesDialogComponent;
  let fixture: ComponentFixture<EnquiriesDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EnquiriesDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EnquiriesDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
