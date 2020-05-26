import { Injectable } from '@angular/core';
import {AngularFireDatabase} from "@angular/fire/database";

@Injectable({
  providedIn: 'root'
})
export class BarsService {

  constructor(private db: AngularFireDatabase) { }

  getThrottleValue(){
    return this.db.object("Throttle").valueChanges();
  }
  getBreakValue(){
    return this.db.object("Break").valueChanges();
  }
}
