import {Component, NgZone, OnInit} from '@angular/core';
import {  AppcomponentService } from './appcomponent.service';
import * as jQuery from 'jquery';
import { Router } from '@angular/router';

// Permette di salvare valori in formato key-value per la sessione seguente (fino a chiusura browser)
if (sessionStorage.getItem('primoAccesso') === undefined)
{
  sessionStorage.setItem('primoAccesso', 'true');
}

if (sessionStorage.getItem('isInMenu') === undefined)
{
  sessionStorage.setItem('isInMenu', 'true');
}
// Permette di salvare valori in formato key-value localmente sul browser (persistenza finché non rimossi)
if (localStorage.getItem('mostraResize') === undefined)
{
  localStorage.setItem('mostraResize', 'true');
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements  OnInit{
  constructor(public _appComponentService: AppcomponentService, private router: Router, private ngZone: NgZone) {}

  ngOnInit()
  {
    this.stopScrolling();
    this.getCurrentUser();
  }

  /**
   * Controlla se l'utente è autenticato e mostra la view adeguata
   */
   getCurrentUser()
  {
    this._appComponentService.isLoggedIn().subscribe(value => {
      this.showToUser(value);
    });
  }

  /**
   * Mostra la vista all'utente
   * @param userIsLogged : variabile Booleana che rappresenta se l'utente è riuscito ad autenticarsi
   */
  showToUser(userIsLogged)
  {
    if (userIsLogged)
    {
      this.ngZone.run(() => {
        this.router.navigate(['/loggedpage']).then(() => {
          return null;
        });
      });

    }
    else
    {
      this.ngZone.run(() => {
        this.router.navigate(['/notloggedpage']).then(() => {
          return null;
        });
      });
    }
  }

  /**
   * Disattiva lo scroll della pagina
   */
  stopScrolling(){
    const scrollPosition = [
      self.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft,
      self.pageYOffset || document.documentElement.scrollTop  || document.body.scrollTop
    ];
    const html = jQuery('html');
    html.data('scroll-position', scrollPosition);
    html.data('previous-overflow', html.css('overflow'));
    html.css('overflow', 'hidden');
    window.scrollTo(scrollPosition[0], scrollPosition[1]);
  }
}
