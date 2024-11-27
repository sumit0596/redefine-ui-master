import { TestBed } from '@angular/core/testing';

import { UnitPreviewService } from './unit-preview.service';

describe('UnitPreviewService', () => {
  let service: UnitPreviewService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UnitPreviewService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
