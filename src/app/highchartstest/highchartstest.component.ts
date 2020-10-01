import { Component, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts'
import {ControllerService} from "../controller.service";
import {DiagnosticaService} from "../diagnostica.service";

declare var require: any;
let Boost = require('highcharts/modules/boost');
let noData = require('highcharts/modules/no-data-to-display');
let More = require('highcharts/highcharts-more');

Boost(Highcharts);
noData(Highcharts);
More(Highcharts);
noData(Highcharts);

@Component({
  selector: 'app-highchartstest',
  templateUrl: './highchartstest.component.html',
  styleUrls: ['./highchartstest.component.css']
})
export class HighchartstestComponent implements OnInit {
    public options: any = {
        chart: {
            type: 'line',
            height: 300
        },
        title: {
            text: 'Sample Plot'
        },
        credits: {
            enabled: false
        },
        tooltip: {
            formatter: function() {
                return 'x: ' + Highcharts.dateFormat('%e %b %y %H:%M:%S', this.x) +
                    'y: ' + this.y.toFixed(2);
            }
        },
        xAxis: {
            type: 'datetime',
            labels: {
                formatter: function() {
                    return Highcharts.dateFormat('%H %M %S', this.value);
                }
            }
        },
        series: [
            {
                name: 'Normal',
                //turboThreshold: 500000,
                data: []
            }
        ]
    }
    constructor(public _service: DiagnosticaService) { }
    ngOnInit(): void {
        this.getData();
        this.getData2();
    }

    getData(){
        let arrayData = [];
        this._service.getCronologySensorData("004").subscribe(dbData => {
            console.log(dbData);
            dbData.forEach((value, key) => {
                console.log(this.convertDate(key));
                arrayData.push([Number(key), value]);
            });
            console.log(arrayData);
            this.options.series[0]['data'] = arrayData;
            Highcharts.chart('chart1',this.options);
        });
    }
    getData2(){
        let arrayData = [];
        this._service.getCronologySensorData("001").subscribe(dbData => {
            console.log(dbData);
            dbData.forEach((value, key) => {
                console.log(this.convertDate(key));
                arrayData.push([Number(key), value]);
            });
            console.log(arrayData);
            this.options.series[0]['data'] = arrayData;
            Highcharts.chart('chart2',this.options);
        });
    }
    convertDate(time: number): number{
        let stamp = new Date(time);
        return stamp.getTime();
    }


}
