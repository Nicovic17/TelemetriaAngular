import {Component, NgZone, OnInit} from '@angular/core';
import {GforceService} from '../gforce.service';

@Component({
  selector: 'app-gforce-section',
  templateUrl: './gforce-section.component.html',
  styleUrls: ['./gforce-section.component.css']
})
export class GforceSectionComponent implements OnInit {
  public x_axis;
  public y_axis;
  public longitudinal: number;
  public lateral: number;
  public latDir: string;

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
        if (value === 0){
          this.latDir = '';
        }else if (value > 0){
          this.latDir = 'R';
        }else{
          this.latDir = 'L';
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
    const latFixer = 33;
    const longFixer = 34;
    const x = (latFixer / 20) * this.lateral;
    const y = longFixer / 20 * this.longitudinal;
    const fix = Math.abs(this.lateral - this.longitudinal);
    const latFix = Math.abs((x / 20 * fix) - x);
    const longFix = Math.abs((y / 20 * fix) - y);
    let tempLat;

    if (this.latDir === 'L'){
      tempLat = this.lateral * -5.30612;
    }else{
      tempLat = this.lateral * 5.30612;
    }
    const tempLong = this.longitudinal * -5.30612;
    if ((this.latDir === 'L' || this.latDir === '') && this.longitudinal < 0){
      this.x_axis = (zeroLat + tempLat + latFix) + 'px';
      this.y_axis = (zeroLong + tempLong - longFix) + 'px';
    }else if ((this.latDir === 'L' || this.latDir === '') && this.longitudinal >= 0){
      this.x_axis = (zeroLat + tempLat + latFix) + 'px';
      this.y_axis = (zeroLong + tempLong + longFix) + 'px';
    }else if (this.latDir === 'R' && this.longitudinal < 0){
      this.x_axis = (zeroLat + tempLat - latFix) + 'px';
      this.y_axis = (zeroLong + tempLong - longFix) + 'px';
    }else if (this.latDir === 'R' && this.longitudinal >= 0){
      this.x_axis = (zeroLat + tempLat - latFix) + 'px';
      this.y_axis = (zeroLong + tempLong + longFix) + 'px';
    }
  }


}
