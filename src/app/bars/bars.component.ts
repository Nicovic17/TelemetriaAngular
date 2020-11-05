import {Component, NgZone, OnInit} from '@angular/core';
import {BarsService} from '../bars.service';

@Component({
  selector: 'app-bars-section',
  templateUrl: './bars.component.html',
  styleUrls: ['./bars.component.css']
})
export class BarsComponent implements OnInit {
  public throttleValue: number;
  public throttleBarPerc: string;
  public breakValue: number;
  public breakBarPerc: string;

  constructor(private _barsService: BarsService, private ngZone: NgZone) { }

  ngOnInit(): void {
    this.ascoltaThrottle();
    this.ascoltaBreak();
  }

  /**
   * Si mette in ascolto sul metodo di tipo Observable getThrottleValue() e aggiorna dati RealTime
   */
  ascoltaThrottle()
  {
    this._barsService.getThrottleValue().subscribe(value => {
      this.ngZone.run(() => {
        this.throttleValue = value;
        this.throttleBarPerc = value + '%';
      });
    });
  }

  /**
   * Si mette in ascolto sul metodo di tipo Observable getBreakValue() e aggiorna dati RealTime
   */
  ascoltaBreak()
  {
    this._barsService.getBreakValue().subscribe(value => {
      this.ngZone.run(() => {
        this.breakValue = value;
        this.breakBarPerc = value + '%';
      });
    });
  }

}
