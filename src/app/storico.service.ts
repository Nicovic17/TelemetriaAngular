import { Injectable } from '@angular/core';
import { AngularFireDatabase } from "@angular/fire/database";
import { StoricoComponent } from './storico/storico.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DialogTestComponent } from '../app/dialog-test/dialog-test.component'
import { AngularFireAuth } from '@angular/fire/auth';

var arrayID = [], jsonObject = [], jsonDateForDropDown = [], arrayMapID = []

@Injectable({
  providedIn: 'root'
})



export class StoricoService {
  constructor(private db: AngularFireDatabase, public dialog: MatDialog, public auth: AngularFireAuth) {


  }
  //Popola array (id - nome) con la mappa presente sul DB
  public getMapForID() {

    arrayMapID = [];
    var ref = this.db.database.ref("mappa");
    ref.once("value", snap => {
      snap.forEach(function (child) {
        var idValore = {}
        idValore["id"] = child.val();
        idValore["nome"] = child.key;
        arrayMapID.push(idValore);
      })
      this.mostraView(document.getElementById("rowButtons"));
    })
  }

  public getArrayMapForID() {
    var jsonString = JSON.stringify(arrayMapID);
    console.log("ArrayMap: " + jsonString)
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
          var tempo = "";
          aggiungi["id"] = element;
          var g = new Date(parseInt(child.key)).getDate()
          var month = new Date(parseInt(child.key)).getMonth() + 1
          var monthString;
          if (month > 0 && month < 10) {
            monthString = "0" + month;
          }
          else
            monthString = month + "";
          var y = new Date(parseInt(child.key)).getFullYear()
          var h = new Date(parseInt(child.key)).getHours();
          var m = new Date(parseInt(child.key)).getMinutes();
          var s = new Date(parseInt(child.key)).getSeconds();
          //var e = new Date(parseInt(child.key)).getMilliseconds();
          tempo = g + "-" + monthString + "-" + y + "-" + " " + h + ":" + m + ":" + s;
          var index = jsonDateForDropDown.length;
          if (index != 0) {
            if (tempo != jsonDateForDropDown[index - 1]["tempo"]) {
              aggiungi["tempo"] = tempo;
              jsonDateForDropDown.push(aggiungi);
            }
          } else {
            aggiungi["tempo"] = tempo;
            jsonDateForDropDown.push(aggiungi);
          }

          //Valore ID in quel tempo
          //aggiungi["valore"] = child.val();

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

  //Prende i sensori selezionati e carica i dati presenti sul database
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
          if (g > 0 && g < 10) {
            dayString = "0" + g;
          }
          else
            dayString = g + "";
          var month = new Date(parseInt(child.key)).getMonth() + 1
          var monthString;
          if (month > 0 && month < 10) {
            monthString = "0" + month;
          }
          else
            monthString = month + "";
          var y = new Date(parseInt(child.key)).getFullYear()
          var h = new Date(parseInt(child.key)).getHours();
          var hourString;
          if (h >= 0 && h < 10) {
            hourString = "0" + h;
          }
          else
            hourString = h + "";
          var m = new Date(parseInt(child.key)).getMinutes();
          var minString;
          if (m >= 0 && m < 10) {
            minString = "0" + m;
          }
          else
            minString = m + "";
          var s = new Date(parseInt(child.key)).getSeconds();
          var secondsString;
          if (s >= 0 && s < 10) {
            secondsString = "0" + s;
          }
          else
            secondsString = s + "";

          var e = new Date(parseInt(child.key)).getMilliseconds();
          var giornoSensore = dayString + "/" + monthString + "/" + y;

          //Se l'orario scelto dall'utente corrisponde a quello del sensore richiesto
          if (element["giornoScelto"] == giornoSensore) {
            //Carico i valori del sensore richiesto nell'intervallo di tempo selezionato
            var orarioSensore = hourString + ":" + minString + ":" + secondsString;
            if (orarioSensore >= element["dataInizio"] && orarioSensore <= element["dataFine"]) {
              aggiungi["id"] = element["id"];
              aggiungi["tempo"] = orarioSensore += ":" + e;
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
    if (jsonObject.length == 0) {
      window.alert("Nessun dato presente per tempo selezionato")
      return obj;
    }
    else {
      console.log("json non vuoto")
      var jsonString = JSON.stringify(jsonObject);
      //console.log(jsonString)
      var obj = JSON.parse(jsonString);
      return obj;
    }
  }

  setTextView(textView: any, text) {
    textView.innerHTML = text;
  }

  mostraView(button: any) {
    button.style.display = "block";
  }

  nascondiView(button: any) {
    button.style.display = "none";
  }

  checkIfUserIsLoggedIn()
  {
    this.auth.onAuthStateChanged(function (user) {
      if (user) {
        console.log("Loggato");
        console.log(user.email + "");
        return true;
      }
      else {
        console.log("Non Loggato");
        return false;
      }
    })

    return false;
  }




}
