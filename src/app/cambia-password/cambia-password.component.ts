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
  confirmButtonDisabled = true;
  confirmFlag1=true;
  confirmFlag2=true;

  confirmPswDisabled = true;

  newPsw = new FormControl('', [Validators.required, Validators.minLength(5)])
  confirmNewPsw = new FormControl('', [Validators.required, Validators.minLength(5)]);

  constructor(public _appComponentService: AppcomponentService, public dialog:MatDialog) { }

  ngOnInit(): void {

    this.newPsw.valueChanges.subscribe(val=>{
      
      if(this.newPsw.hasError('required') || this.newPsw.hasError('minlength'))
      {
        this.confirmFlag1=true
      }
      else
      this.confirmFlag1=false;

      if(!this.confirmFlag1 && !this.confirmFlag2)this.confirmButtonDisabled=false;
    })

    this.confirmNewPsw.valueChanges.subscribe(val=>{
      if(this.confirmNewPsw.hasError('required') || this.confirmNewPsw.hasError('minlength'))
      {
        this.confirmFlag2=true
      }
      else
      this.confirmFlag2=false;

      if(!this.confirmFlag1 && !this.confirmFlag2)this.confirmButtonDisabled=false;
    })

    

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
        
        var ris=await this._appComponentService.updatePassword(newPassword)
       if(ris)
       {
        this._appComponentService.logout()
        this.newPsw.setValue("");
        this.confirmNewPsw.setValue("")
        this.openDialog()
       }
       else
       {
         window.alert("Aggiornamento password non riuscito")
       }
        
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