import { Injectable } from '@angular/core';
import {AngularFireDatabase} from "@angular/fire/database";
import {Observable} from "rxjs";

const p = 'storico/'//Parte statica del path del db

@Injectable({
  providedIn: 'root'
})
export class EngineService {

  constructor(private db: AngularFireDatabase) {
  }

  getTempEngineOne(): Observable<number> {
    let path = 'mappa/temp_engine_1';
    return this.getDbValue(path);
  }

  getTempEngineTwo(): Observable<number> {
    let path = 'mappa/temp_engine_2';
    return this.getDbValue(path);
  }

  getTempEngineThree(): Observable<number> {
    let path = 'mappa/temp_engine_3';
    return this.getDbValue(path);
  }

  getTempEngineFour(): Observable<number> {
    let path = 'mappa/temp_engine_4';
    return this.getDbValue(path);
  }

  getTempIgbtOne(): Observable<number> {
    let path = 'mappa/temp_IGBT_inv_1';
    return this.getDbValue(path);
  }

  getTempIgbtTwo(): Observable<number> {
    let path = 'mappa/temp_IGBT_inv_2';
    return this.getDbValue(path);
  }

  getTempIgbtThree(): Observable<number> {
    let path = 'mappa/temp_IGBT_inv_3';
    return this.getDbValue(path);
  }

  getTempIgbtFour(): Observable<number> {
    let path = 'mappa/temp_IGBT_inv_4';
    return this.getDbValue(path);
  }

  getDbValue(path: string): Observable<number> {
    return new Observable(subscriber => {
      this.db.database.ref(path).once("value").then(value => {
        this.db.database.ref(p + value.val()).limitToLast(1).on("child_added", child => {
          subscriber.next(child.val());
        });
      });
    });
  }
}
