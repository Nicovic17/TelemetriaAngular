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
import {
  MAT_MOMENT_DATE_FORMATS,
  MomentDateAdapter,
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,

} from '@angular/material-moment-adapter';

import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { Inject } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';


import * as Highchartss from 'highcharts'
import { data } from 'jquery';
declare var require: any;

var arrayID = [], arrayForDropDown = [], arrayMapForID = []
var idSelezionati = [];
var datiGrafico;
var chartGen;

//Per utilizzare jQuery in TS
declare var $: any;
//Per utilizzare Plotly
declare var Plotly: any;
//Per utilizzare Highcharts
declare const Highcharts: any;

interface Sensore {
  ID: string;
  asseX: Number[]
  asseY: Number[]
 // date: string[]
}


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


export class StoricoComponent{

//   @ViewChild('dateInput') dateInput: ElementRef;
//
//   //Permette di gestire il click sulla freccia per tornare indietro
//   @HostListener('window:popstate', ['$event'])
//   onPopState(event) {
//     console.log('Back button pressed');
//     document.getElementById("user_div").style.display = "block";
//     document.getElementById("storico").style.display = "none"
//   }
//
//   /**
//    * Array contenente oggetti del tipo Sensore
//    */
//   public mySensors:Sensore[]=[
//
//   ]
//
//   user:Boolean;
//
//   constructor(public auth: AngularFireAuth, public firebase: AngularFireDatabase, public _storicoService: StoricoService, private _adapter
//     : DateAdapter<any>, public dialog: MatDialog) {
//     //this.user=this._storicoService.checkIfUserIsLoggedIn()
//     //this.showToUser(this.user)
//   }
//
//   showToUser(userLogged)
//   {
//     if(userLogged) //Ha effettuato l'accesso
//     {
//        document.getElementById("login_div").style.display = "none";
//         document.getElementById("user_div").style.display = "none";
//         document.getElementById("router").style.display = "block";
//     }
//     else //Non ha effettuato l'accesso
//     {
//         document.getElementById("login_div").style.display = "block";
//     }
//   }
//
//
//   ngOnInit(): void {
//     this._adapter.setLocale('it');
//   }
//
//   ngAfterViewInit() {
//     this._storicoService.nascondiView(document.getElementById("box"))
//     this._storicoService.nascondiView(document.getElementById("btnJson"));
//     this._storicoService.nascondiView(document.getElementById("btnConfermaID"))
//     this._storicoService.nascondiView(document.getElementById("btnAvanti"))
//     this._storicoService.nascondiView(document.getElementById("idPerPlot"));
//     this._storicoService.nascondiView(document.getElementById("filtraggio"));
//     this._storicoService.nascondiView(document.getElementById("rowButtons"))
//     this._storicoService.nascondiView(document.getElementById("footer"))
//     this._storicoService.getID();
//     this._storicoService.getMapForID();
//   }
//
//
//   /**
//    * RICHIAMATO DA BUTTON  MOSTRA ID
//    * CARICA GLI ID DISPONIBILI SUL DATABASE E NE MOSTRA LA LISTA
//    */
//   getID() {
//
//     this._storicoService.nascondiView(document.getElementById("btnCaricaDate"))
//     this._storicoService.mostraView(document.getElementById("btnAvanti"));
//     this._storicoService.mostraView(document.getElementById("filtraggio"))
//     this._storicoService.nascondiView(document.getElementById("topText"))
//
//     arrayID = this._storicoService.getArrayID();
//
//     arrayForDropDown = this._storicoService.getJsonObjectForDropDown()
//
//     this.setUpList(); //Utilizza arrayID
//     this.setUpDropDown(); //Utilizza arrayForDropDown
//
//     if (arrayID.length > 0 && arrayForDropDown.length > 0)
//       return true;
//
//   }
//
//   /**
//    * RICHIAMATO DA GETID
//    * PRENDE L'ARRAY DEGLI ID(ARRAYID) E NE COSTRUISCE UNA LISTA CON RELATIVE CHECKBOX
//    */
//   setUpList() {
//
//     arrayMapForID = this._storicoService.getArrayMapForID()
//     document.getElementById("box").style.display = "block"
//     var i = 0;
//     for (i = 0; i < arrayID.length; i++) {
//       var nomeID = this.getNomeID(arrayID[i], arrayMapForID);
//       if (nomeID == -1)
//         nomeID = arrayID[i]
//       $("#listaDate").append("<li name='item'><span><input type='checkbox'></span><p name='itemText'>" + nomeID + "</p> <label >Date disponibili</label>  <select name='dataInizio' id='dataInizio" + arrayID[i] + "' ></select>  </li>")
//     }
//     return true;
//   }
//
//
//   /**
//    * RICHIAMATO DA GETID
//    * SETTA LE DATI IN CUI SONO STATI REGISTRATI I VALORI => CREA I DROPDOWN CON LE DATE
//    */
//   setUpDropDown() {
//     var k = 0;
//     var i = 0;
//     for (i = 0; i < arrayID.length; i++) {
//       for (k = 0; k < arrayForDropDown.length; k++) {
//         if (arrayForDropDown[k]["id"] == arrayID[i]) {
//           var nomeDropDown = "#dataInizio" + arrayID[i];
//           $(nomeDropDown).append("<option value='test'>" + arrayForDropDown[k]["tempo"] + "</option>")
//         }
//       }
//     }
//   }
//
//
//   flag: Boolean;
//   flagOra: Boolean
//
//
//
//   /**
//    * RICHIAMATO DA AGGIUNGI ID
//    * RILEVA I SENSORI SELEZIONATI NELLA LISTA E RICHIAMA IL SERVICE PER REPERIRNE INFORMZIONI
//    */
//   public aggiungiID() {
//     this.flag = false;
//     idSelezionati = [];
//     //Prendo le checkbox
//     var lis = document.getElementById("listaDate").getElementsByTagName("input");
//     var innerID = document.getElementsByName("itemText");
//     var i = 0;
//     for (i = 0; i < lis.length; i++) {
//       if (lis[i].checked) {
//         //Aggiungi a ID selezionati
//         var obj = {};
//         //Prendo data inizio e fine scelta dall'utente:
//         var giornoAngular = this.dateInput.nativeElement.value;
//         //Converto la data nel formato DD/MM/YYYY
//         var ris = giornoAngular.split("/")
//         if (ris[0] < 10)
//           ris[0] = "0" + ris[0];
//         if (ris[1] < 10)
//           ris[1] = "0" + ris[1]
//
//         var giornoAngularEffettivo = ris[0] + "/" + ris[1] + "/" + ris[2]
//
//         console.log("Giorno angular: " + giornoAngularEffettivo)
//         var oraInizio = (<HTMLInputElement>document.getElementById("oraInizioGenerale")).value;
//         console.log("Ora Inizio sel: " + oraInizio)
//
//         var oraFine = (<HTMLInputElement>document.getElementById("oraFineGenerale")).value;
//
//         //Devo prendere l'ID dal nome del sensore selezionato
//         var ID = this.getIDFromNome(innerID[i].innerHTML, arrayMapForID);
//         if (ID == -1)
//           ID = innerID[i].innerHTML;
//
//         //Salvo l'ID selezionato in oggetto OBJ con relative informazioni
//         obj["id"] = ID;
//         obj["giornoScelto"] = giornoAngularEffettivo;
//         //Controlla validità data
//         this.flagOra = this.compareHours(oraInizio, oraFine);
//         obj["dataInizio"] = oraInizio;
//         obj["dataFine"] = oraFine;
//         this.flag = this.compareDate(oraInizio, oraFine);
//         if (this.flagOra == true)
//           idSelezionati.push(obj);
//         else {
//           window.alert("Data per sensore " + innerID[i].innerHTML + " non valida")
//         }
//       }
//     }
//
//     if (idSelezionati.length == 0) {
//       window.alert("Seleziona almeno un ID")
//     }
//     else {
//       console.log("Vado avanti, carico grafici sensori.")
//       this._storicoService.setTextView(document.getElementById("btnAvanti"), "Aggiorna selezione")
//       //Passo al metodo testGrafico in storico.service gli ID di cui si richiedono informazioni
//       this._storicoService.testGrafico(idSelezionati);
//     }
//   }
//
//    //Metodo chiamato da button MOSTRA GRAFICI SENSORI
//    /**
//     * RICHIAMATO DA MOSTRA GRAFICI SENSORI
//     * CREA GRAFICO PER OGNI SENSORE SELEZIONATO
//     */
//    public startHighChart() {
//
//     this.mySensors=[]
//
//     document.getElementById("btnJson").style.display = "none"
//     document.getElementById("btnConfermaID").style.display = "block"
//     document.getElementById("btnAvanti").style.display = "block"
//     document.getElementById("btnAvanti").innerHTML = "Aggiorna sensori selezionati"
//     document.getElementById("idPerPlot").style.display = "block"
//     $("#grafici").empty()
//
//     //Prendo i dati salvati nella struttura json nel service
//     datiGrafico = this._storicoService.getJsonObject()
//
//     var i=0;
//     datiGrafico.forEach(element => {
//
//       if(this.mySensors.length != 0)
//       {
//         if(this.mySensors[i].ID==element["id"])
//         {
//         this.mySensors[i].asseX.push(element["tempo"])
//         this.mySensors[i].asseY.push(element["valore"])
//         }
//         else{
//           this.mySensors.push({
//            ID: element["id"],
//            asseX: [],
//            asseY: []
//           })
//
//         i++;
//       }
//       } //==0
//       else
//       {
//         this.mySensors.push({
//           ID: element["id"],
//           asseX: [],
//           asseY: []
//          })
//       }
//     });
//
//     for(i=0;i<this.mySensors.length;i++)
//     {
//       this.createHighChart(this.mySensors[i].ID,this.mySensors[i].asseX,this.mySensors[i].asseY)
//     }
//
//     //Crea il filtro per i grafici
//     this.createCheckableIdPlot()
//
//   }
//
//   /**
//    * CREA IL FILTRAGGIO PER IL GRAFICO GENERALE
//    */
//   createCheckableIdPlot() {
//
//     $("#idPlot").empty();
//     var next= this.mySensors[0].ID;
//     var i=0;
//     var nomeID = this.getNomeID(next, arrayMapForID);
//     $("#idPlot").append("<li name='item'><span><input type='checkbox'></span><p name='itemPlot'>" + nomeID + "</p></li>")
//     for(i=0;i<this.mySensors.length;i++)
//     {
//       if(this.mySensors[i].ID != next)
//       {
//         next=this.mySensors[i].ID
//         nomeID=this.getNomeID(next,arrayMapForID);
//         $("#idPlot").append("<li name='item'><span><input type='checkbox'></span><p name='itemPlot'>" + nomeID + "</p></li>")
//       }
//     }
//   }
//
//
//
//   /**
//    * CREA IL GRAFICO GENERALE
//    */
//   public startHighChartGen() {
//
//     var graficiSelezionatiDaUnire = [];
//     document.getElementById("btnConfermaID").innerHTML = "Aggiorna grafico generale"
//     //Prende le checkbox
//     var lis = document.getElementById("idPlot").getElementsByTagName("input"); //Prendo checkbox
//     var innerID = document.getElementsByName("itemPlot");
//
//     var i = 0;
//     for (i = 0; i < lis.length; i++) {
//       if (lis[i].checked) {
//         console.log("Aggiungo: " + this.getIDFromNome(innerID[i].innerHTML, arrayMapForID))
//         graficiSelezionatiDaUnire.push(this.getIDFromNome(innerID[i].innerHTML, arrayMapForID))
//       }
//     }
//
//     $("#grafici").append("<div id='myDivUniti'></div>")
//     this.createHighChartGen("myDivUniti");
//     i=0;
//     for(i=0;i<graficiSelezionatiDaUnire.length;i++)
//     {
//       var j=0;
//       while(graficiSelezionatiDaUnire[i]!=this.mySensors[j].ID)
//       {
//         j++;
//       }
//         this.addToHighChartGen("myDivUniti", this.mySensors[j].ID, this.mySensors[j].asseX, this.mySensors[j].asseY);
//     }
//   }
//
//    /**
//     * RESTITUISCE IL TEMPO CONVERTITO DA FORMATO HH:MM:SS:MS A MS
//     * @param time TEMPO PASSATO CON FORMATO HH:MM:SS:MS
//     */
//   convertToMS(time){
//     let t = time; // hh:mm:ss:ms
//     let ms = Number(t.split(':')[0]) * 60 * 60 * 1000 + Number(t.split(':')[1]) * 60 * 1000 + Number(t.split(':')[2]) *1000 + Number(t.split(':')[3]);
//     return ms;
//   }
//   /**
//    * AGGIUNGE AL GRAFICO GENERALE UNA SERIES (TRACCIATO)
//    * @param nomediv NOME DEL GRAFICO NELLA DOM
//    * @param ID ID DEL SENSORE
//    * @param asseX VALORI DEL SENSORE SU ASSEX
//    * @param asseY VALORI DEL SENSORE SU ASSEY
//    */
//   addToHighChartGen(nomediv, ID, asseX, asseY) {
//     var dataArr=[];
//     var i=0;
//     for(i=0;i<asseX.length;i++)
//     {
//       dataArr.push([this.convertToMS(asseX[i]), asseY[i]])
//     }
//     var newOpt={
//         name: this.getNomeID(ID, arrayMapForID) + "",
//         data:dataArr
//     }
//     chartGen.addSeries(newOpt);
//   }
//
//
//
//   /**
//    * CREA OGGETTO DI TIPO CHART DA UTILIZZARE PER AGGIUNGERVI DIVERSE SERIES(TRACCIATI)
//    * @param nomediv NOME DEL GRAFICO GENERALE PER LA DOM
//    */
//   public createHighChartGen(nomediv) {
//     chartGen = Highcharts.chart(nomediv, {
//
//       chart: {
//         zoomType: 'x'
//       },
//
//       title: {
//         text: "Grafico generale"
//       },
//
//       subtitle: {
//         text: 'Source: UninaCorse E-Team'
//       },
//
//       tooltip: {
//         formatter: function () {
//           return 'Tempo: ' + Highcharts.dateFormat('%H:%M:%S.%L', this.x) +
//             ' Valore:  ' + this.y.toFixed(2); //Mostrato quando passa il mouse sul puntino
//         }
//       },
//
//       yAxis: {
//
//         title: {
//           text: 'Valore sensore'
//         }
//       },
//
//       xAxis: {
//
//         //visible:false,
//         type: 'datetime',
//
//         /*dateTimeLabelFormats: {
//             millisecond: '%H:%M:%S.%L'
//         },*/
//
//         labels: {
//           formatter: function() {
//
//               return Highcharts.dateFormat('%H:%M:%S.%L', this.value);
//           }
//       }
//
//       },
//
//       legend: {
//         layout: 'vertical',
//         align: 'right',
//         verticalAlign: 'middle'
//       },
//
//       responsive: {
//         rules: [{
//           condition: {
//             maxWidth: 500
//           },
//           chartOptions: {
//             legend: {
//               layout: 'horizontal',
//               align: 'center',
//               verticalAlign: 'bottom'
//             }
//           }
//         }]
//       }
//
//     });
//   }
//
//
//   /**
//    * CREA UN GRAFICO PER IL SENSORE PASSATO
//    * @param ID ID DEL SENSORE
//    * @param asseX VALORI SU ASSEX DEL SENSORE
//    * @param asseY VALORI SU ASSEY DEL SENSORE
//    */
//   public createHighChart(ID, asseX, asseY) {
//
//     //Crea nuova DIV
//     $("#grafici").append("<div id='myDiv" + this.getNomeID(ID, arrayMapForID) + "'></div>")
//     Highcharts.chart('myDiv' + this.getNomeID(ID, arrayMapForID), {
//
//       chart: {
//         zoomType: 'x'
//       },
//
//       title: {
//         text: this.getNomeID(ID, arrayMapForID) + ""
//       },
//
//       subtitle: {
//         text: 'Source: UninaCorse E-Team'
//       },
//       tooltip: {
//         formatter: function () {
//           return 'Tempo: ' + this.x +
//             ' Valore:  ' + this.y.toFixed(2); //Mostrato quando passa il mouse sul puntino
//         }
//       },
//
//       yAxis: {
//         title: {
//           text: 'Valore sensore'
//         }
//       },
//
//       xAxis: {
//
//         categories: asseX,
//         accessibility: {
//         }
//       },
//
//       legend: {
//         layout: 'vertical',
//         align: 'right',
//         verticalAlign: 'middle'
//       },
//       series: [{
//         name: this.getNomeID(ID, arrayMapForID) + "",
//         data: asseY
//       }
//       ],
//       responsive: {
//         rules: [{
//           condition: {
//             maxWidth: 500
//           },
//           chartOptions: {
//             legend: {
//               layout: 'horizontal',
//               align: 'center',
//               verticalAlign: 'bottom'
//             }
//           }
//         }]
//       }
//
//     });
//
//   }
//
//   checkIfUserIsLogged() {
//
//
//
//   }
//
// /**
//  * CONFRONTA DUE ORARI, RITORNA TRUE: SE ORA FINALE MAGGIORE O UGUALE A ORA INIZIALE; FALSE ALTRIMENTI
//  * @param hInizio ORA INIZIALE DA CONFRONTARE
//  * @param hFine ORA FINALE DA CONFRONTARE
//  */
//   compareHours(hInizio: String, hFine: String) {
//     var stringOraInizio = hInizio.split(":");
//     var stringOraFine = hFine.split(":");
//
//     //Stessa ora
//     if (stringOraInizio[0] == stringOraFine[0]) {
//       if (parseInt(stringOraFine[1]) >= parseInt(stringOraInizio[1])) //Mi assicuro che min fine >= min inizio
//       {
//         return true;
//       }
//       else
//         return false;
//
//     }
//     else
//       return false;
//   }
//
//   /**
//    *
//    * @param dataInizio DATA INIZIALE IN FORMATO GG/MM/YYYY
//    * @param dataFine DATA FINALE IN FORMATO GG/MM/YYYY
//    */
//   compareDate(dataInizio: String, dataFine: String) {
//
//     //Utilizzando un sistema orario basato su 24 ore
//     //Si può effettuare un confronto tra orari differenti
//     //Semplicemente confrontando i valori delle stringhe:
//     //1: DataInizio deve essere <= di DataFine
//
//     if (dataInizio >= dataFine)
//       return false;
//
//     return true;
//
//   }
//
//
//
//   /**
//    * RESTITUISCE IL NOME DI UN ID
//    * @param id ID DEL SENSORE RICERCATO
//    * @param array ARRAY CONTENENTE LA MAPPA DEGLI ID
//    */
//   getNomeID(id, array) {
//     var i = 0;
//     for (i = 0; i < array.length; i++) {
//       if (id == array[i]["id"]) {
//         return array[i]["nome"];
//       }
//     }
//     return -1;
//   }
//   //Utilizzato per ottenere l'ID del sensore dal relativo nome
//   /**
//    * RESTITUISCE L'ID DI UN SENSORE CONOSCENDONE IL NOME
//    * @param nome NOME DEL SENSORE RICERCATO
//    * @param array ARRAY CONTENENTE LA MAPPA DEGLI ID
//    */
//   getIDFromNome(nome, array) {
//     var i = 0;
//     for (i = 0; i < array.length; i++) {
//       if (nome == array[i]["nome"])
//         return array[i]["id"];
//     }
//     return -1;
//   }

}




