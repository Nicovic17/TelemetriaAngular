import { Injectable } from '@angular/core';
import {AngularFireDatabase} from "@angular/fire/database";


const throttleDBPath = 'realTime/011/value';
const breakDBPath = 'realTime/012/value';

@Injectable({
  providedIn: 'root'
})
export class BarsService {

  constructor(private db: AngularFireDatabase) { }

  getThrottleValue(){
    return this.db.object(throttleDBPath).valueChanges();
  }
  getBreakValue(){
    return this.db.object(breakDBPath).valueChanges();
  }
}
