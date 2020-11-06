import { Injectable } from '@angular/core';
import {AngularFireDatabase} from '@angular/fire/database';
import {Observable} from 'rxjs';

const p = 'storico/';// Parte statica del path del db

@Injectable({
  providedIn: 'root'
})
export class EngineService {

  constructor(private db: AngularFireDatabase) {
  }

   /**
   * Restituisce l'ultimo valore della temperatura del primo motore presente nel database
   */
  getTempEngineOne(): Observable<number> {
    const path = 'mappa/temp_engine_1';
    return this.getDbValue(path);
  }

   /**
   * Restituisce l'ultimo valore della temperatura del secondo motore  presente nel database
   */
  getTempEngineTwo(): Observable<number> {
    const path = 'mappa/temp_engine_2';
    return this.getDbValue(path);
  }

   /**
   * Restituisce l'ultimo valore della temperatura del terzo motore  presente nel database
   */
  getTempEngineThree(): Observable<number> {
    const path = 'mappa/temp_engine_3';
    return this.getDbValue(path);
  }

   /**
   * Restituisce l'ultimo valore della temperatura del quarto motore presente nel database
   */
  getTempEngineFour(): Observable<number> {
    const path = 'mappa/temp_engine_4';
    return this.getDbValue(path);
  }

   /**
   * Restituisce l'ultimo valore della temperatura IGBT del primo Inverter presente nel database
   */
  getTempIgbtOne(): Observable<number> {
    const path = 'mappa/temp_IGBT_inv_1';
    return this.getDbValue(path);
  }

   /**
   * Restituisce l'ultimo valore della temperatura IGBT del secondo Inverter presente nel database
   */
  getTempIgbtTwo(): Observable<number> {
    const path = 'mappa/temp_IGBT_inv_2';
    return this.getDbValue(path);
  }

   /**
   * Restituisce l'ultimo valore della temperatura IGBT del terzo Inverter presente nel database
   */
  getTempIgbtThree(): Observable<number> {
    const path = 'mappa/temp_IGBT_inv_3';
    return this.getDbValue(path);
  }

   /**
   * Restituisce l'ultimo valore della temperatura IGBT del quarto Inverter presente nel database
   */
  getTempIgbtFour(): Observable<number> {
    const path = 'mappa/temp_IGBT_inv_4';
    return this.getDbValue(path);
  }

   /**
   * Restituisce un Observable contenente il valore presente nel path definito
   * @param path : Percorso del valore richiesto su database
   */
  getDbValue(path: string): Observable<number> {
    return new Observable(subscriber => {
      this.db.database.ref(path).once('value').then(value => {
        this.db.database.ref(p + value.val()).limitToLast(1).on('child_added', child => {
          subscriber.next(child.val());
        });
      });
    });
  }
}
