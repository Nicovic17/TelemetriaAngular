import { Injectable } from '@angular/core';
import {AngularFireDatabase} from '@angular/fire/database';

const speedDBPath = 'realTime/004/value';

@Injectable({
  providedIn: 'root'
})
export class SpeedometerService {

  constructor(private db: AngularFireDatabase) { }

  getSpeed(){
    return this.db.object(speedDBPath).valueChanges();
  }
}
