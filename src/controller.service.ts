import { Injectable } from '@angular/core';

import { AngularFireDatabase } from "@angular/fire/database";
import {Observable} from "rxjs";

const p = 'storico/'; //Parte statica del path del db

@Injectable({
  providedIn: 'root'
})
export class ControllerService {

  constructor(private db: AngularFireDatabase) { }

  getPressioneFreno(): Observable<any>{
    let path = 'mappa/pressione_circuito_freno';
    return this.getDbValue(path);
  }
  getFlussoLiquidoRaffreddamento(): Observable<any>{
    let path = 'mappa/flusso_liquido_raffreddamento';
    return this.getDbValue(path);
  }
  getTempLiquidoRaffreddamento(): Observable<any>{
    let path = 'mappa/temp_liquido_raffreddamento';
    return this.getDbValue(path);
  }

  getTempFreno(): Observable<any>{
    let path = 'mappa/temp_freno';
    return this.getDbValue(path);
  }

   /**
   * Restituisce il valore nel path definito del database RealTime
   */
  getAngoloImbardata(): Observable<any>{
    let path = 'mappa/angolo_imbardata';
    return this.getDbValue(path);
  }

  /**
   * Restituisce il valore nel path definito del database RealTime
   */
  getAngoloRollio(): Observable<any>{
    let path = 'mappa/angolo_rollio';
    return this.getDbValue(path);
  }

   /**
   * Restituisce il valore nel path definito del database RealTime
   */
  getAngoloBeccheggio(): Observable<any>{
    let path = 'mappa/angolo_beccheggio';
    return this.getDbValue(path);
  }

  getSpiaECU(): Observable<any>{
    let path = 'mappa/spia_ecu';
    return this.getDbValue(path);
  }

  getSpiaOverHeat(): Observable<any>{
    let path = 'mappa/spia_over_heat';
    return this.getDbValue(path);
  }

  getSpiaBatteryManagementSystem(): Observable<any>{
    let path = 'mappa/spia_bms';
    return this.getDbValue(path);
  }

  getSpiaTractionControlSystem(): Observable<any>{
    let path = 'mappa/spia_tcs';
    return this.getDbValue(path);
  }

  getSpiaTorqueLimitation(): Observable<any>{
    let path = 'mappa/spia_torque_limitation';
    return this.getDbValue(path);
  }

  getSpiaIMD(): Observable<any>{
    let path = 'mappa/spia_imd';
    return this.getDbValue(path);
  }

  /**
   * Restituisce un Observable contenente il valore presente nel path definito
   * @param path : Percorso del valore richiesto su database
   */
  getDbValue(path: string): Observable<any>{
    return new Observable(subscriber => {
      this.db.database.ref(path).once("value").then(value => {
        if(value.val() != "not_exist") {
          this.db.database.ref(p + value.val()).limitToLast(1).on("child_added", child => {
            subscriber.next(child.val());
          });
        }else{
          subscriber.next("null");
        }
      });
    });
  }
}
