import {Component, NgZone, OnInit, ViewChild} from '@angular/core';
import * as Highcharts from 'highcharts';
import {AngularFireAuth} from '@angular/fire/auth';
import {MatSelectionList} from '@angular/material/list';
import {StoricoDueService} from '../storico-due.service';
import {MatDialog, MatDialogConfig, MatDialogRef} from '@angular/material/dialog';
import {MatDialogComponent} from '../mat-dialog/mat-dialog.component';

// Per utilizzare jQuery in TS
declare var $: any;
declare var require: any;
const Boost = require('highcharts/modules/boost');
const noData = require('highcharts/modules/no-data-to-display');
const More = require('highcharts/highcharts-more');
const Exporting = require('highcharts/modules/exporting');
const ExportData = require('highcharts/modules/export-data');
const Accessibility = require('highcharts/modules/accessibility');

Boost(Highcharts);
noData(Highcharts);
More(Highcharts);
noData(Highcharts);
Exporting(Highcharts);
//ExportData(Highcharts);
Accessibility(Highcharts);

interface StrutturaSensori {
    id: string;
    info: Map<number, number>;
}

@Component({
  selector: 'app-highchartstest',
  templateUrl: './highchartstest.component.html',
  styleUrls: ['./highchartstest.component.css']
})
export class HighchartstestComponent implements OnInit {
    public oraInizio;
    public oraFine;
    public maxDate: Date;
    public sensorListDisplayed = false;  // Stabilisce se la lista dei sensori deve essere visibile
    public chartsListDisplayed = false;  // Stabilisce se la lista dei grafici deve essere visibile
    public isLoading = false;
    public canJoinGraph = false; // Stabilisce se il pulsante per unire i grafici è visibile
    public aviableSensors: StrutturaSensori[];  // Struttura definità dopra il decorator serve per mantenere tutti i dati dei sensori
    public sensorsMap: Map<string, string>;  // Conserva la mappa dei sensori
    public listaSensori = [];  // Contiene la lista dei sensori disponibili per l'intervallo di tempo selezionato
    public idSensoriScelti = [];  // contiene gli id dei sensori selezionati
    @ViewChild('sensoriSelezionati', {static: false}) public listObj: MatSelectionList;
    @ViewChild('graph', {static: false}) private graphSection;

  // tslint:disable-next-line:variable-name
    constructor(public _service: StoricoDueService, public auth: AngularFireAuth, public ngZone: NgZone, private errDialog: MatDialog) {
        this.checkIfUserIsLogged();
    }
    ngOnInit(): void {
      this.maxDate = this.setMaxDate();
    }
    /*
        Questo metodo prepara gli input dell'utente convertendoli in millisecondi
        per poi inviare i 2 dati di ora iniziale e finale al metodo startSearch
     */
    async prepareValuesForSearch(val1: string, val2: string, val3){
        const oraI = new Date(val3);
        const oraF = new Date(val3);
        let time = val1.split(':');
        oraI.setHours(Number(time[0]), Number(time[1]), Number(time[2]) || 0);
        time = val2.split(':');
        oraF.setHours(Number(time[0]), Number(time[1]), Number(time[2]) || 0);
        if (this.ifValuesFine(oraI,oraF)){
          this.isLoading = true;
          await this.startSearch(oraI, oraF);
          this.isLoading = false;
        }else{
          this.showErrorTimeDialog();
        }
    }
    /*
        Questo metodo carica in aviableSensors i dati dei sensori SOLO nell'intervallo
        selezionato dall'utente.
     */
    async startSearch(oraI: Date, oraF: Date){
        // Resetta tutte le strutture per inserire nuovi grafici
        this.sensorListDisplayed = false;
        this.chartsListDisplayed = false;
        this.canJoinGraph = false;
        this.listaSensori.splice(0, this.listaSensori.length);
        this.idSensoriScelti.splice(0, this.idSensoriScelti.length);
        if (this.graphSection !== undefined) { for (let i of this.graphSection.nativeElement.children) { i.remove(); } }
        // Vengono dapprima caricati i dati dei sensori e la mappa in modo Sincrono
        this.aviableSensors = await this._service.getAviableSensors(oraI, oraF);
        this.sensorsMap = await this._service.getSensorsMap();
        // Utilizzando la mappa gli id dei sensori vengono convertiti in nomi
        this.aviableSensors.forEach(value => {
            this.listaSensori.push(this.sensorsMap.get(value.id) || 'SENSOR NOT AVIABLE IN THE MAP');
        });
        // Vengono visualizzati
        if (this.aviableSensors.length === 0){
          this.showErrorNoData();
        }else{
          this.ngZone.run(() => {
            this.sensorListDisplayed = true;
            this.chartsListDisplayed = true;
          });
        }
    }
    /*
        Questo metodo viene chiamato alla pressione del pulsante
     */
    mostraGrafici(){
        if (this.listObj.selectedOptions.selected.length === 0){
          this.showErrorNoSelection();
        }else{
          this.inizializzaGrafici();
        }
    }
    inizializzaGrafici(){
      this.sensorListDisplayed = false;
      // Riempe l'array idSensoriScelti
      this.listObj.selectedOptions.selected.forEach(value => {
        const key = value.value;
        // Effettua conversione inversa "Nome sensore" -> ID
        const keys = [...this.sensorsMap.entries()].filter(({ 1: v }) => v === key).map(([k]) => k);
        this.idSensoriScelti.push(keys[0]);
      });
      // console.log(this.idSensoriScelti);

      // Per ogni id scelto ricava da aviableSensors la mappa che contiene tutta la cronologia
      for (const i of this.idSensoriScelti){
        const tempVal = this.aviableSensors.find(value => value.id === i);
        // converto la mappa in array
        const arrayData = [...tempVal.info.entries() ];
        console.log(arrayData);
        const myOpt = this.createNewChartOption(this.toTitleCase(this.sensorsMap.get(i).replace(/_/g, ' ')),
          false,
          [{name: this.sensorsMap.get(i), data: arrayData}]);
        $('#grafici').append('<div id=\'' + i + '\'></div>'); // Il metodo ngFor non faceva rendereizzare il grafico
        Highcharts.chart(String(i), myOpt);
      }
      this.canJoinGraph = true;
    }
    unisciGrafici(){
        const myOpt = this.createNewChartOption('Unione Grafici', true );
        const newSeries = [];
        for (const i of this.idSensoriScelti){
            const tempVal = this.aviableSensors.find(value => value.id === i);
            const arrayData = [...tempVal.info.entries() ];
            newSeries.push({name: this.sensorsMap.get(i), data: arrayData});
        }
        myOpt.series = newSeries;
        $('#grafici').append('<div id=\'uni\'></div>');
        Highcharts.chart('uni', myOpt);
        this.showDialogChartsJoined();
        this.canJoinGraph = false;
    }

    convertDate(time: number): number{
        const stamp = new Date(time);
        return stamp.getTime();
    }

    toTitleCase = (phrase) => {
      return phrase
        .toLowerCase()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    }

    checkIfUserIsLogged() {
      // tslint:disable-next-line:only-arrow-functions
        this.auth.onAuthStateChanged(function(user) {
            if (user) {
                document.getElementById('user_div').style.display = 'none';
                document.getElementById('router').style.display = 'block';

                return true;
            }
            else {
                console.log('Non Loggato');
                document.getElementById('login_div').style.display = 'block';

                return -1;
            }
        });
    }

  /**
   * RITORNA UN OGGETTO OPTION RELATIVO AD UN GRAFICO DI HIGHCHART PRONTO DA ESSERE INIZIALIZZATO
   * @param title: Indica il titolo del grafico
   * @param isShared: True se è un grafico con più series
   * @param chartsData: (Optional) Array di Oggetti con 2 parametri: 1. Il nome della serie 2. Un Array di Array[timestamp, valore]
   */
  createNewChartOption(title: string, isShared: boolean, chartsData?: [{name: string, data: [number, number][]}]): any{
    const newObj = {
      chart: {
        type: 'line',
        height: 300,
        zoomType: 'x',
        panning: true,
        panKey: 'shift',
      },
      title: {
        text: title
      },
      credits: {
        enabled: false
      },
      tooltip: {},
      xAxis: {
        type: 'datetime',
        labels: {
          formatter() {
            // Highcharts rileva this.x come orario GMT, getTimezoneOffset ritorna la differenza di minuti tra GMT e ora locale
            // quindi bisogna cambiare il segno al risultato. In fine 1 min = 60000ms.
            return Highcharts.dateFormat('%H:%M:%S', this.value - new Date().getTimezoneOffset() * 60000);
          },
          crosshair: true
        },
      },
      yAxis: {
        type: 'linear',
        title: 'Values'
      },
      series: chartsData,
      // responsive: {
      //   rules: [{
      //     condition: {
      //       maxWidth: '100px',
      //     },
      //     chartOptions: {
      //       legend: {
      //         layout: 'horizontal',
      //         align: 'center',
      //         verticalAlign: 'bottom'
      //       }
      //     }
      //   }]
      // }
    };
    if ( isShared ){
      newObj.tooltip = {
        formatter() {
          // tslint:disable-next-line:only-arrow-functions
          return this.points.reduce(function(s, point) {
            return s + '<br/>' + point.series.name + ': ' +
              point.y.toFixed(3);
          }, '<b>' + Highcharts.dateFormat('%H:%M:%S:%L', this.x - new Date().getTimezoneOffset() * 60000) + '</b>');
        },
        shared: true,
      };
    }else{
      newObj.tooltip = {
        formatter(){
          return 'Timestamp: ' + Highcharts.dateFormat('%H:%M:%S:%L', this.x - new Date().getTimezoneOffset() * 60000) +
            '  Value: ' + this.y.toFixed(3);
        }
      };
    }
    return newObj;
  }
  ifValuesFine(orai: Date, oraf: Date): boolean{
    return orai < oraf;
  }
  showErrorTimeDialog(){
    this.errDialog.open(MatDialogComponent, {
      maxWidth: '400px',
      maxHeight: '400px',
      data: {
        title: 'Attenzione!',
        body: [
          'L\'ora iniziale deve essere antecedente a quella finale.'
        ],
      },
      disableClose: true,
      position: {
        top: '13%',
      }
    });
  }
  showErrorNoData(){
    this.errDialog.open(MatDialogComponent, {
      maxWidth: '400px',
      maxHeight: '400px',
      data: {
        title: 'Attenzione!',
        body: [
          'Nell\'intervallo temporale selezionato non sono presenti dati all\'interno del database.',
          '.',
          'Visualizzare la sezione tracciato per sapere quali dati sono presenti nel Database.'
        ],
      },
      disableClose: true,
      position: {
        top: '13%',
      },
    });
  }
  showErrorNoSelection(){
    this.errDialog.open(MatDialogComponent, {
      maxWidth: '400px',
      maxHeight: '400px',
      data: {
        title: 'Selezione Non Valida',
        body: [
          'Per visualizzare i grafici selezionare almeno un sensore',
        ],
      },
      disableClose: true,
      position: {
        top: '13%',
      },
    });
  }
  showDialogChartsJoined(){
    this.errDialog.open(MatDialogComponent, {
      maxWidth: '400px',
      maxHeight: '400px',
      data: {
        title: 'Grafici Uniti con Successo!',
        body: [],
      },
      disableClose: true,
      position: {
        top: '13%',
      },
    });
  }
  deselectAll(){
    this.listObj.deselectAll();
  }
  setMaxDate(): Date{
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), today.getDate());
  }
}
