import { Component, OnInit } from '@angular/core';
import {BarsService} from "../bars.service";
import validate = WebAssembly.validate;
import { Observable } from 'rxjs';

@Component({
  selector: 'app-bars-section',
  templateUrl: './bars.component.html',
  styleUrls: ['./bars.component.css']
})
export class BarsComponent implements OnInit {
  throttleValue;
  breakValue : Observable<any>;
  breakValueString : String;
  constructor(private _barsService: BarsService) { }

  ngOnInit(): void {

   

    this._barsService.getThrottleValue().subscribe(value => {
      this.throttleValue = value + "%"
      document.getElementById("throttle").style.width=this.throttleValue;
      document.getElementById("lvlThrottle").innerHTML="Throttle: "+this.throttleValue
    });
    this._barsService.getBreakValue().subscribe((value) =>  this.onDataUpdate(value) );
  }

  onDataUpdate(data : any)
  {
    this.breakValue=data;
    this.breakValueString=this.breakValue + "%";
  }

}
