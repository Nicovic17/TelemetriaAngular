import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { HostListener } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore'
import { AngularFireDatabase } from '@angular/fire/database'
import { Observable, from } from 'rxjs'
import { ViewEncapsulation } from '@angular/core';
import { StoricoService } from '../storico.service'


var arrayDate = [];
var dateSelezionate = [];
var arraySensori = [];
var sensoriSelezionati = [];
var arrayIdSalvati = [];
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

  constructor(public auth: AngularFireAuth, public firebase: AngularFireDatabase, private _storicoService: StoricoService) {

    this.checkIfUserIsLogged()
  }

  ngOnInit(): void {


  }

  ngAfterViewInit() {
    document.getElementById("box").style.display = "none"
    document.getElementById("btnJson").style.display = "none"
    document.getElementById("btnConfermaID").style.display = "none"
    document.getElementById("btnJsonID").style.display = "none"
    document.getElementById("btnAvanti").style.display = "none"
    window.alert("Attendi il caricamento delle date...");
    document.getElementById("load").innerHTML = "<p>Caricamento dati...</p>";
    this._storicoService.getDate()
  }

  private date = []; 

  getDate() {
    document.getElementById("btnCaricaDate").style.display="none"
    document.getElementById("btnAvanti").style.display = "block"
    
    arrayDate=this._storicoService.getArray()
    this.setUpList()

    /*var ref = this.firebase.database.ref("Sensori");

    ref.once("value", snap => {
      snap.forEach(function (child) {

        arrayDate.push(child.key);
      })

      document.getElementById("load").innerHTML = "Caricamento completato"
      this.setUpList();

    })*/


  }



  setUpList() {

    document.getElementById("box").style.display = "block"
    var i = 0;
    for (i = 0; i < arrayDate.length; i++) {


      $("#listaDate").append("<li name='item'><span><input type='checkbox'></span><p name='itemText'>" + arrayDate[i] + "</p></li>")

    }

  }


  public aggiungiData() {
    var lis = document.getElementById("listaDate").getElementsByTagName("input")
    var innerText = document.getElementsByName("itemText");

    var i = 0;
    for (i = 0; i < lis.length; i++) {
      if (lis[i].checked) {
        //Aggiungi alle date selezionate

        const index = dateSelezionate.indexOf(innerText[i].innerHTML);

        if (index == -1) //Non ho trovato la data, quindi faccio il push
        {
          window.alert("Checked, aggiungo " + innerText[i].innerHTML)
          dateSelezionate.push(innerText[i].innerHTML);

        }
        else {
          window.alert("Data già presente");


        }
      }
      else {
        // Se la checkbox è unchecked e la data si trova
        //nell'array, allora la devo eliminare


        const index = dateSelezionate.indexOf(innerText[i].innerHTML);
        if (index > -1) {//Trovata
          window.alert("Devo rimuovere" + innerText[i].innerHTML)
          if (dateSelezionate.length == 1) {//C'è solo una data
            window.alert("Stai eliminando tutte le selezioni")
            dateSelezionate = [];

          }
          else
            dateSelezionate.splice(index, 1);
        }

      }


    }


    if (dateSelezionate.length == 0) {
      window.alert("Seleziona almeno un istante temporale")
    }
    else {
      window.alert("Vado avanti, carico sensori. Num Date: " + dateSelezionate.length)
      this.effettuaQueryeMostraSensoriInIstantiDiTempo()
      document.getElementById("btnJson").style.display = "block"
      document.getElementById("btnAvanti").innerHTML = "Aggiorna selezione"
    }


  }


  effettuaQueryeMostraSensoriInIstantiDiTempo() {
    //Per ogni data in dateSelezionate recupera gli ID dei sensori
    //Aggiunge i sensori in arraySensori

    arraySensori = [];

    var i = 0;
    document.getElementById("load").innerHTML = "Carico sensori..."
    for (i = 0; i < dateSelezionate.length; i++) {
      var ref = this.firebase.database.ref("Sensori").child(dateSelezionate[i]);

      ref.once("value", snap => {
        snap.forEach(function (child) {
          //window.alert(child.key + "")
          arraySensori.push(child.key);
        })



        document.getElementById("load").innerHTML = "Caricamento sensori completato"

      })


    }


  }

  numeroSensori: Number;
  creaJson() {

    window.alert("Sensori caricati: " + arraySensori.length + " arrayDateSelezionate: " + dateSelezionate.length)
    this.numeroSensori = arraySensori.length / dateSelezionate.length;
    window.alert("Sensori ogni data: " + this.numeroSensori)

    window.alert("Dim sens" + arraySensori.length)
    var jsonObjectFinale = [];
    var i = 0;
    for (i = 0; i < dateSelezionate.length; i++) {
      var fine = {}
      fine["tempo"] = dateSelezionate[i];
      var j = 0;
      for (j = 0; j < this.numeroSensori; j++) //Supponendo numero sensori gestiti = numeroSensori
      {
        fine["id" + j] = arraySensori[j];
      }

      jsonObjectFinale.push(fine);
    }

    var jsonObjectFinaleString = JSON.stringify(jsonObjectFinale);
    window.alert(jsonObjectFinaleString);
    var obj = JSON.parse(jsonObjectFinaleString);


    var k = 0;
    $("#listaDate").html("");
    document.getElementById("btnAvanti").style.display = "none"
    document.getElementById("btnJson").style.display = "none"
    document.getElementById("btnConfermaID").style.display = "block"
    document.getElementById("btnJsonID").style.display = "block"
    document.getElementById("titleBox").innerHTML = "Seleziona ID interessati"
    for (k = 0; k < obj.length; k++) {
      var fess = 0;
      var ids = "";
      for (fess = 0; fess < this.numeroSensori; fess++) {
        ids += "<input type='checkbox'>ID" + (fess + 1) + ": <p name='itemText'>" + obj[k]["id" + fess] + "</p>"
      }
      //<li><span>Data</span><input type="checkbox"><span>ID</span></li>
      $("#listaDate").append("<li><span>" + obj[k]["tempo"] + "</span><br>" + ids)

    }


  }

  public aggiungiID() {
    var lis = document.getElementById("listaDate").getElementsByTagName("input") //Prendo le checkbox
    var innerText = document.getElementsByName("itemText"); //Prendo valore in checkbox (ID)

    var i = 0;
    for (i = 0; i < lis.length; i++) {
      if (lis[i].checked) {
        //Aggiungi ai sensori selezionati

        const index = sensoriSelezionati.indexOf(innerText[i].innerHTML);

        if (index == -1) //Non ho trovato il sensore, quindi faccio il push
        {
          window.alert("Checked, aggiungo " + innerText[i].innerHTML)
          sensoriSelezionati.push(innerText[i].innerHTML);
        }
        else {
          window.alert("Sensore già presente")
        }
      }
      else {
        // Se la checkbox è unchecked e il sensore si trova
        //nell'array, allora lo devo eliminare


        const index = sensoriSelezionati.indexOf(innerText[i].innerHTML);
        if (index > -1) {//Trovato
          window.alert("Devo rimuovere" + innerText[i].innerHTML)
          if (sensoriSelezionati.length == 1) {//C'è solo un sensore
            window.alert("Stai eliminando tutte le selezioni")
            sensoriSelezionati = [];

          }
          else
            sensoriSelezionati.splice(index, 1);
        }

      }
    }

    if (sensoriSelezionati.length == 0) {
      window.alert("Seleziona almeno un ID")
    }
    else {
      window.alert("Vado avanti, carico valori. Numero sensori selezionati: " + sensoriSelezionati.length)
      //this.effettuaQueryeMostraSensoriInIstantiDiTempo()
      document.getElementById("btnJsonID").style.display = "block"
      document.getElementById("btnConfermaID").innerHTML = "Aggiorna selezione"
      this.printSensSelezionati();
    }


  }

  creaJsonID() {

   // window.alert("Sensori caricati: " + arraySensori.length + " arrayDateSelezionate: " + dateSelezionate.length)
   // this.numeroSensori = arraySensori.length / dateSelezionate.length;
    //window.alert("Sensori ogni data: " + this.numeroSensori)

   // window.alert("Dim sens" + arraySensori.length)
    var jsonDaRicercare = [];
    var i = 0;
    for (i = 0; i < dateSelezionate.length; i++) {
      var fine = {}
      fine["tempo"] = dateSelezionate[i];
      var j = 0;
      for (j = 0; j < this.numeroSensori; j++) //Supponendo numero sensori gestiti = numeroSensori
      {
        fine["id" + j] = arraySensori[j];
      }

      jsonDaRicercare.push(fine);
    }

    var jsonObjectFinaleString = JSON.stringify(jsonDaRicercare);
    window.alert(jsonObjectFinaleString);
    var obj = JSON.parse(jsonObjectFinaleString);


    /*var k = 0;
    $("#listaDate").html("");
    document.getElementById("btnAvanti").style.display = "none"
    document.getElementById("btnJson").style.display = "none"
    document.getElementById("btnConfermaID").style.display = "block"
    document.getElementById("btnJsonID").style.display = "block"
    document.getElementById("titleBox").innerHTML = "Seleziona ID interessati"
    for (k = 0; k < obj.length; k++) {
      var fess = 0;
      var ids = "";
      for (fess = 0; fess < this.numeroSensori; fess++) {
        ids += "<input type='checkbox'>ID" + (fess + 1) + ": <p name='itemText'>" + obj[k]["id" + fess] + "</p>"
      }
      //<li><span>Data</span><input type="checkbox"><span>ID</span></li>
      $("#listaDate").append("<li><span>" + obj[k]["tempo"] + "</span><br>" + ids)

    }*/


  }
  printSensSelezionati() {
    var j = 0;
    for (j = 0; j < dateSelezionate.length; j++) {
      var i = 0;
      for (i = 0; i < sensoriSelezionati.length; i++) {
        window.alert("Tempo: "+dateSelezionate[j]+" Sensori selezionati; " + sensoriSelezionati[i])
      }
    }

  }





  checkIfUserIsLogged() {
    this.auth.onAuthStateChanged(function (user) {
      if (user) {
        console.log("Loggato");
        console.log(user.email + "");

        document.getElementById("user_div").style.display = "none";
        document.getElementById("router").style.display = "block";


      }
      else {
        console.log("Non Loggato");
        document.getElementById("login_div").style.display = "block";

      }
    })
  }

}


