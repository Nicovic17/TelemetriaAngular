import { TestBed } from '@angular/core/testing';

import { BatteryserviceService } from './batteryservice.service';

describe('BatteryserviceService', () => {
  let service: BatteryserviceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BatteryserviceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
