import { TestBed } from '@angular/core/testing';

import { FePropertiesService } from './fe-properties.service';

describe('FePropertiesService', () => {
  let service: FePropertiesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FePropertiesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
