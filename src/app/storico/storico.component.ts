import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { HostListener } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore'
import { AngularFireDatabase } from '@angular/fire/database'
import { Observable, from } from 'rxjs'
import { ViewEncapsulation } from '@angular/core';
import { StoricoService } from '../storico.service'


var arrayDate = [], arrayID = [], arrayForDropDown = [];
var idSelezionati = [];
var arrayTrace = [];
var datiGrafico;
var traceSelezionate = [];
var trace;


var layout = {

  xaxis: {
    title: "Tempo"
  },
  yaxis: {
    title: "ID"
  },
  paper_bgcolor: "#6d6d6d",
  plot_bgcolor: "#fff"


};
//Per utilizzare jQuery in TS
declare var $: any;
declare var Plotly: any;


@Component({
  selector: 'app-storico',
  templateUrl: './storico.component.html',
  styleUrls: ['./storico.component.css'],
  encapsulation: ViewEncapsulation.None
})


export class StoricoComponent implements OnInit {



  //Permette di gestire il click sulla freccia per tornare indietro
  @HostListener('window:popstate', ['$event'])
  onPopState(event) {
    console.log('Back button pressed');
    document.getElementById("user_div").style.display = "block";
    document.getElementById("storico").style.display = "none"
  }

  constructor(public auth: AngularFireAuth, public firebase: AngularFireDatabase, private _storicoService: StoricoService) {

    this.checkIfUserIsLogged()
  }

  ngOnInit(): void {


  }

  ngAfterViewInit() {
    document.getElementById("box").style.display = "none"
    document.getElementById("btnJson").style.display = "none"
    document.getElementById("btnConfermaID").style.display = "none"
    document.getElementById("btnAvanti").style.display = "none"
    document.getElementById("idPerPlot").style.display = "none"
    document.getElementById("load").innerHTML = "<p>Caricamento dati...</p>";
    //this._storicoService.getDate()
    this._storicoService.getID();

  }

  private date = [];

  getID() {

    document.getElementById("btnCaricaDate").style.display = "none"
    document.getElementById("btnAvanti").style.display = "block"

    arrayID = this._storicoService.getArrayID();
    arrayForDropDown = this._storicoService.getJsonObjectForDropDown()

    this.setUpList();
    this.setUpDropDown();

  }

  /*
  getDate() {
    document.getElementById("btnCaricaDate").style.display = "none"
    document.getElementById("btnAvanti").style.display = "block"

    arrayDate = this._storicoService.getArray()
    this.setUpList()
  }*/



  setUpList() {



    document.getElementById("box").style.display = "block"
    var i = 0;
    for (i = 0; i < arrayID.length; i++) {


      $("#listaDate").append("<li name='item'><span><input type='checkbox'></span><p name='itemText'>" + arrayID[i] + "</p> <label >Data inizio</label>  <select name='dataInizio' id='dataInizio" + arrayID[i] + "' ></select> <label>Data fine</label> <select  id='dataFine" + arrayID[i] + "' ></select> </li>")

    }

  }

  setUpDropDown() {
    var k = 0;
    var i = 0;
    for (i = 0; i < arrayID.length; i++) {
      for (k = 0; k < arrayForDropDown.length; k++) {
        // window.alert("In drop: " + arrayForDropDown[k]["tempo"])
        if (arrayForDropDown[k]["id"] == arrayID[i]) {
          var nomeDropDown = "#dataInizio" + arrayID[i];
          $(nomeDropDown).append("<option value='test'>" + arrayForDropDown[k]["tempo"] + "</option>")
          var nomeDropDownFine = "#dataFine" + arrayID[i];
          $(nomeDropDownFine).append("<option value='test'>" + arrayForDropDown[k]["tempo"] + "</option>")
        }


      }
    }

  }

  flag: Boolean;
  public aggiungiID() {

    idSelezionati = [];

    var lis = document.getElementById("listaDate").getElementsByTagName("input"); //Prendo checkbox
    var innerID = document.getElementsByName("itemText");

    var i = 0;
    for (i = 0; i < lis.length; i++) {
      if (lis[i].checked) {
        //Aggiungi a ID selezionati
        var obj = {};

        //idSelezionati.push(innerID[i].innerHTML)
        //Prendo data inizio e fine:
        var dataInizio = $("#dataInizio" + innerID[i].innerHTML + " :selected").text();
        var dataFine = $("#dataFine" + innerID[i].innerHTML + " :selected").text();
        obj["id"] = innerID[i].innerHTML;
        obj["dataInizio"] = dataInizio;
        obj["dataFine"] = dataFine;

        this.flag = this.compareDate(dataInizio, dataFine);

        if (this.flag == true)
          idSelezionati.push(obj);
        else {
          window.alert("Data per sensore " + innerID[i].innerHTML + " non valida");
        }


      }

    }

    if (idSelezionati.length == 0) {
      window.alert("Seleziona almeno un ID");
    }
    else {

      window.alert("Vado avanti, carico grafici sensori.");
      //Effettua graficazioni
      this._storicoService.testGrafico(idSelezionati);
    }
  }

  compareDate(dataInizio: String, dataFine: String) {

    //Utilizzando un sistema orario basato su 24 ore
    //Si può effettuare un confronto tra orari differenti
    //Semplicemente confrontando i valori delle stringhe:

    //1: DataInizio deve essere <= di DataFine

    if (dataInizio >= dataFine)
      return false;

    return true;

  }

  createCheckableIdPlot() {

    $("#idPlot").empty();

    idSelezionati.forEach(element => {



      $("#idPlot").append("<li name='item'><span><input type='checkbox'></span><p name='itemPlot'>" + element["id"] + "</p></li>")


    });

  }

  public startPlot() {

    document.getElementById("btnJson").style.display = "none"
    document.getElementById("btnConfermaID").style.display = "block"
    document.getElementById("btnAvanti").style.display = "block"
    document.getElementById("btnAvanti").innerHTML = "Aggiorna sensori selezionati"
    document.getElementById("idPerPlot").style.display = "block"
    this.createCheckableIdPlot()

    datiGrafico = this._storicoService.getJsonObject()


    var i = 0;
    var asseX = [];
    var asseY = []
    var currID = datiGrafico[0]["id"];
    for (i = 0; i < datiGrafico.length; i++) {

      var ID = datiGrafico[i]["id"];
      if (ID != currID) //Grafico diverso
      {



        arrayTrace.push(trace);

        window.alert("Cambio grafico")
        currID = ID;
        asseX = [datiGrafico[i]["tempo"]]
        asseY = [datiGrafico[i]["valore"]]
      }
      else //Stesso grafico
      {
        //window.alert("Aggiorno grafico di ID: " + ID);
        asseX.push(datiGrafico[i]["tempo"]);
        asseY.push(datiGrafico[i]["valore"]);
      }

      var layout = {
        title: "Grafico ID: " + ID,
        xaxis: {
          title: "Tempo"
        },
        yaxis: {
          title: "ID"
        },
        paper_bgcolor: "#6d6d6d",
        plot_bgcolor: "#fff"


      };

      trace = {
        x: asseX,
        y: asseY,
        type: 'scatter',
        name: "" + ID
      };

      var data = [trace];

      //Crea nuova DIV
      $("#grafici").append("<div id='myDiv" + ID + "'></div>")


      Plotly.newPlot('myDiv' + ID, data, layout);

    }


    arrayTrace.push(trace)

    //window.alert("Post plot")

  }

  unisciTrace() {

    $("#grafici").append("<div id='myDivUniti'></div>")
    Plotly.newPlot('myDivUniti', arrayTrace, layout);
  }


  mostraPlotUniti() {

    traceSelezionate = [];

    document.getElementById("btnConfermaID").innerHTML = "Aggiorna grafico generale"
    //Prende le checkbox 
    var lis = document.getElementById("idPlot").getElementsByTagName("input"); //Prendo checkbox
    var innerID = document.getElementsByName("itemPlot");

    var i = 0;

    for (i = 0; i < lis.length; i++) {
      if (lis[i].checked) {

        var j = 0;
        for (j = 0; j < arrayTrace.length; j++) {

          window.alert("Confronto: " + innerID[i].innerHTML + " con " + arrayTrace[j]["name"])
          if (innerID[i].innerHTML == arrayTrace[j]["name"]) {

            traceSelezionate.push(arrayTrace[j]);
          }
          else {
            window.alert("Traccia non presente")
          }

        }
      }
    }


    if (traceSelezionate.length == 0) {
      window.alert("Seleziona almeno un ID")

    }
    else {
      $("#grafici").append("<div id='myDivUniti'></div>")
      Plotly.newPlot('myDivUniti', traceSelezionate, layout);

    }



  }

  checkIfUserIsLogged() {
    this.auth.onAuthStateChanged(function (user) {
      if (user) {
        console.log("Loggato");
        console.log(user.email + "");

        document.getElementById("user_div").style.display = "none";
        document.getElementById("router").style.display = "block";


      }
      else {
        console.log("Non Loggato");
        document.getElementById("login_div").style.display = "block";

      }
    })
  }

}


