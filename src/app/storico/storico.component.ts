import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { HostListener } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore'
import { AngularFireDatabase } from '@angular/fire/database'
import { Observable, from } from 'rxjs'
import { ViewEncapsulation } from '@angular/core';

var arrayDate=[];
//Per utilizzare jQuery in TS
declare var $: any;

@Component({
  selector: 'app-storico',
  templateUrl: './storico.component.html',
  styleUrls: ['./storico.component.css'],
  encapsulation: ViewEncapsulation.None
})


export class StoricoComponent implements OnInit {



  //Permette di gestire il click sulla freccia per tornare indietro
  @HostListener('window:popstate', ['$event'])
  onPopState(event) {
    console.log('Back button pressed');
    document.getElementById("user_div").style.display = "block";
    document.getElementById("storico").style.display = "none"
  }

  constructor(public auth: AngularFireAuth, public firebase: AngularFireDatabase) {



    this.checkIfUserIsLogged()


  }

  ngOnInit(): void {


  }

  ngAfterViewInit() {
    document.getElementById("box").style.display="none"
    this.getDate();
  }

  private date=[];

  getDate() {

    document.getElementById("load").innerHTML = "<p>Caricamento dati...</p>";


    var ref = this.firebase.database.ref("Sensori");

    ref.once("value",snap => {
      snap.forEach(function (child){
        //window.alert(child.key+"");
        arrayDate.push(child.key);
      })

      document.getElementById("load").innerHTML="Caricamento completato"
      this.setUpList();
    })
    

  }

  setUpList()
  {
    document.getElementById("box").style.display="block"
    var node=document.createElement("li")
    var text=document.createTextNode("Test2")
    node.appendChild(text)
    $("#listaDate").append("<li><span>1</span>Testo3</li>")
    
    document.getElementById("listaDate").appendChild(node);
    
  }



  checkIfUserIsLogged() {
    this.auth.onAuthStateChanged(function (user) {
      if (user) {
        console.log("Loggato");
        console.log(user.email + "");

        document.getElementById("user_div").style.display = "none";
        document.getElementById("router").style.display = "block";
        //document.getElementById("user_div").style.display="block";
        //document.getElementById("login_div").style.display="none";
        //document.getElementById("router").style.display="none";

      }
      else {
        console.log("Non Loggato");
        document.getElementById("login_div").style.display = "block";
        //document.getElementById("user_div").style.display = "none";
        //document.getElementById("login_div").style.display = "block";
        //document.getElementById("router").style.display="none";
      }
    })
  }

}


