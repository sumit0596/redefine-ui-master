import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardCampaignsComponent } from './dashboard-campaigns.component';

describe('DashboardCampaignsComponent', () => {
  let component: DashboardCampaignsComponent;
  let fixture: ComponentFixture<DashboardCampaignsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashboardCampaignsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardCampaignsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
