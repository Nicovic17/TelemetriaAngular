import {Component, Input, NgZone, OnInit, ViewChild} from '@angular/core';
import {MatListModule, MatSelectionList} from '@angular/material/list';
import {DiagnosticaService} from "../diagnostica.service";


@Component({
  selector: 'app-diagnostica',
  templateUrl: './diagnostica.component.html',
  styleUrls: ['./diagnostica.component.css']
})
export class DiagnosticaComponent implements OnInit {
  messagesList: Array<string> = ['root'];
  messageMap = new Map();//Map del tipo <Messaggio>:<Key>
  isWait = true;
  visibility = 'display:none';
  @ViewChild('msg', {static: true}) private listObj: MatSelectionList;

  constructor( private _diagService: DiagnosticaService, private ngZone: NgZone) {
    
  }

  ngOnInit(): void {
    this.isWait = true;
    this.visibility = "display:none";
    this.listUpdate();
    this.showCore();
  }

  selectAll(){
    this.listObj.selectAll();
  }
  selectNone(){
    this.listObj.deselectAll();
  }
  showCore(){
    setTimeout(() => {
      this.ngZone.run(() => {
        this.isWait = false;
        this.visibility = "display: block";
      });
    }, 2000);
  }
  listUpdate(){
    let message: string;
    this.messagesList.pop();
    this._diagService.getDiagMessages().subscribe(value => {
      message = this.convertDate(Number(value[0]));
      this.ngZone.run(() => {
        message = message + " _ " + value[1];
        this.messagesList.unshift(message);
      });
      this.messageMap.set(message,value[0]); //L'array conserva l'associazione key-value del db per la cancellazione
      console.log("added "+value);
    });
  }
  convertDate(time: number): string{
    let stamp = new Date(time);
    return "[" + stamp.toLocaleString() + "]";
  }
  deleteMessages(object){
    let index: number;
    for(let i of object){
      console.log(i._text.nativeElement.innerText);
      console.log(this.messageMap.get(i._text.nativeElement.innerText));
      this._diagService.deleteKey(this.messageMap.get(i._text.nativeElement.innerText));
      console.log("Eliminazione: " + this.messageMap.delete(i._text.nativeElement.innerText));
      index = this.messagesList.indexOf(i._text.nativeElement.innerText);
      this.ngZone.run(() => {
        this.messagesList.splice(index,1);
      });
    }
  }

  
}
