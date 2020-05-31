import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { HostListener } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore'
import { AngularFireDatabase } from '@angular/fire/database'
import { Observable, from } from 'rxjs'
import { ViewEncapsulation } from '@angular/core';


var arrayDate = [];
var dateSelezionate = [];
var arraySensori=[];
var arrayIdSalvati=[];
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
    document.getElementById("box").style.display = "none"
    document.getElementById("btnJson").style.display="none"
    document.getElementById("btnConfermaID").style.display="none"
    document.getElementById("btnMostraValID").style.display="none"
    this.getDate();
  }

  private date = [];

  getDate() {

    document.getElementById("load").innerHTML = "<p>Caricamento dati...</p>";


    var ref = this.firebase.database.ref("Sensori");

    ref.once("value", snap => {
      snap.forEach(function (child) {
        //window.alert(child.key+"");
        arrayDate.push(child.key);
      })

      document.getElementById("load").innerHTML = "Caricamento completato"
      this.setUpList();
      //setUpListJS()
    })


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

    if(dateSelezionate.length==0)
    {
      window.alert("Seleziona almeno un istante temporale")
    }
    else{
      window.alert("Vado avanti, carico sensori"+dateSelezionate.length)
      this.effettuaQueryeMostraSensoriInIstantiDiTempo()
      document.getElementById("btnJson").style.display="block"
      document.getElementById("btnAvanti").innerHTML="Aggiorna selezione"
    }
    

  }

  effettuaQueryeMostraSensoriInIstantiDiTempo(){
    //Per ogni data in dateSelezionate recupera gli ID dei sensori
    //Aggiunge i sensori in arraySensori

    var i=0;
    document.getElementById("load").innerHTML="Carico sensori..."
    for(i=0;i<dateSelezionate.length;i++)
    {
      var ref = this.firebase.database.ref("Sensori").child(dateSelezionate[i]);

      ref.once("value", snap => {
        snap.forEach(function (child){
         // window.alert(child.key+"")
         arraySensori.push(child.key);
        })

        document.getElementById("load").innerHTML="Caricamento sensori completato"
        
      })


      }

    
  }
  
  creaJson(){

    window.alert("Dim sens"+ arraySensori.length)
    var jsonObjectFinale=[];
    var i=0;
    for(i=0;i<dateSelezionate.length;i++)
    {
      var fine={}
      fine["tempo"]=dateSelezionate[i];
      var j=0;
      for(j=0;j<2;j++)//Supponendo numero sensori gestiti =2
      {
        fine["id"+j]=arraySensori[j];
      }

      jsonObjectFinale.push(fine);
    }

    var jsonObjectFinaleString=JSON.stringify(jsonObjectFinale);
    window.alert(jsonObjectFinaleString);
    var obj=JSON.parse(jsonObjectFinaleString);

    
    var k=0;
    $("#listaDate").html("");
    document.getElementById("btnAvanti").style.display="none"
    document.getElementById("btnJson").style.display="none"
    document.getElementById("btnConfermaID").style.display="block"
    document.getElementById("btnMostraValID").style.display="block"
    document.getElementById("titleBox").innerHTML="Seleziona ID interessati"
    for(k=0;k<obj.length;k++)
    {
      //<li><span>Data</span><input type="checkbox"><span>ID</span></li>
      $("#listaDate").append("<li><span>"+obj[k]["tempo"]+"</span><br><input type='checkbox'>ID1: "+obj[k]["id0"]+"<span></span><input type='checkbox'>ID2: "+obj[k]["id1"]+"<span>")

    }
    

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

function test() {
  window.alert("TEst")
}


