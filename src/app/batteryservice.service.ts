import { Injectable } from '@angular/core';


import { AngularFireDatabase } from '@angular/fire/database'



import { BehaviorSubject } from 'rxjs'


//Per utilizzare jQuery in TS
declare var $: any;

//Variabile per aggiornare la carica della batteria
var charge=50;
//Variabile per aggiornare la vista della batteria
var col;

@Injectable({
  providedIn: 'root'
})

export class BatteryserviceService {


  public _charge= new BehaviorSubject<Number>(10);
  chargeen$= this._charge.asObservable();

  constructor(public db: AngularFireDatabase) {
    this.ascoltaBatteria()
   }

  sendCharge(charge : Number)
  {
    console.log("Invio DATIIII"+charge)
    this._charge.next(charge)
  }

  ascoltaBatteria() {
    //Utilizza l'oggetto AngularFireDatabase per mettersi in ascolto su un determinato campo e fare operazioni
    //nel momento in cui il campo subisce variazioni
    this.db.object("Batteria").snapshotChanges().subscribe(action => {
      //charge=Number(action.payload.val())
      console.log("Invio da DB : "+action.payload.val())
      this._charge.next(Number(action.payload.val()))
    });
  }


}
