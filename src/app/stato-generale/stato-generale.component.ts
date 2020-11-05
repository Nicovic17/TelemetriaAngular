import {AfterViewInit, Component, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {MatDialogComponent} from '../mat-dialog/mat-dialog.component';




@Component({
  selector: 'app-stato-generale',
  templateUrl: './stato-generale.component.html',
  styleUrls: ['./stato-generale.component.css']
})

// Classe principale che contiene tutte le componenti della pagina stato generale

export class StatoGeneraleComponent implements OnInit, AfterViewInit {

  constructor(private matDialog: MatDialog) {}

  ngOnInit(): void {  }
  ngAfterViewInit(){
    this.setLocalStorageStatoGenerale();
  }

  /**
   * Gestisce le variabili LocalStorage per la visualizzazione dei messaggi di PopUp in stato generale
   */
  setLocalStorageStatoGenerale()
  {
    if (localStorage.getItem('mostraResize') === 'true')
      {
        const choice = this.showDialog('La seguente applicazione è ottimizzata per schermi di 23\'\'.',
        ['Se necessario, modificare la grandezza della pagina premendo contemporaneamente i tasti ctrl e +, ctrl e -',
        'fino a quando i 4 rettangoli (in basso a destra), contenenti le temperature dei motori, non sono correttamente contenuti nella pagina.']);
        choice.afterClosed().subscribe(result => {
        if (result === 1){
         localStorage.setItem('mostraResize', 'false');
        }
      });
      }
  }

  /**
   * Apre un messaggio PopUp e restituisce un valore di ritorno alla chiusura
   * @param titolo Stringa contenente il titolo del messaggio
   * @param corpo  Array di Stringhe contenente il corpo del messaggio
   */
  showDialog(titolo: string, corpo: string[]){
    return this.matDialog.open(MatDialogComponent, {
      maxWidth: '400px',
      maxHeight: '400px',
      data: {
        title: titolo,
        body: corpo,
        isChoice: false,
        isPersonalized: true,
        choices: [
          {
            name: 'Chiudi',
            returnValue: 1
          }
        ]
      },
      disableClose: true,
      position: {
        top: '13%',
      }
    });
  }
}


