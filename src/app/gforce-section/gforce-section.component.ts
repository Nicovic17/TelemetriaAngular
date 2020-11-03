import {Component, NgZone, OnInit} from '@angular/core';
import {GforceService} from "../gforce.service";

@Component({
  selector: 'app-gforce-section',
  templateUrl: './gforce-section.component.html',
  styleUrls: ['./gforce-section.component.css']
})
export class GforceSectionComponent implements OnInit {
  public x_axis;  //CENTER 16PX
  public y_axis;  //CENTER -1PX
  public longitudinal;
  public lateral;
  public latDir;

  constructor(private _gforceService: GforceService, private ngZone: NgZone) { }

  ngOnInit(): void {
    this.ascoltaAccLong();
    this.ascoltaAccLat();
  }

   /**
   * Si mette in ascolto sul metodo di tipo Observable getLongitudinalAcc() e aggiorna dati RealTime 
   */
  ascoltaAccLong(){
    this._gforceService.getLongitudinalAcc().subscribe(value => {
      this.ngZone.run(() => {
        this.longitudinal = value;
        this.updateGForce();
      });

    });
  }

   /**
   * Si mette in ascolto sul metodo di tipo Observable getLateralAcc() e aggiorna dati RealTime 
   */
  ascoltaAccLat(){
    this._gforceService.getLateralAcc().subscribe(value => {
      this.ngZone.run(() => {
        if(value==0){
          this.latDir='';
        }else if(value>0){
          this.latDir='R';
        }else{
          this.latDir='L';
        }
        this.lateral = Math.abs(value);
        this.updateGForce();
      });

    });
  }

  /**
   * Aggiorna view componente GForce
   */
  updateGForce(){
    const zeroLat = 47;  // est-ovest 47
    const zeroLong = 48;  // nord-sud 48
    let tempLat;
    if(this.latDir === 'L'){
      tempLat = this.lateral * -5.30612;
    }else{
      tempLat = this.lateral * 5.30612;
    }
    const tempLong = this.longitudinal * -5.30612;
    this.x_axis = zeroLat + tempLat + 'px';
    this.y_axis = zeroLong + tempLong + 'px';

  }


}
