import { Injectable } from '@angular/core';

import { AngularFireDatabase } from '@angular/fire/database';
import {Observable} from 'rxjs';

const p = 'storico/';// Parte statica del path del db

@Injectable({
  providedIn: 'root'
})
export class GforceService {

  constructor(private db: AngularFireDatabase) { }

  /**
   * Restituisce l'ultimo valore dell'accelerazione longitudinale ottenuto dalla vettura presente nel database RealTime
   */
  getLongitudinalAcc(): Observable<number>{
    return new Observable<number>(subscriber => {
      this.db.database.ref('mappa/accelerazione_longitudinale').once('value').then(value => {
        this.db.database.ref(p + value.val()).limitToLast(1).on('child_added', child => {
          subscriber.next(child.val());
        });
      });
    });
  }

  /**
   * Restituisce l'ultimo valore dell'accelerazione laterale ottenuto dalla vettura presente nel database RealTime
   */
  getLateralAcc(): Observable<number>{
    return new Observable<number>(subscriber => {
      this.db.database.ref('mappa/accelerazione_laterale').once('value').then(value => {
        this.db.database.ref(p + value.val()).limitToLast(1).on('child_added', child => {
          subscriber.next(child.val());
        });
      });
    });
  }
}
