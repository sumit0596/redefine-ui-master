import { TestBed } from '@angular/core/testing';

import { PropertyEqService } from './property-eq.service';

describe('PropertyEqService', () => {
  let service: PropertyEqService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PropertyEqService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
