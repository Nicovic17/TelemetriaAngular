import { Injectable } from '@angular/core';
import {AngularFireDatabase} from '@angular/fire/database';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DiagnosticaService {

  constructor(private db: AngularFireDatabase) { }

  /**
   * Ritorna un oggetto Observable al path del database relativo ai messaggi di diagnostica.
   * L'oggetto notificherà il chiamante per ogni valore presente nel database e per ogni valore
   * aggiunto.
   */
  getDiagMessages(): Observable<string[]>{
    return new Observable<string[]>(subscriber => {
      this.db.database.ref('/diagnostica').on('child_added', child => {
        subscriber.next([child.key, child.val()]);
      });
    });
  }

  /**
   * Ritorna un oggetto Observable al path del database relativo ai messaggi di diagnostica.
   * L'oggetto notificherà il chiamante (una sola volta) il numero di messaggi presenti sul database
   */
  async getMessagesNumber(): Promise<number>{
    let count = 0;
    await this.db.database.ref('/diagnostica').once('value').then(value => {
      count = value.numChildren();
    });
    return count;
  }

  /**
   * Il metodo cancella dal database il messaggio di diagnostica avente come chiave il parametro key
   * @param key: timestamp del messaggio da cancellare
   */
  deleteKey(key){
    this.db.database.ref('/diagnostica/' + key).remove().then(() => {
      console.log('Database key:' + key + ' removal complete.');
    }).catch(reason => {
      console.log('Database removal FAILED reason: ' + reason);
    });
  }
}
