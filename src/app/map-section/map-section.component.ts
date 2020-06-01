import { Component, OnInit } from '@angular/core';
import {MapService} from "../map.service";


declare var OpenLayers: any;
declare var testMarker:any;
declare var loadTest:any;

const url = "https://cdn.jsdelivr.net/gh/openlayers/openlayers.github.io@master/en/v6.3.1/build/ol.js";


@Component({
  selector: 'app-map-section',
  templateUrl: './map-section.component.html',
  styleUrls: ['./map-section.component.css']
})
export class MapSectionComponent implements OnInit {
  private markers;
  private trimmer;
  private mappa;
  private lonlat;
  private zoom;
  private lon;
  private lat;

  loadAPI: Promise<any>;
  constructor(private _mapService: MapService) {}

  ngOnInit(): void {
    //Appena si carica la pagina carica lo script in "url"
    this.loadScript()
    //Appena si carica la pagina la mappa viene settata automaticamente con un click
    //Questo perché il settaggio automatico diretto porta problemi con OpenLayer
    //document.getElementById("setUp").click()
    this.setUpMap();

    this._mapService.getLatitude().subscribe(value => {
      this.lat = value;
      this.newMarker();
    })

    this._mapService.getLongitude().subscribe(value => {
      this.lon = value;
      this.newMarker();
    })
   
  }


  //Si occupa di inizializzare la mappa
  public setUpMap() {
    this.mappa = new OpenLayers.Map("mapdiv");
    this.mappa.addLayer(new OpenLayers.Layer.OSM());
    this.lonlat = new OpenLayers.LonLat(this.lonlat, this.zoom)
    .transform(
      new OpenLayers.Projection("EPSG:4326"), // transform from WGS 1984
      this.mappa.getProjectionObject() // to Spherical Mercator Projection
    );

      //Distanza visiva dalla mappa
    this.zoom = 16;
    this.markers = new OpenLayers.Layer.Markers("Markers");
    this.mappa.addLayer(this.markers);
    this.markers.addMarker(new OpenLayers.Marker(this.lonlat));
    this.mappa.setCenter(this.lonlat, this.zoom);
    this.trimmer = 0;

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


  //Crea MARKER sulla mappa e lo posiziona nelle ccoordinate passate
  newMarker() {
    this.markers.destroy();

    this.lonlat = new OpenLayers.LonLat(this.lon, this.lat)
      .transform(
        new OpenLayers.Projection("EPSG:4326"), // transform from WGS 1984
        this.mappa.getProjectionObject() // to Spherical Mercator Projection
      );

    this.zoom = 30;

    this.markers = new OpenLayers.Layer.Markers("Markers");
    this.mappa.addLayer(this.markers);

    this.markers.addMarker(new OpenLayers.Marker(this.lonlat));
    this.mappa.setCenter(this.lonlat, this.zoom);
  }
}

/*
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
 }*/

/*//Si occupa di spostare il MARKER nella posizione (long/lat) definita
moveWithLongAndLat(long, lat) {

  this.markers.destroy();

  this.newMarker(lat, long);
}*/


/*move() {
  this.markers.destroy();
  if (this.trimmer == 1) {
    this.newMarker(10.022154, 44.680667);
    this.trimmer--;
  }
  else
    if (this.trimmer == 0) {

      this.newMarker(10.027399, 44.681493);
      this.trimmer++;
    }
}*/