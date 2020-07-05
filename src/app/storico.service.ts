import { Injectable } from '@angular/core';
import { AngularFireDatabase } from "@angular/fire/database";

var arrayDate = [], arrayID = [], jsonObject = [], jsonDateForDropDown = [], arrayMapID=[]
var test = ["Pollo"]
var numSens;
var arrayNumeroSensoriPerOgniData = [];
@Injectable({
  providedIn: 'root'
})
export class StoricoService {

  private arrayDateInterno = []

  constructor(private db: AngularFireDatabase) {

  }



  public getDate() {

    var ref = this.db.database.ref("Sensori");

    ref.once("value", snap => {
      snap.forEach(function (child) {
        //window.alert(child.key  )
        arrayDate.push(child.key)
      })
      
    })
  }

  //Popola array (id - nome) con la mappa presente sul DB
  public getMapForID(){

    arrayMapID=[];
    var ref=this.db.database.ref("mappa");

    ref.once("value", snap =>{
      snap.forEach(function (child){
        var idValore={}
        idValore["id"]=child.val();
        idValore["nome"]=child.key;

        arrayMapID.push(idValore);
      })

      window.alert("Dati mappa ottenuti")
      this.mostraView(document.getElementById("rowButtons"));
    })
  }

  public getArrayMapForID(){

    var jsonString = JSON.stringify(arrayMapID);
    window.alert("ArrayMap: "+jsonString)
    var obj = JSON.parse(jsonString);

    return obj;

  }

  public getMammt(){
    return arrayDate;
  }

  //Popola array con tutti gli ID registrati sul database
  public getID() {

    arrayID = []
    jsonDateForDropDown = [];

    var ref = this.db.database.ref("storico");

    ref.once("value", snap => {
      snap.forEach(function (child) {

        arrayID.push(child.key)
      })
      
      this.nascondiView(document.getElementById("loader"))
      this.getDateForDropDown();
    })

  }

  getArrayID() {
    return arrayID;
  }

  getDateForDropDown() {
    arrayID.forEach(element => {

      var ref = this.db.database.ref("storico").child(element);
      ref.once("value", snap => {
        snap.forEach(function (child) {
          var aggiungi = {}
          //window.alert("Aggiungo ID: "+element) //ID

          aggiungi["id"] = element;
          //window.alert("Aggiungo TEMPO: "+child.key) //Tempo
          //window.alert("h"+child.key); 
          var g = new Date(parseInt(child.key)).getDate()
          var month = new Date(parseInt(child.key)).getMonth() + 1
          var monthString;
          if (month > 0 && month < 10) 
          {
            monthString = "0" + month;
          }
          else
          monthString=month+"";

          var y = new Date(parseInt(child.key)).getFullYear()

          var h = new Date(parseInt(child.key)).getHours();
          var m = new Date(parseInt(child.key)).getMinutes();
          var s = new Date(parseInt(child.key)).getSeconds();
          var e = new Date(parseInt(child.key)).getMilliseconds();

          aggiungi["tempo"] =g+"-"+monthString+"-"+y+"-"+" "+ h + ":" + m + ":" + s + ":" + e;
          //window.alert("Aggiungo VAL ID: "+child.child("value").val()) //Valore ID in quel tempo
          aggiungi["valore"] = child.val();
          jsonDateForDropDown.push(aggiungi);
          //child = tempo // child.

        })

      })



    });
  }

  getJsonObjectForDropDown() {
    var jsonString = JSON.stringify(jsonDateForDropDown);
    window.alert(jsonString)
    var obj = JSON.parse(jsonString);

    return obj;
  }

  getArray() {
    return arrayDate;
  }

  //Prende i sensori selezionati e ne starta un grafico
  testGrafico(array: any) {
    jsonObject = [];


    array.forEach(element => { //Per ogni ID

      var ref = this.db.database.ref("storico").child(element["id"]);
      ref.once("value", snap => {
        snap.forEach(function (child) {
          var aggiungi = {}
          //window.alert("Aggiungo ID: "+element) //ID


          //window.alert("Aggiungo TEMPO: "+child.key) //Tempo
          //window.alert("h"+child.key); 
          //Controllo sul tempo

          var g = new Date(parseInt(child.key)).getDate()
          var month = new Date(parseInt(child.key)).getMonth() + 1
          var monthString;
          if (month > 0 && month < 10) 
          {
            monthString = "0" + month;
          }
          else
          monthString=month+"";

          var y = new Date(parseInt(child.key)).getFullYear()

          var h = new Date(parseInt(child.key)).getHours();
          var m = new Date(parseInt(child.key)).getMinutes();
          var s = new Date(parseInt(child.key)).getSeconds();
          var secondsString;
          if(s >=0 && s <10)
          {
            secondsString="0"+s;
          }
          else
          secondsString=s+"";

          var e = new Date(parseInt(child.key)).getMilliseconds();

          var giornoSensore=g+"/"+monthString+"/"+y;

          //window.alert("Giorno scelto: "+element["giornoScelto"] + "Giorno sensore: "+giornoSensore)
          if(element["giornoScelto"] == giornoSensore)

          {
            //window.alert("Giorno corrispondente")
            //Giorno corrispondente
            var orarioSensore=h+":"+m+":"+secondsString;

            if(orarioSensore >= element["dataInizio"] && orarioSensore <= element["dataFine"])
            {
              //window.alert("Orario corrispondente")
              
              //Salvo orari in range selezionati
              //window.alert("Orario sensore: "+orarioSensore + "Data inizio: "+element["dataInizio"])
              aggiungi["id"] = element["id"];
              aggiungi["tempo"] = orarioSensore+=":"+e;
              aggiungi["valore"] = child.val();
              jsonObject.push(aggiungi);
            }
          }

          /*var data = h + ":" + m + ":" + s + ":" + e;
          var x=new Date(data);
          var y=new Date(element["dataInizio"]).getHours();
          var z=new Date(element["dataFine"]);
          window.alert("x: "+x+"y:"+y+"z")
          if (data >= element["dataInizio"] && data <= element["dataFine"]) {
           
          }*/


          //window.alert("Aggiungo VAL ID: "+child.child("value").val()) //Valore ID in quel tempo


          //child = tempo // child.

        })

        document.getElementById("btnJson").style.display = "block"


      })



    });

  }

  getJsonObject() {
    if(jsonObject.length==0)
    {
      window.alert("Nessun dato presente per tempo selezionato")
      return obj;
    }
    else{

      window.alert("json non vuoto")

      var jsonString = JSON.stringify(jsonObject);
    window.alert(jsonString)
    var obj = JSON.parse(jsonString);

    return obj;

    }
    
  }

  mostraView(button : any)
  {
    button.style.display="block";
  }

  nascondiView(button : any)
  {
    button.style.display="none";
  }


  //Prende il numero di sensori salvato in ogni istante di tempo disponibile
  getNumChildrenForAllDate() {
    var ref = this.db.database.ref("Sensori");

    ref.once("value", snap => {
      snap.forEach(function (child) {
        arrayNumeroSensoriPerOgniData.push(child.numChildren())
      })

      window.alert("Numero di children per ogni data ottenuto")
    })

  }

  public returnNumChildren() {

    return arrayNumeroSensoriPerOgniData;
  }
}
