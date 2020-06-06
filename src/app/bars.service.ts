import { Injectable } from '@angular/core';
import {AngularFireDatabase} from "@angular/fire/database";
import {Observable} from "rxjs";


const throttleDBPath = 'storico/011';
const breakDBPath = 'storico/012';

@Injectable({
  providedIn: 'root'
})
export class BarsService {

  constructor(private db: AngularFireDatabase) { }

  getThrottleValue(): Observable<number>{
    return new Observable(subscriber => {
      this.db.database.ref(throttleDBPath).on("child_added", child => {
        subscriber.next(child.val());
      });
    });
  }
  getBreakValue(): Observable<number>{
    return new Observable(subscriber => {
      this.db.database.ref(breakDBPath).on("child_added", child => {
        subscriber.next(child.val());
      });
    });
  }
}
