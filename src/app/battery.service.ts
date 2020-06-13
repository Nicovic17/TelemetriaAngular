import { Injectable } from '@angular/core';

import { AngularFireDatabase } from '@angular/fire/database'

import { Observable } from 'rxjs'

const lvDBPath = 'storico/018';
const hvDBPath = 'storico/017';
const hvCorrenteDBPath = 'storico/019';
const lvCorrenteDBPath = 'storico/020';
const hvTensioneDBPath = 'storico/015';
const lvTensioneDBPath = 'storico/016';

@Injectable({
  providedIn: 'root'
})
export class BatteryService {

  constructor(private db: AngularFireDatabase) { }

  getBatteriaLowVoltage(): Observable<number>{
    return new Observable<number>(subscriber => {
      this.db.database.ref(lvDBPath).limitToLast(1).on("child_added", child => {
        subscriber.next(child.val());
      })
    })
  }
  getCorrenteHighVoltage():Observable<number>{
    return new Observable<number>(subscriber => {
      this.db.database.ref(hvCorrenteDBPath).limitToLast(1).on("child_added", child => {
        subscriber.next(child.val());
      });
    });
  }
  getCorrenteLowVoltage():Observable<number>{
    return new Observable<number>(subscriber => {
      this.db.database.ref(lvCorrenteDBPath).limitToLast(1).on("child_added", child => {
        subscriber.next(child.val());
      });
    });
  }
  getTensioneHighVoltage():Observable<number>{
    return new Observable<number>(subscriber => {
      this.db.database.ref(hvTensioneDBPath).limitToLast(1).on("child_added", child => {
        subscriber.next(child.val());
      });
    });
  }
  getTensioneLowVoltage():Observable<number>{
    return new Observable<number>(subscriber => {
      this.db.database.ref(lvTensioneDBPath).limitToLast(1).on("child_added", child => {
        subscriber.next(child.val());
      });
    });
  }
  getBatteriaHighVoltage(): Observable<number>{
    return new Observable<number>(subscriber => {
      this.db.database.ref(hvDBPath).limitToLast(1).on("child_added", child => {
        subscriber.next(child.val());
      })
    })
  }
}
