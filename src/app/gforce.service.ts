import { Injectable } from '@angular/core';

import { AngularFireDatabase } from '@angular/fire/database'
import {Observable} from "rxjs";

const p = 'storico/'//Parte statica del path del db

@Injectable({
  providedIn: 'root'
})
export class GforceService {

  constructor(private db: AngularFireDatabase) { }

  getLongitudinalAcc(): Observable<number>{
    return new Observable<number>(subscriber => {
      this.db.database.ref('mappa/accelerazione_longitudinale').once("value").then(value => {
        this.db.database.ref(p + value.val()).limitToLast(1).on("child_added", child => {
          subscriber.next(child.val());
        });
      });
    });
  }

  getLateralAcc(): Observable<number>{
    return new Observable<number>(subscriber => {
      this.db.database.ref('mappa/accelerazione_laterale').once("value").then(value => {
        this.db.database.ref(p + value.val()).limitToLast(1).on("child_added", child => {
          subscriber.next(child.val());
        });
      });
    });
  }
}
