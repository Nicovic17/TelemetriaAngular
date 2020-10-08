import { TestBed } from '@angular/core/testing';

import { StoricoDueService } from './storico-due.service';

describe('StoricoDueService', () => {
  let service: StoricoDueService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StoricoDueService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
