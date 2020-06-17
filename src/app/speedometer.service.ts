import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import {Observable} from "rxjs";

const p = 'storico/'; //Parte statica del path del db

@Injectable({
  providedIn: 'root'
})
export class SpeedometerService {

  constructor(private db: AngularFireDatabase) { }

  getSpeed(): Observable<number>{
    return new Observable(subscriber => {
      this.db.database.ref('mappa/velocita_assoluta').once("value").then(value => {
        this.db.database.ref(p + value.val()).limitToLast(1).on("child_added", child => {
          subscriber.next(child.val());
        });
      });
    });
  }
}
