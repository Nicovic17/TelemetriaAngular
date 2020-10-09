import { Injectable } from '@angular/core';
import { AngularFireDatabase } from "@angular/fire/database";
import { StoricoComponent } from './storico/storico.component';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import { DialogTestComponent } from '../app/dialog-test/dialog-test.component'



var arrayDate = [], arrayID = [], jsonObject = [], jsonDateForDropDown = [], arrayMapID=[]
var arrayNumeroSensoriPerOgniData = [];
@Injectable({
  providedIn: 'root'
})
export class StoricoService {
  constructor(private db: AngularFireDatabase,public dialog: MatDialog) {
  }

  public getDate() {

    var ref = this.db.database.ref("Sensori");
    ref.once("value", snap => {
      snap.forEach(function (child) {
        arrayDate.push(child.key)
      })
      
    })
  }

  //Popola array (id - nome) con la mappa presente sul DB
  public getMapForID(){

    arrayMapID=[];
    var ref=this.db.database.ref("mappa");

    ref.once("value", snap =>{
      snap.forEach(function (child){
        var idValore={}
        idValore["id"]=child.val();
        idValore["nome"]=child.key;

        arrayMapID.push(idValore);
      })
      this.mostraView(document.getElementById("rowButtons"));
      
    })
  }

  public getArrayMapForID(){

    var jsonString = JSON.stringify(arrayMapID);
    console.log("ArrayMap: "+jsonString)
    var obj = JSON.parse(jsonString);

    return obj;

  }


  //Popola array con tutti gli ID registrati sul database
  public getID() {

    arrayID = []
    jsonDateForDropDown = [];

    var ref = this.db.database.ref("storico");

    ref.once("value", snap => {
      snap.forEach(function (child) {

        arrayID.push(child.key)
      })
      
      this.nascondiView(document.getElementById("loader"))
      this.mostraView(document.getElementById("footer"))
      
      this.getDateForDropDown();
    })

  }

  //Popola l'array jsonDateForDropDown che conterrà tutte le date disponibili dei sensori
  getDateForDropDown() {
    arrayID.forEach(element => {

      var ref = this.db.database.ref("storico").child(element);
      ref.once("value", snap => {
        snap.forEach(function (child) {
          var aggiungi = {}

          aggiungi["id"] = element;
          var g = new Date(parseInt(child.key)).getDate()
          var month = new Date(parseInt(child.key)).getMonth() + 1
          var monthString;
          if (month > 0 && month < 10) 
          {
            monthString = "0" + month;
          }
          else
          monthString=month+"";

          var y = new Date(parseInt(child.key)).getFullYear()

          var h = new Date(parseInt(child.key)).getHours();
          var m = new Date(parseInt(child.key)).getMinutes();
          var s = new Date(parseInt(child.key)).getSeconds();
          var e = new Date(parseInt(child.key)).getMilliseconds();

          aggiungi["tempo"] =g+"-"+monthString+"-"+y+"-"+" "+ h + ":" + m + ":" + s + ":" + e;
           //Valore ID in quel tempo
          aggiungi["valore"] = child.val();
          jsonDateForDropDown.push(aggiungi);
          //child = tempo // child.

        })

      })



    });
  }

  getJsonObjectForDropDown() {
    var jsonString = JSON.stringify(jsonDateForDropDown);
    console.log(jsonString)
    var obj = JSON.parse(jsonString);

    return obj;
  }

  getArrayID() {
    return arrayID;
  }



  getArray() {
    return arrayDate;
  }

  //Prende i sensori selezionati e carica i dati presenti sul database di questi sensori
  //nell'intervallo di tempo selezionato
  testGrafico(array: any) {
    jsonObject = [];
    array.forEach(element => { //Per ogni ID
      var ref = this.db.database.ref("storico").child(element["id"]);
      ref.once("value", snap => {
        snap.forEach(function (child) {
          var aggiungi = {}
          //Controllo sul tempo

          var g = new Date(parseInt(child.key)).getDate()
          var dayString;
          if(g>0 && g<10)
          {
            dayString="0"+g;
          }
          else
          dayString=g+"";
          var month = new Date(parseInt(child.key)).getMonth() + 1
          var monthString;
          if (month > 0 && month < 10) 
          {
            monthString = "0" + month;
          }
          else
          monthString=month+"";

          var y = new Date(parseInt(child.key)).getFullYear()
          var h = new Date(parseInt(child.key)).getHours();
          var hourString;
          if(h>=0 && h<10)
          {
            hourString="0"+h;
          }
          else
          hourString=h+"";

          var m = new Date(parseInt(child.key)).getMinutes();
          var minString;
          if(m>=0 && m<10)
          {
            minString="0"+m;
          }
          else
          minString=m+"";

          var s = new Date(parseInt(child.key)).getSeconds();
          var secondsString;
          if(s >=0 && s <10)
          {
            secondsString="0"+s;
          }
          else
          secondsString=s+"";

          var e = new Date(parseInt(child.key)).getMilliseconds();

          var giornoSensore=dayString+"/"+monthString+"/"+y;

          //Se l'orario scelto dall'utente corrisponde a quello del sensore richiesto
          if(element["giornoScelto"] == giornoSensore)
          {
            //Carico i valori del sensore richiesto nell'intervallo di tempo selezionato
            var orarioSensore=hourString+":"+minString+":"+secondsString;
            if(orarioSensore >= element["dataInizio"] && orarioSensore <= element["dataFine"])
            {
              aggiungi["id"] = element["id"];
              aggiungi["tempo"] = orarioSensore+=":"+e;
              aggiungi["valore"] = child.val();
              //Struttura che conterrà tutti i valori disponibili
              jsonObject.push(aggiungi);
            }
          }
        })
        document.getElementById("btnJson").style.display = "block"
      })
    });

  }

  //Richiamato in startHighChart 
  //Restituisce oggetto id-tempo-valore dei sensori richiesti in istanti di tempo selezionati
  getJsonObject() {
    if(jsonObject.length==0)
    {
      window.alert("Nessun dato presente per tempo selezionato")
      return obj;
    }
    else{
      console.log("json non vuoto")
      var jsonString = JSON.stringify(jsonObject);
      //console.log(jsonString)
    var obj = JSON.parse(jsonString);
    return obj;

    }
    
  }

  setTextView(textView : any, text)
  {
    textView.innerHTML=text;
  }

  mostraView(button : any)
  {
    button.style.display="block";
  }

  nascondiView(button : any)
  {
    button.style.display="none";
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
