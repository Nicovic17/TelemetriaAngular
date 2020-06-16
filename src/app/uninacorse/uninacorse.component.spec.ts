import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UninacorseComponent } from './uninacorse.component';

describe('UninacorseComponent', () => {
  let component: UninacorseComponent;
  let fixture: ComponentFixture<UninacorseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UninacorseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UninacorseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  /*it('should create', () => {
    expect(component).toBeTruthy();
  });*/
});
