import { Injectable } from '@angular/core';

import { AngularFireDatabase } from '@angular/fire/database';

import { Observable } from 'rxjs';

const p = 'storico/'; // Parte statica del path del db

@Injectable({
  providedIn: 'root'
})
export class BatteryService {

  constructor(private db: AngularFireDatabase) { }

   /**
   * Restituisce l'ultimo valore della batteria LowVoltage presente nel database
   */
  getBatteriaLowVoltage(): Observable<number>{
    const path = 'mappa/percentuale_di_carica_lv';
    return this.getDbValue(path);
  }

   /**
   * Restituisce l'ultimo valore della corrente HighVoltage presente nel database
   */
  getCorrenteHighVoltage(): Observable<number>{
    const path = 'mappa/corrente_in_uscita_hv';
    return this.getDbValue(path);
  }

   /**
   * Restituisce l'ultimo valore della corrente LowVoltage presente nel database
   */
  getCorrenteLowVoltage(): Observable<number>{
    const path = 'mappa/corrente_in_uscita_lv';
    return this.getDbValue(path);
  }

   /**
   * Restituisce l'ultimo valore della tensione HighVoltage presente nel database
   */
  getTensioneHighVoltage(): Observable<number>{
    const path = 'mappa/tensione_batt_hv';
    return this.getDbValue(path);
  }

   /**
   * Restituisce l'ultimo valore della tensione LowVoltage presente nel database
   */
  getTensioneLowVoltage(): Observable<number>{
    const path = 'mappa/tensione_batt_lv';
    return this.getDbValue(path);
  }

   /**
   * Restituisce l'ultimo valore della batteria HighVoltage presente nel database
   */
  getBatteriaHighVoltage(): Observable<number>{
    const path = 'mappa/percentuale_di_carica_hv';
    return this.getDbValue(path);
  }

   /**
   * Restituisce l'ultimo valore della temperatura media HighVoltage presente nel database
   */
  getTempMediaHighVoltage(){
    const path = 'mappa/temp_media_hv';
    return this.getDbValue(path);
  }

   /**
   * Restituisce l'ultimo valore della temperatura media LowVoltage presente nel database
   */
  getTempMediaLowVoltage(){
    const path = 'mappa/temp_media_lv';
    return this.getDbValue(path);
  }

  /**
   * Restituisce un Observable contenente il valore presente nel path definito
   * @param path : Percorso del valore richiesto su database
   */
  getDbValue(path: string): Observable<number>{
    return new Observable(subscriber => {
      this.db.database.ref(path).once('value').then(value => {
        this.db.database.ref(p + value.val()).limitToLast(1).on('child_added', child => {
          subscriber.next(child.val());
        });
      });
    });
  }
}
