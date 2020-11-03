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

  /**
   * Si mette in ascolto sul metodo di tipo Observable getFlussoLiquidoRaffreddamento() e aggiorna dati RealTime
   */
  ascoltaFlussoRaffreddamento(){
    this._controllerService.getFlussoLiquidoRaffreddamento().subscribe(value => {
      this.ngZone.run(() => {
        this.liquidStream = this.isValueValid(value);
      });
    });
  }

  /**
   * Si mette in ascolto sul metodo di tipo Observable getTempLiquidoRaffreddamento() e aggiorna dati RealTime
   */
  ascoltaLiquidTemperature(){
    this._controllerService.getTempLiquidoRaffreddamento().subscribe(value => {
      this.ngZone.run(() => {
        this.liquidTemperature = this.isValueValid(value);
      });
    });
  }

  /**
   * Si mette in ascolto sul metodo di tipo Observable getPressioneFreno() e aggiorna dati RealTime
   */
  ascoltaBreakPressure(){
    this._controllerService.getPressioneFreno().subscribe(value => {
      this.ngZone.run(() => {
        this.breakPressure = this.isValueValid(value);
      });
    });
  }

  /**
   * Si mette in ascolto sul metodo di tipo Observable getTempFreno() e aggiorna dati RealTime
   */
  ascoltaBreakTemperature(){
    this._controllerService.getTempFreno().subscribe(value => {
      this.ngZone.run(() =>{
        this.breakTemp = this.isValueValid(value);
      });
    });
  }

  /**
   * Si mette in ascolto sul metodo di tipo Observable getSpiaBatteryManagementSystem() e aggiorna dati RealTime
   */
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

  /**
   * Si mette in ascolto sul metodo di tipo Observable getSpiaTorqueLimitation() e aggiorna dati RealTime
   */
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

  /**
   * Si mette in ascolto sul metodo di tipo Observable getSpiaECU() e aggiorna dati RealTime
   */
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

  /**
   * Si mette in ascolto sul metodo di tipo Observable getSpiaOverHeat() e aggiorna dati RealTime
   */
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

  /**
   * Si mette in ascolto sul metodo di tipo Observable getSpiaTractionControlSystem() e aggiorna dati RealTime
   */
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

  /**
   * Si mette in ascolto sul metodo di tipo Observable getSpiaIMD() e aggiorna dati RealTime
   */
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

  /**
   * 
   * @param value 
   */
  isValueValid(value){
    if(value == "null"){
      return "NULL";
    }else {
      return value;
    }
  }
}
