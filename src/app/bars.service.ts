import { Injectable } from '@angular/core';
import {AngularFireDatabase} from "@angular/fire/database";
import {Observable} from "rxjs";


const p = 'storico/'; //Parte statica del path del db

@Injectable({
  providedIn: 'root'
})
export class BarsService {

  constructor(private db: AngularFireDatabase) { }

  getBreakValue(): Observable<number>{
    let param = 'mappa/angolo_pedale_freno';
    return this.getDbValue(param);
  }
  getThrottleValue(): Observable<number>{
    let param = 'mappa/angolo_pedale_acceleratore';
    return this.getDbValue(param);
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
