import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { MatDialogComponent } from './mat-dialog/mat-dialog.component';
import {  AppcomponentService } from '../app/appcomponent.service';
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

describe('AppComponent', () => {


  let appComponent: AppComponent;

  let appComponentService: AppcomponentService;

  let fixture: ComponentFixture<AppComponent>;

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
      providers: [AngularFireAuth, AngularFireDatabase],

      declarations: [
        AppComponent,
        MatDialogComponent
      ],

    })
    .overrideModule(BrowserDynamicTestingModule, {
      set: {
        entryComponents: [MatDialogComponent]
      }
    })
    .compileComponents().then(() => {

      fixture = TestBed.createComponent(AppComponent);
      appComponent = fixture.componentInstance;
      authService = TestBed.inject(AngularFireAuth);
      appComponentService = TestBed.inject(AppcomponentService);

    });

  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    appComponent = fixture.componentInstance;
    fixture.detectChanges();


  });

});
