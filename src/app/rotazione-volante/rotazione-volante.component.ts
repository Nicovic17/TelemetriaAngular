import { Component, OnInit } from '@angular/core';

import { AngularFireDatabase } from '@angular/fire/database'

import { VolanteserviceService } from '../volanteservice.service'


var gradi=10
@Component({
  selector: 'app-rotazione-volante',
  templateUrl: './rotazione-volante.component.html',
  styleUrls: ['./rotazione-volante.component.css']
})
export class RotazioneVolanteComponent implements OnInit {

  constructor(private _interactionService:VolanteserviceService) { }

  ngOnInit(): void {
  }


  ngAfterViewInit()
  {

    this._interactionService.gradi$.subscribe(
      data => {
        console.log("Gradi ottenuti: "+data);
        gradi=Number(data);
        this.ruotaVolante()
        
      })

  }

  ruotaVolante()
  {
    document.getElementById("degrees").innerHTML="Rotazione: "+gradi+"°";
    document.getElementById("volante").style.webkitTransitionDuration="1s"
    document.getElementById("volante").style.webkitTransform="rotate("+gradi+"deg)"
  }

}
