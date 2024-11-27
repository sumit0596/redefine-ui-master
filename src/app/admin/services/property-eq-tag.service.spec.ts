import { TestBed } from '@angular/core/testing';

import { PropertyEqTagService } from './property-eq-tag.service';

describe('PropertyEqTagService', () => {
  let service: PropertyEqTagService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PropertyEqTagService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
