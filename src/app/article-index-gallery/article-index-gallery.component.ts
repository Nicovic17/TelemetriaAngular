import {AfterViewInit, Component, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {MatDialogComponent} from '../mat-dialog/mat-dialog.component';




@Component({
  selector: 'app-article-index-gallery',
  templateUrl: './article-index-gallery.component.html',
  styleUrls: ['./article-index-gallery.component.css']
})

// Classe principale che contiene tutte le componenti della pagina stato generale

export class ArticleIndexGalleryComponent implements OnInit, AfterViewInit {

  constructor(private matDialog: MatDialog) {}

  ngOnInit(): void {
  }
  ngAfterViewInit(){
    this.setLocalStorageStatoGenerale()
  }

  /**
   * Gestisce le variabili LocalStorage per la visualizzazione dei messaggi di PopUp in stato generale
   */
  setLocalStorageStatoGenerale()
  {
    if (localStorage.getItem('mostraResize') === 'true')
      {
        const choice = this.showChoiceDialog('La seguente applicazione è ottimizzata per schermi di 32\'\'.',
        ['Se necessario, effettuare un resize (zoom out) tramite browser della pagina mostrata.']);
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
  showChoiceDialog(titolo: string, corpo: string[]){
    return this.matDialog.open(MatDialogComponent, {
      maxWidth: '400px',
      maxHeight: '400px',
      data: {
        title: titolo,
        body: corpo,
        resizeOption: true,
        isPersonalized: true
      },
      disableClose: true,
      position: {
        top: '13%',
      },
    });
  }
}


