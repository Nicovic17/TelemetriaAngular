import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StatoGeneraleComponent } from './stato-generale.component';

describe('StatoGeneraleComponent', () => {
  let component: StatoGeneraleComponent;
  let fixture: ComponentFixture<StatoGeneraleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StatoGeneraleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StatoGeneraleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

 /* it('should create', () => {
    expect(component).toBeTruthy();
  });*/
});
