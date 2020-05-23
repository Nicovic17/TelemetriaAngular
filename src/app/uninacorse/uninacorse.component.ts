import { Component, OnInit } from '@angular/core';


import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-uninacorse',
  templateUrl: './uninacorse.component.html',
  styleUrls: ['./uninacorse.component.css']
})
export class UninacorseComponent implements OnInit {

  constructor(public auth:AngularFireAuth) {

    this.checkIfUserIsLogged()
   }

  ngOnInit(): void {
  }

  logout()
  {
    this.auth.signOut();
    document.getElementById("uninacorse").style.display="none";
  }

  checkIfUserIsLogged()
  {
    this.auth.onAuthStateChanged(function(user){
      if(user){
          console.log("Loggato");
          console.log(user.email+"");

          document.getElementById("user_div").style.display="none";
          document.getElementById("router").style.display="block";
          //document.getElementById("user_div").style.display="block";
          //document.getElementById("login_div").style.display="none";
          //document.getElementById("router").style.display="none";
         
      }
      else{
        console.log("Non Loggato");

        //document.getElementById("user_div").style.display = "none";
        //document.getElementById("login_div").style.display = "block";
        //document.getElementById("router").style.display="none";
      }
    })
  }

}
