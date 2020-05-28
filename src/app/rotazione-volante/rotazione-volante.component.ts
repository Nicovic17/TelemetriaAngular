import { Component, OnInit } from '@angular/core';

import { AngularFireDatabase } from '@angular/fire/database';

import { VolanteserviceService } from '../volanteservice.service';


@Component({
  selector: 'app-rotazione-volante',
  templateUrl: './rotazione-volante.component.html',
  styleUrls: ['./rotazione-volante.component.css']
})
export class RotazioneVolanteComponent implements OnInit {
  public gradi: number;

  constructor(private _interactionService: VolanteserviceService) { }

  ngOnInit(): void {
    this._interactionService.gradi$.subscribe(
        data => {
          this.gradi = Number(data);
        });
  }
}
