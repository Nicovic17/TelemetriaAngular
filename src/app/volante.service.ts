import { Injectable } from '@angular/core';

import { AngularFireDatabase } from '@angular/fire/database'
import {Observable} from "rxjs";

const p = 'storico/'; //Parte statica del path del db

@Injectable({
  providedIn: 'root'
})
export class VolanteService {

  constructor( public db:AngularFireDatabase) { }

  getGradiVolante(): Observable<number>{
    return new Observable<number>(subscriber => {
      this.db.database.ref('mappa/angolo_di_sterzo').once("value").then(value => {
        this.db.database.ref(p + value.val()).limitToLast(1).on("child_added", child => {
          subscriber.next(child.val());
        });
      });
    });
  }
}
