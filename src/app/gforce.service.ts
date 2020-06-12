import { Injectable } from '@angular/core';

import { AngularFireDatabase } from '@angular/fire/database'
import {Observable} from "rxjs";

const longAccDBPath = 'storico/002';
const latAccDBPath = 'storico/003';

@Injectable({
  providedIn: 'root'
})
export class GforceService {

  constructor(private db: AngularFireDatabase) { }

  getLongitudinalAcc(): Observable<number>{
    return new Observable<number>(subscriber => {
      this.db.database.ref(longAccDBPath).limitToLast(1).on("child_added", child => {
        subscriber.next(child.val());
      })
    })
  }

  getLateralAcc(): Observable<number>{
    return new Observable<number>(subscriber => {
      this.db.database.ref(latAccDBPath).limitToLast(1).on("child_added", child => {
        subscriber.next(child.val());
      })
    })
  }
}
