import { TestBed } from '@angular/core/testing';

import { BuilderPopupService } from './builder-popup.service';

describe('BuilderPopupService', () => {
  let service: BuilderPopupService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BuilderPopupService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
