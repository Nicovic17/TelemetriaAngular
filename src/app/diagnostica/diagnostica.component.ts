import {Component, NgZone, OnInit, ViewChild} from '@angular/core';
import {MatSelectionList} from '@angular/material/list';
import {DiagnosticaService} from '../diagnostica.service';
import {FormControl} from '@angular/forms';


@Component({
  selector: 'app-diagnostica',
  templateUrl: './diagnostica.component.html',
  styleUrls: ['./diagnostica.component.css']
})
export class DiagnosticaComponent implements OnInit {

  constructor( private _diagService: DiagnosticaService, private ngZone: NgZone) {}
  messagesList: Array<string> = [];
  messageListBackup = []; // Utilizzato per la funzionalità di filtraggio dei dati
  messageMap = new Map(); // Map del tipo <Messaggio>:<Key>
  @ViewChild('msg', {static: true}) private listObj: MatSelectionList;
  messageControl = new FormControl();
  isLoading = 0;

  ngOnInit(): void {
    this.listUpdate().then(() => {
      return null;
    });
  }
  /**
   * Seleziona tutti i messaggi
   */
  selectAll(){
    this.listObj.selectAll();
    this.listObj.selectedOptions.selected.forEach(value => {
      this.selectionChange(value);
    });
  }
  /**
   * Deseleziona tutti i messaggi
   */
  selectNone(){
    this.listObj.selectedOptions.selected.forEach(value => {
      value.selected = false;
      this.selectionChange(value);
    });
    this.listObj.deselectAll();
  }

  /**
   * Funzione che ottiene un Observable dal service e si mette in attesa di nuovi messaggi di diagnostica dopo aver
   * letto tutti i messaggi già presenti
   */
  async listUpdate(){
    this.isLoading = await this._diagService.getMessagesNumber();
    let message: string;
    this._diagService.getDiagMessages().subscribe(value => {
      message = this.convertDate(Number(value[0]));
      this.ngZone.run(() => {
        message = message + '    ' + value[1];
        this.messagesList.unshift(message);
        this.messageListBackup.unshift(message);
      });
      this.messageMap.set(message, value[0]); // L'array conserva l'associazione key-value del db per la cancellazione
      this.isLoading--;
    });
  }

  /**
   * Funzione restiruisce una stringa formattata in modo da mostrare ora, minuti, secondi e millisecondi
   * del timestamo ricevuto come parametro.
   * @param time: numero in millisecondi della data
   */
  convertDate(time: number): string{
    const stamp = new Date(time);
    const h = this.normalizeTimes(stamp.getHours(), false);
    const m = this.normalizeTimes(stamp.getMinutes(), false);
    const s = this.normalizeTimes(stamp.getSeconds(), false);
    const ms = this.normalizeTimes(stamp.getMilliseconds(), true);
    return '[ ' + h + ':' + m + ':' + s + ':' + ms + ' ]';
  }

  /**
   * Funzione che ha lo scopo di formattare correttamente le stringhe delle date dei messaggi di diagnostica
   * in modo da allineare tutte le date.
   * Per esempio se un messaggio ha timestamp 12:3:4:141 la funzione lo trasforma in 12:03:04:141
   * @param value: Valore da normalizzare
   * @param isMillis: true se value è il valore dei millisecondi.
   * Necessario perchè i millisecondi sono a 3 cifre e hanno bisogno di più controlli.
   */
  normalizeTimes(value: number, isMillis: boolean): string{
    let ret;
    if (!isMillis) {
      if (value < 10) {
        ret = '0' + value;
      }else{
        ret = value;
      }
    }else{
      if (value < 10){
        ret = '00' + value;
      }else if (value >= 10 && value < 100){
        ret = '0' + value;
      }else{
        ret = value;
      }
    }
    return ret;
  }

  /**
   * Cancella i messaggi selezionati dal database e da messageList.
   */
  deleteMessages(){
    let index: number;
    this.listObj.selectedOptions.selected.forEach(val => {
      this._diagService.deleteKey(this.messageMap.get(val.value));
      console.log('Eliminazione: ' + this.messageMap.delete(val.value));
      index = this.messagesList.indexOf(val.value);
      this.ngZone.run(() => {
        this.messagesList.splice(index, 1);
      });
      this.messageListBackup.splice(index, 1);
    });
  }

  /**
   * Funzione che applica il filtro a messageList in base alla parola contenuta in event
   * La funzione di filtraggio utilizza un array di supporto messageListBackup che contiene tutti i messaggi
   * mentre messageList contiene solo quelli da mostrare effettivamente.
   * @param event: contiene la parola per filtrare i messaggi
   */
  applyFilter(event: Event) {
    if (event == null){
      this.messagesList = this.messageListBackup;
    }else{
      const filterValue = (event.target as HTMLInputElement).value;
      this.messagesList = this.messageListBackup.filter(value => value.toLowerCase().includes(filterValue.trim().toLowerCase()));
    }
  }

  /**
   * Funzione che serve a preservare i messaggi selezionati anche dopo che cambia la parola del filtro.
   * La funzione viene chiamata con l'event binding selectionChanges di mat-selection-list
   * @param option: messaggio selezionato
   */
  selectionChange(option: any){
    let value = this.messageControl.value || [];
    if (option.selected) {
      value.push(option.value);
    } else {
      value = value.filter((x: any) => x !== option.value);
    }
    this.messageControl.setValue(value);
  }
}
