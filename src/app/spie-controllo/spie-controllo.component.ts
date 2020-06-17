import {Component, NgZone, OnInit} from '@angular/core';
import {ControllerService} from "../controller.service";

@Component({
  selector: 'app-spie-controllo',
  templateUrl: './spie-controllo.component.html',
  styleUrls: ['./spie-controllo.component.css']
})
export class SpieControlloComponent implements OnInit {
  public breakPressure;

  //Implementare service con connessione a database per dati corrispondenti
  constructor(private _controllerService: ControllerService, private ngZone: NgZone) { }

  ngOnInit(): void {
    this.ascoltaBreakPressure();
  }
  ascoltaBreakPressure(){
    this._controllerService.getPressioneFreno().subscribe(value => {
      this.ngZone.run(() => {
        this.breakPressure = value;
      });
    });
  }
  ngAfterViewInit()
  {
    document.getElementById("BMS").classList.add("red")
  }

}
