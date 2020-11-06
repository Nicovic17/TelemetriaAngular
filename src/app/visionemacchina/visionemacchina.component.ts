import {Component, NgZone, OnInit} from '@angular/core';
import {EngineService} from '../engine.service';

@Component({
  selector: 'app-visionemacchina',
  templateUrl: './visionemacchina.component.html',
  styleUrls: ['./visionemacchina.component.css']
})
export class VisionemacchinaComponent implements OnInit {
  public tempEng1;
  public tempEng2;
  public tempEng3;
  public tempEng4;
  public tempIgbt1;
  public tempIgbt2;
  public tempIgbt3;
  public tempIgbt4;

  constructor(private _engineService: EngineService, private ngZone: NgZone) { }

  ngOnInit(): void {
    this.ascoltaSensori();
  }
  ascoltaSensori(){
    this.ngZone.run(() => {
      this.ascoltaEng1();
      this.ascoltaEng2();
      this.ascoltaEng3();
      this.ascoltaEng4();
      this.ascoltaIgbt1();
      this.ascoltaIgbt2();
      this.ascoltaIgbt3();
      this.ascoltaIgbt4();
    });

  }

  /**
   * Si mette in ascolto sul metodo di tipo Observable getTempEngineOne() e aggiorna dati RealTime
   */
  ascoltaEng1(){
    this._engineService.getTempEngineOne().subscribe(value => {
      this.tempEng1 = value;
    });
  }

  /**
   * Si mette in ascolto sul metodo di tipo Observable getTempEngineTwo() e aggiorna dati RealTime
   */
  ascoltaEng2(){
    this._engineService.getTempEngineTwo().subscribe(value => {
      this.tempEng2 = value;
    });
  }

  /**
   * Si mette in ascolto sul metodo di tipo Observable getTempEngineThree() e aggiorna dati RealTime
   */
  ascoltaEng3(){
    this._engineService.getTempEngineThree().subscribe(value => {
      this.tempEng3 = value;
    });
  }

  /**
   * Si mette in ascolto sul metodo di tipo Observable getTempEngineFour() e aggiorna dati RealTime
   */
  ascoltaEng4(){
    this._engineService.getTempEngineFour().subscribe(value => {
      this.tempEng4 = value;
    });
  }

  /**
   * Si mette in ascolto sul metodo di tipo Observable getTempIgbtOne() e aggiorna dati RealTime
   */
  ascoltaIgbt1(){
    this._engineService.getTempIgbtOne().subscribe(value => {
      this.tempIgbt1 = value;
    });
  }

  /**
   * Si mette in ascolto sul metodo di tipo Observable getTempIgbtTwo() e aggiorna dati RealTime
   */
  ascoltaIgbt2(){
    this._engineService.getTempIgbtTwo().subscribe(value => {
      this.tempIgbt2 = value;
    });
  }

  /**
   * Si mette in ascolto sul metodo di tipo Observable getTempIgbtThree() e aggiorna dati RealTime
   */
  ascoltaIgbt3(){
    this._engineService.getTempIgbtThree().subscribe(value => {
      this.tempIgbt3 = value;
    });
  }

  /**
   * Si mette in ascolto sul metodo di tipo Observable getTempIgbtFour() e aggiorna dati RealTime
   */
  ascoltaIgbt4(){
    this._engineService.getTempIgbtFour().subscribe(value => {
      this.tempIgbt4 = value;
    });
  }

}
