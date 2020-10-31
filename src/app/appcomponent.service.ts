import {Injectable} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {auth} from 'firebase/app';
import {Observable} from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AppcomponentService {


  constructor(public auth: AngularFireAuth) {

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

 async updatePassword(newPassword): Promise<boolean>
  {
    const user = await this.auth.currentUser;
    return await user.updatePassword(newPassword).then(() => {
      return true;
    }).catch(error => {
      return false;
    });
  }


  getCurrentUser()
  {
    try {
     return this.auth.currentUser;
   } catch (error) {
     return null;
   }
  }

 async logout()
  {
   let ris=await this.auth.signOut()
   .then(ris=>{
    return true;
   })
   .catch(error =>{
    return false;
   })

   return ris;

    
  }

 async myLogin(email, password)
  {

    const ris=await this.auth.signInWithEmailAndPassword(email,password).then(function(user)
    {

      return true;
    }).catch(function(error){
      //Errore in login
      return false;
    });

    return ris;
  }


}

