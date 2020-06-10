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

  constructor(private _gforceService: GforceService, private ngZone: NgZone) { }

  ngOnInit(): void {
    this.ascoltaAccLong();
    this.ascoltaAccLat();
  }
  ascoltaAccLong(){
    this._gforceService.getLongitudinalAcc().subscribe(value => {
      this.ngZone.run(() => {
        this.longitudinal = value;
        this.updateGForce();
      });

    });
  }
  ascoltaAccLat(){
    this._gforceService.getLateralAcc().subscribe(value => {
      this.ngZone.run(() => {
        this.lateral = value;
        this.updateGForce();
      });

    });
  }
  updateGForce(){
    const zeroLat = 16;
    const zeroLong = -1;

    let tempLat = this.lateral * 6.78;
    let tempLong = this.longitudinal * -6.78;

      this.x_axis = zeroLat + tempLat + 'px';
      this.y_axis = zeroLong + tempLong + 'px';

  }


}
