import {Component, NgZone, OnInit, ViewChildren} from '@angular/core';
import * as Highcharts from 'highcharts';
import {StoricoService} from '../storico.service';
import {MatDialog} from '@angular/material/dialog';
import {MatDialogComponent} from '../mat-dialog/mat-dialog.component';
import {FormControl} from '@angular/forms';
import {debounceTime, startWith, switchMap} from 'rxjs/operators';
import {of} from 'rxjs';
import {MatButton} from '@angular/material/button';

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
ExportData(Highcharts);
Accessibility(Highcharts);

interface StrutturaSensori {
    id: string;
    info: Map<number, number>;
}

@Component({
  selector: 'app-highchartstest',
  templateUrl: './storico.component.html',
  styleUrls: ['./storico.component.css']
})
export class StoricoComponent implements OnInit {
    public maxDate: Date;
    public sensorListDisplayed = false;  // Stabilisce se la lista dei sensori deve essere visibile
    public chartsListDisplayed = false;  // Stabilisce se la lista dei grafici deve essere visibile
    public isLoading = false;
    public canJoinGraph = false; // Stabilisce se il pulsante per unire i grafici è visibile
    public canFilter = false;
    private availableSensors: StrutturaSensori[];  // Struttura definità dopra il decorator serve per mantenere tutti i dati dei sensori
    private sensorsMap: Map<string, string>;  // Conserva la mappa dei sensori
    private listaSensori = [];  // Contiene la lista dei sensori disponibili per l'intervallo di tempo selezionato
    public idSensoriScelti = [];  // contiene gli id dei sensori selezionati
    search = new FormControl();
    searchControl = new FormControl();

    @ViewChildren('graph') graphSection: any;

    $search = this.search.valueChanges.pipe(
      startWith(null),
      debounceTime(5),
      switchMap((res: string) => {
        if (!res){ return of(this.listaSensori); }
        res = res.trim().toLowerCase();
        return of(
          this.listaSensori.filter(x => x.toLowerCase().indexOf(res) >= 0)
        );
      })
    );

    filterChange(option: any){
      let value = this.searchControl.value || [];
      option.selected ? value.push(option.value) : value = value.filter((x: any) => x !== option.value);
      this.searchControl.setValue(value);
    }

    constructor(public _service: StoricoService, public ngZone: NgZone, private errDialog: MatDialog) {}

    ngOnInit(): void {
      this.maxDate = this.setMaxDate();
    }

  /**
   * Il metodo viene chiamato al click del pulsante cerca. Inizializza correttamente le variabili Date per la ricerca
   * nel database.
   * Alla fine del metodo avremo due oggetti Date che corrisponderanno alla data di inizio e di fine della ricerca
   * @param val1 E' la stringa che contiene l'ora iniziale presa dal time picker
   * @param val2 E' la stringa che contiene l'ora finale presa dal time picker
   * @param val3 E' la stringa che contiene la data presa dal date picker
   */
    async prepareValuesForSearch(val1: string, val2: string, val3){
        const oraI = new Date(val3);
        const oraF = new Date(val3);
        let time = val1.split(':'); // divide una stringa in un array tramite il valore di separazione
        oraI.setHours(Number(time[0]), Number(time[1]), Number(time[2]) || 0);
        time = val2.split(':'); // divide una stringa in un array tramite il valore di separazione
        oraF.setHours(Number(time[0]), Number(time[1]), Number(time[2]) || 0);
        if (this.ifValuesFine(oraI, oraF)){
          this.isLoading = true;
          await this.startSearch(oraI, oraF);
          this.isLoading = false;
        }else{
          this.showErrorTimeDialog();
        }
    }

  /**
   * Il metodo riceve due parametri di tipo date che corrispondono alla data iniziale e finale della ricerca.
   * Effettua due chiamate al service, la prima ritorna l'array availableSensors che contiene tutti i dati
   * recuperati in base alla data iniziale e finale; la seconda chiamata ritorna la Mappa dei sensori necessaria
   * per sapere, a partire dall'id, di che sensore si tratta.
   *
   * Utilizzando l'array availableSensors e la sensorMap riempe l'array listaSensori con i nomi dei sensori disponibili
   * @param oraI Data di inizio della ricerca
   * @param oraF Data di fine della ricerca
   */
    async startSearch(oraI: Date, oraF: Date){
        this.search.enable();
        this.canFilter = true;
        // Resetta tutte le strutture per inserire nuovi grafici
        this.searchControl.reset();
        this.sensorListDisplayed = false;
        this.chartsListDisplayed = false;
        this.canJoinGraph = false;
        // Vengono dapprima caricati i dati dei sensori e la mappa in modo Sincrono
        this.availableSensors = await this._service.getAvailableSensors(oraI, oraF);
        this.sensorsMap = await this._service.getSensorsMap();
        // Utilizzando la mappa gli id dei sensori vengono convertiti in nomi
        this.availableSensors.forEach(value => {
            this.listaSensori.push(this.sensorsMap.get(value.id) || 'SENSOR NOT AVAILABLE IN THE MAP');
        });
        // Vengono visualizzati
        if (this.availableSensors.length === 0){
          this.canFilter = false;
          this.showErrorNoData();
        }else{
          this.sensorListDisplayed = true;
          //this.chartsListDisplayed = true;
        }
    }

    /**
     * Il metodo viene chiamato al click del pulsante 'mostra grafici', controlla se è stato selezionato almeno un sensore
     * e, in caso positivo, pulisce alcune strutture non più necessarie per allegerire il rendering di angular per poi
     * mostrare all'utente la scelta sul tipo di grafico da visualizzare.
     *
     * In caso di nessun sensore selezionato mostra errore.
     */
    mostraGrafici(){
        if (this.searchControl.value === null || this.searchControl.value?.length === 0){
          this.showErrorNoSelection();
        }else{
          // Mostra all'utente un dialog per scegliere come visualizzare i grafici
          this.chooseChartType();
        }
    }

  /**
   * Il metodo riempe l'array idSensoriScelti con gli id dei sensori scelti dall'utente, scorre l'array creato per
   * controllare se siano stati selezionati sensori non validi ed infine chiama o il metodo mostraGraficiSingoli o
   * il metodo unisciGrafici a seconda del parametro ricevuto
   *
   * @param isSingle Indica il metodo da chiamare dopo aver svolto le operazioni
   */
    inizializzaGrafici(isSingle: boolean){
        let isFailed = false;
        // Resetta e Riempe l'array idSensoriScelti
        this.idSensoriScelti.splice(0, this.idSensoriScelti.length);
        this.searchControl.value.forEach(value => {
          const key = value;
          // Effettua conversione inversa "Nome sensore" -> ID per ricavare i dati da availableSensors
          const keys = [...this.sensorsMap.entries()].filter(({ 1: v }) => v === key).map(([k]) => k);
          this.idSensoriScelti.push(keys[0]);
        });
        // Controlla se sono stati scelti sensori non validi
        for (const i of this.idSensoriScelti){
          if (i === undefined){
            isFailed = true;
            break;
          }
        }
        if (!isFailed) {
          this.chartsListDisplayed = true;
          this.sensorListDisplayed = false;
          this.search.reset();
          this.search.disable();
          // Prima di mostrare i grafici all'utente, resettiamo i due array in modo da liberare i costrutti di
          // angular che andrebberò ad inizializzare gli elementi html (nascosti) inutilmente
          this.listaSensori.splice(0, this.listaSensori.length);
          isSingle ? this.mostraGraficiSingoli() : this.unisciGrafici();
        }else{
          this.showDialog('Errore!', ['Sono stati selezionati uno o più sensori non presenti nella Mappa dei Sensori',
            'Evitare di selezionare i sensori \'Sensor not Aviable in The Map\'']);
        }
    }

  /**
   * Il metodo scorre l'array idSensoriScelti e per ogni elemento ricava i dati relativi al sensore all'interno dell'array
   * availableSensor. Crea poi per ogniuno un oggetto Option da dare ad Highchart per renderizzare il grafico.
   *
   * Il seguente metodo renderizza n grafici conteneti ogniuno i dati relativi ad un sensore.
   */
    mostraGraficiSingoli(){
        // scorre l'array idSensoriScelti che conterrà l'id dei sensori scelti dall'utente per ogni id ricava i dati da availableSensors
        for (const i of this.idSensoriScelti){
          // tempVal conterrà un oggetto di tipo StrutturaSensori preso dall'array availableSensors
          const tempVal = this.availableSensors.find(value => value.id === i);
          // Highchart ha bisogno di un array di array di 2 elementi [puntoAscisse,puntoOrdinata] per mostrare i dati sul grafico
          const arrayData = [...tempVal.info.entries() ]; // scorre un Iterable e inserisce gli elementi in un array
          const myOpt = this.createNewChartOption(this.toTitleCase(this.sensorsMap.get(i).replace(/_/g, ' ')),
            false,
            [{name: this.sensorsMap.get(i), data: arrayData}]);
          const subscription = this.graphSection.changes.subscribe(() => {
            console.log("Is changed");
            $('#grafici').append('<div id=\'' + i + '\'></div>'); // Il metodo ngFor non faceva rendereizzare il grafico
            Highcharts.chart(String(i), myOpt);
            subscription.unsubscribe();
          });
          this.canJoinGraph = true;
        }
    }

  /**
   * A differenza del metodo mostraGraficiSingoli questo crea un unico oggetto Option (da dare ad Highcharts) per tutti
   * i sensori scelti dall'utente in modo che Highcharts renderizzerà un solo grafico contenente tutti i sensori scelti
   * mostrando ogni sensore su una diversa funzione.
   */
    unisciGrafici(){
        const myOpt = this.createNewChartOption('Unione Grafici', true );
        const newSeries = [];
        for (const i of this.idSensoriScelti){
            const tempVal = this.availableSensors.find(value => value.id === i);
            const arrayData = [...tempVal.info.entries() ];
            newSeries.push({name: this.sensorsMap.get(i), data: arrayData});
        }
        myOpt.series = newSeries;
        const subscription = this.graphSection.changes.subscribe(() => {
          $('#grafici').append('<div id=\'uni\'></div>');
          Highcharts.chart('uni', myOpt);
          subscription.unsubscribe();
        });
        this.showDialogChartsJoined();
        this.canJoinGraph = false;
    }

  /**
   * Il metodo mostra un dialog all'utente e gli fa scegliere il tipo di grafico da visualizzare
   */
    chooseChartType(){
        const matRef = this.showTypeOfChartChoice();
        matRef.afterClosed().subscribe(value => {
          if (value === 0){
            this.inizializzaGrafici(true);
          }else{
            this.inizializzaGrafici(false);
          }
        });
    }

  /**
   * Il metodo prende come parametro una stringa e la ritorna formattata in Title Case
   * @param phrase stringa da formattare
   */
    toTitleCase = (phrase) => {
        return phrase
          .toLowerCase()
          .split(' ')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
    }

  /**
   * RITORNA UN OGGETTO OPTION RELATIVO AD UN GRAFICO DI HIGHCHART PRONTO DA ESSERE INIZIALIZZATO
   * @param title: Indica il titolo del grafico
   * @param isShared: True se è un grafico con più series
   * @param chartsData: (Optional) Array di Oggetti con 2 parametri: 1. Il nome della serie 2. Un Array di Array[puntoAscisse,puntoOrdinate]
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

  /**
   * Ritorna true se orai contiene un tempo antecedente ad oraf, false altrimenti.
   * @param orai oggetto Date da confrontare
   * @param oraf oggetto Date da confrontare
   */
    ifValuesFine(orai: Date, oraf: Date): boolean{
      return orai < oraf;
    }

  /**
   * Mostra un Dialog all'utente per informarlo sull'utilizzo dei grafici
   */
    showDialogChartsInfo(){
      const body = [
        'E\' possibile selezionare un intervallo di valori del grafico per eseguire uno zoom.',
        ' ',
        'Una volta eseguito uno zoom è possibile spostarsi nel grafico tenenedo premuto il tasto Shift e trascinando (il grafico) con il cursore' +
        ' in una determinata direzione.',
        ' ',
        'Sulla parte superiore destra di ogni grafico è presente un menù che permette di esportare i dati in diversi formati.'
      ];
      const ref = this.showDialog('Informazioni sui Grafici', body);
    }

  /**
   * Mostra un Dialog di errore all'utente
   */
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

  /**
   * Mostra un Dialog di errore all'utente
   */
    showErrorNoData(){
      this.errDialog.open(MatDialogComponent, {
        maxWidth: '400px',
        maxHeight: '400px',
        data: {
          title: 'Attenzione!',
          body: [
            'Nell\'intervallo temporale selezionato non sono presenti dati all\'interno del database.',
            ' ',
            'Visualizzare la sezione tracciato per sapere quali dati sono presenti nel Database.'
          ],
        },
        disableClose: true,
        position: {
          top: '13%',
        },
      });
    }

  /**
   * Mostra un Dialog di errore all'utente
   */
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

  /**
   * Mostra un dialog che avverte l'utente che i grafici sono stati uniti con successo
   */
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

  /**
   * Viene chiamato all'avvio del component dal metodo ngOnInit() si occupa di settare la data massima selezionabile
   * dal datePicker, non permettendo all'utente di selezioanre una data futura.
   */
    setMaxDate(): Date{
      const today = new Date();
      return new Date(today.getFullYear(), today.getMonth(), today.getDate());
    }

  /**
   * Mostra un dialog dinamico all'utente in base ai paramtri ricevuti
   * @param titolo titolo del dialog
   * @param corpo array di stringhe contenente il corpo del dialog
   */
    showDialog(titolo: string, corpo: string[]){
      this.errDialog.open(MatDialogComponent, {
        maxWidth: '400px',
        maxHeight: '400px',
        data: {
          title: titolo,
          body: corpo,
        },
        disableClose: true,
        position: {
          top: '13%',
        },
      });
    }

  /**
   * Mostra un Dialog all'utente che gli permette di effettuare una scelta
   */
    showTypeOfChartChoice(){
      return this.errDialog.open(MatDialogComponent, {
        maxWidth: '400px',
        maxHeight: '400px',
        data: {
          title: 'Modalità Grafici',
          body: [
            'Si desidera visualizzare i grafici singoli o un solo Grafico Unito?',
          ],
          isChoice: false,
          isPersonalized: true,
          choices: [
            { name: 'Grafici Singoli',
              returnValue: 0
            },
            {
              name: 'Grafico Unito',
              returnValue: 1
            }
          ]
        },
        disableClose: true,
        position: {
          top: '13%',
        },
      });
    }
}
