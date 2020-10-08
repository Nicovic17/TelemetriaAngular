import { Injectable } from '@angular/core';
import { AngularFireDatabase } from "@angular/fire/database";
import { StoricoComponent } from './storico/storico.component';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import { DialogTestComponent } from '../app/dialog-test/dialog-test.component';
import {Observable} from 'rxjs';



class StrutturaSensori {
  id: string;
  info: Map<number, number>;
}
@Injectable({
  providedIn: 'root'
})
export class StoricoDueService {
  positionSensorId: string = "010"; //DOVREBBE ESSERE PRESO DALLA MAPPA DEI SENSORI
  sensori: Array<StrutturaSensori> = new Array<StrutturaSensori>();
  constructor(private db: AngularFireDatabase, public dialog: MatDialog) {}

  async getAviableSensors(oraI: Date, oraF: Date): Promise<StrutturaSensori[]>{
    this.sensori.splice(0, this.sensori.length);
    const oraInizNum = oraI.getTime();
    const oraFineNum = oraF.getTime();
    await this.db.database.ref('storico').once('value').then(value => {
      value.forEach(child => {
        const tempMap = new Map<number, number>();
        child.forEach(nephew => {
          if(Number(nephew.key) >= oraInizNum && Number(nephew.key) <= oraFineNum){
            tempMap.set(Number(nephew.key), nephew.val());
          }
        });
        if(tempMap.size > 0 && child.key !== this.positionSensorId) {
          this.sensori.push({id: child.key, info: tempMap});
        }
      });
    });
    return this.sensori;
  }

  async getSensorsMap(): Promise<Map<string, string>>{
    const map: Map<string, string> = new Map<string, string>();
    await this.db.database.ref('mappa').once('value').then(value => {
      value.forEach(sensor => {
        map.set(sensor.val(), sensor.key);
      });
    });
    return map;
  }
}
