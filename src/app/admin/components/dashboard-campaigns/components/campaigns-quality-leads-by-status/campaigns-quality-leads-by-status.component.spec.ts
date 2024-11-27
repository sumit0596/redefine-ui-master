import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CampaignsQualityLeadsByStatusComponent } from './campaigns-quality-leads-by-status.component';

describe('CampaignsQualityLeadsByStatusComponent', () => {
  let component: CampaignsQualityLeadsByStatusComponent;
  let fixture: ComponentFixture<CampaignsQualityLeadsByStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CampaignsQualityLeadsByStatusComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CampaignsQualityLeadsByStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
