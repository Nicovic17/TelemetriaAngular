import { Component, NgZone, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AppcomponentService } from '../appcomponent.service';
import { MatDialogComponent } from '../mat-dialog/mat-dialog.component';

@Component({
  selector: 'app-notloggedpage',
  templateUrl: './notlogged.component.html',
  styleUrls: ['./notlogged.component.css']
})
export class NotloggedComponent implements OnInit {
  email = new FormControl({
    value: 'uninacorse@gmail.com',
    disabled: true
  });
  password = new FormControl('', [Validators.required]);
  hideNewPassword = true;
  emailDisabled = true;
  loginButtonDisabled = true;
  isLoading = false;
  constructor(public _appComponentService: AppcomponentService, private ngZone: NgZone,
              private router: Router, private matDialog: MatDialog) { }

  ngOnInit(): void {
    this.ascoltaFormPassword();
  }

  /**
   * Controlla che nel form password venga inserita una password che rispetti i parametri settati
   */
  ascoltaFormPassword()
  {
    this.password.valueChanges.subscribe(() => {
      this.loginButtonDisabled = this.password.hasError('required');
    });
  }

  /**
   * Gestisce la pressione del pulsante Enter
   * @param event: la pressione del pulsante
   */
  handleEvent(event: any)
  {
    if (event.key === 'Enter' && !this.loginButtonDisabled)
    {
      this.myLogin().then(() => null);
    }
  }

  /**
   * Effettua l'autenticazione con la password inserita nel form rispettivo
   * Se la password è errata, mostra un PopUp di errore
   */
  async myLogin(){
    this.isLoading = true;
    const successLogin = await this._appComponentService.myLogin(this.email.value, this.password.value);
    this.isLoading = false;
    if (successLogin)
    {
      this.ngZone.run(() => {
        this.router.navigate(['/loggedpage']);
      });
    }
    else
    {
      this.showDialog('Attenzione!', ['La password inserita non è valida.']);
    }
    this.password.reset();
  }

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
