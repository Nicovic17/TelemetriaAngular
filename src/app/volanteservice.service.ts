import { Injectable } from '@angular/core';

import { AngularFireDatabase } from '@angular/fire/database'



import { BehaviorSubject } from 'rxjs'



//Per utilizzare jQuery in TS
declare var $: any;



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

    this.db.object("RotazioneVolante").snapshotChanges().subscribe(action => {
      console.log("Invio da DB : "+action.payload.val())
      this._gradi.next(Number(action.payload.val()))
    });

  }
}
