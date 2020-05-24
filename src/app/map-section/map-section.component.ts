import { Component, OnInit } from '@angular/core';

import { AngularFirestore } from '@angular/fire/firestore'
import { AngularFireDatabase } from '@angular/fire/database'
import { AngularFireAuth } from '@angular/fire/auth'

import { Observable, from } from 'rxjs'

import { map } from 'rxjs/operators';


declare var OpenLayers: any;

const url = "https://www.openlayers.org/api/OpenLayers.js";

let markers;
let trimmer;
var mappa;
var lonLat;
var zoom;
var lon
var lat;

@Component({
  selector: 'app-map-section',
  templateUrl: './map-section.component.html',
  styleUrls: ['./map-section.component.css']
})
export class MapSectionComponent implements OnInit {


  database:AngularFireDatabase;

  array:Number[];
  lat:Number;
  long:Number;

  loadAPI: Promise<any>;


  constructor(db:AngularFireDatabase) {
    
    this.database=db;
    //Mette in ascolto la classe sulle coordinate presenti nel database
    this.ascoltaMap()
   }

  ngOnInit(): void {

    //Appena si carica la pagina carica lo script in "url"
    this.loadScript()
    //Appena si carica la pagina la mappa viene settata automaticamente con un click
    //Questo perché il settaggio automatico diretto porta problemi con OpenLayer
    document.getElementById("setUp").click()
   
  }

  ngAfterViewInit(){
    
    
  }

  //Converte l'oggetto restituito dal firebase in un Number
  //Dopodiché ne effettua lo spostamento a quelle coordinate
  convLat(lat:Object)
  {
    this.lat=Number(lat);
    if(this.lat!=undefined)
    {
      console.log("Lati: "+this.lat)
      this.moveWithLongAndLat(this.lat,this.long)
    }
    
  }

  //Converte l'oggetto restituito dal firebase in un Number
  //Dopodiché ne effettua lo spostamento a quelle coordinate
  convLong(long:Object)
  {
    this.long=Number(long);
    if(this.long!=undefined)
    {
      console.log("Long: "+this.long)
      this.moveWithLongAndLat(this.lat,this.long)

    }
    
  }

 

  ascoltaMap()
  {
    //Mi metto in ascolto sul campo Map/Lat 
    this.database.object("Map/Lat").snapshotChanges().subscribe(action => {
      //Effettuo conversione e movimento
      this.convLat(action.payload.val());
    });

    //Mi metto in ascolto sul campo Map/Long
    this.database.object("Map/Long").snapshotChanges().subscribe(action => {
      //Effettuo conversione e movimento
      this.convLong(action.payload.val())
    });

    
  }



  //Si occupa di inizializzare la mappa
  public setUpMap() {

    document.getElementById("setUp").style.display="none";

    mappa = new OpenLayers.Map("mapdiv");
    mappa.addLayer(new OpenLayers.Layer.OSM());
    lonLat = new OpenLayers.LonLat(14.4475, 40.88141666666667)
      .transform(
        new OpenLayers.Projection("EPSG:4326"), // transform from WGS 1984
        mappa.getProjectionObject() // to Spherical Mercator Projection
      );

      //Distanza visiva dalla mappa
    zoom = 16;

    markers = new OpenLayers.Layer.Markers("Markers");
    mappa.addLayer(markers);

    markers.addMarker(new OpenLayers.Marker(lonLat));

    mappa.setCenter(lonLat, zoom);
    trimmer = 0;

  }

  public loadScript() {
    console.log('preparing to load...')
    let node = document.createElement('script');
    node.src = url;
    node.type = 'text/javascript';
    node.async = true;
    node.charset = 'utf-8';
    document.getElementsByTagName('head')[0].appendChild(node);
  }

  move() {


    markers.destroy();


    if (trimmer == 1) {

      this.newMarker(10.022154, 44.680667);
      trimmer--;
    }
    else
      if (trimmer == 0) {

        this.newMarker(10.027399, 44.681493);
        trimmer++;
      }

  }

  //Si occupa di spostare il MARKER nella posizione (long/lat) definita
  moveWithLongAndLat(long, lat) {

    //window.alert("Got: "+long+","+lat);

    markers.destroy();


    this.newMarker(lat, long);


  }

  //Crea MARKER sulla mappa e lo posiziona nelle ccoordinate passate
  newMarker(lon, lat) {

    var lonLat = new OpenLayers.LonLat(lon, lat)
      .transform(
        new OpenLayers.Projection("EPSG:4326"), // transform from WGS 1984
        mappa.getProjectionObject() // to Spherical Mercator Projection
      );

    var zoom = 16;

    markers = new OpenLayers.Layer.Markers("Markers");
    mappa.addLayer(markers);

    markers.addMarker(new OpenLayers.Marker(lonLat));
    mappa.setCenter(lonLat, zoom);
  }




}

