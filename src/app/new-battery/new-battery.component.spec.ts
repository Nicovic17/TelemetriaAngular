import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewBatteryComponent } from './new-battery.component';

describe('NewBatteryComponent', () => {
  let component: NewBatteryComponent;
  let fixture: ComponentFixture<NewBatteryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewBatteryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewBatteryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
