import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpieControlloComponent } from './spie-controllo.component';

describe('SpieControlloComponent', () => {
  let component: SpieControlloComponent;
  let fixture: ComponentFixture<SpieControlloComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpieControlloComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpieControlloComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
