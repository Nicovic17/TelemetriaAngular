import { Injectable } from '@angular/core';
import {AngularFireDatabase} from "@angular/fire/database";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class DiagnosticaService {

  constructor(private db: AngularFireDatabase) { }

  getDiagMessages(): Observable<string[]>{
    return new Observable<string[]>(subscriber => {
      this.db.database.ref("/diagnostica").on("child_added", child =>{
        subscriber.next([child.key,child.val()]);
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

}
