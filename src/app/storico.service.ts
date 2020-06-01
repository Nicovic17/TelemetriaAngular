import { Injectable } from '@angular/core';
import {AngularFireDatabase} from "@angular/fire/database";

var arrayDate=[];
var test=["Pollo"]
@Injectable({
  providedIn: 'root'
})
export class StoricoService {

  private arrayDateInterno=[]

  constructor(private db: AngularFireDatabase) {
    
   }

   

    public getDate(){
      
    var ref = this.db.database.ref("Sensori");

    ref.once("value", snap => {
      snap.forEach(function (child) {
        //window.alert(child.key  )
        arrayDate.push(child.key)
      })
      window.alert("Finito")
      document.getElementById("load").innerHTML="Caricamento completato"
    })
    

    
   }

   getArray(){
     return arrayDate;
   }
}
