import {Component, NgZone, OnInit} from '@angular/core';
import {ControllerService} from "../controller.service";

@Component({
  selector: 'app-spie-controllo',
  templateUrl: './spie-controllo.component.html',
  styleUrls: ['./spie-controllo.component.css']
})
export class SpieControlloComponent implements OnInit {
  public breakPressure;
  public breakTemp;
  public liquidTemperature;
  public liquidStream;
  public bms = "button";
  public trq = "button";
  public ecu = "button";
  public oh = "button";
  public tcs = "button";
  public imd = "button";

  //Implementare service con connessione a database per dati corrispondenti
  constructor(private _controllerService: ControllerService, private ngZone: NgZone) { }

  ngOnInit(): void {
    this.ascoltaBreakPressure();
    this.ascoltaLiquidTemperature();
    this.ascoltaFlussoRaffreddamento();
    this.ascoltaBreakTemperature();

    this.ascoltaSpiaBMS();
    this.ascoltaSpiaECU();
    this.ascoltaSpiaIMD();
    this.ascoltaSpiaOH();
    this.ascoltaSpiaTCS();
    this.ascoltaSpiaTRQ();
  }
  ascoltaFlussoRaffreddamento(){
    this._controllerService.getFlussoLiquidoRaffreddamento().subscribe(value => {
      this.ngZone.run(() => {
        this.liquidStream = this.isValueValid(value);
      });
    });
  }
  ascoltaLiquidTemperature(){
    this._controllerService.getTempLiquidoRaffreddamento().subscribe(value => {
      this.ngZone.run(() => {
        this.liquidTemperature = this.isValueValid(value);
      });
    });
  }
  ascoltaBreakPressure(){
    this._controllerService.getPressioneFreno().subscribe(value => {
      this.ngZone.run(() => {
        this.breakPressure = this.isValueValid(value);
      });
    });
  }
  ascoltaBreakTemperature(){
    this._controllerService.getTempFreno().subscribe(value => {
      this.ngZone.run(() =>{
        this.breakTemp = this.isValueValid(value);
      });
    });
  }

  ascoltaSpiaBMS(){
    this._controllerService.getSpiaBatteryManagementSystem().subscribe(value => {
      this.ngZone.run(() =>{
        if (value == 1) {
          this.bms = "button danger";
        } else {
          this.bms = "button";
        }
      });
    });
  }
  ascoltaSpiaTRQ(){
    this._controllerService.getSpiaTorqueLimitation().subscribe(value => {
      this.ngZone.run(() =>{
        if (value == 1) {
          this.trq = "button danger";
        } else {
          this.trq = "button";
        }
      });

    });
  }
  ascoltaSpiaECU(){
    this._controllerService.getSpiaECU().subscribe(value => {
      this.ngZone.run(() =>{
        if (value == 1) {
          this.ecu = "button danger";
        } else {
          this.ecu = "button";
        }
      });

    });
  }
  ascoltaSpiaOH(){
    this._controllerService.getSpiaOverHeat().subscribe(value => {
      this.ngZone.run(() =>{
        if (value == 1) {
          this.oh = "button danger";
        } else {
          this.oh = "button";
        }
      });

    });
  }
  ascoltaSpiaTCS(){
    this._controllerService.getSpiaTractionControlSystem().subscribe(value => {
      this.ngZone.run(() =>{
        if (value == 1) {
          this.tcs = "button active";
        } else {
          this.tcs = "button";
        }
      });

    });
  }
  ascoltaSpiaIMD(){
    this._controllerService.getSpiaIMD().subscribe(value => {
      this.ngZone.run(() =>{
        if (value == 1) {
          this.imd = "button danger";
        } else {
          this.imd = "button";
        }
      });

    });
  }

  isValueValid(value){
    if(value == "null"){
      return "NULL";
    }else {
      return value;
    }
  }
}
