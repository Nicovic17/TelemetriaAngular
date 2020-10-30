import { Component } from '@angular/core';
import { MatDialogComponent } from './mat-dialog/mat-dialog.component';
import {  AppcomponentService } from '../app/appcomponent.service'
import { FormControl, Validators } from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})


export class AppComponent {
  title = 'firebase-auth';
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


    this.getCurrentUser()
  }

  ngAfterViewInit()
  {
    let inputPassword=document.getElementById("inputPassword");

    inputPassword.addEventListener("keyup",event=>{
      if(event.key == "Enter" && !this.loginButtonDisabled)
      {
        this.myLogin();
      }
    })
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
    }
    this.password.reset();
  }

  showRouter()
  {
    document.getElementById("user_div").style.display="none";
    document.getElementById("router").style.display="block";
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
