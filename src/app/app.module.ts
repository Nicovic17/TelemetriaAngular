import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule, routingComponents } from './app-routing.module';
import { AppComponent } from './app.component';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireModule } from '@angular/fire';
import { environment } from '../environments/environment';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// IMPORT DEI SERVICE
import { BarsService } from './bars.service';
import { SpeedometerService } from './speedometer.service';
import { BatteryService } from './battery.service';
import { VolanteService } from './volante.service';
import { MapService } from './map.service';
import { EngineService } from './engine.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { HttpClientModule } from '@angular/common/http';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDialogModule } from '@angular/material/dialog';
import { MatListModule } from '@angular/material/list';
import { DiagnosticaService } from './diagnostica.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { StoricoDueService } from './storico-due.service';
import { StrRemUnderscore } from './stringformat.pipe';
import { MatDialogComponent } from './mat-dialog/mat-dialog.component';
import { AppcomponentService } from './appcomponent.service';
import { NotloggedpageComponent } from './notloggedpage/notloggedpage.component';
import { LoggedpageComponent } from './loggedpage/loggedpage.component';
import { RouterModule } from '@angular/router';


// ATTENZIONE NON IMPORTARE QUA I COMPONENT, VANNO IN --> app-routing.module.ts

@NgModule({
  declarations: [
    AppComponent,
    routingComponents, // Array collocato in app-routing.module.ts in esso vanno dichiarati i Component
    StrRemUnderscore,
    MatDialogComponent,
    NotloggedpageComponent,
    LoggedpageComponent
  ],
  imports: [
      BrowserModule,
      AppRoutingModule,

      AngularFireModule.initializeApp(environment.firebaseConfig),
      AngularFirestoreModule,
      FontAwesomeModule,
      FormsModule,
      BrowserAnimationsModule,
      MatDatepickerModule,
      MatFormFieldModule,
      MatInputModule,
      MatButtonModule,
      MatNativeDateModule,
      MatToolbarModule,
      MatIconModule,
      HttpClientModule,
      MatExpansionModule,
      MatDialogModule,
      FormsModule,
      MatListModule,
      MatProgressSpinnerModule,
      ReactiveFormsModule
  ],
  entryComponents: [
    MatDialogComponent,
  ],
  providers: [SpeedometerService,
    BatteryService, BarsService, VolanteService, MapService,
    EngineService, MatDatepickerModule, DiagnosticaService, StoricoDueService, AppComponent, AppcomponentService],

  bootstrap: [AppComponent]
})
export class AppModule { }
