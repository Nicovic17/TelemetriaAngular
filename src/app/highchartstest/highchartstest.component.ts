import {Component, NgZone, OnInit, ViewChild} from '@angular/core';
import * as Highcharts from 'highcharts';
import {ControllerService} from '../controller.service';
import {DiagnosticaService} from '../diagnostica.service';
import {StoricoService} from '../storico.service';
import {AngularFireAuth} from '@angular/fire/auth';
import {MatSelectionList} from '@angular/material/list';
import {StoricoDueService} from '../storico-due.service';

//Per utilizzare jQuery in TS
declare var $: any;
declare var require: any;
let Boost = require('highcharts/modules/boost');
let noData = require('highcharts/modules/no-data-to-display');
let More = require('highcharts/highcharts-more');

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
    //Viene utilizzato per ricavare i sensori selezionati
    @ViewChild('sensoriSelezionati', {static: false}) private listObj: MatSelectionList;
    @ViewChild('graph', {static: false}) private  listGraph;
    public oraInizio;
    public oraFine;
    public sensorListDisplayed = false;  // Stabilisce se la lista dei sensori deve essere visibile
    public chartsListDisplayed = false;  // Stabilisce se la lista dei grafici deve essere visibile
    public canJoinGraph = false; // Stabilisce se il pulsante per unire i grafici è visibile
    public aviableSensors: StrutturaSensori[];  // Struttura definità dopra il decorator serve per mantenere tutti i dati dei sensori
    public sensorsMap: Map<string, string>;  // Conserva la mappa dei sensori
    public listaSensori = [];  // Contiene la lista dei sensori disponibili per l'intervallo di tempo selezionato
    public idSensoriScelti = [];  // contiene gli id dei sensori selezionati

    // Indica le opzioni standard per i grafici
    public options: any = {
        chart: {
            type: 'line',
            height: 300
        },
        title: {
            text: 'Grafici Storico:'
        },
        credits: {
            enabled: false
        },
        tooltip: {
            formatter: function() {
                return 'x: ' + Highcharts.dateFormat('%e %b %y %H:%M:%S', this.x) +
                    'y: ' + this.y.toFixed(2);
            }
        },
        xAxis: {
            type: 'datetime',
            labels: {
                formatter: function() {
                    return Highcharts.dateFormat('%H %M %S', this.value);
                }
            }
        },
        series: [
            {
                name: 'Normal',
                // turboThreshold: 500000,
                data: []
            }
        ]
    };

    constructor(public _service: StoricoDueService, public auth: AngularFireAuth, public ngZone: NgZone) {
        this.checkIfUserIsLogged();
    }
    ngOnInit(): void {
    }
    /*
        Questo metodo prepara gli input dell'utente convertendoli in millisecondi
        per poi inviare i 2 dati di ora iniziale e finale al metodo startSearch
     */
    async prepareValuesForSearch(val1: Date, val2: Date, val3){
        let oraI = val1;
        let oraF = val2;
        const data: Date = new Date(val3);

        oraI.setDate(data.getDate());
        oraI.setMonth(data.getMonth());
        oraI.setFullYear(data.getFullYear());
        oraI.setHours(oraI.getHours()-1, oraI.getMinutes(), oraI.getSeconds());
        oraF.setDate(data.getDate());
        oraF.setMonth(data.getMonth());
        oraF.setFullYear(data.getFullYear());
        oraF.setHours(oraF.getHours()-1, oraF.getMinutes(), oraF.getSeconds());
        //console.log(oraI, oraF);
        this.startSearch(oraI, oraF);
    }
    /*
        Questo metodo carica in aviableSensors i dati dei sensori SOLO nell'intervallo
        selezionato dall'utente.
     */
    async startSearch(oraI: Date, oraF: Date){
        this.chartsListDisplayed = false;
        this.listaSensori.splice(0,this.listaSensori.length);
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
        Questo metodo viene attivato alla pressione del pulsante
     */
    mostraGrafici(){
        // Riempe l'array idSensoriScelti
        this.listObj.selectedOptions.selected.forEach(value => {
            //console.log(value._text.nativeElement.innerText);
            const key = value._text.nativeElement.innerText;
            //Effettua conversione inversa "Nome sensore" -> ID
            const keys = [...this.sensorsMap.entries()].filter(({ 1: v }) => v === key).map(([k]) => k);
            this.idSensoriScelti.push(keys[0]);
        });
        //console.log(this.idSensoriScelti);
        this.sensorListDisplayed = false;
        // Per ogni id scelto ricava da aviableSensors la mappa che contiene tutta la cronologia
        for(const i of this.idSensoriScelti){
            const tempVal = this.aviableSensors.find(value => value.id === i);
            const arrayData = [...tempVal.info.entries() ];
            this.options.series[0]['data'] = arrayData;
            this.options.series[0].name = this.sensorsMap.get(i);
            $("#grafici").append("<div id='" + i + "'></div>"); // Il metodo ngFor non faceva rendereizzare il grafico
            Highcharts.chart(String(i), this.options);
        }
        this.canJoinGraph = true;
    }

    unisciGrafici(){
        const myOpt: any = this.options;
        const newSeries = [];
        for(let i of this.idSensoriScelti){
            const tempVal = this.aviableSensors.find(value => value.id === i);
            const arrayData = [...tempVal.info.entries() ];
            newSeries.push({name: this.sensorsMap.get(i), data: arrayData});
        }
        myOpt.series = newSeries;
        $("#grafici").append("<div id='uni'></div>");
        Highcharts.chart('uni', this.options);
    }

    convertDate(time: number): number{
        let stamp = new Date(time);
        return stamp.getTime();
    }

    checkIfUserIsLogged() {
        this.auth.onAuthStateChanged(function (user) {
            if (user) {
                document.getElementById("user_div").style.display = "none";
                document.getElementById("router").style.display = "block";

                return true;
            }
            else {
                console.log("Non Loggato");
                document.getElementById("login_div").style.display = "block";

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
