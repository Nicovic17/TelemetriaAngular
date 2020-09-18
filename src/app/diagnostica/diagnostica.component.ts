import {Component, NgZone, OnInit} from '@angular/core';
import {MatListModule} from '@angular/material/list';
import {AngularFireAuth} from "@angular/fire/auth";
import {DiagnosticaService} from "../diagnostica.service";


@Component({
  selector: 'app-diagnostica',
  templateUrl: './diagnostica.component.html',
  styleUrls: ['./diagnostica.component.css']
})
export class DiagnosticaComponent implements OnInit {
  messagesList: Array<string> = ['root'];
  messageMap = new Map();//Map del tipo <Messaggio>:<Key>
  constructor(public auth: AngularFireAuth, private _diagService: DiagnosticaService, private ngZone: NgZone) {
    this.checkIfUserIsLogged();
  }

  ngOnInit(): void {
    this.listUpdate();
  }

  listUpdate(){
    this.messagesList.pop();
    this._diagService.getDiagMessages().subscribe(value => {
      this.ngZone.run(() => {
        this.messagesList.push(value[1]);
      })
      this.messageMap.set(value[1],value[0]); //L'array conserva l'associazione key-value del db per la cancellazione
      console.log("added "+value);
    });
  }

  deleteMessages(object){
    let index: number;
    for(let i of object){
      //console.log(i._text.nativeElement.innerText);
      //console.log(this.messageMap.get(i._text.nativeElement.innerText));
      this._diagService.deleteKey(this.messageMap.get(i._text.nativeElement.innerText));
      //console.log("Eliminazione: " + this.messageMap.delete(i._text.nativeElement.innerText));
      index = this.messagesList.indexOf(i._text.nativeElement.innerText);
      this.ngZone.run(() => {
        this.messagesList.splice(index,1);
      });
    }
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
    })
  }
}
