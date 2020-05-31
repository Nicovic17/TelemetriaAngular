import { Injectable } from '@angular/core';


import { AngularFireDatabase } from '@angular/fire/database'



import { BehaviorSubject } from 'rxjs'


//Per utilizzare jQuery in TS
declare var $: any;

//Variabile per aggiornare la carica della batteria
var charge=50;
//Variabile per aggiornare la vista della batteria
var col;

const lvDBPath = 'realTime/016/value';
const hvDBPath = 'realTime/015/value';

@Injectable({
  providedIn: 'root'
})
export class BatteryService {
  // Creo oggetto Observable che su cui si poggia la vista Batteria
  public _charge = new BehaviorSubject<Number>(100);
  chargeen$ = this._charge.asObservable();

  public _chargeLv = new BehaviorSubject<Number>(100)
  chargeLv$ = this._chargeLv.asObservable()

  constructor(private db: AngularFireDatabase) {
    this.ascoltaBatteria();
    this.ascoltaBatteriaLv();
   }

   
  sendCharge(charge : Number)
  {
    console.log("Invio DATIIII"+charge);
    this._charge.next(charge);
  }

  // Ogni volta che la batteria cambia nel DB , il nuovo valore viene inviato all'oggetto Observable e aggiornato poi
  // nella vista
  ascoltaBatteria() {
    //Utilizza l'oggetto AngularFireDatabase per mettersi in ascolto su un determinato campo e fare operazioni
    //nel momento in cui il campo subisce variazioni
    this.db.object(hvDBPath).snapshotChanges().subscribe(action => {
      //charge=Number(action.payload.val())
      console.log("Invio da DB : "+action.payload.val())
      this._charge.next(Number(action.payload.val()))
    });
  }

  ascoltaBatteriaLv() {
    //Utilizza l'oggetto AngularFireDatabase per mettersi in ascolto su un determinato campo e fare operazioni
    //nel momento in cui il campo subisce variazioni
    this.db.object(lvDBPath).snapshotChanges().subscribe(action => {
      //charge=Number(action.payload.val())
      console.log("Invio da DB LV : "+action.payload.val())
      this._chargeLv.next(Number(action.payload.val()))
    });
  }

}
