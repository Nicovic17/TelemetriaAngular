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
  ascoltaRollio(){

  }
  ascoltaBeccheggio(){

  }
  ascoltaImbardata(){

  }

}
