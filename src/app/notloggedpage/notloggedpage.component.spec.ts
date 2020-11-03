import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotloggedpageComponent } from './notloggedpage.component';

describe('NotloggedpageComponent', () => {
  let component: NotloggedpageComponent;
  let fixture: ComponentFixture<NotloggedpageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotloggedpageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotloggedpageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

 /* it('should create', () => {
    expect(component).toBeTruthy();
  });*/
});
