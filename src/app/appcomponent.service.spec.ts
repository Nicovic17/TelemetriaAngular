
import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { MatDialogComponent } from './mat-dialog/mat-dialog.component';
import {MatDialogModule} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
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
import { AppcomponentService } from './appcomponent.service';

describe('AppcomponentService', () => {
 // let service: AppcomponentService;

 let appComponent: AppComponent;
  let matDialogComponent: MatDialogComponent;

  let appComponentService: AppcomponentService;

  let fixture: ComponentFixture<AppComponent>
  let fixtureMatDialogComp: ComponentFixture<MatDialogComponent>

  let authService;

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
  .overrideModule(BrowserDynamicTestingModule,{
    set:{
      entryComponents:[MatDialogComponent]
    }
  })
  .compileComponents().then(()=>{

    fixture=TestBed.createComponent(AppComponent)
    appComponent=fixture.componentInstance
    authService=TestBed.inject(AngularFireAuth)
    appComponentService=TestBed.inject(AppcomponentService)
    
  });

}));

  //Service test

  it('#myLogin service success', async ()=>{
    
    let email="uninacorse@gmail.com"
    let password="Uninacorse";


    const ris=await appComponentService.myLogin(email,password)
    expect(ris).toBe(true)
   

  })

  it('#myLogin service failed wrong email', async ()=>{

    let email="uninacorseee@gmail.com"
    let password="Uninacorse";

    const ris=await appComponentService.myLogin(email,password);
    expect(ris).toBe(false, 'Access failed, wrong email');

  })

  it('#myLogin service failed wrong password', async ()=>{

    let email="uninacorse@gmail.com"
    let password="Uninacorrrse";

    const ris=await appComponentService.myLogin(email,password);
    expect(ris).toBe(false, 'Access failed, wrong password');

  })

  it('#myLogin service failed, wrong password and email', async ()=>{

    let email="uninacorseeee@gmail.com"
    let password="Uninacorrrse";

    const ris=await appComponentService.myLogin(email,password);
    expect(ris).toBe(false, 'Access failed, wrong password and email');
  } )

  it('#logout service success', async ()=>{

    let email="uninacorse@gmail.com"
    let password="Uninacorse";

    const ris=await appComponentService.myLogin(email,password);
    let logOut=null;
    if(ris)
    logOut=await appComponent._appComponentService.logout()

    expect(logOut).toBe(true)

  })


  it('#getCurretUser service success', async ()=>{

    let email="uninacorse@gmail.com"
    let password="Uninacorse";
    let currUser;
    const ris=await appComponentService.myLogin(email,password);
    if(ris)
    currUser= await appComponentService.getCurrentUser()

    expect(currUser).not.toBeNull()
  })

  it('#updatePassword service success',async ()=>{

    let email="uninacorse@gmail.com"
    let password="Uninacorse";
    let ris;
    const login=await appComponentService.myLogin(email,password);
    let newPassword="Uninacorse";

    if(login)
    ris=await appComponentService.updatePassword(newPassword)

    expect(ris).toBe(true)

  })

  it('#updatePassword service not success',async ()=>{

   
    let ris;
    let newPassword="Uninacorse";
    ris=await appComponentService.updatePassword(newPassword)
    expect(ris).toBe(false)

  })

});
