import { Injectable } from '@angular/core';
import {AngularFireDatabase} from "@angular/fire/database";
import {Observable} from "rxjs";

const gpsDBPath = '/storico/010/';

@Injectable({
  providedIn: 'root'
})
export class MapService {
  constructor(private db: AngularFireDatabase) { }

  getLongitude(): Observable<number>{
    return new Observable(subscriber => {
      this.db.database.ref(gpsDBPath).limitToLast(1).on("child_added", child => {
        subscriber.next(child.child('long').val());
      });
    });
  }

  getLatitude(): Observable<number>{
    return new Observable(subscriber => {
      this.db.database.ref(gpsDBPath).limitToLast(1).on("child_added", child => {
        subscriber.next(child.child('lat').val());
      });
    });
  }

}

