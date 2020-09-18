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
import {StoricoService} from "./storico.service";
import {EngineService} from "./engine.service";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core'
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core'
import {
  MAT_MOMENT_DATE_FORMATS,
  MomentDateAdapter,
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
} from '@angular/material-moment-adapter';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon'
import { HttpClientModule } from "@angular/common/http";
import { FooterComponent } from './footer/footer.component';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatDialog, MAT_DIALOG_DATA, MatDialogModule} from '@angular/material/dialog';
import { DialogTestComponent } from './dialog-test/dialog-test.component';
import {MatListModule} from "@angular/material/list";
import {DiagnosticaService} from "./diagnostica.service";



// ATTENZIONE NON IMPORTARE QUA I COMPONENT, VANNO IN --> app-routing.module.ts

@NgModule({
  declarations: [
    AppComponent,
    routingComponents, // Array collocato in app-routing.module.ts in esso vanno dichiarati i Component
    FooterComponent,
    DialogTestComponent,
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
        MatListModule
    ],

  providers: [SpeedometerService, 
    BatteryService, BarsService, VolanteService, MapService, 
    StoricoService, EngineService, MatDatepickerModule, DiagnosticaService],

  bootstrap: [AppComponent]
})
export class AppModule { }
