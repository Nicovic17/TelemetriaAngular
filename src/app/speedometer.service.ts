import { Injectable } from '@angular/core';

import {AngularFireDatabase} from '@angular/fire/database';

@Injectable({
  providedIn: 'root'
})
export class SpeedometerService {

  constructor(private db: AngularFireDatabase) { }

  getSpeed(){
    return this.db.object("Speed").valueChanges();
  }
}
