import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth'
import { auth } from 'firebase/app'
import { Observable } from 'rxjs';
import { RouterLink } from '@angular/router';
import { domainToUnicode } from 'url';

import {  AppcomponentService } from '../app/appcomponent.service'
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {MatDialog, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { MatDialogComponent } from '../app/mat-dialog/mat-dialog.component';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})


export class AppComponent {
  title = 'firebase-auth';
  email = new FormControl({
    value: "uninacorse@gmail.com",
    disabled: true
  })
  password = new FormControl('', [Validators.required])
  userIsLogged:any;
  hideNewPassword=true;
  emailDisabled=true;
  loginButtonDisabled=true;


  constructor(public auth: AngularFireAuth, public _appComponentService: AppcomponentService, public dialog: MatDialog) {

  }

  ngOnInit()
  {
    this.password.valueChanges.subscribe(val=>{
      if(this.password.hasError('required'))
      {
        //document.getElementById("loginButton").classList.remove("myHover")
        this.loginButtonDisabled=true
      }
      else
      {
        //document.getElementById("loginButton").classList.add("myHover")
        this.loginButtonDisabled=false;
      }
    })


    this.getCurrentUser()
  }

   getCurrentUser()
  {
    this._appComponentService.isLoggedIn().subscribe(value=>{
      this.showToUser(value)
    })
  }

  login() {
    this._appComponentService.login()
  }
  logout() {
    this._appComponentService.logout();
  }

  showToUser(userIsLogged)
  {
    if(userIsLogged)
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
    }
  }

  textUsername:Object;
  textPassword:Object;
  successLogin:any;
 async myLogin(){

    //this.textUsername=(document.getElementById("username") as (HTMLInputElement)).value;
    //console.log(this.textUsername+"")
    //this.textPassword=(document.getElementById("password") as (HTMLInputElement)).value;

    this.successLogin=await this._appComponentService.myLogin(this.email.value,this.password.value);

    if(this.successLogin)
    {
          document.getElementById("user_div").style.display="block";
          document.getElementById("login_div").style.display="none";
          document.getElementById("router").style.display="none";
    }
    else
    {

      this.showDialog('Errore autenticazione!',
            ['Password errata.']);

      document.getElementById("user_div").style.display = "none";
      document.getElementById("login_div").style.display = "block";
      document.getElementById("router").style.display="none";
    }
    this.password.reset();
  }

  showRouter()
  {
    document.getElementById("user_div").style.display="none";
    document.getElementById("router").style.display="block";
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

}
