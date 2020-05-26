import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BatteryindicatorComponent } from './batteryindicator.component';

describe('BatteryindicatorComponent', () => {
  let component: BatteryindicatorComponent;
  let fixture: ComponentFixture<BatteryindicatorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BatteryindicatorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BatteryindicatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
