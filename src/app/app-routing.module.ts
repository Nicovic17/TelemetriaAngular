import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { StatoGeneraleComponent } from './stato-generale/stato-generale.component';
import { SpeedometerSectionComponent } from './speedometer-section/speedometer-section.component';
import { MapSectionComponent } from './map-section/map-section.component';
import { NewBatteryComponent } from './new-battery/new-battery.component';
import { RotazioneVolanteComponent } from './rotazione-volante/rotazione-volante.component';
import { BarsComponent } from './bars/bars.component';
import { SpieControlloComponent } from './spie-controllo/spie-controllo.component';
import { VisionemacchinaComponent } from './visionemacchina/visionemacchina.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { GforceSectionComponent } from './gforce-section/gforce-section.component';
import { AnglesComponent } from './angles/angles.component';
import { DiagnosticaComponent } from './diagnostica/diagnostica.component';
import { StoricoComponent } from './storico/storico.component';
import { CambiaPasswordComponent } from './cambia-password/cambia-password.component';
import { NotloggedComponent } from './notlogged/notlogged.component';
import { LoggedComponent } from './logged/logged.component';


const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full'},
  { path: 'login', component: AppComponent },
  { path: 'statogenerale', component: StatoGeneraleComponent },
  { path: 'storico', component: StoricoComponent },
  { path: 'diagnostica', component: DiagnosticaComponent},
  { path: 'cambiopassword', component: CambiaPasswordComponent},
  { path: 'notloggedpage', component: NotloggedComponent},
  { path: 'loggedpage', component: LoggedComponent},
  { path: '**', component: PageNotFoundComponent } // ATTENZIONE DEVE ESSERE SEMPRE L'ULTIMA DELL'ARRAY
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

export const routingComponents = [
    NavBarComponent,
    StatoGeneraleComponent,
    SpeedometerSectionComponent,
    MapSectionComponent,
    NewBatteryComponent,
    RotazioneVolanteComponent,
    BarsComponent,
    SpieControlloComponent,
    VisionemacchinaComponent,
    PageNotFoundComponent,
    GforceSectionComponent,
    DiagnosticaComponent,
    AnglesComponent,
    StoricoComponent,
    CambiaPasswordComponent,
    LoggedComponent,
    NotloggedComponent
];
