import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

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

  formGroup= new FormGroup({

    newPsw : new FormControl('', [Validators.required, Validators.minLength(6)]),
    confirmNewPsw : new FormControl('', [Validators.required, Validators.minLength(6)])
  })

  constructor(public _appComponentService: AppcomponentService, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.ascoltaFormGroup();
  }

  /**
   * Controlla che nel form FormGroup vengano rispettati tutti i vincoli predisposti per ogni formControl
   * Se tutti i form rispettano i parametri, abilita il button per proseguire
   */
  ascoltaFormGroup()
  {
    this.formGroup.get('newPsw').valueChanges.subscribe(() => {
      this.newPswHasError= this.formGroup.get('newPsw').invalid;
      this.confirmButtonDisabled = !(!this.newPswHasError && !this.confirmNewPswHasError);
    });

    this.formGroup.get('confirmNewPsw').valueChanges.subscribe(val=>{
      this.confirmNewPswHasError= this.formGroup.get('confirmNewPsw').invalid;
      this.confirmButtonDisabled = !(!this.newPswHasError && !this.confirmNewPswHasError);
    });
  }

  /**
   * Mostra messaggio di errore nel form grafico
   */
  getErrorConfirmNewPsw() {
    if (this.formGroup.get('confirmNewPsw').hasError('required')) {
      return 'Campo obbligatorio';
    }

    if (this.formGroup.get('confirmNewPsw').hasError('minlength')) {
      return 'Minimo 6 caratteri';
    }
  }

  /**
   * Mostra messaggio di errore nel form grafico
   */
  getErrorNewPsw() {
    if (this.formGroup.get('newPsw').hasError('required')) {
      return 'Campo obbligatorio';
    }

    if (this.formGroup.get('newPsw').hasError('minlength')) {
      return 'Minimo 6 caratteri';
    }
  }


  /**
   * Effettua l'aggiornamento della password se i campi sono stati compilati correttamente
   */
  async updatePassword() {

      const newPassword = this.formGroup.get('newPsw').value;
      const newConfirmPassword = this.formGroup.get('confirmNewPsw').value;
      if (newPassword === newConfirmPassword)
      {
        const ris = await this._appComponentService.updatePassword(newPassword);
        if (ris)
        {
          await this._appComponentService.logout();
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
        this.formGroup.reset();
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
