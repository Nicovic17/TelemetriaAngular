import {Component, Input, NgZone, OnInit, ViewChild} from '@angular/core';
import {MatListModule, MatListOption, MatSelectionList} from '@angular/material/list';
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
  isLoading = true;

  ngOnInit(): void {
    this.listUpdate();
  }
  selectAll(){
    this.listObj.selectAll();
    this.listObj.selectedOptions.selected.forEach(value => {
      this.selectionChange(value);
    });
  }
  selectNone(){
    this.listObj.selectedOptions.selected.forEach(value => {
      value.selected = false;
      this.selectionChange(value);
    });
    this.listObj.deselectAll();
  }
  async listUpdate(){
    let messagesNumber = await this._diagService.getMessagesNumber();
    let message: string;
    this._diagService.getDiagMessages().subscribe(value => {
      message = this.convertDate(Number(value[0]));
      this.ngZone.run(() => {
        message = message + '    ' + value[1];
        this.messagesList.unshift(message);
        this.messageListBackup.unshift(message);
      });
      this.messageMap.set(message, value[0]); // L'array conserva l'associazione key-value del db per la cancellazione
      messagesNumber--;
      if (messagesNumber === 0){
        this.isLoading = false;
      }
    });
  }

  convertDate(time: number): string{
    const stamp = new Date(time);
    const h = this.normalizeTimes(stamp.getHours(), false);
    const m = this.normalizeTimes(stamp.getMinutes(), false);
    const s = this.normalizeTimes(stamp.getSeconds(), false);
    const ms = this.normalizeTimes(stamp.getMilliseconds(), true);
    return '[ ' + h + ':' + m + ':' + s + ':' + ms + ' ]';
  }
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

  applyFilter(event: Event) {
    if (event == null){
      this.messagesList = this.messageListBackup;
    }else{
      const filterValue = (event.target as HTMLInputElement).value;
      this.messagesList = this.messageListBackup.filter(value => value.toLowerCase().includes(filterValue.trim().toLowerCase()));
    }
  }

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
