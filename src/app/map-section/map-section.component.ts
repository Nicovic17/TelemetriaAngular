import { Component, OnInit } from '@angular/core';
import {MapService} from '../map.service';

declare var OpenLayers: any;

const url = 'https://cdn.jsdelivr.net/gh/openlayers/openlayers.github.io@master/en/v6.3.1/build/ol.js';


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
    this.loadScript();
    this.setUpMap();

    this.ascoltaLatitudine();
    this.ascoltaLongitudine();
  }

   /**
   * Si mette in ascolto sul metodo di tipo Observable getLongitude(), aggiorna dati RealTime e aggiorna marker sulla mappa
   */
  ascoltaLongitudine()
  {
    this._mapService.getLongitude().subscribe(value => {
      this.lon = value;
      this.newMarker();
    });
  }

  /**
   * Si mette in ascolto sul metodo di tipo Observable getLatitude(), aggiorna dati RealTime e aggiorna marker sulla mappa
   */
  ascoltaLatitudine()
  {
    this._mapService.getLatitude().subscribe(value => {
      this.lat = value;
      this.newMarker();
    });
  }

  /**
   * Inizializza la mappa
   */
  public setUpMap() {
    this.mappa = new OpenLayers.Map('mapdiv');
    this.mappa.addLayer(new OpenLayers.Layer.OSM());
    this.lonlat = new OpenLayers.LonLat(this.lonlat, this.zoom)
    .transform(
      new OpenLayers.Projection('EPSG:4326'), // transform from WGS 1984
      this.mappa.getProjectionObject() // to Spherical Mercator Projection
    );

    // Distanza visiva dalla mappa
    this.zoom = 16;
    this.markers = new OpenLayers.Layer.Markers('Markers');
    this.mappa.addLayer(this.markers);
    this.markers.addMarker(new OpenLayers.Marker(this.lonlat));
    this.mappa.setCenter(this.lonlat, this.zoom);
    this.trimmer = 0;

  }

  /**
   * Carica lo script OpenLayers
   */
  public loadScript() {
    console.log('preparing to load...');
    const node = document.createElement('script');
    node.src = url;
    node.type = 'text/javascript';
    node.async = true;
    node.charset = 'utf-8';
    document.getElementsByTagName('head')[0].appendChild(node);
  }

  /**
   * Crea MARKER sulla mappa e lo posiziona nelle ccoordinate passate
   */
  newMarker() {
    this.markers.destroy();
    this.lonlat = new OpenLayers.LonLat(this.lon, this.lat)
      .transform(
        new OpenLayers.Projection('EPSG:4326'), // transform from WGS 1984
        this.mappa.getProjectionObject() // to Spherical Mercator Projection
      );
    this.zoom = 30;
    this.markers = new OpenLayers.Layer.Markers('Markers');
    this.mappa.addLayer(this.markers);
    this.markers.addMarker(new OpenLayers.Marker(this.lonlat));
    this.mappa.setCenter(this.lonlat, this.zoom);
  }
}
