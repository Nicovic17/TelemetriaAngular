import {AfterViewInit, Component, OnInit} from '@angular/core';
import * as jQuery from 'jquery';
import {MatDialog} from '@angular/material/dialog';
import {MatDialogComponent} from '../mat-dialog/mat-dialog.component';




@Component({
  selector: 'app-article-index-gallery',
  templateUrl: './stato-generale.component.html',
  styleUrls: ['./stato-generale.component.css']
})

// Classe principale che contiene tutte le componenti della pagina

export class StatoGeneraleComponent implements OnInit, AfterViewInit {

  constructor(private matDialog: MatDialog) {}

  ngOnInit(): void {
  }
  ngAfterViewInit(){
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


