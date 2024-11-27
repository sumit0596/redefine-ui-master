import { TestBed } from '@angular/core/testing';

import { DebtProgrammeService } from './debt-programme.service';

describe('DebtProgrammeService', () => {
  let service: DebtProgrammeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DebtProgrammeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
