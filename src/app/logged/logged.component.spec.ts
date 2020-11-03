import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFirestore, AngularFirestoreModule } from '@angular/fire/firestore';
import { Router, RouterModule } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { environment } from 'src/environments/environment';
import { AppcomponentService } from '../appcomponent.service';

import { LoggedComponent } from './logged.component';

describe('LoggedComponent', () => {

  let component: LoggedComponent;
  let fixture: ComponentFixture<LoggedComponent>;

  let appComponentService: AppcomponentService;

  let authService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports:[
        RouterTestingModule.withRoutes([]),
        AngularFireModule.initializeApp(environment.firebaseConfig),
        AngularFirestoreModule
      ],
      declarations: [ LoggedComponent ],
      providers:[AngularFireAuth, AngularFireDatabase],
    })
    .compileComponents().then(()=>{
      fixture = TestBed.createComponent(LoggedComponent);
      component=fixture.componentInstance

      authService=TestBed.inject(AngularFireAuth)
      appComponentService=TestBed.inject(AppcomponentService)
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoggedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('#logout ', async()=>{

    let ris= await component.logout()
    expect(localStorage.getItem("mostraResize")).toMatch("true")
    expect(ris).toBe(true);

  })
});
