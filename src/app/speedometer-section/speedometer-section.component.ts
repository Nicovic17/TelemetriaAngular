
import { Component, OnInit } from '@angular/core';
import { SpeedometerService } from '../speedometer.service';

@Component({
  selector: 'app-speedometer-section',
  templateUrl: './speedometer-section.component.html',
  styleUrls: ['./speedometer-section.component.css']
})
export class SpeedometerSectionComponent implements OnInit {
  private c;
  private ctx;
  private speedGradient;

  constructor(private _speedservice: SpeedometerService) { }

  ngOnInit(): void {
    this.setUpSpeed();
    this.ascoltaSpeed();
  }

  /**
  * Si mette in ascolto sul metodo di tipo Observable getSpeed(), aggiorna dati RealTime e aggiorna vista dello speedometer
  */
  ascoltaSpeed() {
    this._speedservice.getSpeed().subscribe(value => {
      this.drawSpeed(value);
    });
  }

  /**
   * Crea elementi grafici per la rappresentazione dello speedometer
   */
  setUpSpeed() {
    this.c = (document.getElementById("canvas") as HTMLCanvasElement);
    this.c.width = 300;
    this.c.height = 294;
    this.ctx = this.c.getContext("2d");
    //Rescale the size
    this.ctx.scale(0.6, 0.6);

    this.speedGradient = this.ctx.createLinearGradient(0, 0, 500, 500);
    this.speedGradient.addColorStop(0, '#00b8fe');
    this.speedGradient.addColorStop(1, 'red');
  }

  /**
   * Aggiorna la vista dello speedometer
   * @param speed : velocità da rappresentare graficamente
   */
  drawSpeed(speed) {
    const topSpeed = 200;
    // DISEGNA LO SFONDO NERO CIRCOLARE
    this.ctx.clearRect(0, 0, 500, 500);
    this.ctx.beginPath();
    this.ctx.fillStyle = 'rgba(0, 0, 0, .9)';
    this.ctx.arc(250, 250, 240, 0, 2 * Math.PI);
    this.ctx.fill();
    this.ctx.save()
    this.ctx.restore();
    //COLORE CIFRE VELICITà AL CENTRO
    this.ctx.fillStyle = "#FFF";
    this.ctx.stroke();

    this.ctx.beginPath();

    //CERCHIO INTERNO
    this.ctx.arc(250, 250, 100, 0, 2 * Math.PI);
    this.ctx.strokeStyle = "#333"; //COLORE LINEA CERCHIO PICCOLO
    this.ctx.lineWidth = 10; //SPESSORE

    this.ctx.stroke();
    //CREA UN CERCHIO DI CONTORNO INTORNO ALLO SPEEDOMETRO
    this.ctx.beginPath();
    this.ctx.lineWidth = 3;
    this.ctx.arc(250, 250, 240, 0, 2 * Math.PI);
    this.ctx.stroke();

    //SPEED TEXT
    this.ctx.font = "700 70px Open Sans";
    this.ctx.textAlign = "center";
    this.ctx.fillText(speed, 250, 260);
    this.ctx.font = "700 15px Open Sans";
    this.ctx.fillText("Km/h", 250, 280);
    this.ctx.fillStyle = "#FFF"; //COLORE NUMERI INDICATI DALLE LANCETTE
    for (var i = 10; i <= topSpeed; i += 10) {
      console.log();                                                        //Le line multipli di 20 sono + doppie//Fa in modo che vengono scritte solo multipli di 20
      this.drawMiniNeedle(this.calculateSpeedAngle(i / topSpeed, 133.07888, 38.37) * Math.PI, i % 20 == 0 ? 3 : 1, i % 20 == 0 ? i : '');
    }

    //COLORE E ANGOLATURA DELLA STRISCIA LUMINOSA
    this.ctx.beginPath();
    this.ctx.strokeStyle = "#41dcf4";
    this.ctx.lineWidth = 25;
    this.ctx.shadowBlur = 20;
    this.ctx.shadowColor = "#00c6ff";
    this.ctx.strokeStyle = this.speedGradient;
    //this.ctx.arc(x_coord_centr, y_coord_centr, angolo_inizio_striscia, angolo_lancetta)
    this.ctx.arc(250, 250, 228, .668 * Math.PI, this.calculateSpeedAngle(speed / topSpeed, 133.07888, 38.37) * Math.PI);
    this.ctx.stroke();
    //COLORE E ANGOLATURA DELLA LANCETTA
    this.ctx.shadowBlur = 0;
    this.ctx.strokeStyle = '#41dcf4';
    this.speedNeedle(this.calculateSpeedAngle(speed / topSpeed, 133.07888, 38.37) * Math.PI);
  }

  /**
   *
   * @param x
   * @param a
   * @param b
   */
  calculateSpeedAngle(x, a, b) {
    let degree = (a - b) * (x) + b;
    let radian = (degree * Math.PI) / 180;
    return radian <= 2.322 ? radian : 2.322;
  }

  /**
   * DISEGNA LE LINEETTE DELLE VELOCITA'
   * @param rotation
   * @param width
   * @param speed
   */
  drawMiniNeedle(rotation, width, speed) {
    this.ctx.lineWidth = width;
    this.ctx.save();
    this.ctx.translate(250, 250);
    this.ctx.rotate(rotation);
    this.ctx.strokeStyle = "#333";
    this.ctx.fillStyle = "#333";
    this.ctx.strokeRect(-20 / 2 + 220, -1 / 2, 20, 1);
    this.ctx.restore();
    let x = (250 + 180 * Math.cos(rotation));
    let y = (250 + 180 * Math.sin(rotation));
    this.ctx.font = "700 20px Open Sans";
    this.ctx.fillText(speed, x, y);
    rotation += Math.PI / 180;
  }

  /**
   *
   * @param rotation
   */
  speedNeedle(rotation) {
    this.ctx.lineWidth = 2;
    this.ctx.save();
    this.ctx.translate(250, 250);
    this.ctx.rotate(rotation);
    this.ctx.strokeRect(105, -0.5, 135, 1);
    this.ctx.restore();
    rotation += Math.PI / 180;
  }

}
