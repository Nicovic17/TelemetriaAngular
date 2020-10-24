import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

import {  AppcomponentService } from '../appcomponent.service';
import {MatDialog, MAT_DIALOG_DATA} from '@angular/material/dialog';
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
  confirmFlag1 = true;
  confirmFlag2 = true;

  confirmPswDisabled = true;

  newPsw = new FormControl('', [Validators.required, Validators.minLength(5)]);
  confirmNewPsw = new FormControl('', [Validators.required, Validators.minLength(5)]);

  constructor(public _appComponentService: AppcomponentService, public dialog: MatDialog) { }

  ngOnInit(): void {

    this.newPsw.valueChanges.subscribe(val => {

      if (this.newPsw.hasError('required') || this.newPsw.hasError('minlength'))
      {
        this.confirmFlag1 = true;
      }
      else {
      this.confirmFlag1 = false;
      }

      if (!this.confirmFlag1 && !this.confirmFlag2) {this.confirmButtonDisabled = false; }
    });

    this.confirmNewPsw.valueChanges.subscribe(val => {
      if (this.confirmNewPsw.hasError('required') || this.confirmNewPsw.hasError('minlength'))
      {
        this.confirmFlag2 = true;
      }
      else {
      this.confirmFlag2 = false;
      }

      if (!this.confirmFlag1 && !this.confirmFlag2) {this.confirmButtonDisabled = false; }
    });



  }

  getErrorConfirmNewPsw() {
    if (this.confirmNewPsw.hasError('required')) {
      return 'Campo obbligatorio';
    }

    if (this.confirmNewPsw.hasError('minlength')) {
      return 'Minimo 5 caratteri';
    }
  }

  getErrorNewPsw() {
    if (this.newPsw.hasError('required')) {
      return 'Campo obbligatorio';
    }

    if (this.newPsw.hasError('minlength')) {
      return 'Minimo 5 caratteri';
    }
  }


  async updatePassword() {
    if (this.newPsw.invalid || this.confirmNewPsw.invalid) {
      this.showDialog('Errore!', ['Compilare correttamente i cambi']);
    }
    else {
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
        this.newPsw.setValue('');
        this.confirmNewPsw.setValue('');
      }
      else
      {
        this.showDialog('Errore!', ['Le password non corrispondono']);
      }
    }
  }
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
