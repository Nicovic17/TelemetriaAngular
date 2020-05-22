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
    this.ascoltaMap()
   }

  ngOnInit(): void {

    this.loadScript()
    document.getElementById("setUp").click()
   
  }

  ngAfterViewInit(){
    
    
  }

  convLat(lat:Object)
  {
    this.lat=Number(lat);
    if(this.lat!=undefined)
    {
      console.log("Lati: "+this.lat)
      this.move2(this.lat,this.long)
    }
    
  }

  convLong(long:Object)
  {
    this.long=Number(long);
    if(this.long!=undefined)
    {
      console.log("Long: "+this.long)
      this.move2(this.lat,this.long)

    }
    
  }

  /*writeVal(val1:Object,val2:Object)
  {
    
    this.xxx=Number(val1);
    console.log("VAL1: "+this.xxx);
  }*/

  ascoltaMap()
  {
    this.database.object("Map/Lat").snapshotChanges().subscribe(action => {
      lat=action.payload.val()
      this.convLat(action.payload.val());
    });

    this.database.object("Map/Long").snapshotChanges().subscribe(action => {
      this.convLong(action.payload.val())
    });

    
  }



  public setUpMap() {

    document.getElementById("setUp").style.display="none";

    mappa = new OpenLayers.Map("mapdiv");
    mappa.addLayer(new OpenLayers.Layer.OSM());
    lonLat = new OpenLayers.LonLat(14.4475, 40.88141666666667)
      .transform(
        new OpenLayers.Projection("EPSG:4326"), // transform from WGS 1984
        mappa.getProjectionObject() // to Spherical Mercator Projection
      );

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

  move2(long, lat) {

    //window.alert("Got: "+long+","+lat);

    markers.destroy();


    this.newMarker(lat, long);


  }

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

