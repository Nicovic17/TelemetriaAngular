import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFirestore, AngularFirestoreModule } from '@angular/fire/firestore';
import { Router, RouterModule } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { environment } from 'src/environments/environment';
import { AppcomponentService } from '../appcomponent.service';

import { LoggedpageComponent } from './loggedpage.component';

describe('LoggedpageComponent', () => {

  let component: LoggedpageComponent;
  let fixture: ComponentFixture<LoggedpageComponent>;

  let appComponentService: AppcomponentService;

  let authService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports:[
        RouterTestingModule.withRoutes([]),
        AngularFireModule.initializeApp(environment.firebaseConfig),
        AngularFirestoreModule
      ],
      declarations: [ LoggedpageComponent ],
      providers:[AngularFireAuth, AngularFireDatabase],
    })
    .compileComponents().then(()=>{
      fixture = TestBed.createComponent(LoggedpageComponent);
      component=fixture.componentInstance

      authService=TestBed.inject(AngularFireAuth)
      appComponentService=TestBed.inject(AppcomponentService)
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoggedpageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('#logout ', async()=>{

    let ris= await component.logout()
    expect(localStorage.getItem("mostraResize")).toMatch("true")
    expect(ris).toBe(true);

  })
});
