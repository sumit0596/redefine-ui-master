import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MediaEnquiryFormComponent } from './media-enquiry-form.component';

describe('MediaEnquiryFormComponent', () => {
  let component: MediaEnquiryFormComponent;
  let fixture: ComponentFixture<MediaEnquiryFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MediaEnquiryFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MediaEnquiryFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
