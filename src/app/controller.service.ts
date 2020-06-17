import { Injectable } from '@angular/core';

import { AngularFireDatabase } from "@angular/fire/database";
import {Observable} from "rxjs";

const p = 'storico/'; //Parte statica del path del db

@Injectable({
  providedIn: 'root'
})
export class ControllerService {

  constructor(private db: AngularFireDatabase) { }

  getPressioneFreno(): Observable<number>{
    let path = 'mappa/pressione_circuito_freno';
    return this.getDbValue(path);
  }
  getFlussoLiquidoRaffreddamento(): Observable<number>{
    let path = 'mappa/flusso_liquido_raffreddamento';
    return this.getDbValue(path);
  }
  getTempLiquidoRaffreddamento(): Observable<number>{
    let path = 'mappa/temp_liquido_raffreddamento';
    return this.getDbValue(path);
  }

  getAngoloImbardata(): Observable<number>{
    let path = 'mappa/angolo_imbardata';
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
