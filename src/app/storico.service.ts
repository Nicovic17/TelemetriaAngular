import { Injectable } from '@angular/core';
import {AngularFireDatabase} from "@angular/fire/database";

var arrayDate=[], arrayID=[], jsonObject=[];
var test=["Pollo"]
var numSens;
var arrayNumeroSensoriPerOgniData=[];
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

   //Popola array con tutti gli ID registrati sul database
   public getID(){

    var ref = this.db.database.ref("Sensori");

    ref.once("value", snap => {
      snap.forEach(function (child) {
        //window.alert(child.key  )
        arrayID.push(child.key)
      })
      //window.alert("Finito")
      document.getElementById("load").innerHTML="Caricamento completato"
    })

   }

   getArrayID(){
     return arrayID;
   }
   getArray(){
     return arrayDate;
   }

   //Prende i sensori selezionati e ne starta un grafico
   testGrafico(array: any)
   {
     jsonObject=[];
     
      array.forEach(element => { //Per ogni ID

        var ref=this.db.database.ref("Sensori").child(element);
        ref.once("value",snap =>{
          snap.forEach(function(child){
            var aggiungi={}
            //window.alert("Aggiungo ID: "+element) //ID
            aggiungi["id"]=element;
            //window.alert("Aggiungo TEMPO: "+child.key) //Tempo
            aggiungi["tempo"]=child.key;
            //window.alert("Aggiungo VAL ID: "+child.child("value").val()) //Valore ID in quel tempo
            aggiungi["valore"]=child.child("value").val();
            jsonObject.push(aggiungi);
            //child = tempo // child.
            
          })

          document.getElementById("btnJson").style.display="block"
          

        })
        
        

      });

   }

   getJsonObject()
   {
     var jsonString=JSON.stringify(jsonObject);
     window.alert(jsonString)
     var obj=JSON.parse(jsonString);
     
     return obj;
   }
   

   //Prende il numero di sensori salvato in ogni istante di tempo disponibile
   getNumChildrenForAllDate()
   {
      var ref=this.db.database.ref("Sensori");

      ref.once("value",snap =>{
        snap.forEach(function (child){
          arrayNumeroSensoriPerOgniData.push(child.numChildren())
        })

        window.alert("Numero di children per ogni data ottenuto")
      })

   }

   public returnNumChildren(){
     
     return arrayNumeroSensoriPerOgniData;
   }
}
