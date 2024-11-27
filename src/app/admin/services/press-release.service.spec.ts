import { TestBed } from '@angular/core/testing';

import { PressReleaseService } from './press-release.service';

describe('PressReleaseService', () => {
  let service: PressReleaseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PressReleaseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
