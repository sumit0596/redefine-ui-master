import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnquiryDialogComponent } from './enquiry-dialog.component';

describe('EnquiryDialogComponent', () => {
  let component: EnquiryDialogComponent;
  let fixture: ComponentFixture<EnquiryDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EnquiryDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EnquiryDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
