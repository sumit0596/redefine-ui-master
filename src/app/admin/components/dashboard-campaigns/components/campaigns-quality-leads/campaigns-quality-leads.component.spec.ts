import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CampaignsQualityLeadsComponent } from './campaigns-quality-leads.component';

describe('CampaignsQualityLeadsComponent', () => {
  let component: CampaignsQualityLeadsComponent;
  let fixture: ComponentFixture<CampaignsQualityLeadsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CampaignsQualityLeadsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CampaignsQualityLeadsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
