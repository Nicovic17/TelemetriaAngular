import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-spie-controllo',
  templateUrl: './spie-controllo.component.html',
  styleUrls: ['./spie-controllo.component.css']
})
export class SpieControlloComponent implements OnInit {

  //Implementare service con connessione a database per dati corrispondenti
  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit()
  {
    document.getElementById("BMS").classList.add("red")
  }

}
