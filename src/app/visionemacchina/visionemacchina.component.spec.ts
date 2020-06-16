import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VisionemacchinaComponent } from './visionemacchina.component';

describe('VisionemacchinaComponent', () => {
  let component: VisionemacchinaComponent;
  let fixture: ComponentFixture<VisionemacchinaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VisionemacchinaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisionemacchinaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  /*it('should create', () => {
    expect(component).toBeTruthy();
  });*/
});
