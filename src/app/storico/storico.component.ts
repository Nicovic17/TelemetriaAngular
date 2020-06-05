import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { HostListener } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore'
import { AngularFireDatabase } from '@angular/fire/database'
import { Observable, from } from 'rxjs'
import { ViewEncapsulation } from '@angular/core';
import { StoricoService } from '../storico.service'


var arrayDate = [], arrayID = [];
var idSelezionati = [];
var arrayTrace = [];
var datiGrafico;
var traceSelezionate = [];
var trace;


//var dateSelezionate = [];
//var arraySensori = [];
//var sensoriSelezionati = [];
//var arrayIdSalvati = [];
//var arrayPath = [];
//var arrayValori = []
//var arrayNumeroSensoriPerOgniData = []


var layout = {

  xaxis: {
    title: "Tempo"
  },
  yaxis: {
    title: "ID"
  },
  paper_bgcolor: "#6d6d6d",
  plot_bgcolor: "#fff"


};
//Per utilizzare jQuery in TS
declare var $: any;
declare var Plotly: any;


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
    document.getElementById("btnAvanti").style.display = "none"
    document.getElementById("idPerPlot").style.display = "none"
    document.getElementById("load").innerHTML = "<p>Caricamento dati...</p>";
    //this._storicoService.getDate()
    this._storicoService.getID();
  }

  private date = [];

  getID() {

    document.getElementById("btnCaricaDate").style.display = "none"
    document.getElementById("btnAvanti").style.display = "block"

    arrayID = this._storicoService.getArrayID();
    this.setUpList();

  }

  getDate() {
    document.getElementById("btnCaricaDate").style.display = "none"
    document.getElementById("btnAvanti").style.display = "block"

    arrayDate = this._storicoService.getArray()
    this.setUpList()
  }



  setUpList() {

    document.getElementById("box").style.display = "block"
    var i = 0;
    for (i = 0; i < arrayID.length; i++) {


      $("#listaDate").append("<li name='item'><span><input type='checkbox'></span><p name='itemText'>" + arrayID[i] + "</p></li>")
      $("#idPlot").append("<li name='item'><span><input type='checkbox'></span><p name='itemPlot'>" + arrayID[i] + "</p></li>")

    }

  }

  public aggiungiID() {

    idSelezionati = [];

    var lis = document.getElementById("listaDate").getElementsByTagName("input"); //Prendo checkbox
    var innerID = document.getElementsByName("itemText");

    var i = 0;
    for (i = 0; i < lis.length; i++) {
      if (lis[i].checked) {
        //Aggiungi a ID selezionati
        idSelezionati.push(innerID[i].innerHTML)

        /*const index = idSelezionati.indexOf(innerID[i].innerHTML);

        if (index == -1) //ID non trovato , effettuo PUSH
        {
          //window.alert("Aggiungo ID: " + innerID[i].innerHTML)
          idSelezionati.push(innerID[i].innerHTML)
        }
        else {

          window.alert("ID già presente in selezionati");
        }*/
      }
      /*
      else//Not checked
      {
        //Se la checkbox è unchecked e ID si trova in array
        //Rimuovi ID

        const index = idSelezionati.indexOf(innerID[i].innerHTML);

        if (index > -1) {
          //Trovato
          window.alert("Rimuovo: " + innerID[i].innerHTML);
          if (idSelezionati.length == 1) {
            //C'è solo un ID
            window.alert("Stai rimuovendo tutti gli ID selezionati");
            idSelezionati = [];
          }
          else {
            idSelezionati.splice(index, 1);
          }
        }

      }*/
    }

    if (idSelezionati.length == 0) {
      window.alert("Seleziona almeno un ID");
    }
    else {

      window.alert("Vado avanti, carico grafici sensori.");
      //Effettua graficazioni
      this._storicoService.testGrafico(idSelezionati);
    }
  }


  public startPlot() {

    document.getElementById("btnConfermaID").style.display = "block"
    document.getElementById("btnAvanti").style.display = "none"
    document.getElementById("idPerPlot").style.display = "block"

    datiGrafico = this._storicoService.getJsonObject()


    var i = 0;
    var asseX = [];
    var asseY = []
    var currID = datiGrafico[0]["id"];
    for (i = 0; i < datiGrafico.length; i++) {

      var ID = datiGrafico[i]["id"];
      if (ID != currID) //Grafico diverso
      {

        trace = {
          x: asseX,
          y: asseY,
          type: 'scatter',
          name: "00" + (ID - 1)
        };

        arrayTrace.push(trace);

        window.alert("Cambio grafico")
        currID = ID;
        asseX = [datiGrafico[i]["tempo"]]
        asseY = [datiGrafico[i]["valore"]]
      }
      else //Stesso grafico
      {
        window.alert("Aggiorno grafico di ID: " + ID);
        asseX.push(datiGrafico[i]["tempo"]);
        asseY.push(datiGrafico[i]["valore"]);
      }

      var layout = {
        title: "Grafico ID: " + ID,
        xaxis: {
          title: "Tempo"
        },
        yaxis: {
          title: "ID"
        },
        paper_bgcolor: "#6d6d6d",
        plot_bgcolor: "#fff"


      };

      trace = {
        x: asseX,
        y: asseY,
        type: 'scatter',
        name: "" + ID
      };

      var data = [trace];

      //Crea nuova DIV
      $("#grafici").append("<div id='myDiv" + ID + "'></div>")


      Plotly.newPlot('myDiv' + ID, data, layout);

    }


    arrayTrace.push(trace)

    //window.alert("Post plot")

  }

  unisciTrace() {

    $("#grafici").append("<div id='myDivUniti'></div>")
    Plotly.newPlot('myDivUniti', arrayTrace, layout);
  }


  mostraPlotUniti() {

    traceSelezionate = [];

    document.getElementById("btnConfermaID").innerHTML = "Aggiorna grafico generale"
    //Prende le checkbox 
    var lis = document.getElementById("idPlot").getElementsByTagName("input"); //Prendo checkbox
    var innerID = document.getElementsByName("itemPlot");

    var i = 0;

    for (i = 0; i < lis.length; i++) {
      if (lis[i].checked) {

        var j = 0;
        for (j = 0; j < arrayTrace.length; j++) {

          if (innerID[i].innerHTML == arrayTrace[j]["name"]) {

            //Controllo se innerID è già è in traceSelezionate

            var index;
            if (traceSelezionate.length > 0) {
              var k = 0;
              for (k = 0; k < traceSelezionate.length; k++) {
                index = traceSelezionate[k]["name"].indexOf(innerID[i].innerHTML);

                if (index > -1)//trovato
                {
                  window.alert("Traccia già presente.")
                  break;
                }
                else
                  if (index == -1)//Non trovato, effettuo push
                  {
                    window.alert("Effettuo push")
                    traceSelezionate.push(arrayTrace[j]);
                    break;
                  }
              }

            }
            else {
              window.alert("Effettuo push qua");
              traceSelezionate.push(arrayTrace[j]);
            }

          }
        }
      }
      /*else
      if(!lis[i].checked)
      {
        //Controllo se innerID è in traceSelezionate
        var h=0;
        for(h=0;h<traceSelezionate.length;h++)
        {
          if(innerID[i].innerHTML == traceSelezionate[h]["name"])
          {
            //Trovato, devo rimuoevere
            if(traceSelezionate.length==1)
            {
              window.alert("Stai rimuovendo tutto")
              traceSelezionate=[]
            }
            else{
              window.alert("Rimuovo"+innerID[i].innerHTML)
              traceSelezionate.splice(h,1);
            }
          }
          
        }
        
      }*/

    }

    if (traceSelezionate.length == 0) {
      window.alert("Seleziona almeno un ID")

    }
    else {
      $("#grafici").append("<div id='myDivUniti'></div>")
      Plotly.newPlot('myDivUniti', traceSelezionate, layout);

    }



  }

  /*
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

  creaJson() {

    window.alert("Sensori caricati: " + arraySensori.length + " arrayDateSelezionate: " + dateSelezionate.length)

    arrayNumeroSensoriPerOgniData = this._storicoService.returnNumChildren();

    window.alert("Dim sens" + arraySensori.length)
    var jsonObjectFinale = [];
    var i = 0;
    for (i = 0; i < dateSelezionate.length; i++) {

      var fine = {}
      fine["tempo"] = dateSelezionate[i];
      var j = 0;
      for (j = 0; j < arrayNumeroSensoriPerOgniData[j]; j++) //Supponendo numero sensori gestiti = numeroSensori
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
      for (fess = 0; fess < arrayNumeroSensoriPerOgniData[fess]; fess++) {
        ids += "<input type='checkbox'>ID" + (fess + 1) + ": <p name='itemText'>" + obj[k]["id" + fess] + "</p>"
      }
      //<li><span>Data</span><input type="checkbox"><span>ID</span></li>
      $("#listaDate").append("<li><span name='itemTemp'>" + obj[k]["tempo"] + "</span><br>" + ids)

    }


  }



  /*public aggiungiID() {

    arrayPath=[]

    //Deve aggiungere i path da cercare ad un array di path
    var lis = document.getElementById("listaDate").getElementsByTagName("input") //Prendo le checkbox
    var innerTemp = document.getElementsByName("itemTemp"); //Prendo tempo corrispondente
    var innerText = document.getElementsByName("itemText"); //Prendo valore in checkbox (ID)
    
    window.alert("Numero di checkbox: "+lis.length);
    window.alert("Numero di Tempo: "+innerTemp.length);
    window.alert("Numero di ID : "+innerText.length);
    //Ad ogni tempo corrispondono numeroSensori sensori con relative checkbox

    //Per ogni tempo
    //Per ogni checkbox in quel tempo
    //Se checkbox, aggiungi tempo/id ad array

    var i=0;
    for(i=0;i<innerTemp.length;i++)
    {
      window.alert("Tempo trovato: "+innerTemp[i].innerHTML)
      var j=0;
      for(j=0;j<lis.length;j++)
      {
        window.alert("ID curr: "+innerText[j].innerHTML)
        var path=innerTemp[i].innerHTML+"/"+innerText[j].innerHTML;
        if(lis[j].checked)
        {
          //Controlla se presente path innerTemp[i]/lis[j]
          
          const index = arrayPath.indexOf(path);
          //Se non presente , push
          if(index==-1)
          {
            arrayPath.push(path);
          }
          //Se presente allora niente
          else{
            window.alert("Path già presente");
          }
          
        }
        else{
          //Controlla se presente path
          const index=arrayPath.indexOf(path);
          //Se presente, rimuovi
          if(index>-1)
          {
            //Rimuovo
            if(arrayPath.length==1)
            {
              window.alert("Rimozione di tutti i sensori da cercare");
              arrayPath=[];
            }
            else{
              arrayPath.splice(index,1);
            }
          }
        //Se non presente, niente
          
        }
      }

    }

    if(arrayPath.length==0)
    {
      window.alert("Seleziona almeno un ID")
    }
    else
    {
      //Effettua query
      this.effettuaQueryMostraValoriIDSelezionati()
    }

  
    


  }*/
  /*
    effettuaQueryMostraValoriIDSelezionati() {
      arrayValori = [];
  
  
      var i = 0;
      document.getElementById("load").innerHTML = "Carico valore sensori..."
      for (i = 0; i < arrayPath.length; i++) {
        window.alert("Effettuo query: " + arrayPath[i] + "/valore")
        var ref = this.firebase.database.ref("Sensori").child(arrayPath[i]);
  
        ref.once("value", snap => {
          window.alert(snap.child("Nome").val())
          window.alert(snap.child("valore").val())
  
          document.getElementById("load").innerHTML = "Caricamento valori completato"
  
        })
  
  
      }
  
    }
  
    printPath() {
  
      var i = 0;
      for (i = 0; i < arrayPath.length; i++) {
        window.alert("Path: " + arrayPath[i]);
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
        for (j = 0; j < arrayNumeroSensoriPerOgniData[i]; j++) //Supponendo numero sensori gestiti = numeroSensori
        {
          fine["id" + j] = arraySensori[j];
        }
  
        jsonDaRicercare.push(fine);
      }
  
      var jsonObjectFinaleString = JSON.stringify(jsonDaRicercare);
      window.alert(jsonObjectFinaleString);
      var obj = JSON.parse(jsonObjectFinaleString);
  
      var k = 0;
      for (k = 0; k < obj.length; k++) {
        var numId = 0;
        for (numId = 0; numId < arraySensori.length; numId++) {
          window.alert("Path search: " + obj[k]["tempo"] + "/" + obj[k]["id" + numId])
        }
  
      }
  
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
  /*
  
    }
    printSensSelezionati() {
      var j = 0;
      for (j = 0; j < dateSelezionate.length; j++) {
        var i = 0;
        for (i = 0; i < sensoriSelezionati.length; i++) {
          window.alert("Tempo: " + dateSelezionate[j] + " Sensori selezionati; " + sensoriSelezionati[i])
        }
      }
  
    }
  
  */



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


