import { Component } from '@angular/core';
import { MatDialogComponent } from './mat-dialog/mat-dialog.component';
import {  AppcomponentService } from '../app/appcomponent.service'
import { FormControl, Validators } from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import * as jQuery from 'jquery';

//Permette di salvare valori in formato key-value per la sessione seguente (fino a chiusura browser)
if(sessionStorage.getItem("primoAccesso")==undefined)
{
  sessionStorage.setItem("primoAccesso","true");
}

if(sessionStorage.getItem("isInMenu")==undefined)
{
  sessionStorage.setItem("isInMenu","true");
}

//Permette di salvare valori in formato key-value localmente sul browser (persistenza finché non rimossi)
if(localStorage.getItem("mostraResize")==undefined)
{
  localStorage.setItem("mostraResize","true");
}





@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})


export class AppComponent {
  title = 'UninaCorse E-Team';
  nomeUtente=new FormControl({
    value: "UninaCorse",
    disabled: true
  })
   email = new FormControl({
    value: "uninacorse@gmail.com",
    disabled: true
  })
  password = new FormControl('', [Validators.required])
  userIsLogged:any;
  hideNewPassword=true;
  emailDisabled=true;
  loginButtonDisabled=true;

  constructor(public _appComponentService: AppcomponentService, private matDialog: MatDialog) {
  }

  ngOnInit()
  {
    this.stopScrolling();
    this.ascoltaFormPassword()
    this.getCurrentUser()
  }

  /**
   * Controlla che nel form password venga inserita una password che rispetti i parametri settati
   */
  ascoltaFormPassword()
  {
    this.password.valueChanges.subscribe(val=>{
      if(this.password.hasError('required'))
      {
        this.loginButtonDisabled=true
        document.getElementById("loginButton").classList.remove("myButton");
      }
      else
      {
        this.loginButtonDisabled=false;
        document.getElementById("loginButton").classList.add("myButton");
      }
    })
  }

  /**
   * Gestisce l'evento "Enter" ottenuto dalla tastiera
   * @param event : evento ottenuto dalla tastiera
   */
  handleEvent(event: any)
  {
    if(event.key == "Enter" && !this.loginButtonDisabled)
    {
      this.myLogin();
      return true;
    }
    return false;
  }

  /**
   * Controlla se l'utente è autenticato e mostra la view adeguata
   */
   getCurrentUser()
  {
    this._appComponentService.isLoggedIn().subscribe(value=>{
      this.showToUser(value)
    })
  }

  /**
   * Effettua il logout e gestisce le variabili di localStorage
   */
  logout() {
    this._appComponentService.logout();
    localStorage.setItem("mostraResize","true")
    return true;
  }

  /**
   * Mostra la vista all'utente
   * @param userIsLogged : variabile Booleana che rappresenta se l'utente è riuscito ad autenticarsi
   */
  showToUser(userIsLogged)
  {
    if(userIsLogged)
    {
      document.getElementById("user_div").style.display = "block";
      document.getElementById("login_div").style.display = "none";
      document.getElementById("router").style.display="none";
    }
    else
    {
        document.getElementById("user_div").style.display = "none";
        document.getElementById("login_div").style.display = "block";
        document.getElementById("router").style.display="none";
    }
  }

/**
 * Effettua l'autenticazione con la password inserita nel form rispettivo
 * Se la password è errata, mostra un PopUp di errore
 */
 async myLogin(){

    let successLogin=await this._appComponentService.myLogin(this.email.value,this.password.value);

    if(successLogin)
    {
          document.getElementById("user_div").style.display="block";
          document.getElementById("login_div").style.display="none";
          document.getElementById("router").style.display="none";
    }
    else
    {

      document.getElementById("user_div").style.display = "none";
      document.getElementById("login_div").style.display = "block";
      document.getElementById("router").style.display="none";
      this.showDialog('Attenzione!', ['La password inserita non è valida.']);
      return false;
    }
    this.password.reset();
    return true;
  }

/**
 * Mostra i routerLink
 */
  showRouter()
  {
    document.getElementById("user_div").style.display="none";
    document.getElementById("router").style.display="block";
  }

   /**
   * Apre un messaggio PopUp
   * @param titolo Stringa contenente il titolo del messaggio
   * @param corpo  Array di Stringhe contenente il corpo del messaggio
   */
  showDialog(titolo: string, corpo: string[]){
    this.matDialog.open(MatDialogComponent, {
      maxWidth: '400px',
      maxHeight: '400px',
      data: {
        title: titolo,
        body: corpo,
      },
      disableClose: true,
      position: {
        top: '13%',
      },
    });
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
