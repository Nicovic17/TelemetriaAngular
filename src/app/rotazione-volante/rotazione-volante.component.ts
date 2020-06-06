import { Component, OnInit } from '@angular/core';
import { VolanteService } from '../volante.service';


@Component({
  selector: 'app-rotazione-volante',
  templateUrl: './rotazione-volante.component.html',
  styleUrls: ['./rotazione-volante.component.css']
})
export class RotazioneVolanteComponent implements OnInit {
  public gradi;
  public rotation;

  constructor(private _volanteService: VolanteService) { }

  ngOnInit(){
      this.ascoltaVolante();
  }


  ascoltaVolante(){
      this._volanteService.getGradiVolante().subscribe(value => this.updateValues(value) );
  }
  updateValues(value){
      this.gradi = value;
      this.rotation = `rotate(${value}deg)`;
      console.log(this.rotation);
      document.getElementById("deg").innerHTML="Volante " + value + "°"
  }
}
