import {Injectable} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {Observable} from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AppcomponentService {


  constructor(public auth: AngularFireAuth) {

   }

   /**
    * Si mette in ascolto sull'oggetto auth:AngularFireAuth e restituisce un Observable contenente lo stato dell'utente (Logged/ Not logged)
    */
  isLoggedIn(): Observable<boolean>{
    return new Observable(subscriber => {
      this.auth.onAuthStateChanged((user) => {
        if (user)
        {
          subscriber.next(true);
        }
        else
        {
          subscriber.next(false);
        }
      }).then(() => {
        return null;
      });
    });
  }

  /**
   * Aggiorna la password dell'utente attualmente loggato
   * @param newPassword Stringa contenente la nuova password
   */
 async updatePassword(newPassword): Promise<boolean>
  {
    const user = await this.auth.currentUser;
    return await user.updatePassword(newPassword).then(() => {
      return true;
    }).catch((error) => {
      console.log(error.message);
      return false;
    });
  }

/**
 * Restituisce l'utente attualmente loggato
 */
  getCurrentUser()
  {
    try {
      return this.auth.currentUser;
    } catch (error) {
      console.log(error.message);
      return null;
    }
  }

  /**
   * Effettua il logout dell'utente
   */
 async logout()
  {
    return await this.auth.signOut()
     .then(() => {
       return true;
     })
     .catch((error) => {
       console.log(error.message);
       return false;
     });
  }

  /**
   * Effettua il login ottenute le credenziali
   * @param email Stringa contenente l'email dell'utente che sta tentando di effettuare l'accesso
   * @param password Stringa contenente la password dell'utente che sta tentando di effettuato l'accesso
   */
 async myLogin(email, password)
  {
    return await this.auth.signInWithEmailAndPassword(email, password).then(() => {
      return true;
    }).catch( (error) => {
      // Errore in login
      console.log(error.message);
      return false;
    });
  }


}

