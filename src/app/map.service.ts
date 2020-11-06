import { Injectable } from '@angular/core';
import {AngularFireDatabase} from '@angular/fire/database';
import {Observable} from 'rxjs';

const p = 'storico/'; // Parte statica del path del db

@Injectable({
  providedIn: 'root'
})
export class MapService {
  constructor(private db: AngularFireDatabase) { }

 /**
   * Restituisce l'ultimo valore longitudinale ottenuto dalla vettura presente nel database RealTime
   */
  getLongitude(): Observable<number>{
    return new Observable(subscriber => {
      this.db.database.ref('mappa/posizione_veicolo').once('value').then(value => {
        this.db.database.ref(p + value.val()).limitToLast(1).on('child_added', child => {
          subscriber.next(child.child('long').val());
        });
      });
    });
  }

   /**
   * Restituisce l'ultimo valore latitudinale ottenuto dalla vettura presente nel database RealTime
   */
  getLatitude(): Observable<number>{
    return new Observable(subscriber => {
      this.db.database.ref('mappa/posizione_veicolo').once('value').then(value => {
        this.db.database.ref(p + value.val()).limitToLast(1).on('child_added', child => {
          subscriber.next(child.child('lat').val());
        });
      });
    });
  }

}

