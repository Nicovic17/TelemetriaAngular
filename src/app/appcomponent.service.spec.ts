import { TestBed } from '@angular/core/testing';

import { AppcomponentService } from './appcomponent.service';

describe('AppcomponentService', () => {
  let service: AppcomponentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AppcomponentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
