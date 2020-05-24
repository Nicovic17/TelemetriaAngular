import { Component, OnInit, WrappedValue } from '@angular/core';

import { AngularFirestore } from '@angular/fire/firestore'
import { AngularFireDatabase } from '@angular/fire/database'
import { AngularFireAuth } from '@angular/fire/auth'

import { Observable, from } from 'rxjs'

import { BatteryserviceService } from '../batteryservice.service'

//Per utilizzare jQuery in TS
declare var $: any;

//Variabile per aggiornare la carica della batteria
var charge=50;
//Variabile per aggiornare la vista della batteria
var col;


const url="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"

@Component({
  selector: 'app-new-battery',
  templateUrl: './new-battery.component.html',
  styleUrls: ['./new-battery.component.css']
})
export class NewBatteryComponent implements OnInit {

  constructor(private _interactionService: BatteryserviceService) {

    
    
   }

   

 
  ngOnInit(): void {
    //Carica lo script presente in "url" [non necessario]
    this.loadScript()
    
  }

  ngAfterViewInit()
  {

    this._interactionService.chargeen$.subscribe(
      data => {
        console.log("Charge ottenuta: "+data);
        charge=Number(data);
        this.batUpdate()
        
      }
    )
  }

/*Implementato in service
  ascoltaBatteria() {
    //Utilizza l'oggetto AngularFireDatabase per mettersi in ascolto su un determinato campo e fare operazioni
    //nel momento in cui il campo subisce variazioni
    this.db.object("Batteria").snapshotChanges().subscribe(action => {
      charge=Number(action.payload.val())
      this.batUpdate();
    });
  }*/

  //Carica script hostato online
  public loadScript() {
    console.log('preparing to load...')
    let node = document.createElement('script');
    node.src = url;
    node.type = 'text/javascript';
    node.async = true;
    node.charset = 'utf-8';
    document.getElementsByTagName('head')[0].appendChild(node);
  }

  
  //Tramite la variabile charge si occupa di aggiornare la vista della batteria
 batUpdate(){

  let lvlBattery = document.getElementById("lvlBattery");
    lvlBattery.innerHTML = "Batteria: " + charge + "%"
  //console.log("Charge: ",charge);
  if(charge<20){
    // Red - Danger!
    col = ["#750900","#c6462b", "#b74424", "#df0a00", "#590700"];
  }else if(charge<40){
    // Yellow - Might wanna charge soon...
    col = ["#754f00","#f2bb00", "#dbb300", "#df8f00", "#593c00"];
  }else{
    // Green - All good!
    col = ["#316d08","#60b939", "#51aa31", "#64ce11", "#255405"];
  }
 
  $("#battery").css("background-image","linear-gradient(to right, transparent 5%, "+col[0]+" 5%, "+col[0]+" 7%, "+col[1]+" 8%, "+col[1]+" 10%, "+col[2]+" 11%, "+col[2]+" "+ (charge-3) +"%, "+col[3]+" "+ (charge-2) +"%, "+col[3]+" "+ charge +"%, "+col[4]+" "+ charge +"%, black "+ (charge+5) +"%, black 95%, transparent 95%), linear-gradient(to bottom, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0.4) 4%, rgba(255,255,255,0.2) 7%, rgba(255,255,255,0.2) 14%, rgba(255,255,255,0.8) 14%, rgba(255,255,255,0.2) 40%, rgba(255,255,255,0) 41%, rgba(255,255,255,0) 80%, rgba(255,255,255,0.2) 80%, rgba(255,255,255,0.4) 86%, rgba(255,255,255,0.6) 90%, rgba(255,255,255,0.1) 92%, rgba(255,255,255,0.1) 95%, rgba(255,255,255,0.5) 98%)");
}

}


