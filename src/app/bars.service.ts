import { Injectable } from '@angular/core';
import {AngularFireDatabase} from '@angular/fire/database';
import {Observable} from 'rxjs';


const p = 'storico/'; // Parte statica del path del db

@Injectable({
  providedIn: 'root'
})
export class BarsService {

  constructor(private db: AngularFireDatabase) { }

  /**
   * Restituisce il valore di Break presente nel database
   */
  getBreakValue(): Observable<number>{
    const param = 'mappa/angolo_pedale_freno';
    return this.getDbValue(param);
  }
  /**
   * Restituisce il valore di Throttle presente nel database
   */
  getThrottleValue(): Observable<number>{
    const param = 'mappa/angolo_pedale_acceleratore';
    return this.getDbValue(param);
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
