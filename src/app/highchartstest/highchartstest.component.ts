import {Component, NgZone, OnInit, ViewChild} from '@angular/core';
import * as Highcharts from 'highcharts';
import {AngularFireAuth} from '@angular/fire/auth';
import {MatSelectionList} from '@angular/material/list';
import {StoricoDueService} from '../storico-due.service';

// Per utilizzare jQuery in TS
declare var $: any;
declare var require: any;
const Boost = require('highcharts/modules/boost');
const noData = require('highcharts/modules/no-data-to-display');
const More = require('highcharts/highcharts-more');

Boost(Highcharts);
noData(Highcharts);
More(Highcharts);
noData(Highcharts);

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
    public ddd = '10/8/2020'; // Da Togliere
    public sensorListDisplayed = false;  // Stabilisce se la lista dei sensori deve essere visibile
    public chartsListDisplayed = false;  // Stabilisce se la lista dei grafici deve essere visibile
    public canJoinGraph = false; // Stabilisce se il pulsante per unire i grafici è visibile
    public aviableSensors: StrutturaSensori[];  // Struttura definità dopra il decorator serve per mantenere tutti i dati dei sensori
    public sensorsMap: Map<string, string>;  // Conserva la mappa dei sensori
    public listaSensori = [];  // Contiene la lista dei sensori disponibili per l'intervallo di tempo selezionato
    public idSensoriScelti = [];  // contiene gli id dei sensori selezionati
    @ViewChild('sensoriSelezionati', {static: false}) private listObj: MatSelectionList;
    @ViewChild('graph', {static: false}) private  listGraph;

    // Indica le opzioni standard per i grafici
    public options: any = {
        chart: {
            type: 'line',
            height: 300,
            zoomType: 'x',
            panning: true,
            panKey: 'shift',
        },
        title: {
            text: 'Grafici Storico:'
        },
        credits: {
            enabled: false
        },
        tooltip: {
            formatter() {
                // Highcharts rileva this.x come orario GMT, getTimezoneOffset ritorna la differenza di minuti tra GMT e ora locale
                // quindi bisogna cambiare il segno al risultato. In fine 1 min = 60000ms.
                return 'Timestamp: ' + Highcharts.dateFormat('%H:%M:%S:%L', this.x - new Date().getTimezoneOffset() * 60000) +
                    '  Value: ' + this.y.toFixed(3);
            },
            // formatter: function() {
            //   return this.points.reduce(function (s, point) {
            //     return s + '<br/>' + point.series.name + ': ' +
            //       point.y + 'm';
            //   }, '<b>' + this.x + '</b>');
            // },
            shared: true,
            split: true,
        },
        xAxis: {
            type: 'datetime',
            labels: {
              formatter() {
                // Highcharts rileva this.x come orario GMT, getTimezoneOffset ritorna la differenza di minuti tra GMT e ora locale
                // quindi bisogna cambiare il segno al risultato. In fine 1 min = 60000ms.
                return Highcharts.dateFormat('%H:%M:%S', this.value - new Date().getTimezoneOffset() * 60000);
              }
            },
            crosshair: true,
            minorTicks: false,
            minorTickInterval: 100,
            minorTickLength: 3,
        },
        yAxis: {
          type: 'linear',
          title: 'Values',
        },
        series: [
            {
                name: 'Normal',
                // turboThreshold: 500000,
                data: []
            }
        ],
        // responsive: {
        //   rules: [{
        //     condition: {
        //       maxWidth: 500
        //     },
        //     chartOptions: {
        //       plotOptions: {
        //         series: {
        //           marker: {
        //             radius: 2.5
        //           }
        //         }
        //       }
        //     }
        //   }]
        // }
    };

  // tslint:disable-next-line:variable-name
    constructor(public _service: StoricoDueService, public auth: AngularFireAuth, public ngZone: NgZone) {
        this.checkIfUserIsLogged();
    }
    ngOnInit(): void {
    }
    /*
        Questo metodo prepara gli input dell'utente convertendoli in millisecondi
        per poi inviare i 2 dati di ora iniziale e finale al metodo startSearch
     */
    async prepareValuesForSearch(val1: string, val2: string, val3){
        const oraI = new Date(val3);
        const oraF = new Date(val3);
        let h;
        let m;
        let s;

        h = val1.substr(0, 2);
        m = val1.substr(3, 2);
        s = val1.substr(6, 2);
        oraI.setHours(h, m, s);
        h = val2.substr(0, 2);
        m = val2.substr(3, 2);
        s = val2.substr(6, 2);
        oraF.setHours(h, m, s);
        console.log(oraI, oraF);
        await this.startSearch(oraI, oraF);
    }
    /*
        Questo metodo carica in aviableSensors i dati dei sensori SOLO nell'intervallo
        selezionato dall'utente.
     */
    async startSearch(oraI: Date, oraF: Date){
        this.chartsListDisplayed = false;
        this.canJoinGraph = false;
        this.listaSensori.splice(0, this.listaSensori.length);
        this.idSensoriScelti.splice(0, this.idSensoriScelti.length);
        // Vengono d'apprima caricati i dati dei sensori e la mappa in modo Sincrono
        this.aviableSensors = await this._service.getAviableSensors(oraI, oraF);
        this.sensorsMap = await this._service.getSensorsMap();
        // Utilizzando la mappa gli id dei sensori vengono convertiti in nomi
        this.aviableSensors.forEach(value => {
            this.listaSensori.push(this.sensorsMap.get(value.id));
        });
        // Vengono visualizzati
        this.ngZone.run(() => {
            this.sensorListDisplayed = true;
            this.chartsListDisplayed = true;
        });
    }
    /*
        Questo metodo viene chiamato alla pressione del pulsante
     */
    mostraGrafici(){
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
            this.options.series[0].data = arrayData;
            this.options.series[0].name = this.sensorsMap.get(i);
            this.options.title.text = this.toTitleCase(this.sensorsMap.get(i).replace(/_/g, ' '));
            $('#grafici').append('<div id=\'' + i + '\'></div>'); // Il metodo ngFor non faceva rendereizzare il grafico
            Highcharts.chart(String(i), this.options);
        }
        this.canJoinGraph = true;
    }

    unisciGrafici(){
        const myOpt: any = this.options;
        const newSeries = [];
        myOpt.tooltip = {
          formatter() {
            // tslint:disable-next-line:only-arrow-functions
            return this.points.reduce(function(s, point) {
              return s + '<br/>' + point.series.name + ': ' +
                point.y.toFixed(3);
            }, '<b>' + Highcharts.dateFormat('%H:%M:%S:%L', this.x - new Date().getTimezoneOffset() * 60000) + '</b>');
          },
          shared: true,
        };
        console.log(this.idSensoriScelti);
        myOpt.title.text = 'Unione Grafici';
        for (const i of this.idSensoriScelti){
            const tempVal = this.aviableSensors.find(value => value.id === i);
            const arrayData = [...tempVal.info.entries() ];
            newSeries.push({name: this.sensorsMap.get(i), data: arrayData});
        }
        myOpt.series = newSeries;
        $('#grafici').append('<div id=\'uni\'></div>');
        Highcharts.chart('uni', this.options);
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

    /*getData(){
    let arrayData = [];
    this._service.getCronologySensorData("004").subscribe(dbData => {
        console.log(dbData);
        dbData.forEach((value, key) => {
            console.log(this.convertDate(key));
            arrayData.push([Number(key), value]);
        });
        console.log(arrayData);
        this.options.series[0]['data'] = arrayData;
        Highcharts.chart('chart1',this.options);
    });
    }
    getData2(){
        let arrayData = [];
        this._service.getCronologySensorData("001").subscribe(dbData => {
            console.log(dbData);
            dbData.forEach((value, key) => {
                console.log(this.convertDate(key));
                arrayData.push([Number(key), value]);
            });
            console.log(arrayData);
            this.options.series[0]['data'] = arrayData;
            Highcharts.chart('chart2',this.options);
        });
    }*/
}
