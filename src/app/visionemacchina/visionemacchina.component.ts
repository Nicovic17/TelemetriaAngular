import {Component, NgZone, OnInit} from '@angular/core';
import {EngineService} from '../engine.service';

@Component({
  selector: 'app-visionemacchina',
  templateUrl: './visionemacchina.component.html',
  styleUrls: ['./visionemacchina.component.css']
})
export class VisionemacchinaComponent implements OnInit {
  public tempEng1;
  public tempEng1Class="btn";

  public tempEng2;
  public tempEng2Class="btn";

  public tempEng3;
  public tempEng3Class="btn";

  public tempEng4;
  public tempEng4Class="btn";

  public tempIgbt1;
  public tempIgbt2;
  public tempIgbt3;
  public tempIgbt4;

  constructor(private _engineService: EngineService, private ngZone: NgZone) { }

  ngOnInit(): void {
    this.ascoltaSensori();
  }
  ascoltaSensori(){
      this.ascoltaEng1();
      this.ascoltaEng2();
      this.ascoltaEng3();
      this.ascoltaEng4();
      this.ascoltaIgbt1();
      this.ascoltaIgbt2();
      this.ascoltaIgbt3();
      this.ascoltaIgbt4();
  }

  /**
   * Si mette in ascolto sul metodo di tipo Observable getTempEngineOne() e aggiorna dati RealTime
   */
  ascoltaEng1(){
    this._engineService.getTempEngineOne().subscribe(value => {
      this.ngZone.run(() =>{
        
        this.tempEng1 = value;

        if(this.tempEng1>80 || this.tempIgbt1>80)
        this.tempEng1Class="btn red"

        if(this.tempEng1<=80 && this.tempIgbt1<=80)
        this.tempEng1Class="btn"
      });
    });
  }

  /**
   * Si mette in ascolto sul metodo di tipo Observable getTempEngineTwo() e aggiorna dati RealTime
   */
  ascoltaEng2(){
    this._engineService.getTempEngineTwo().subscribe(value => {
      this.ngZone.run(() =>{
        this.tempEng2 = value;

        if(this.tempEng2>80 || this.tempIgbt2>80)
        this.tempEng2Class="btn red"

        if(this.tempEng2<=80 && this.tempIgbt2<=80)
        this.tempEng2Class="btn"
      });
    });
  }

  /**
   * Si mette in ascolto sul metodo di tipo Observable getTempEngineThree() e aggiorna dati RealTime
   */
  ascoltaEng3(){
    this._engineService.getTempEngineThree().subscribe(value => {
      this.ngZone.run(() =>{
        this.tempEng3 = value;

        if(this.tempEng3>80 || this.tempIgbt3>80)
        this.tempEng3Class="btn red"

        if(this.tempEng3<=80 && this.tempIgbt3<=80)
        this.tempEng3Class="btn"
      });
    });
  }

  /**
   * Si mette in ascolto sul metodo di tipo Observable getTempEngineFour() e aggiorna dati RealTime
   */
  ascoltaEng4(){
    this._engineService.getTempEngineFour().subscribe(value => {
      this.ngZone.run(() =>{
        this.tempEng4 = value;

        if(this.tempEng3>80 || this.tempIgbt3>80)
        this.tempEng4Class="btn red"

        if(this.tempEng3<=80 && this.tempIgbt3<=80)
        this.tempEng4Class="btn"
      });
    });
  }

  /**
   * Si mette in ascolto sul metodo di tipo Observable getTempIgbtOne() e aggiorna dati RealTime
   */
  ascoltaIgbt1(){
    this._engineService.getTempIgbtOne().subscribe(value => {
      this.ngZone.run(() =>{
        this.tempIgbt1 = value;

        if(this.tempEng1>80 || this.tempIgbt1>80)
        this.tempEng1Class="btn red"

        if(this.tempEng1<=80 && this.tempIgbt1<=80)
        this.tempEng1Class="btn"

      });
    });
  }

  /**
   * Si mette in ascolto sul metodo di tipo Observable getTempIgbtTwo() e aggiorna dati RealTime
   */
  ascoltaIgbt2(){
    this._engineService.getTempIgbtTwo().subscribe(value => {
      this.ngZone.run(() =>{
        this.tempIgbt2 = value;

        if(this.tempEng2>80 || this.tempIgbt2>80)
        this.tempEng2Class="btn red"

        if(this.tempEng2<=80 && this.tempIgbt2<=80)
        this.tempEng2Class="btn"
      });
    });
  }

  /**
   * Si mette in ascolto sul metodo di tipo Observable getTempIgbtThree() e aggiorna dati RealTime
   */
  ascoltaIgbt3(){
    this._engineService.getTempIgbtThree().subscribe(value => {
      this.ngZone.run(() =>{
        this.tempIgbt3 = value;

        if(this.tempEng3>80 || this.tempIgbt3>80)
        this.tempEng3Class="btn red"

        if(this.tempEng3<=80 && this.tempIgbt3<=80)
        this.tempEng3Class="btn"
      });
    });
  }

  /**
   * Si mette in ascolto sul metodo di tipo Observable getTempIgbtFour() e aggiorna dati RealTime
   */
  ascoltaIgbt4(){
    this._engineService.getTempIgbtFour().subscribe(value => {
      this.ngZone.run(() =>{
        this.tempIgbt4 = value;

        if(this.tempEng4>80 || this.tempIgbt4>80)
        this.tempEng4Class="btn red"

        if(this.tempEng4<=80 && this.tempIgbt4<=80)
        this.tempEng4Class="btn"
      });
    });
  }

}
