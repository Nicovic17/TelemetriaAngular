
import { Component, OnInit } from '@angular/core';

import { AngularFirestore } from '@angular/fire/firestore'
import { AngularFireDatabase } from '@angular/fire/database'
import { AngularFireAuth } from '@angular/fire/auth'

import { Observable, from } from 'rxjs'

var c;
var ctx;
var speedGradient;

@Component({
  selector: 'app-speedometer-section',
  templateUrl: './speedometer-section.component.html',
  styleUrls: ['./speedometer-section.component.css']
})
export class SpeedometerSectionComponent implements OnInit {

  database: AngularFireDatabase;

  constructor(db: AngularFireDatabase) {

    this.database = db;
    this.ascoltaSpeed()
  }

  ngOnInit(): void {
    this.setUpSpeed()
  }

  setUpSpeed() {
    c = <HTMLCanvasElement>document.getElementById("canvas");
    c.width = 500;
    c.height = 500;
    ctx = c.getContext("2d");
    //Rescale the size
    ctx.scale(1, 1);

    speedGradient = ctx.createLinearGradient(0, 0, 500, 500);
    speedGradient.addColorStop(0, '#00b8fe');
    //speedGradient.addColorStop(.5, 'yellow');
    speedGradient.addColorStop(1, 'red');
  }

  ascoltaSpeed() {
    this.database.object("Speed").snapshotChanges().subscribe(action => {
      this.drawSpeedo(action.payload.val());
    });
  }



  speedNeedle(rotation) {
    ctx.lineWidth = 2;
    ctx.save();
    ctx.translate(250, 250);
    ctx.rotate(rotation);
    //.strokeRect(distanza_lancetta_centro, inclinazione_lancetta,lunghezza_lancetta,spessore_lancetta)
    ctx.strokeRect(105, -0.5, 135, 1);
    ctx.restore();
    rotation += Math.PI / 180;


  }

  //DISEGNA LE LINEETTE DELLE VELOCITà
  drawMiniNeedle(rotation, width, speed) {
    ctx.lineWidth = width;
    ctx.save();
    ctx.translate(250, 250);
    ctx.rotate(rotation);
    ctx.strokeStyle = "#333";
    ctx.fillStyle = "#333";
    ctx.strokeRect(-20 / 2 + 220, -1 / 2, 20, 1);
    ctx.restore();
    let x = (250 + 180 * Math.cos(rotation));
    let y = (250 + 180 * Math.sin(rotation));
    ctx.font = "700 20px Open Sans";
    ctx.fillText(speed, x, y);
    rotation += Math.PI / 180;
  }

  calculateSpeedAngle(x, a, b) {
    let degree = (a - b) * (x) + b;
    let radian = (degree * Math.PI) / 180;
    return radian <= 2.322 ? radian : 2.322;
  }

  drawSpeedo(speed) {
    var topSpeed = 200;
    // DISEGNA LO SFONDO NERO CIRCOLARE
    ctx.clearRect(0, 0, 500, 500);
    ctx.beginPath();
    ctx.fillStyle = 'rgba(0, 0, 0, .9)';
    ctx.arc(250, 250, 240, 0, 2 * Math.PI);
    ctx.fill();
    ctx.save()
    ctx.restore();
    //COLORE CIFRE VELICITà AL CENTRO
    ctx.fillStyle = "#FFF";
    ctx.stroke();

    ctx.beginPath();

    //CERCHIO INTERNO
    ctx.arc(250, 250, 100, 0, 2 * Math.PI);
    ctx.strokeStyle = "#333"; //COLORE LINEA CERCHIO PICCOLO
    ctx.lineWidth = 10; //SPESSORE 

    ctx.stroke();
    //CREA UN CERCHIO DI CONTORNO INTORNO ALLO SPEEDOMETRO
    ctx.beginPath();
    ctx.lineWidth = 3;
    ctx.arc(250, 250, 240, 0, 2 * Math.PI);
    ctx.stroke();

    //SPEED TEXT
    ctx.font = "700 70px Open Sans";
    ctx.textAlign = "center";
    ctx.fillText(speed, 250, 260);
    ctx.font = "700 15px Open Sans";
    ctx.fillText("Km/h", 250, 280);
    ctx.fillStyle = "#FFF"; //COLORE NUMERI INDICATI DALLE LANCETTE
    for (var i = 10; i <= topSpeed; i += 10) {
      console.log();                                                        //Le line multipli di 20 sono + doppie//Fa in modo che vengono scritte solo multipli di 20
      this.drawMiniNeedle(this.calculateSpeedAngle(i / topSpeed, 133.07888, 38.37) * Math.PI, i % 20 == 0 ? 3 : 1, i % 20 == 0 ? i : '');
    }

    //COLORE E ANGOLATURA DELLA STRISCIA LUMINOSA
    ctx.beginPath();
    ctx.strokeStyle = "#41dcf4";
    ctx.lineWidth = 25;
    ctx.shadowBlur = 20;
    ctx.shadowColor = "#00c6ff";
    ctx.strokeStyle = speedGradient;
    //ctx.arc(x_coord_centr, y_coord_centr, angolo_inizio_striscia, angolo_lancetta)
    ctx.arc(250, 250, 228, .668 * Math.PI, this.calculateSpeedAngle(speed / topSpeed, 133.07888, 38.37) * Math.PI);
    ctx.stroke();
    //COLORE E ANGOLATURA DELLA LANCETTA
    ctx.shadowBlur = 0;
    ctx.strokeStyle = '#41dcf4';
    this.speedNeedle(this.calculateSpeedAngle(speed / topSpeed, 133.07888, 38.37) * Math.PI);
  }

}
