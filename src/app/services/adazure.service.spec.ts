import { TestBed } from '@angular/core/testing';

import { AdAzureService } from './adazure.service';

describe('AdAzureService', () => {
  let service: AdAzureService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdAzureService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
