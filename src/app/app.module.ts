import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule, routingComponents } from './app-routing.module';
import { AppComponent } from './app.component';
import { AngularFirestoreModule } from '@angular/fire/firestore'
import { AngularFireModule } from '@angular/fire'
import { environment } from '../environments/environment';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule } from "@angular/forms";
// IMPORT DEI SERVICE
import { BarsService } from "./bars.service";
import { SpeedometerService } from "./speedometer.service";
import { BatteryService } from './battery.service';
import { VolanteService } from "./volante.service";
import { MapService } from "./map.service";

// UNUSED SERVONO ?
import { AngularFireDatabase } from '@angular/fire/database'
import { AngularFireAuth } from '@Angular/fire/auth';

// ATTENZIONE NON IMPORTARE QUA I COMPONENT, VANNO IN --> app-routing.module.ts

@NgModule({
  declarations: [
    AppComponent,
    routingComponents, // Array collocato in app-routing.module.ts in esso vanno dichiarati i Component
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,

    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
    FontAwesomeModule,
    FormsModule
  ],

  providers: [SpeedometerService, BatteryService, BarsService, VolanteService, MapService],

  bootstrap: [AppComponent]
})
export class AppModule { }
