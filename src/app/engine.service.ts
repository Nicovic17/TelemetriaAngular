import { Injectable } from '@angular/core';
import {AngularFireDatabase} from "@angular/fire/database";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class EngineService {

  constructor(private db: AngularFireDatabase) { }

  getTempEngineOne(): Observable<number>{
    return new Observable<number>(subscriber => {
      this.db.database.ref('storico/287').limitToLast(1).on("child_added", value => {
        subscriber.next(value.val());
      });
    });
  }
  getTempEngineTwo(): Observable<number>{
    return new Observable<number>(subscriber => {
      this.db.database.ref('storico/288').limitToLast(1).on("child_added", value => {
        subscriber.next(value.val());
      });
    });
  }
  getTempEngineThree(): Observable<number>{
    return new Observable<number>(subscriber => {
      this.db.database.ref('storico/289').limitToLast(1).on("child_added", value => {
        subscriber.next(value.val());
      });
    });
  }
  getTempEngineFour(): Observable<number>{
    return new Observable<number>(subscriber => {
      this.db.database.ref('storico/290').limitToLast(1).on("child_added", value => {
        subscriber.next(value.val());
      });
    });
  }
  getTempIgbtOne(): Observable<number>{
    return new Observable<number>(subscriber => {
      this.db.database.ref('storico/292').limitToLast(1).on("child_added", value => {
        subscriber.next(value.val());
      });
    });
  }
  getTempIgbtTwo(): Observable<number>{
    return new Observable<number>(subscriber => {
      this.db.database.ref('storico/293').limitToLast(1).on("child_added", value => {
        subscriber.next(value.val());
      });
    });
  }
  getTempIgbtThree(): Observable<number>{
    return new Observable<number>(subscriber => {
      this.db.database.ref('storico/294').limitToLast(1).on("child_added", value => {
        subscriber.next(value.val());
      });
    });
  }
  getTempIgbtFour(): Observable<number>{
    return new Observable<number>(subscriber => {
      this.db.database.ref('storico/295').limitToLast(1).on("child_added", value => {
        subscriber.next(value.val());
      });
    });
  }
}
