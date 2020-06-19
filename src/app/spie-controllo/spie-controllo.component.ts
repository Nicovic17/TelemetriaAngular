import {Component, NgZone, OnInit} from '@angular/core';
import {ControllerService} from "../controller.service";

@Component({
  selector: 'app-spie-controllo',
  templateUrl: './spie-controllo.component.html',
  styleUrls: ['./spie-controllo.component.css']
})
export class SpieControlloComponent implements OnInit {
  public breakPressure;
  public liquidTemperature;
  public liquidStream;

  //Implementare service con connessione a database per dati corrispondenti
  constructor(private _controllerService: ControllerService, private ngZone: NgZone) { }

  ngOnInit(): void {
    this.ascoltaBreakPressure();
    this.ascoltaLiquidTemperature();
    this.ascoltaFlussoRaffreddamento();
  }
  ascoltaFlussoRaffreddamento(){
    this._controllerService.getFlussoLiquidoRaffreddamento().subscribe(value => {
      this.ngZone.run(() => {
        this.liquidStream = value;
      });
    });
  }
  ascoltaLiquidTemperature(){
    this._controllerService.getTempLiquidoRaffreddamento().subscribe(value => {
      this.ngZone.run(() => {
        this.liquidTemperature = value;
      });
    });
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
    //document.getElementById("BMS").classList.add("danger")
  }

}
