import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth'
import { auth, User } from 'firebase/app'
import { Observable } from 'rxjs';
import { AppComponent } from '../app/app.component'
import { take, map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class AppcomponentService {

 
  constructor(public auth: AngularFireAuth, public appComponent: AppComponent) {

   }

  isLoggedIn():Observable<boolean>{

    return new Observable(subscriber=>{
      this.auth.onAuthStateChanged((user)=>{
        if(user)
        {
          subscriber.next(true)
        }
        else
        {
          subscriber.next(false);
        }
        
      })
    })
  }


  login()
  {
    this.auth.signInWithPopup(new auth.GoogleAuthProvider());
  }

  logout()
  {
    this.auth.signOut();
  }

 async myLogin(email, password)
  {

    const ris=await this.auth.signInWithEmailAndPassword(email,password).then(function(user)
    {
      
      return true;
    }).catch(function(error){
      //Errore in login
      window.alert("Errore login");
      return false;
    });

    return ris;
  }
}
