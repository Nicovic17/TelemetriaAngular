/*
ISTRUZIONI PER HIGHCHARTS SENZA CDN

SCARICARE HIGHCHARTS AL LINK https://www.highcharts.com/blog/download/ CLICCANDO SU HIGHCHARTS 8.2.0

COPIARE IL CONTENUTO DELLA CARTELLA CODE NEL PERCORSO SRC/ASSET/JS/HIGHCHARTS

ENJOY


*/



import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { HostListener } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database'
import { ViewEncapsulation } from '@angular/core';
import { StoricoService } from '../storico.service'
import { exit } from 'process';
import {
  MAT_MOMENT_DATE_FORMATS,
  MomentDateAdapter,
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,

} from '@angular/material-moment-adapter';

import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { Inject } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DialogTestComponent } from '../dialog-test/dialog-test.component'


import * as Highchartss from 'highcharts'
import { data } from 'jquery';
declare var require: any;
let Boost = require('highcharts/modules/boost');
let noData = require('highcharts/modules/no-data-to-display');
let More = require('highcharts/highcharts-more');

Boost(Highchartss);
noData(Highchartss);
More(Highchartss);
noData(Highchartss);


var arrayID = [], arrayForDropDown = [], arrayMapForID = []
var idSelezionati = [];
var arrayTrace = [];
var datiGrafico;
var traceSelezionate = [];
var trace;
var chartGen;



//Utilizzato da plotly
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
//Per utilizzare Plotly
declare var Plotly: any;
//Per utilizzare Highcharts
declare const Highcharts: any;


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
      deps: [
        MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS
      ]
    },
    {
      provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS
    }
  ]
})


export class StoricoComponent implements OnInit {

  @ViewChild('dateInput') dateInput: ElementRef;

  //Permette di gestire il click sulla freccia per tornare indietro
  @HostListener('window:popstate', ['$event'])
  onPopState(event) {
    console.log('Back button pressed');
    document.getElementById("user_div").style.display = "block";
    document.getElementById("storico").style.display = "none"
  }

  pageLoaded: boolean;
  Highcharts = Highcharts;
  options: Highchartss.Options;
  seriesOptionsType: Highchartss.SeriesOptionsType;

  constructor(public auth: AngularFireAuth, public firebase: AngularFireDatabase, public _storicoService: StoricoService, private _adapter
    : DateAdapter<any>, public dialog: MatDialog) {
    this.checkIfUserIsLogged()
  }

  openDialog() {

    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;

    this.dialog.open(DialogTestComponent,
      {
        width: '400px',
        height: '250px'
      });
  }

  ngOnInit(): void {
    this.pageLoaded = true;
    this._adapter.setLocale('it');
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

  //Metodo chiamato al click su MOSTRA ID
  //Carica gli ID disponibili sul database e ne mostra la lista
  getID() {

    this._storicoService.nascondiView(document.getElementById("btnCaricaDate"))
    this._storicoService.mostraView(document.getElementById("btnAvanti"));
    this._storicoService.mostraView(document.getElementById("filtraggio"))
    this._storicoService.nascondiView(document.getElementById("topText"))

    arrayID = this._storicoService.getArrayID();
    arrayForDropDown = this._storicoService.getJsonObjectForDropDown()

    this.setUpList(); //Utilizza arrayID
    this.setUpDropDown(); //Utilizza arrayForDropDown

    if (arrayID.length > 0 && arrayForDropDown.length > 0)
      return true;

  }

  //Chiamato da GETID , prende l'array degli ID(arrayID) e ne costruisce la lista con relative checkbox
  
  setUpList() {

    arrayMapForID = this._storicoService.getArrayMapForID()
    document.getElementById("box").style.display = "block"
    var i = 0;
    for (i = 0; i < arrayID.length; i++) {

      var nomeID = this.getNomeID(arrayID[i], arrayMapForID);
      if (nomeID == -1)
        nomeID = arrayID[i]
      $("#listaDate").append("<li name='item'><span><input type='checkbox'></span><p name='itemText'>" + nomeID + "</p> <label >Date disponibili</label>  <select name='dataInizio' id='dataInizio" + arrayID[i] + "' ></select>  </li>")


    }

    return true;

  }

  //Chiamato da GETID
  //Setta le date in cui sono stati registrati i valori => crea i dropdown con le date
  setUpDropDown() {
    var k = 0;
    var i = 0;
    for (i = 0; i < arrayID.length; i++) {
      for (k = 0; k < arrayForDropDown.length; k++) {
        if (arrayForDropDown[k]["id"] == arrayID[i]) {
          var nomeDropDown = "#dataInizio" + arrayID[i];
          $(nomeDropDown).append("<option value='test'>" + arrayForDropDown[k]["tempo"] + "</option>")
        }


      }
    }

  }

  //Utilizzato per ottenre il nome del sensore dal relativo ID
  getNomeID(id, array) {

    var i = 0;
    for (i = 0; i < array.length; i++) {
      if (id == array[i]["id"]) {
        return array[i]["nome"];
      }
    }
    return -1;
  }
  //Utilizzato per ottenere l'ID del sensore dal relativo nome
  getIDFromNome(nome, array) {

    var i = 0;
    for (i = 0; i < array.length; i++) {
      if (nome == array[i]["nome"])
        return array[i]["id"];
    }

    return -1;

  }

  flag: Boolean;
  flagOra: Boolean

  //Metodo chiamato dal button AGGIUNGI ID
  //Rileva i sensori selezionati nella lista e ne carica i dati
  public aggiungiID() {
    this.flag = false;

    idSelezionati = [];

    //Prendo le checkbox
    var lis = document.getElementById("listaDate").getElementsByTagName("input"); 
    var innerID = document.getElementsByName("itemText");

    var i = 0;
    for (i = 0; i < lis.length; i++) {
      if (lis[i].checked) {
        //Aggiungi a ID selezionati
        var obj = {};
        //Prendo data inizio e fine scelta dall'utente:
        var giornoAngular = this.dateInput.nativeElement.value;
        //Converto la data nel formato DD/MM/YYYY
        var ris = giornoAngular.split("/")
        if (ris[0] < 10)
          ris[0] = "0" + ris[0];
        if (ris[1] < 10)
          ris[1] = "0" + ris[1]

        var giornoAngularEffettivo = ris[0] + "/" + ris[1] + "/" + ris[2]

        console.log("Giorno angular: " + giornoAngularEffettivo)
        var oraInizio = (<HTMLInputElement>document.getElementById("oraInizioGenerale")).value;
        console.log("Ora Inizio sel: " + oraInizio)

        var oraFine = (<HTMLInputElement>document.getElementById("oraFineGenerale")).value;

        //Devo prendere l'ID dal nome del sensore selezionato
        var ID = this.getIDFromNome(innerID[i].innerHTML, arrayMapForID);
        if (ID == -1)
          ID = innerID[i].innerHTML;

        //Salvo l'ID selezionato in oggetto OBJ con relative informazioni
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
          window.alert("Data per sensore " + innerID[i].innerHTML + " non valida")
        }
      }
    }

    if (idSelezionati.length == 0) {
      window.alert("Seleziona almeno un ID")
    }
    else {
      console.log("Vado avanti, carico grafici sensori.")
      this._storicoService.setTextView(document.getElementById("btnAvanti"), "Aggiorna selezione")
      //Passo al metodo testGrafico in storico.service gli ID di cui si richiedono informazioni
      this._storicoService.testGrafico(idSelezionati);
    }
  }

   //Metodo chiamato da button MOSTRA GRAFICI SENSORI
   public startHighChart() {

    this.startPlot();

    document.getElementById("btnJson").style.display = "none"
    this._storicoService.mostraView(document.getElementById("btnConfermaID"))
    document.getElementById("btnAvanti").style.display = "block"
    document.getElementById("btnAvanti").innerHTML = "Aggiorna sensori selezionati"
    document.getElementById("idPerPlot").style.display = "block"
    $("#grafici").empty()

    //Prendo i dati salvati nella struttura json nel service
    datiGrafico = this._storicoService.getJsonObject()
    //Crea il filtro per i grafici
    this.createCheckableIdPlot()

    if (datiGrafico.length == 0) {
      window.alert("Esco");
      exit;
    }

    var asseX = [];
    var asseY = [];
    var ID = "";
    var currID = datiGrafico[0]["id"];

    datiGrafico.forEach(element => {

      ID = element["id"];

      if (ID != currID) {
        //Cambio grafico
        this.createHighChart(currID, asseX, asseY);

        console.log("cambio grafico PUSHO: " + element["id"])

        currID = ID;
        asseX = [element["tempo"]];
        asseY = [element["valore"]];
      }
      else {
        //Stesso grafico
        asseX.push(element["tempo"]);
        asseY.push(element["valore"]);
      }

    });

    //creo grafico
    this.createHighChart(ID, asseX, asseY);
  }

  compareHours(hInizio: String, hFine: String) {
    var stringOraInizio = hInizio.split(":");
    var stringOraFine = hFine.split(":");

    //Stessa ora
    if (stringOraInizio[0] == stringOraFine[0]) {
      if (parseInt(stringOraFine[1]) >= parseInt(stringOraInizio[1])) //Mi assicuro che min fine >= min inizio
      {
        return true;
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

  //Crea il filtro per i grafici con relative checkbox
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



  //Highchart per generale
  public startHighChartGen() {

    var graficiSelezionatiDaUnire = [];
    document.getElementById("btnConfermaID").innerHTML = "Aggiorna grafico generale"

    //Prende le checkbox 
    var lis = document.getElementById("idPlot").getElementsByTagName("input"); //Prendo checkbox
    var innerID = document.getElementsByName("itemPlot");

    var i = 0;

    for (i = 0; i < lis.length; i++) {
      if (lis[i].checked) {
        console.log("Aggiungo: " + this.getIDFromNome(innerID[i].innerHTML, arrayMapForID))
        graficiSelezionatiDaUnire.push(this.getIDFromNome(innerID[i].innerHTML, arrayMapForID))
      }
    }

    $("#grafici").append("<div id='myDivUniti'></div>")
    this.createHighChartGen("myDivUniti", ID, asseX, asseY);
    datiGrafico = this._storicoService.getJsonObject()

    var asseX = [];
    var asseY = [];
    var ID = "";
    var currID = graficiSelezionatiDaUnire[0];
    var intCurrID = 0;
    var newIntCurrID = 0;

    console.log("CurrID" + currID)
    datiGrafico.forEach(element => {

      if (element["id"] == currID) {
        //Da aggiungere
        ID = currID;
        asseX.push(element["tempo"]);
        asseY.push(element["valore"]);
      }
      else {
        if (asseY.length > 0) //Ho aggiunto un grafico
          this.addToHighChartGen("myDivUniti", ID, asseX, asseY);
        //currID=currID+1;
        intCurrID = parseInt(currID);
        newIntCurrID = intCurrID + 1;

        if (newIntCurrID < 9)
          currID = "00" + newIntCurrID
        if (newIntCurrID > 9 && newIntCurrID < 100)
          currID = "0" + newIntCurrID
        if (newIntCurrID > 99)
          currID = newIntCurrID + "";
        asseX = [];
        asseY = [];
      }

    });
    //creo grafico gen
    if (asseY.length > 0)
      this.addToHighChartGen("myDivUniti", ID, asseX, asseY);
  }

  addToHighChartGen(nomediv, ID, asseX, asseY) {
    var length = asseX.length;
    console.log("Last time asse: " + asseY[length - 1])
    chartGen.addSeries({
      name: this.getNomeID(ID, arrayMapForID) + "",
      data: asseY
    });

    console.log("xAxis Length: " + chartGen.xAxis.length);
    chartGen.xAxis[0].setCategories(asseX);
  }

  //Highcharts per generale
  public createHighChartGen(nomediv, ID, asseX, asseY) {


    chartGen = Highcharts.chart(nomediv, {

      chart: {
        zoomType: 'x'
      },

      title: {
        text: "Grafico generale"
      },

      subtitle: {
        text: 'Source: UninaCorse E-Team'
      },

      tooltip: {
        formatter: function () {
          return 'Tempo: ' + this.x +
            ' Valore:  ' + this.y.toFixed(2); //Mostrato quando passa il mouse sul puntino
        }
      },

      yAxis: {
        title: {
          text: 'Valore sensore'
        }
      },

      xAxis: {

        categories: asseX,
        type: 'datetime'

      },

      legend: {
        layout: 'vertical',
        align: 'right',
        verticalAlign: 'middle'
      },

      responsive: {
        rules: [{
          condition: {
            maxWidth: 500
          },
          chartOptions: {
            legend: {
              layout: 'horizontal',
              align: 'center',
              verticalAlign: 'bottom'
            }
          }
        }]
      }

    });

  }

 

  //Highcharts
  public createHighChart(ID, asseX, asseY) {

    //Crea nuova DIV
    $("#grafici").append("<div id='myDiv" + this.getNomeID(ID, arrayMapForID) + "'></div>")
    var lengthAsseY = asseY.length;

    Highcharts.chart('myDiv' + this.getNomeID(ID, arrayMapForID), {

      chart: {
        zoomType: 'x'
      },

      title: {
        text: this.getNomeID(ID, arrayMapForID) + ""
      },

      subtitle: {
        text: 'Source: UninaCorse E-Team'
      },
      tooltip: {
        formatter: function () {
          return 'Tempo: ' + this.x +
            ' Valore:  ' + this.y.toFixed(2); //Mostrato quando passa il mouse sul puntino
        }
      },

      yAxis: {
        title: {
          text: 'Valore sensore'
        }
      },

      xAxis: {

        categories: asseX,
        accessibility: {

          rangeDescription: "Range: " + asseY[0] + " to " + asseY[lengthAsseY]
        }
      },

      legend: {
        layout: 'vertical',
        align: 'right',
        verticalAlign: 'middle'
      },



      series: [{
        name: this.getNomeID(ID, arrayMapForID) + "",
        data: asseY
      }
      ],

      responsive: {
        rules: [{
          condition: {
            maxWidth: 500
          },
          chartOptions: {
            legend: {
              layout: 'horizontal',
              align: 'center',
              verticalAlign: 'bottom'
            }
          }
        }]
      }

    });

  }


  //Carica i dati per il grafico generale
  public startPlot() {
    datiGrafico = this._storicoService.getJsonObject()

    if (datiGrafico.length == 0) {
      window.alert("Esco");
      exit;
    }
    var asseXa = [];
    var asseYa = [];
    arrayTrace = [];
    var currID = datiGrafico[0]["id"];

    datiGrafico.forEach(element => {

      var ID = element["id"];

      if (ID != currID) {
        //Cambio grafico

        arrayTrace.push(trace);
        currID = ID;

        asseXa = [element["tempo"]];
        asseYa = [element["valore"]];

      }
      else {
        //Stesso grafico
        asseXa.push(element["tempo"]);
        asseYa.push(element["valore"]);
      }

      trace = {
        x: asseXa,
        y: asseYa,
        type: 'scatter',
        name: "" + ID,
        mode: 'lines+markers'
      };
    });

    arrayTrace.push(trace)
  }


  ordinaTempi(daOrdinare) {

    //trova tempo minore HH:MM:SS:MS
    var minHH = "24";
    var minMM = "60";
    var minSS = "60";
    var minMS = "999";
    var splitTime = "";
    var tempoMinore;
    var tempoMaggiore;
     //HH:MM:SS:MS minore
    var i=0;
     for(i=0;i<daOrdinare.length;i++)
        {
            splitTime=daOrdinare[i].split(":");
            if(splitTime[0]<minHH)
            minHH=splitTime[0]

            if( parseInt(splitTime[0]) == parseInt(minHH) && splitTime[1]<minMM)
            minMM=splitTime[1];

            if( splitTime[0]==minHH && splitTime[1]==minMM && splitTime[2]<minSS )
            minSS=splitTime[2]

            if( splitTime[0]==minHH && splitTime[1]==minMM && splitTime[2]==minSS && parseInt(splitTime[3])<parseInt(minMS) )
            {
                minMS=splitTime[3];
            }

        }
        window.alert("MinHH:minMM:minSS:minMS "+minHH+":"+minMM+":"+minSS+":"+minMS) 
        tempoMinore=minHH+":"+minMM+":"+minSS+":"+minMS;

        //HH:MM:SS:MS maggiore
        var maxHH="00";
        var maxMM="00";
        var maxSS="00";
        var maxMS="000";
        splitTime="";
        var currentTime;
        var tempiOrdinati=[];

        for(i=0;i<daOrdinare.length;i++)
        {
            splitTime=daOrdinare[i].split(":");
            if(splitTime[0]>maxHH)
            maxHH=splitTime[0]

            if(splitTime[0]==maxHH && splitTime[1]>maxMM)
            maxMM=splitTime[1];

            if( splitTime[0]==maxHH && splitTime[1]==maxMM && splitTime[2]>maxSS )
            maxSS=splitTime[2]

            if( splitTime[0]==maxHH && splitTime[1]==maxMM && splitTime[2]==maxSS && parseInt(splitTime[3])>parseInt(maxMS) )
            {
                maxMS=splitTime[3];
            }

        }
        window.alert("MaxHH:MaxMM:MaxSS:MaxMS "+maxHH+":"+maxMM+":"+maxSS+":"+maxMS) 
        tempoMaggiore=maxHH+":"+maxMM+":"+maxSS+":"+maxMS

         //Calcola tutti gli istanti di tempo possibili da min a max

         currentTime=tempoMinore.split(":");
         tempiOrdinati=[];
         var aggiungiTempo;

         while( aggiungiTempo != tempoMaggiore)
         {
             if( parseInt(currentTime[3]) <= parseInt("999") )
             {
                 aggiungiTempo=currentTime[0]+":"+currentTime[1]+":"+currentTime[2]+":"+currentTime[3]
                 tempiOrdinati.push(aggiungiTempo)
                 currentTime[3]=parseInt(currentTime[3])+1
             }
             else
             {
                 currentTime[3]="000";
                 if(currentTime[2]<"60")
                 {
                     currentTime[2]=parseInt(currentTime[2])+1
                 }
                 else
                 {
                     currentTime[2]="00"
                     if(currentTime[1]<"60")
                     currentTime[1]=parseInt(currentTime[1])+1;
                     else
                     {
                         currentTime[1]="00"
                         currentTime[0]=parseInt(currentTime[0])+1
                     }
                 }
             }
         }
         return tempiOrdinati;
  }

  //Richiamato da button MOSTRA GRAFICI UNITI
  //Rileva i grafici selezionati nella lista di filtro e ne crea un grafico unico
  mostraPlotUniti() {

    $("#grafici").append("<div id='myDivUniti'></div>")
    traceSelezionate = [];
    /********************************************************************************** */
    
    var tuttiIstantiTemporali = []
    for (i = 0; i < arrayTrace.length; i++)
      tuttiIstantiTemporali.push(arrayTrace[i]["x"])

      var listaTuttiIstantiTemporali=[];
      for(i=0;i<tuttiIstantiTemporali.length;i++)
      {
        for(j=0;j<tuttiIstantiTemporali[i].length;j++)
        {
          listaTuttiIstantiTemporali.push(tuttiIstantiTemporali[i][j])
        }
      }
    console.log(listaTuttiIstantiTemporali)

    //ordina tutti istanti temporali
    var tempiOrdinati=this.ordinaTempi(listaTuttiIstantiTemporali)

    console.log("Tempi ordinati: "+tempiOrdinati)
    
    //crea trace 0 con x=istantiTemporaliOrdinati e asseY = tutti 0
    var yGen=[]
    var splitTempi=""
    for(i=0;i<tempiOrdinati.length;i++)
    {
      splitTempi=tempiOrdinati[i].split(":")
      if( parseInt(splitTempi[2])<10 && parseInt(splitTempi[2])>0 )tempiOrdinati[i]=splitTempi[0]+":"+splitTempi[1]+":"+"0"+splitTempi[2]+":"+splitTempi[3]
      splitTempi=tempiOrdinati[i].split(":")
      splitTempi=tempiOrdinati[i].split(":")
      yGen[i]=0;
    }
    var trace0={
      x: tempiOrdinati,
      y: yGen,
      mode: 'dot',
      hoverinfo:'skip'
    }
    //aggiungi trace 0 a traceSelezionate
    traceSelezionate.push(trace0);

    /********************************************************************************** */


    document.getElementById("btnConfermaID").innerHTML = "Aggiorna grafico generale"
    //Prende le checkbox 
    var lis = document.getElementById("idPlot").getElementsByTagName("input"); //Prendo checkbox
    var innerID = document.getElementsByName("itemPlot");

    var i = 0;
    var j = 0;
    for (i = 0; i < lis.length; i++) {
      if (lis[i].checked) {
        for (j = 0; j < arrayTrace.length; j++) {
          console.log("Confronto: " + innerID[i].innerHTML + " con " + this.getNomeID(arrayTrace[j]["name"], arrayMapForID))
          if (innerID[i].innerHTML == this.getNomeID(arrayTrace[j]["name"], arrayMapForID)) {
            console.log("Aggiungo a traceSelezionate");
            traceSelezionate.push(arrayTrace[j]);
          }
        }
      }
    }

    if (traceSelezionate.length == 0) {
      console.log("Seleziona almeno un ID")
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


