import { Component, OnInit } from '@angular/core';

import { AngularFirestore } from '@angular/fire/firestore'
import { AngularFireDatabase } from '@angular/fire/database'
import { AngularFireAuth } from '@angular/fire/auth'

import { Observable, from } from 'rxjs'

const url = "https://kit.fontawesome.com/f6b29a4c68.js";



@Component({
  selector: 'app-battery-section',
  templateUrl: './battery-section.component.html',
  styleUrls: ['./battery-section.component.css']
})
export class BatterySectionComponent implements OnInit {

  database: AngularFireDatabase;

  constructor(db: AngularFireDatabase) {

    this.database = db;

    this.ascoltaBatteria();

  }

  ascoltaBatteria() {
    this.database.object("Batteria").snapshotChanges().subscribe(action => {
      this.myBattery(action.payload.val());
    });
  }


  ngOnInit(): void {

    this.loadScript();

  }




  public loadScript() {
    console.log('preparing to load...')
    let node = document.createElement('script');
    node.src = url;
    node.type = 'text/javascript';
    node.async = true;
    node.charset = 'utf-8';
    document.getElementsByTagName('head')[0].appendChild(node);
  }

  myBattery(lvl) {
    let lvlBattery = document.getElementById("lvlBattery");
    lvlBattery.innerHTML = "Batteria: " + lvl + "%"
    let battery = document.getElementById("battery");

    if (lvl <= 100 && lvl > 75) {
      battery.innerHTML = "&#xf240";
    }
    else
      if (lvl <= 75 && lvl > 50) {
        battery.innerHTML = "&#xf241";
      }
      else
        if (lvl <= 50 && lvl > 25) {
          battery.innerHTML = "&#xf242";
        }
        else
          if (lvl <= 25 && lvl > 0) {
            battery.innerHTML = "&#xf243";
          }
          else
            if (lvl == 0) {
              battery.innerHTML = "&#xf244";
            }

    /*setTimeout(function(){
        lvl=lvl-25;
        myBattery(lvl);
    },1000);*/

  }

}
