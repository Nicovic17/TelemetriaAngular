import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { AngularFirestoreModule } from '@angular/fire/firestore'

import { AngularFireDatabase } from '@angular/fire/database'

import { AngularFireAuth } from '@Angular/fire/auth'

import { AngularFireModule } from '@angular/fire'

import { environment } from '../environments/environment';
import { UninacorseComponent } from './uninacorse/uninacorse.component'

import { RouterModule, Routes } from '@angular/router';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { SectionBannerComponent } from './section-banner/section-banner.component';
import { ArticleIndexGalleryComponent } from './article-index-gallery/article-index-gallery.component';
import { BatterySectionComponent } from './battery-section/battery-section.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SpeedometerSectionComponent } from './speedometer-section/speedometer-section.component';
import { MapSectionComponent } from './map-section/map-section.component'



@NgModule({
  declarations: [
    AppComponent,
    UninacorseComponent,
    NavBarComponent,
    SectionBannerComponent,
    ArticleIndexGalleryComponent,
    BatterySectionComponent,
    SpeedometerSectionComponent,
    MapSectionComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,

    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
    RouterModule.forRoot([
      {
        path:'uninacorse', component:UninacorseComponent
      },
      {
        path:'login', component: AppComponent
      },
    ]),
    FontAwesomeModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
