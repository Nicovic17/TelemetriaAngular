import { Component, NgZone, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialog, MatDialogClose } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AppcomponentService } from '../appcomponent.service';
import { MatDialogComponent } from '../mat-dialog/mat-dialog.component';

@Component({
  selector: 'app-notloggedpage',
  templateUrl: './notloggedpage.component.html',
  styleUrls: ['./notloggedpage.component.css']
})
export class NotloggedpageComponent implements OnInit {

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

  constructor(public _appComponentService: AppcomponentService, private ngZone: NgZone, private router: Router, private matDialog: MatDialog) { }

  ngOnInit(): void {
    this.ascoltaFormPassword()
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
 * Effettua l'autenticazione con la password inserita nel form rispettivo
 * Se la password è errata, mostra un PopUp di errore
 */
 async myLogin(){

  let successLogin=await this._appComponentService.myLogin(this.email.value,this.password.value);

  if(successLogin)
  {
    this.ngZone.run(()=>{
      this.router.navigate(['/loggedpage'])
    })
  }
  else
  {
    this.showDialog('Attenzione!', ['La password inserita non è valida.']);
    return false;
  }
  this.password.reset();
  return true;
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

}
