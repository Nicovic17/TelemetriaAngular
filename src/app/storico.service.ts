import { Injectable } from '@angular/core';
import { AngularFireDatabase } from "@angular/fire/database";

var arrayDate = [], arrayID = [], jsonObject = [], jsonDateForDropDown=[];
var test = ["Pollo"]
var numSens;
var arrayNumeroSensoriPerOgniData = [];
@Injectable({
  providedIn: 'root'
})
export class StoricoService {

  private arrayDateInterno = []

  constructor(private db: AngularFireDatabase) {

  }



  public getDate() {

    var ref = this.db.database.ref("Sensori");

    ref.once("value", snap => {
      snap.forEach(function (child) {
        //window.alert(child.key  )
        arrayDate.push(child.key)
      })
      window.alert("Finito")
      document.getElementById("load").innerHTML = "Caricamento completato"
    })
  }

  //Popola array con tutti gli ID registrati sul database
  public getID() {

    arrayID = []
    jsonDateForDropDown=[];

    var ref = this.db.database.ref("storico");

    ref.once("value", snap => {
      snap.forEach(function (child) {
        
        arrayID.push(child.key)
      })
      //window.alert("Finito")
      document.getElementById("load").innerHTML = "Caricamento completato"
      this.getDateForDropDown();
    })

  }

  getArrayID() {
    return arrayID;
  }

  getDateForDropDown()
  {
    arrayID.forEach(element => {

      var ref = this.db.database.ref("storico").child(element);
      ref.once("value", snap => {
        snap.forEach(function (child) {
          var aggiungi = {}
          //window.alert("Aggiungo ID: "+element) //ID
          
          aggiungi["id"] = element;
          //window.alert("Aggiungo TEMPO: "+child.key) //Tempo
          //window.alert("h"+child.key); 
          var h = new Date(parseInt(child.key)).getHours();
          var m = new Date(parseInt(child.key)).getMinutes();
          var s = new Date(parseInt(child.key)).getSeconds();
          var e = new Date(parseInt(child.key)).getMilliseconds();
          
          aggiungi["tempo"] = h+":"+m+":"+s+":"+e;
          //window.alert("Aggiungo VAL ID: "+child.child("value").val()) //Valore ID in quel tempo
          aggiungi["valore"] = child.val();
          jsonDateForDropDown.push(aggiungi);
          //child = tempo // child.

        })

      })
      


    });
  }

  getJsonObjectForDropDown()
  {
    var jsonString = JSON.stringify(jsonDateForDropDown);
    window.alert(jsonString)
    var obj = JSON.parse(jsonString);

    return obj;
  }

  getArray() {
    return arrayDate;
  }

  //Prende i sensori selezionati e ne starta un grafico
  testGrafico(array: any) {
    jsonObject = [];

    
    array.forEach(element => { //Per ogni ID

      var ref = this.db.database.ref("storico").child(element["id"]);
      ref.once("value", snap => {
        snap.forEach(function (child) {
          var aggiungi = {}
          //window.alert("Aggiungo ID: "+element) //ID
          
          
          //window.alert("Aggiungo TEMPO: "+child.key) //Tempo
          //window.alert("h"+child.key); 
          //Controllo sul tempo
          var h = new Date(parseInt(child.key)).getHours();
          var m = new Date(parseInt(child.key)).getMinutes();
          var s = new Date(parseInt(child.key)).getSeconds();
          var e = new Date(parseInt(child.key)).getMilliseconds();

          var data=h+":"+m+":"+s+":"+e;
          /*var x=new Date(data);
          var y=new Date(element["dataInizio"]).getHours();
          var z=new Date(element["dataFine"]);
          window.alert("x: "+x+"y:"+y+"z")*/
         if(data>=element["dataInizio"] && data<=element["dataFine"])
         {
          aggiungi["id"] = element["id"];
          aggiungi["tempo"] = data 
          aggiungi["valore"] = child.val();
          jsonObject.push(aggiungi);
         }
            
          
          //window.alert("Aggiungo VAL ID: "+child.child("value").val()) //Valore ID in quel tempo
          
          
          //child = tempo // child.

        })

        document.getElementById("btnJson").style.display = "block"


      })



    });

  }

  getJsonObject() {
    var jsonString = JSON.stringify(jsonObject);
    window.alert(jsonString)
    var obj = JSON.parse(jsonString);

    return obj;
  }


  //Prende il numero di sensori salvato in ogni istante di tempo disponibile
  getNumChildrenForAllDate() {
    var ref = this.db.database.ref("Sensori");

    ref.once("value", snap => {
      snap.forEach(function (child) {
        arrayNumeroSensoriPerOgniData.push(child.numChildren())
      })

      window.alert("Numero di children per ogni data ottenuto")
    })

  }

  public returnNumChildren() {

    return arrayNumeroSensoriPerOgniData;
  }
}
