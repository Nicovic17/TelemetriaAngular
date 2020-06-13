import {Component, NgZone, OnInit} from '@angular/core';
import {EngineService} from "../engine.service";

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
    })

  }
  ascoltaEng1(){
    this._engineService.getTempEngineOne().subscribe(value => {
      this.tempEng1 = value;
    });
  }
  ascoltaEng2(){
    this._engineService.getTempEngineTwo().subscribe(value => {
      this.tempEng2 = value;
    });
  }
  ascoltaEng3(){
    this._engineService.getTempEngineThree().subscribe(value => {
      this.tempEng3 = value;
    });
  }
  ascoltaEng4(){
    this._engineService.getTempEngineFour().subscribe(value => {
      this.tempEng4 = value;
    });
  }
  ascoltaIgbt1(){
    this._engineService.getTempIgbtOne().subscribe(value => {
      this.tempIgbt1 = value;
    });
  }
  ascoltaIgbt2(){
    this._engineService.getTempIgbtTwo().subscribe(value => {
      this.tempIgbt2 = value;
    });
  }
  ascoltaIgbt3(){
    this._engineService.getTempIgbtThree().subscribe(value => {
      this.tempIgbt3 = value;
    });
  }
  ascoltaIgbt4(){
    this._engineService.getTempIgbtFour().subscribe(value => {
      this.tempIgbt4 = value;
    });
  }

}
