import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {UninacorseComponent} from "./uninacorse/uninacorse.component";
import {AppComponent} from "./app.component";
import {StoricoComponent} from "./storico/storico.component";
import {NavBarComponent} from "./nav-bar/nav-bar.component";
import {SectionBannerComponent} from "./section-banner/section-banner.component";
import {ArticleIndexGalleryComponent} from "./article-index-gallery/article-index-gallery.component";
import {SpeedometerSectionComponent} from "./speedometer-section/speedometer-section.component";
import {MapSectionComponent} from "./map-section/map-section.component";
import {NewBatteryComponent} from "./new-battery/new-battery.component";
import {RotazioneVolanteComponent} from "./rotazione-volante/rotazione-volante.component";
import {BarsComponent} from "./bars/bars.component";
import {SpieControlloComponent} from "./spie-controllo/spie-controllo.component";
import {VisionemacchinaComponent} from "./visionemacchina/visionemacchina.component";
import {BatteryindicatorComponent} from "./batteryindicator/batteryindicator.component";
import {PageNotFoundComponent} from "./page-not-found/page-not-found.component";


const routes: Routes = [
  { path: '', redirectTo: '/', pathMatch: 'full'},
  { path: 'uninacorse', component: UninacorseComponent },
  { path: 'login', component: AppComponent },
  { path: 'storico', component: StoricoComponent },
  { path: '**', component: PageNotFoundComponent } //ATTENZIONE DEVE ESSERE SEMPRE L'ULTIMA DELL'ARRAY
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

export const routingComponents = [
    UninacorseComponent,
    NavBarComponent,
    SectionBannerComponent,
    ArticleIndexGalleryComponent,
    SpeedometerSectionComponent,
    MapSectionComponent,
    NewBatteryComponent,
    RotazioneVolanteComponent,
    BarsComponent,
    SpieControlloComponent,
    VisionemacchinaComponent,
    BatteryindicatorComponent,
    StoricoComponent
]