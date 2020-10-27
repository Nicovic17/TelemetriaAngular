import { Injectable } from '@angular/core';
import {AngularFireDatabase} from "@angular/fire/database";
import {Observable} from "rxjs";
import {childOfKind} from 'tslint';

@Injectable({
  providedIn: 'root'
})
export class DiagnosticaService {

  constructor(private db: AngularFireDatabase) { }

  getDiagMessages(): Observable<string[]>{
    return new Observable<string[]>(subscriber => {
      this.db.database.ref("/diagnostica").on("child_added", child =>{
        subscriber.next([child.key, child.val()]);
      });
    });
  }

  deleteKey(key){
    this.db.database.ref("/diagnostica/" + key).remove().then(() => {
      console.log("Database key:" + key + " removal complete.");
    }).catch(reason => {
      console.log("Database removal FAILED reason: " + reason);
    });
  }

  getCronologySensorData(id: string): Observable<Map<number, number>>{
    let ret = new Map();
    return new Observable<Map<number, number>>(subscriber => {
      this.db.database.ref("storico/"+id).once("value").then(value => {
        value.forEach(child => {
          ret.set(child.key,child.val());
        });
        subscriber.next(ret);
      });
    });
  }


}
