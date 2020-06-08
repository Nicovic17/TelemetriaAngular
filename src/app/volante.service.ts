import { Injectable } from '@angular/core';

import { AngularFireDatabase } from '@angular/fire/database'
import {Observable} from "rxjs";

const steerWheelAngDBPath = '/storico/001';

@Injectable({
  providedIn: 'root'
})
export class VolanteService {

  constructor( public db:AngularFireDatabase) { }

  getGradiVolante(): Observable<number>{
    return new Observable<number>(subscriber => {
      this.db.database.ref(steerWheelAngDBPath).on("child_added", child => {
        subscriber.next(child.val());
      })
    })
  }
}
