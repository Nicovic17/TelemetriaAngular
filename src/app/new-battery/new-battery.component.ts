import { Component, OnInit } from '@angular/core';

import { BatteryService } from '../battery.service'

//Per utilizzare jQuery in TS
declare var $: any;

var col, colLv;

//const url="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"

@Component({
  selector: 'app-new-battery',
  templateUrl: './new-battery.component.html',
  styleUrls: ['./new-battery.component.css']
})
export class NewBatteryComponent implements OnInit {
    public dataHV; //Variabile che riferisce alla carica della batteria high voltage
    public dataLV; //Variabile che riferisce alla carica della batteria low voltage

    constructor(private _interactionService: BatteryService) {}

    ngOnInit(): void {
        this._interactionService.ascoltaBatteriaHighVoltage().subscribe(data => {
            this.dataHV=Number(data);
            this.batUpdate()
        });
        this._interactionService.ascoltaBatteriaLowVoltage().subscribe(data => {
            this.dataLV=Number(data);
            this.batUpdateLowVoltage()
        });
    }
    //Tramite la variabile this.dataHV si occupa di aggiornare la vista della batteria
    batUpdate(){
        if(this.dataHV<20){
            // Red - Danger!
            col = ["#750900","#c6462b", "#b74424", "#df0a00", "#590700"];
        }else if(this.dataHV<40){
            // Yellow - Might wanna this.dataHV soon...
            col = ["#754f00","#f2bb00", "#dbb300", "#df8f00", "#593c00"];
        }else{
            // Green - All good!
            col = ["#316d08","#60b939", "#51aa31", "#64ce11", "#255405"];
        }

        $("#battery").css("background-image","linear-gradient(to right, transparent 5%, "+col[0]+" 5%, "+col[0]+" 7%, "
            +col[1]+" 8%, "+col[1]+" 10%, "+col[2]+" 11%, "+col[2]+" "+ (this.dataHV-3) +"%, "+col[3]+" "+ (this.dataHV-2) +"%, "
            +col[3]+" "+ this.dataHV +"%, "+col[4]+" "+ this.dataHV +"%, black "+ (this.dataHV+5)
            +"%, black 95%, transparent 95%), linear-gradient(to bottom, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0.4) " +
            "4%, rgba(255,255,255,0.2) 7%, rgba(255,255,255,0.2) 14%, rgba(255,255,255,0.8) 14%, " +
            "rgba(255,255,255,0.2) 40%, rgba(255,255,255,0) 41%, rgba(255,255,255,0) 80%, rgba(255,255,255,0.2) 80%, " +
            "rgba(255,255,255,0.4) 86%, rgba(255,255,255,0.6) 90%, rgba(255,255,255,0.1) 92%, " +
            "rgba(255,255,255,0.1) 95%, rgba(255,255,255,0.5) 98%)");
    }
    batUpdateLowVoltage(){

        /*let lvlBattery = document.getElementById("lvlBattery");
        lvlBattery.innerHTML = "HighVolt: " + this.dataHV + "%    -" + " "+"LowVolt"+ this.dataLV+"%";*/
        //console.log("Charge: ",this.dataHV);
        if(this.dataLV<20){
            // Red - Danger!
            colLv = ["#750900","#c6462b", "#b74424", "#df0a00", "#590700"];
        }else if(this.dataLV<40){
            // Yellow - Might wanna this.dataHV soon...
            colLv = ["#754f00","#f2bb00", "#dbb300", "#df8f00", "#593c00"];
        }else{
            // Green - All good!
            colLv = ["#316d08","#60b939", "#51aa31", "#64ce11", "#255405"];
        }

        $("#battery2").css("background-image","linear-gradient(to right, transparent 5%, "+colLv[0]+" 5%, "+colLv[0]+
            " 7%, "+colLv[1]+" 8%, "+colLv[1]+" 10%, "+colLv[2]+" 11%, "+colLv[2]+" "+ (this.dataLV-3) +"%, "+colLv[3]+" "
            + (this.dataLV-2) +"%, "+colLv[3]+" "+ this.dataLV +"%, "+colLv[4]+" "+ this.dataLV +"%, black "+ (this.dataLV+5)
            +"%, black 95%, transparent 95%), linear-gradient(to bottom, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0.4) " +
                "4%, rgba(255,255,255,0.2) 7%, rgba(255,255,255,0.2) 14%, rgba(255,255,255,0.8) 14%, rgba(255,255,255,0.2) " +
                "40%, rgba(255,255,255,0) 41%, rgba(255,255,255,0) 80%, rgba(255,255,255,0.2) 80%, rgba(255,255,255,0.4) " +
                "86%, rgba(255,255,255,0.6) 90%, rgba(255,255,255,0.1) 92%, rgba(255,255,255,0.1) 95%, " +
                "rgba(255,255,255,0.5) 98%)");
    }

}


