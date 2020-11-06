import { Component, NgZone, OnInit } from '@angular/core';

import { BatteryService } from '../battery.service';

// Per utilizzare jQuery in TS
declare var $: any;

// const url="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"

@Component({
    selector: 'app-new-battery',
    templateUrl: './new-battery.component.html',
    styleUrls: ['./new-battery.component.css']
})
export class NewBatteryComponent implements OnInit {
    public dataHV; // Variabile che riferisce alla carica della batteria high voltage
    public dataLV; // Variabile che riferisce alla carica della batteria low voltage
    public correnteHV;
    public correnteLV;
    public tensioneHV;
    public tensioneLV;
    public tmediaHV;
    public tmediaLV;
    public colorLV;
    public colorHV;

    constructor(private _interactionService: BatteryService, private ngZone: NgZone) { }

    ngOnInit(): void {
        this.ascoltaBatteriaHighVoltage();
        this.ascoltaBatteriaLowVoltage();
        this.ascoltaCorrenteHighVoltage();
        this.ascoltaCorrenteLowVoltage();
        this.ascoltaTensioneHighVoltage();
        this.ascoltaTensioneLowVoltage();
        this.ascoltaTMediaHV();
        this.ascoltaTMediaLV();
    }

    /**
   * Si mette in ascolto sul metodo di tipo Observable getBatteriaHighVoltage(), aggiorna dati RealTime
   */
    ascoltaBatteriaHighVoltage() {
        this._interactionService.getBatteriaHighVoltage().subscribe(data => {
            this.ngZone.run(() => {
                this.dataHV = Number(data);
            });
            this.batUpdateHighVoltage();
        });
    }

    /**
   * Si mette in ascolto sul metodo di tipo Observable getBatteriaLowVoltage(), aggiorna dati RealTime
   */
    ascoltaBatteriaLowVoltage() {
        this._interactionService.getBatteriaLowVoltage().subscribe(data => {
            this.ngZone.run(() => {
                this.dataLV = Number(data);
            });
            this.batUpdateLowVoltage();
        });
    }

    /**
   * Si mette in ascolto sul metodo di tipo Observable getCorrenteHighVoltage(), aggiorna dati RealTime
   */
    ascoltaCorrenteHighVoltage() {
        this._interactionService.getCorrenteHighVoltage().subscribe(value => {
            this.ngZone.run(() => {
                this.correnteHV = Number(value);
            });
        });
    }

    /**
   * Si mette in ascolto sul metodo di tipo Observable getCorrenteLowVoltage(), aggiorna dati RealTime
   */
    ascoltaCorrenteLowVoltage() {
        this._interactionService.getCorrenteLowVoltage().subscribe(value => {
            this.ngZone.run(() => {
                this.correnteLV = Number(value);
            });
        });
    }

    /**
   * Si mette in ascolto sul metodo di tipo Observable getTensioneHighVoltage(), aggiorna dati RealTime
   */
    ascoltaTensioneHighVoltage() {
        this._interactionService.getTensioneHighVoltage().subscribe(value => {
            this.ngZone.run(() => {
                this.tensioneHV = Number(value);
            });
        });
    }

    /**
   * Si mette in ascolto sul metodo di tipo Observable getTensioneLowVoltage(), aggiorna dati RealTime
   */
    ascoltaTensioneLowVoltage() {
        this._interactionService.getTensioneLowVoltage().subscribe(value => {
            this.ngZone.run(() => {
                this.tensioneLV = Number(value);
            });
        });
    }

    /**
   * Si mette in ascolto sul metodo di tipo Observable getTempMediaHighVoltage(), aggiorna dati RealTime
   */
    ascoltaTMediaHV() {
        this._interactionService.getTempMediaHighVoltage().subscribe(value => {
            this.ngZone.run(() => {
                this.tmediaHV = value;
            });
        });
    }

    /**
   * Si mette in ascolto sul metodo di tipo Observable getTempMediaLowVoltage(), aggiorna dati RealTime
   */
    ascoltaTMediaLV() {
        this._interactionService.getTempMediaLowVoltage().subscribe(value => {
            this.ngZone.run(() => {
                this.tmediaLV = value;
            });
        });
    }


    /**
     * Aggiorna la vista della batteria HV
     */
    batUpdateHighVoltage() {
        if (this.dataHV < 20) {
            // Red - Danger!
            this.colorHV = ['#750900', '#c6462b', '#b74424', '#df0a00', '#590700'];
        } else if (this.dataHV < 40) {
            // Yellow - Might wanna this.dataHV soon...
            this.colorHV = ['#754f00', '#f2bb00', '#dbb300', '#df8f00', '#593c00'];
        } else {
            // Green - All good!
            this.colorHV = ['#316d08', '#60b939', '#51aa31', '#64ce11', '#255405'];
        }

        $('#battery').css('background-image', 'linear-gradient(to right, transparent 5%, ' + this.colorHV[0] + ' 5%, ' + this.colorHV[0] + ' 7%, '
            + this.colorHV[1] + ' 8%, ' + this.colorHV[1] + ' 10%, ' + this.colorHV[2] + ' 11%, ' + this.colorHV[2] + ' ' + (this.dataHV - 3) + '%, ' + this.colorHV[3] + ' ' + (this.dataHV - 2) + '%, '
            + this.colorHV[3] + ' ' + this.dataHV + '%, ' + this.colorHV[4] + ' ' + this.dataHV + '%, black ' + (this.dataHV + 5)
            + '%, black 95%, transparent 95%), linear-gradient(to bottom, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0.4) ' +
            '4%, rgba(255,255,255,0.2) 7%, rgba(255,255,255,0.2) 14%, rgba(255,255,255,0.8) 14%, ' +
            'rgba(255,255,255,0.2) 40%, rgba(255,255,255,0) 41%, rgba(255,255,255,0) 80%, rgba(255,255,255,0.2) 80%, ' +
            'rgba(255,255,255,0.4) 86%, rgba(255,255,255,0.6) 90%, rgba(255,255,255,0.1) 92%, ' +
            'rgba(255,255,255,0.1) 95%, rgba(255,255,255,0.5) 98%)');
    }

    /**
     * Aggiorna la vista della batteria LV
     */
    batUpdateLowVoltage() {

        if (this.dataLV < 20) {
            // Red - Danger!
            this.colorLV = ['#750900', '#c6462b', '#b74424', '#df0a00', '#590700'];
        } else if (this.dataLV < 40) {
            // Yellow - Might wanna this.dataHV soon...
            this.colorLV = ['#754f00', '#f2bb00', '#dbb300', '#df8f00', '#593c00'];
        } else {
            // Green - All good!
            this.colorLV = ['#316d08', '#60b939', '#51aa31', '#64ce11', '#255405'];
        }

        $('#battery2').css('background-image', 'linear-gradient(to right, transparent 5%, ' + this.colorLV[0] + ' 5%, ' + this.colorLV[0] +
            ' 7%, ' + this.colorLV[1] + ' 8%, ' + this.colorLV[1] + ' 10%, ' + this.colorLV[2] + ' 11%, ' + this.colorLV[2] + ' ' + (this.dataLV - 3) + '%, ' + this.colorLV[3] + ' '
            + (this.dataLV - 2) + '%, ' + this.colorLV[3] + ' ' + this.dataLV + '%, ' + this.colorLV[4] + ' ' + this.dataLV + '%, black ' + (this.dataLV + 5)
            + '%, black 95%, transparent 95%), linear-gradient(to bottom, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0.4) ' +
            '4%, rgba(255,255,255,0.2) 7%, rgba(255,255,255,0.2) 14%, rgba(255,255,255,0.8) 14%, rgba(255,255,255,0.2) ' +
            '40%, rgba(255,255,255,0) 41%, rgba(255,255,255,0) 80%, rgba(255,255,255,0.2) 80%, rgba(255,255,255,0.4) ' +
            '86%, rgba(255,255,255,0.6) 90%, rgba(255,255,255,0.1) 92%, rgba(255,255,255,0.1) 95%, ' +
            'rgba(255,255,255,0.5) 98%)');
    }

}


