
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
    this.c = (document.getElementById('canvas') as HTMLCanvasElement);
    this.c.width = 300;
    this.c.height = 300;
    this.ctx = this.c.getContext('2d');
    // Rescale the size
    this.ctx.scale(1, 1);

    this.speedGradient = this.ctx.createLinearGradient(0, 0, 300, 300);
    this.speedGradient.addColorStop(0, '#00b8fe');
    this.speedGradient.addColorStop(1, 'red');
  }

  /**
   * Funzione che renderizza l'intero speedometro viene utilizzata anche per aggiornarlo
   * @param speed  velocità da rappresentare graficamente
   */
  drawSpeed(speed) {
    const topSpeed = 200;
    // DISEGNA LO SFONDO NERO CIRCOLARE
    this.ctx.clearRect(0, 0, 300, 300);
    this.ctx.beginPath();
    this.ctx.fillStyle = 'rgba(0, 0, 0, .9)';
    this.ctx.arc(150, 150, 145, 0, 2 * Math.PI);
    this.ctx.fill();
    this.ctx.save();
    this.ctx.restore();
    // COLORE CIFRE VELICITà AL CENTRO
    this.ctx.fillStyle = '#FFF';
    this.ctx.stroke();

    this.ctx.beginPath();

    //CERCHIO INTERNO
    this.ctx.arc(150, 150, 60, 0, 2 * Math.PI);
    this.ctx.strokeStyle = '#333'; // COLORE LINEA CERCHIO PICCOLO
    this.ctx.lineWidth = 6; // SPESSORE

    this.ctx.stroke();
    // CREA UN CERCHIO DI CONTORNO INTORNO ALLO SPEEDOMETRO
    this.ctx.beginPath();
    this.ctx.lineWidth = 2;
    this.ctx.arc(150, 150, 145, 0, 2 * Math.PI);
    this.ctx.stroke();

    //SPEED TEXT
    this.ctx.font = '700 40px Open Sans';
    this.ctx.textAlign = 'center';
    this.ctx.fillText(speed, 150, 150); // posizione testo velocità al centro
    this.ctx.font = '700 15px Open Sans';
    this.ctx.fillText('Km/h', 150, 180);
    this.ctx.fillStyle = '#FFF'; //COLORE NUMERI INDICATI DALLE LANCETTE
    for (let i = 10; i <= topSpeed; i += 10) {
      // Le line multipli di 20 sono + doppie//Fa in modo che vengono scritte solo multipli di 20
      this.drawMiniNeedle(this.calculateSpeedAngle(i / topSpeed, 133.07888, 38.37) * Math.PI, i % 20 == 0 ? 2 : 1, i % 20 == 0 ? i : '');
    }

    // COLORE E ANGOLATURA DELLA STRISCIA LUMINOSA
    this.ctx.beginPath();
    this.ctx.strokeStyle = '#41dcf4';
    this.ctx.lineWidth = 16;
    this.ctx.shadowBlur = 9;
    this.ctx.shadowColor = '#00c6ff';
    this.ctx.strokeStyle = this.speedGradient;
    // this.ctx.arc(x_coord_centr, y_coord_centr, angolo_inizio_striscia, angolo_lancetta)
    this.ctx.arc(150, 150, 137, .668 * Math.PI, this.calculateSpeedAngle(speed / topSpeed, 133.07888, 38.37) * Math.PI);
    this.ctx.stroke();
    // COLORE E ANGOLATURA DELLA LANCETTA
    this.ctx.shadowBlur = 0;
    this.ctx.strokeStyle = '#41dcf4';
    this.speedNeedle(this.calculateSpeedAngle(speed / topSpeed, 133.07888, 38.37) * Math.PI);
  }

  /**
   * Funzione che calcola l'angolo per posizionare un valore di velocità, in base alla velocità
   * attuale e quella massima
   * @param x valore rapporto tra valore velocità e velocità massima
   * @param a indica fino a che angolo devono uscire i valori
   * @param b indica da che angolo devono iniziare i valori
   */
  calculateSpeedAngle(x, a, b) {
    const degree = (a - b) * (x) + b;
    const radian = (degree * Math.PI) / 180;
    return radian <= 2.322 ? radian : 2.322;
  }

  /**
   * DISEGNA LE LINEETTE DELLE VELOCITA'
   * Questa funzione viene chiamata da un ciclo for n volta in base a quante lineette della velocità si vogliono
   * rappresentare.
   * @param rotation indica l'angolatura alla quale disegnare la lineetta
   * @param width indica lo spessore della lineetta
   * @param speed indica la velocità da assegnare alla lineetta
   */
  drawMiniNeedle(rotation, width, speed) {
    this.ctx.lineWidth = width;
    this.ctx.save();
    this.ctx.translate(150, 150);
    this.ctx.rotate(rotation);
    this.ctx.strokeStyle = '#333';
    this.ctx.fillStyle = '#333';
    this.ctx.strokeRect(-20 / 2 + 135, -1 / 2, 14, 1);
    this.ctx.restore();
    const x = (150 + 110 * Math.cos(rotation));
    const y = (150 + 110 * Math.sin(rotation));
    this.ctx.font = '700 12px Open Sans';
    this.ctx.fillText(speed, x, y);
    rotation += Math.PI / 180;
  }

  /**
   * Questa funzione disegna la linea che segna la velocità attuale.
   * @param rotation indica l'angolatura alla quale la lineetta deve trovarsi
   */
  speedNeedle(rotation) {
    this.ctx.lineWidth = 1;
    this.ctx.save();
    this.ctx.translate(150, 150);
    this.ctx.rotate(rotation);
    // posiziona la freccia che punta alla velocità corrente
    this.ctx.strokeRect(64, -0.5, 80, 1);
    this.ctx.restore();
    rotation += Math.PI / 180;
  }

}
