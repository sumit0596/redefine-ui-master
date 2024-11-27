import { TestBed } from '@angular/core/testing';

import { InternationalPropertyService } from './international-property.service';

describe('InternationalPropertyService', () => {
  let service: InternationalPropertyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InternationalPropertyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
