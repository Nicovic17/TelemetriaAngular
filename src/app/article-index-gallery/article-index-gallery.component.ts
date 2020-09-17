import { Component, OnInit } from '@angular/core';
import * as jQuery from 'jquery';

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

@Component({
  selector: 'app-article-index-gallery',
  templateUrl: './article-index-gallery.component.html',
  styleUrls: ['./article-index-gallery.component.css']
})

//Classe principale che contiene tutte le componenti della pagina

export class ArticleIndexGalleryComponent implements OnInit {

  constructor() {


  }

  ngOnInit(): void {




  }






}


