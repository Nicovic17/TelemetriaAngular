import { Injectable } from '@angular/core';

import { AngularFireDatabase } from '@angular/fire/database'

import { Observable } from 'rxjs'

const lvDBPath = 'storico/016';
const hvDBPath = 'storico/015';

@Injectable({
  providedIn: 'root'
})
export class BatteryService {

  constructor(private db: AngularFireDatabase) { }

  ascoltaBatteriaLowVoltage(): Observable<number>{
    return new Observable<number>(subscriber => {
      this.db.database.ref(lvDBPath).limitToLast(1).on("child_added", child => {
        subscriber.next(child.val());
      })
    })
  }

  ascoltaBatteriaHighVoltage(): Observable<number>{
    return new Observable<number>(subscriber => {
      this.db.database.ref(hvDBPath).limitToLast(1).on("child_added", child => {
        subscriber.next(child.val());
      })
    })
  }
}
