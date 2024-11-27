import { TestBed } from '@angular/core/testing';

import { DashboardCampaignsService } from './dashboard-campaigns.service';

describe('DashboardCampaignsService', () => {
  let service: DashboardCampaignsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DashboardCampaignsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
