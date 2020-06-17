import { Injectable } from '@angular/core';

import { AngularFireDatabase } from '@angular/fire/database'

import { Observable } from 'rxjs'

const p = 'storico/'; //Parte statica del path del db

@Injectable({
  providedIn: 'root'
})
export class BatteryService {

  constructor(private db: AngularFireDatabase) { }

  getBatteriaLowVoltage(): Observable<number>{
    let path = 'mappa/percentuale_di_carica_lv';
    return this.getDbValue(path);
  }
  getCorrenteHighVoltage():Observable<number>{
    let path = 'mappa/corrente_in_uscita_hv';
    return this.getDbValue(path);
  }
  getCorrenteLowVoltage():Observable<number>{
    let path = 'mappa/corrente_in_uscita_lv';
    return this.getDbValue(path);
  }
  getTensioneHighVoltage():Observable<number>{
    let path = 'mappa/tensione_batt_hv';
    return this.getDbValue(path);
  }
  getTensioneLowVoltage():Observable<number>{
    let path = 'mappa/tensione_batt_lv';
    return this.getDbValue(path);
  }
  getBatteriaHighVoltage(): Observable<number>{
    let path = 'mappa/percentuale_di_carica_hv';
    return this.getDbValue(path);
  }
  getTempMediaHighVoltage(){
    let path = 'mappa/temp_media_hv';
    return this.getDbValue(path);
  }
  getTempMediaLowVoltage(){
    let path = 'mappa/temp_media_lv';
    return this.getDbValue(path);
  }
  getDbValue(path: string): Observable<number>{
    return new Observable(subscriber => {
      this.db.database.ref(path).once("value").then(value => {
        this.db.database.ref(p + value.val()).limitToLast(1).on("child_added", child => {
          subscriber.next(child.val());
        });
      });
    });
  }
}
