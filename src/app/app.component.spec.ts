import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { MatDialogComponent } from './mat-dialog/mat-dialog.component';
import {  AppcomponentService } from '../app/appcomponent.service'
import { FormControl, Validators } from '@angular/forms';
import {MatDialog, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { assert } from 'console';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireModule } from '@angular/fire';
import { environment } from 'src/environments/environment';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';

describe('AppComponent', () => {


  let appComponent: AppComponent;
  let matDialogComponent: MatDialogComponent;

  let fixture: ComponentFixture<AppComponent>
  let fixtureMatDialogComp: ComponentFixture<MatDialogComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
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
      providers:[AngularFireAuth, AngularFireDatabase],
    
      declarations: [
        AppComponent,
        MatDialogComponent
      ],
      
    })
    
    .compileComponents().then(()=>{

      fixture=TestBed.createComponent(AppComponent)
      appComponent=fixture.componentInstance

     
      
    });

    
    
    
  }));

  beforeEach(()=>{
    fixture=TestBed.createComponent(AppComponent)
    appComponent=fixture.componentInstance
    fixture.detectChanges()

  })

  it('mostra il login se utente non loggato',()=>{

    appComponent.showToUser(false);

    expect(document.getElementById("user_div").style.display).toEqual("none")
    expect(document.getElementById("login_div").style.display).toEqual("block")
    expect( document.getElementById("router").style.display).toEqual("none")

  })

  it('mostra menu principale se utente loggato',()=>{
    appComponent.showToUser(true);

    expect(document.getElementById("user_div").style.display).toEqual("block")
    expect(document.getElementById("login_div").style.display).toEqual("none")
    expect( document.getElementById("router").style.display).toEqual("none")

  })

  it('run myLogin function',()=>{
    
    
    fixtureMatDialogComp=TestBed.createComponent(MatDialogComponent)
    matDialogComponent=fixtureMatDialogComp.componentInstance
    fixtureMatDialogComp.detectChanges

   

  })
 /* it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });*/

  /*
  it(`should have as title 'firebase-auth'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('firebase-auth');
  });

  it('should render title', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('.content span').textContent).toContain('firebase-auth app is running!');
  });*/
});
