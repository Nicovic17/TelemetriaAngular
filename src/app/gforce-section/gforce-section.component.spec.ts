import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GforceSectionComponent } from './gforce-section.component';

describe('GforceSectionComponent', () => {
  let component: GforceSectionComponent;
  let fixture: ComponentFixture<GforceSectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GforceSectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GforceSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  /*it('should create', () => {
    expect(component).toBeTruthy();
  });*/
});
