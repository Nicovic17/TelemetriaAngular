import { TestBed } from '@angular/core/testing';

import { BatteryService } from './battery.service';

describe('BatteryserviceService', () => {
  let service: BatteryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BatteryService);
  });

  /*it('should be created', () => {
    expect(service).toBeTruthy();
  });*/
});
