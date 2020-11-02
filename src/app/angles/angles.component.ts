import {Component, NgZone, OnInit} from '@angular/core';
import {ControllerService} from "../controller.service";

@Component({
  selector: 'app-angles',
  templateUrl: './angles.component.html',
  styleUrls: ['./angles.component.css']
})
export class AnglesComponent implements OnInit {
  public rollio;
  public beccheggio;
  public imbardata;
  constructor(private _controllerService: ControllerService, private ngZone: NgZone) { }

  ngOnInit(): void {
    this.ascoltaRollio();
    this.ascoltaImbardata();
    this.ascoltaBeccheggio();
  }

  /**
   * Si mette in ascolto sul metodo di tipo Observable getAngoloRollio() e aggiorna dati RealTime
   */
  ascoltaRollio(){
    this._controllerService.getAngoloRollio().subscribe(value => {
      this.ngZone.run(() => {
        this.rollio = value;
      });
    });
  }
  /**
   * Si mette in ascolto sul metodo di tipo Observable getAngoloBeccheggio() e aggiorna dati RealTime
   */
  ascoltaBeccheggio(){
    this._controllerService.getAngoloBeccheggio().subscribe(value => {
      this.ngZone.run(() => {
        this.beccheggio = value;
      });
    });
  }
  /**
   * Si mette in ascolto sul metodo di tipo Observable getAngoloImbardata() e aggiorna dati RealTime
   */
  ascoltaImbardata(){
    this._controllerService.getAngoloImbardata().subscribe(value => {
      this.ngZone.run(() => {
        this.imbardata = value;
      });
    });
  }

}
