import { async, ComponentFixture, TestBed } from '@angular/core/testing';


import { NotloggedComponent } from './notlogged.component';
import {AppcomponentService} from '../appcomponent.service';
import {MatDialogModule} from '@angular/material/dialog';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {AngularFireModule} from '@angular/fire';
import {environment} from '../../environments/environment';
import {AngularFirestoreModule} from '@angular/fire/firestore';
import {AngularFireAuth} from '@angular/fire/auth';
import {AngularFireDatabase} from '@angular/fire/database';
import {LoggedComponent} from '../logged/logged.component';
import {MatDialogComponent} from '../mat-dialog/mat-dialog.component';
import {BrowserDynamicTestingModule} from '@angular/platform-browser-dynamic/testing';
import {RouterTestingModule} from '@angular/router/testing';

describe('NotloggedComponent', () => {
  let component: NotloggedComponent;
  let fixture: ComponentFixture<NotloggedComponent>;

  let appComponentService: AppcomponentService;
  let authService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        // Creo Router di testing per simulare un cambio pagina
        RouterTestingModule.withRoutes([
          {path: 'loggedpage', component: NotloggedComponent},
          {path: 'notloggedpage', component: NotloggedComponent}
        ]),
        MatDialogModule,
        MatFormFieldModule,
        ReactiveFormsModule,
        FormsModule,
        MatIconModule,
        MatInputModule,
        BrowserAnimationsModule,
        AngularFireModule.initializeApp(environment.firebaseConfig),
        AngularFirestoreModule
      ],
      providers: [
        AngularFireAuth, AngularFireDatabase
      ],
      declarations: [ NotloggedComponent, LoggedComponent, MatDialogComponent ]
    }).overrideModule(BrowserDynamicTestingModule, {
      set: {
        entryComponents: [MatDialogComponent]
      }
    })
      .compileComponents().then(() => {
        fixture = TestBed.createComponent(NotloggedComponent);
        component = fixture.componentInstance;
        authService = TestBed.inject(AngularFireAuth);
        appComponentService = TestBed.inject(AppcomponentService);

    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotloggedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    appComponentService.logout();
  });

  it('#myLogin success', async () => {
   component.email.setValue('uninacorsetestingemail@gmail.com');
   component.password.setValue('Uninacorse');
   await component.myLogin();
   expect(component.successLogin).toBe(true, 'Login successufull access ');
 });

  it('#myLogin failed, wrong email and password', async () => {
    component.email.setValue('uninacorsssse@gmail.com');
    component.password.setValue('Uninaaaacorse');
    await component.myLogin();
    expect(component.successLogin).toBe(false, ' Provided wrong password and email ');
  });

  it('#myLogin failed, wrong email', async () => {
    component.email.setValue('uninacorsssse@gmail.com');
    component.password.setValue('Uninacorse');
    await component.myLogin();
    expect(component.successLogin).toBe(false, 'Provided wrong email ');
  });

  it('#myLogin failed, wrong password', async () => {
    component.email.setValue('uninacorse@gmail.com');
    component.password.setValue('Uninaaaacorse');
    await component.myLogin();
    expect(component.successLogin).toBe(false, ' Provided wrong password ');
  });
});
