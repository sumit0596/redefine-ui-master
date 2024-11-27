import { TestBed } from '@angular/core/testing';

import { SensService } from './sens.service';

describe('SensService', () => {
  let service: SensService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SensService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
