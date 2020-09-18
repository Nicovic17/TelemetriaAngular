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
        this.messagesList.push(value);
      })
      console.log("added "+value);
    });
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
