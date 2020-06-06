import { Component, OnInit } from '@angular/core';
import {BarsService} from "../bars.service";

@Component({
  selector: 'app-bars-section',
  templateUrl: './bars.component.html',
  styleUrls: ['./bars.component.css']
})
export class BarsComponent implements OnInit {
  throttleValue;
  breakValue;

  constructor(private _barsService: BarsService) { }

  ngOnInit(): void {
    this._barsService.getThrottleValue().subscribe(value => this.throttleValue = value + "%");
    this._barsService.getBreakValue().subscribe(value => this.breakValue = value + "%");
  }

}
