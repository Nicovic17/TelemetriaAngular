import { TestBed } from '@angular/core/testing';

import { GforceService } from './gforce.service';

describe('GforceService', () => {
  let service: GforceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GforceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
