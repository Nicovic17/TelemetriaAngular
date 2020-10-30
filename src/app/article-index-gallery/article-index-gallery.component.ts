import { Component, OnInit } from '@angular/core';
import * as jQuery from 'jquery';
import {MatDialog} from '@angular/material/dialog';
import { MatDialogComponent } from '../mat-dialog/mat-dialog.component';



@Component({
  selector: 'app-article-index-gallery',
  templateUrl: './article-index-gallery.component.html',
  styleUrls: ['./article-index-gallery.component.css']
})

//Classe principale che contiene tutte le componenti della pagina

export class ArticleIndexGalleryComponent implements OnInit {

  constructor(private matDialog: MatDialog) {}

  ngOnInit(): void {
    this.stopScrolling();
  }
  ngAfterViewInit(){
    /*alert("Attenzione! Non è stata ancora implementata una funzionalità di resizing automatico." +
      " Per ottenere una visualizzazione ottimale della schermata, modificare la grandezza degli elementi con " +
      "la combinazione di tasti Ctrl + & Ctrl - ");*/
      if(localStorage.getItem("mostraResize") == "true")
      {
        const choice = this.showChoiceDialog('La seguente applicazione è ottimizzata per schermi di 32\'\'.',
        ["Se necessario, effettuare un resize (zoom out) tramite browser della pagina mostrata."]);
        choice.afterClosed().subscribe(result => {
        if (result === 1){
         localStorage.setItem("mostraResize","false");
        }
      });
      }
      
  }
  stopScrolling(){
    //Inizio Modulo disattivazione scroll della pagina
    var scrollPosition = [
      self.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft,
      self.pageYOffset || document.documentElement.scrollTop  || document.body.scrollTop
    ];
    var html = jQuery('html');
    html.data('scroll-position', scrollPosition);
    html.data('previous-overflow', html.css('overflow'));
    html.css('overflow', 'hidden');
    window.scrollTo(scrollPosition[0], scrollPosition[1]);
    //Fine modulo
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


