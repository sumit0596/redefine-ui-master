import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CampaignAllLeadsByMediumComponent } from './campaign-all-leads-by-medium.component';

describe('CampaignAllLeadsByMediumComponent', () => {
  let component: CampaignAllLeadsByMediumComponent;
  let fixture: ComponentFixture<CampaignAllLeadsByMediumComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CampaignAllLeadsByMediumComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CampaignAllLeadsByMediumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
