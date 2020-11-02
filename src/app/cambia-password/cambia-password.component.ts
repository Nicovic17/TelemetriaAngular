import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

import {  AppcomponentService } from '../appcomponent.service';
import {MatDialog} from '@angular/material/dialog';
import { MatDialogComponent } from '../mat-dialog/mat-dialog.component';

@Component({
  selector: 'app-cambia-password',
  templateUrl: './cambia-password.component.html',
  styleUrls: ['./cambia-password.component.css']
})
export class CambiaPasswordComponent implements OnInit {

  hideNewPassword = true;
  hideConfirmNewPassword = true;
  confirmButtonDisabled = true;
  newPswHasError = true;
  confirmNewPswHasError = true;
  confirmPswDisabled = true;
  newPsw = new FormControl('', [Validators.required, Validators.minLength(5)]);
  confirmNewPsw = new FormControl('', [Validators.required, Validators.minLength(5)]);

  constructor(public _appComponentService: AppcomponentService, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.controllaValiditàFormNewPassword()
    this.controllaValiditàFormConfirmNewPassword()
  }

  /**
   * Controlla che nel form NewPsw venga inserita una password che rispetti i parametri settati
   * Se tutti i form rispettano i parametri, abilita il button per proseguire
   */
  controllaValiditàFormNewPassword()
  {
    this.newPsw.valueChanges.subscribe(val => {
      if (this.newPsw.hasError('required') || this.newPsw.hasError('minlength'))
      {
        this.newPswHasError = true;
      }
      else {
        this.newPswHasError = false;
      }
      if (!this.newPswHasError && !this.confirmNewPswHasError) {this.confirmButtonDisabled = false; }
    });
  }

  /**
   * Controlla che nel form confirmNewPsw venga inserita una password che rispetti i parametri settati
   * Se tutti i form rispettano i parametri, abilita il button per proseguire
   */
  controllaValiditàFormConfirmNewPassword()
  {
    this.confirmNewPsw.valueChanges.subscribe(val => {
      if (this.confirmNewPsw.hasError('required') || this.confirmNewPsw.hasError('minlength'))
      {
        this.confirmNewPswHasError = true;
      }
      else {
      this.confirmNewPswHasError = false;
      }

      if (!this.confirmNewPswHasError && !this.confirmNewPswHasError) {this.confirmButtonDisabled = false; }
    });
  }

  /**
   * Mostra messaggio di errore nel form grafico
   */
  getErrorConfirmNewPsw() {
    if (this.confirmNewPsw.hasError('required')) {
      return 'Campo obbligatorio';
    }

    if (this.confirmNewPsw.hasError('minlength')) {
      return 'Minimo 5 caratteri';
    }
  }

  /**
   * Mostra messaggio di errore nel form grafico
   */
  getErrorNewPsw() {
    if (this.newPsw.hasError('required')) {
      return 'Campo obbligatorio';
    }

    if (this.newPsw.hasError('minlength')) {
      return 'Minimo 5 caratteri';
    }
  }


  /**
   * Effettua l'aggiornamento della password se i campi sono stati compilati correttamente
   */
  async updatePassword() {
    
      let newPassword = this.newPsw.value;
      let newConfirmPassword = this.confirmNewPsw.value;
      if (newPassword === newConfirmPassword)
      {
        let ris = await this._appComponentService.updatePassword(newPassword);
        if (ris)
        {
          this._appComponentService.logout();
          this.showDialog('Aggiornamento effettuato!',
            ['La password è stata  correttamente aggiornata.', 'Effettua nuovamente l\'accesso.']);
        }
        else
        {
          const choice = this.showChoiceDialog('Password NON modificata!',
            ['Per modificare la password è necessario rieffettuare il login.', '.', 'Vuoi Procedere ?']);
          choice.afterClosed().subscribe(result => {
            if (result === 1){
              this._appComponentService.logout();
            }
          });
        }
        this.newPsw.reset()
        this.confirmNewPsw.reset()
      }
      else
      {
        this.showDialog('Errore!', ['Le password non corrispondono']);
      }
    
  }
  /**
   * Apre un messaggio PopUp
   * @param titolo Stringa contenente il titolo del messaggio
   * @param corpo  Array di Stringhe contenente il corpo del messaggio
   */
  showDialog(titolo: string, corpo: string[]){
    this.dialog.open(MatDialogComponent, {
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
   * Apre un messaggio PopUp e restituisce un valore di ritorno alla chiusura
   * @param titolo Stringa contenente il titolo del messaggio
   * @param corpo  Array di Stringhe contenente il corpo del messaggio
   */
  showChoiceDialog(titolo: string, corpo: string[]){
    return this.dialog.open(MatDialogComponent, {
      maxWidth: '400px',
      maxHeight: '400px',
      data: {
        title: titolo,
        body: corpo,
        isChoice: true,
      },
      disableClose: true,
      position: {
        top: '13%',
      },
    });
  }
}

export class DialogElementsExampleDialog {}
