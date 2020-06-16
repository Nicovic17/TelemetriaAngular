import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpeedometerSectionComponent } from './speedometer-section.component';

describe('SpeedometerSectionComponent', () => {
  let component: SpeedometerSectionComponent;
  let fixture: ComponentFixture<SpeedometerSectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpeedometerSectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpeedometerSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  /*it('should create', () => {
    expect(component).toBeTruthy();
  });*/
});
