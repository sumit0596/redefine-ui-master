import { TestBed } from '@angular/core/testing';

import { MytoasterService } from './mytoaster.service';

describe('MytoasterService', () => {
  let service: MytoasterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MytoasterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
