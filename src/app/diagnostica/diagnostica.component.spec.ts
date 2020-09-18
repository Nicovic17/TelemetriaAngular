import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DiagnosticaComponent } from './diagnostica.component';

describe('DiagnosticaComponent', () => {
  let component: DiagnosticaComponent;
  let fixture: ComponentFixture<DiagnosticaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DiagnosticaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DiagnosticaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
