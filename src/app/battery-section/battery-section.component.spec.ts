import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BatterySectionComponent } from './battery-section.component';

describe('BatterySectionComponent', () => {
  let component: BatterySectionComponent;
  let fixture: ComponentFixture<BatterySectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BatterySectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BatterySectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
