import { TestBed } from '@angular/core/testing';

import { VolanteserviceService } from './volanteservice.service';

describe('VolanteserviceService', () => {
  let service: VolanteserviceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VolanteserviceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
