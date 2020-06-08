import { Injectable } from '@angular/core';
import {AngularFireDatabase} from '@angular/fire/database';
import {Observable} from "rxjs";

const speedDBPath = '/storico/004';

@Injectable({
  providedIn: 'root'
})
export class SpeedometerService {

  constructor(private db: AngularFireDatabase) { }

  getSpeed(): Observable<number>{
    return new Observable(subscriber => {
      this.db.database.ref(speedDBPath).limitToLast(1).on("child_added", child => {
        subscriber.next(child.val());
      });
    })

  }
}
