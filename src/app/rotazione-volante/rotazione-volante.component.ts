import {Component, NgZone, OnInit} from '@angular/core';
import { VolanteService } from '../volante.service';


@Component({
  selector: 'app-rotazione-volante',
  templateUrl: './rotazione-volante.component.html',
  styleUrls: ['./rotazione-volante.component.css']
})
export class RotazioneVolanteComponent implements OnInit {
  public gradi;
  public rotation;

  constructor(private _volanteService: VolanteService, private ngZone: NgZone) { }

  ngOnInit(){
      this.ascoltaVolante();
  }


  ascoltaVolante(){
      this._volanteService.getGradiVolante().subscribe(value => {
          this.ngZone.run(() => {
              this.gradi = value;
              this.rotation = `rotate(${value}deg)`;
          })
      } );
  }
}
