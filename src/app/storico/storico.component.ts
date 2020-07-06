import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { HostListener } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database'
import { Observable, from } from 'rxjs'
import { ViewEncapsulation } from '@angular/core';
import { StoricoService } from '../storico.service'
import { exit } from 'process';
import { typeSourceSpan } from '@angular/compiler';
import {
  MAT_MOMENT_DATE_FORMATS,
  MomentDateAdapter,
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,

} from '@angular/material-moment-adapter';
import {formatDate} from '@angular/common';
import * as moment from 'moment'
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';




var arrayDate = [], arrayID = [], arrayForDropDown = [], arrayMapForID = []
var idSelezionati = [];
var arrayTrace = [];
var datiGrafico;
var traceSelezionate = [];
var trace;
var oraInizio, minInizio, secInizio;


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



var layoutGenerale = {
  title: "Grafico generale: ",

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
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: MAT_DATE_LOCALE, useValue: 'it-IT'
    },
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps:[
        MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS
      ]
    },
    {
      provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS
    }
  ]
})



export class StoricoComponent implements OnInit {

  @ViewChild('dateInput') dateInput:ElementRef;

  //Permette di gestire il click sulla freccia per tornare indietro
  @HostListener('window:popstate', ['$event'])
  onPopState(event) {
    console.log('Back button pressed');
    document.getElementById("user_div").style.display = "block";
    document.getElementById("storico").style.display = "none"
  }

  pageLoaded: boolean;

  constructor(public auth: AngularFireAuth, public firebase: AngularFireDatabase, public _storicoService: StoricoService, private _adapter
    : DateAdapter<any>) {

      
    
      
    this.checkIfUserIsLogged()
  }

  ngOnInit(): void {

    this.pageLoaded = true;
    this._adapter.setLocale('it')

  }

  ngAfterViewInit() {

    this._storicoService.nascondiView(document.getElementById("box"))

    this._storicoService.nascondiView(document.getElementById("btnJson"));

    this._storicoService.nascondiView(document.getElementById("btnConfermaID"))

    this._storicoService.nascondiView(document.getElementById("btnAvanti"))

    this._storicoService.nascondiView(document.getElementById("idPerPlot"));

    this._storicoService.nascondiView(document.getElementById("filtraggio"));

    this._storicoService.nascondiView(document.getElementById("rowButtons"))

    this._storicoService.nascondiView(document.getElementById("footer"))

    this._storicoService.getID();
    this._storicoService.getMapForID();


  }

  private date = [];

  getID() {

    //document.getElementById("btnCaricaDate").style.display = "none"
    this._storicoService.nascondiView(document.getElementById("btnCaricaDate"))
    this._storicoService.mostraView(document.getElementById("btnAvanti"));
    this._storicoService.mostraView(document.getElementById("filtraggio"))
    this._storicoService.nascondiView(document.getElementById("topText"))

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


    arrayMapForID = this._storicoService.getArrayMapForID()

    //window.alert("Array Map Length"+arrayMapForID.length)

    document.getElementById("box").style.display = "block"
    var i = 0;
    for (i = 0; i < arrayID.length; i++) {

      var nomeID = this.getNomeID(arrayID[i], arrayMapForID);
      if (nomeID == -1)
        nomeID = arrayID[i]
      //window.alert("Nome ID"+nomeID)

      $("#listaDate").append("<li name='item'><span><input type='checkbox'></span><p name='itemText'>" + nomeID + "</p> <label >Date disponibili</label>  <select name='dataInizio' id='dataInizio" + arrayID[i] + "' ></select>  </li>")
      //$("#listaDate").append("<li name='item'><span><input type='checkbox'></span><p name='itemText'>" + arrayID[i] + "</p> </li>")

    }

    return true;

  }

  getNomeID(id, array) {

    var i = 0;
    for (i = 0; i < array.length; i++) {
      if (id == array[i]["id"]) {
        return array[i]["nome"];
      }
    }
    return -1;
  }
  getIDFromNome(nome, array) {

    var i = 0;
    for (i = 0; i < array.length; i++) {
      if (nome == array[i]["nome"])
        return array[i]["id"];
    }

    return -1;

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
          /*var nomeDropDownFine = "#dataFine" + arrayID[i];
          $(nomeDropDownFine).append("<option value='test'>" + arrayForDropDown[k]["tempo"] + "</option>")*/
        }


      }
    }

  }


  flag: Boolean;
  flagOra: Boolean
  public aggiungiID() {
    this.flag = false;

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
        //var dataInizio = $("#dataInizio" + innerID[i].innerHTML + " :selected").text();
        //var dataFine = $("#dataFine" + innerID[i].innerHTML + " :selected").text();
        var giornoAngular=this.dateInput.nativeElement.value;
        var ris=giornoAngular.split("/")
        if(ris[0]<10)
        ris[0]="0"+ris[0];
        if(ris[1]<10)
        ris[1]="0"+ris[1]
        
        var giornoAngularEffettivo=ris[0]+"/"+ris[1]+"/"+ris[2]
        window.alert("Giorno angular: "+giornoAngularEffettivo)
        //var giornoInizio = (<HTMLInputElement>document.getElementById("giornoInizioGenerale")).value;
        var oraInizio = (<HTMLInputElement>document.getElementById("oraInizioGenerale")).value;
        window.alert("Ora Ini<io sel: " + oraInizio)
        //var dataInizio = giornoInizio + " " + oraInizio;

        var oraFine = (<HTMLInputElement>document.getElementById("oraFineGenerale")).value;
        //var dataFine = giornoInizio + " " + oraFine; 

        //Devo prendere l'ID dal nome del sensore selezionato
        var ID = this.getIDFromNome(innerID[i].innerHTML, arrayMapForID);
        if (ID == -1)
          ID = innerID[i].innerHTML;

        obj["id"] = ID;
        obj["giornoScelto"] = giornoAngularEffettivo;

        //Controlla validità data

        this.flagOra = this.compareHours(oraInizio, oraFine);

        obj["dataInizio"] = oraInizio;
        obj["dataFine"] = oraFine;

        this.flag = this.compareDate(oraInizio, oraFine);

        if (this.flag == true && this.flagOra == true)
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

  compareHours(hInizio: String, hFine: String) {
    var stringOraInizio = hInizio.split(":");
    var stringOraFine = hFine.split(":");

    //Stessa ora
    if (stringOraInizio[0] == stringOraFine[0]) {
      if (parseInt(stringOraFine[1]) >= parseInt(stringOraInizio[1])) //Mi assicuro che ora fine >= ora inizio
      {
        //Massimo un minuto di differenza o stesso minuto
        if ((parseInt(stringOraFine[1]) - parseInt(stringOraInizio[1])) <= 1 || stringOraFine[1] == stringOraInizio[1]) {
          return true;
        }
        else
          return false;
      }
      else
      return false;

    }
    else
      return false;
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

    var next = datiGrafico[0]["id"]

    var nomeID = this.getNomeID(next, arrayMapForID);
    $("#idPlot").append("<li name='item'><span><input type='checkbox'></span><p name='itemPlot'>" + nomeID + "</p></li>")

    datiGrafico.forEach(element => {

      if (element["id"] != next) {
        next = element["id"]

        nomeID = this.getNomeID(next, arrayMapForID);

        $("#idPlot").append("<li name='item'><span><input type='checkbox'></span><p name='itemPlot'>" + nomeID + "</p></li>")

      }



    });

  }

  public startPlot() {

    document.getElementById("btnJson").style.display = "none"
    //document.getElementById("btnConfermaID").style.display = "block"
    this._storicoService.mostraView(document.getElementById("btnConfermaID"))
    document.getElementById("btnAvanti").style.display = "block"
    document.getElementById("btnAvanti").innerHTML = "Aggiorna sensori selezionati"
    document.getElementById("idPerPlot").style.display = "block"


    $("#grafici").empty()


    datiGrafico = this._storicoService.getJsonObject()
    this.createCheckableIdPlot()

    if (datiGrafico.length == 0) {
      window.alert("Esco");
      exit;
    }

    var i = 0;
    var asseX = [];
    var asseY = []
    var currID = datiGrafico[0]["id"];

    datiGrafico.forEach(element => {

      var ID = element["id"];

      if (ID != currID) {
        //Cambio grafico
        arrayTrace.push(trace);
        currID = ID;
        asseX = [element["tempo"]];
        asseY = [element["valore"]];
      }
      else {
        //Stesso grafico
        asseX.push(element["tempo"]);
        asseY.push(element["valore"]);
      }

      var layout = {
        title: "Grafico ID: " + this.getNomeID(ID, arrayMapForID),
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
      $("#grafici").append("<div id='myDiv" + this.getNomeID(ID, arrayMapForID) + "'></div>")


      Plotly.newPlot('myDiv' + this.getNomeID(ID, arrayMapForID), data, layout);



    });


    arrayTrace.push(trace)


    /*for (i = 0; i < datiGrafico.length; i++) {

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


    arrayTrace.push(trace)*/

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

        window.alert("Agg checkbox " + i)
        traceSelezionate.push(arrayTrace[i]);
        /*for (j = 0; j < arrayTrace.length; j++) {

          //window.alert("Confronto: " + innerID[i].innerHTML + " con " + arrayTrace[j]["name"])
          if (innerID[i].innerHTML == arrayTrace[j]["name"]) {

            const index=traceSelezionate.indexOf(arrayTrace[j]["name"]);
            if(index==-1)
            traceSelezionate.push(arrayTrace[j]);
            else
            {window.alert("Traccia doppione evitata")}
          }
          else {
            window.alert("Traccia non presente")
          }

        }*/
      }
    }


    if (traceSelezionate.length == 0) {
      window.alert("Seleziona almeno un ID")

    }
    else {
      $("#grafici").append("<div id='myDivUniti'></div>")
      Plotly.newPlot('myDivUniti', traceSelezionate, layoutGenerale);

    }



  }

  checkIfUserIsLogged() {
    this.auth.onAuthStateChanged(function (user) {
      if (user) {
        console.log("Loggato");
        console.log(user.email + "");

        document.getElementById("user_div").style.display = "none";
        document.getElementById("router").style.display = "block";

        return true;
      }
      else {
        console.log("Non Loggato");
        document.getElementById("login_div").style.display = "block";

        return -1;
      }
    })


  }

}


