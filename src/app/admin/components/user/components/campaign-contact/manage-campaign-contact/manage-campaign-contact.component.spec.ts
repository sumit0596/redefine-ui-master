import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageCampaignContactComponent } from './manage-campaign-contact.component';

describe('ManageCampaignContactComponent', () => {
  let component: ManageCampaignContactComponent;
  let fixture: ComponentFixture<ManageCampaignContactComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageCampaignContactComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageCampaignContactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
