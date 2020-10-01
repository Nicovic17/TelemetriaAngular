import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HighchartstestComponent } from './highchartstest.component';

describe('HighchartstestComponent', () => {
  let component: HighchartstestComponent;
  let fixture: ComponentFixture<HighchartstestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HighchartstestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HighchartstestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
