import { TestBed } from '@angular/core/testing';

import { DiagnosticaService } from './diagnostica.service';

describe('DiagnosticaService', () => {
  let service: DiagnosticaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DiagnosticaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
