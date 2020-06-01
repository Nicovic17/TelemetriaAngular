import { Injectable } from '@angular/core';
import {AngularFireDatabase} from "@angular/fire/database";

@Injectable({
  providedIn: 'root'
})
export class MapService {
  private tempLat;
  private tempLong;
  constructor(private db: AngularFireDatabase) { }

  getLongitude(){
    return this.db.object('/realTime/010/longitude').valueChanges();
  }

  getLatitude(){
    return this.db.object('/realTime/010/latitude').valueChanges();
  }

}

