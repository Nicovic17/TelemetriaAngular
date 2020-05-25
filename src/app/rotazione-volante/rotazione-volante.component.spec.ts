import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RotazioneVolanteComponent } from './rotazione-volante.component';

describe('RotazioneVolanteComponent', () => {
  let component: RotazioneVolanteComponent;
  let fixture: ComponentFixture<RotazioneVolanteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RotazioneVolanteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RotazioneVolanteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
