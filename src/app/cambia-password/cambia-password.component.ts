import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

import {  AppcomponentService } from '../appcomponent.service'
import {MatDialog, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { DialogTestComponent } from '../dialog-test/dialog-test.component';

@Component({
  selector: 'app-cambia-password',
  templateUrl: './cambia-password.component.html',
  styleUrls: ['./cambia-password.component.css']
})
export class CambiaPasswordComponent implements OnInit {
  
  hideNewPassword=true;
  hideConfirmNewPassword=true;
  confirmButtonDisabled = false;
  confirmPswDisabled = true;

  newPsw = new FormControl('', [Validators.required, Validators.minLength(5)])
  confirmNewPsw = new FormControl('', [Validators.required, Validators.minLength(5)]);

  constructor(public _appComponentService: AppcomponentService, public dialog:MatDialog) { }

  ngOnInit(): void {
  }

  openDialog()
  {
    this.dialog.open(DialogTestComponent)
  }

  getErrorConfirmNewPsw() {
    if (this.confirmNewPsw.hasError('required')) {
      return "Campo obbligatorio"
    }

    if (this.confirmNewPsw.hasError('minlength')) {
      return "Minimo 5 caratteri"
    }
  }

  getErrorNewPsw() {
    if (this.newPsw.hasError('required')) {
      return "Campo obbligatorio"
    }

    if (this.newPsw.hasError('minlength')) {
      return "Minimo 5 caratteri"
    }
  }


  async updatePassword() {
    if (this.newPsw.invalid || this.confirmNewPsw.invalid) {
      window.alert("Compilare correttamente i campi")
    }
    else {
      var newPassword = this.newPsw.value;
      var newConfirmPassword = this.confirmNewPsw.value;

      if(newPassword==newConfirmPassword)
      {
        
        this._appComponentService.updatePassword(newPassword)
        this._appComponentService.logout()
        this.newPsw.setValue("");
        this.confirmNewPsw.setValue("")
        this.openDialog()
      }
      else
      {
        window.alert("Password non corrispondenti")
      }
    }

  }

  goBack()
  {
    document.getElementById("user_div").style.display="block";
    document.getElementById("router").style.display="none";
  }
}

export class DialogElementsExampleDialog {}