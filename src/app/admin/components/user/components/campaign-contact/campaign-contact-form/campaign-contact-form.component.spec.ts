import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CampaignContactFormComponent } from './campaign-contact-form.component';

describe('CampaignContactFormComponent', () => {
  let component: CampaignContactFormComponent;
  let fixture: ComponentFixture<CampaignContactFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CampaignContactFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CampaignContactFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
