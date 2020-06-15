import { Component } from '@angular/core';

import { AngularFireAuth } from '@angular/fire/auth'

import { auth } from 'firebase/app'
import { Observable } from 'rxjs';
import { RouterLink } from '@angular/router';
import { domainToUnicode } from 'url';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})


export class AppComponent {
  title = 'firebase-auth';

  auth2:AngularFireAuth;

  constructor(public auth: AngularFireAuth) {
    this.auth2=auth;
    this.checkIfUserIsLogged();
  }

  login() {
    this.auth.signInWithPopup(new auth.GoogleAuthProvider());
  }
  logout() {
    this.auth.signOut();
  }

  checkIfUserIsLogged()
  {
    this.auth.onAuthStateChanged(function(user){
      if(user){
          console.log("Loggato");
          console.log(user.email+"");

          document.getElementById("user_div").style.display="block";
          document.getElementById("login_div").style.display="none";
          document.getElementById("router").style.display="none";
         
      }
      else{
        console.log("Non Loggato");

        document.getElementById("user_div").style.display = "none";
        document.getElementById("login_div").style.display = "block";
        document.getElementById("router").style.display="none";
      }
    })
  }

  textUsername:Object;
  textPassword:Object;
  
  myLogin(){
    
    this.textUsername=(document.getElementById("username") as (HTMLInputElement)).value;
    console.log(this.textUsername+"")
    this.textPassword=(document.getElementById("password") as (HTMLInputElement)).value;

    this.auth2.signInWithEmailAndPassword(this.textUsername.toString(),this.textPassword.toString()).catch(function(error){
      //Errore in login
      window.alert("Errore login");
    });
    
  }

  mostra()
  {
    document.getElementById("user_div").style.display="none";
    document.getElementById("router").style.display="block";
  }

  mostraStorico(){
    document.getElementById("user_div").style.display="none";
    document.getElementById("router").style.display="block";

  }

}
