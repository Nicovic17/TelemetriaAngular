import { Injectable } from '@angular/core';

import { AngularFireDatabase } from '@angular/fire/database'



import { BehaviorSubject } from 'rxjs';



//Per utilizzare jQuery in TS
declare var $: any;

const steerWheelAngDBPath = 'realTime/001/value';

@Injectable({
  providedIn: 'root'
})
export class VolanteserviceService {

  public _gradi= new BehaviorSubject<Number>(0);
  gradi$= this._gradi.asObservable();

  constructor( public db:AngularFireDatabase) { 
    this.ascoltaGradiVolante();
  }

  ascoltaGradiVolante(){

    this.db.object(steerWheelAngDBPath).snapshotChanges().subscribe(action => {
      console.log("Invio da DB : "+action.payload.val())
      this._gradi.next(Number(action.payload.val()))
    });

  }
}
