import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StoricoComponent } from './storico.component';
import { AngularFireAuth } from '@angular/fire/auth';
import { HostListener, NgModule } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database'
import { AngularFireModule } from '@angular/fire';
import { environment } from 'src/environments/environment';
import { AngularFirestoreModule } from '@angular/fire/firestore'
import { AppComponent } from '../app.component'
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

describe('StoricoComponent', () => {
  let component: StoricoComponent;
  let appComponent : AppComponent;
  let fixture: ComponentFixture<StoricoComponent>;
  let fixtureAppComponent: ComponentFixture<AppComponent>
  let arrayID : Array<any>;
  let el : HTMLElement;

  beforeEach(() => { 
    
    TestBed.configureTestingModule({
      declarations: [ StoricoComponent ],
      providers: [AngularFireAuth, AngularFireDatabase, MatDialogModule],
      
      imports: [
        AngularFireModule.initializeApp(environment.firebaseConfig),
        AngularFirestoreModule,MatDialogModule
      ]
    })
    .compileComponents().then(()=>{
      fixture=TestBed.createComponent(StoricoComponent)
      fixtureAppComponent=TestBed.createComponent(AppComponent)
      component=fixture.componentInstance;
      appComponent=fixtureAppComponent.componentInstance
    });
   
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StoricoComponent);
    //fixtureAppComponent=TestBed.createComponent(AppComponent)
    component = fixture.componentInstance;
    //appComponent=fixtureAppComponent.componentInstance;
    fixture.detectChanges();
    //fixtureAppComponent.detectChanges()
    
    
    
  });

  /*it('should create', () => {
    expect(component).toBeTruthy();
  });*/
  it('ngOnInit view',()=>{

    component.ngOnInit()
    expect(component.pageLoaded).toBeTruthy();
  })

  it('setUpList is true',()=>{

    var ris=component.setUpList();
    expect(ris).toBeTruthy();
  })

  it('getNomeIDReturnCorrectNameFromID',()=>{

    var id="001";
    
    var array=[];
    var el1={}
    el1["id"]="001"
    el1["nome"]="macchina"
    array.push(el1);

    var ris=component.getNomeID(id,array)

    expect(ris).toEqual("macchina")
  })

  it('getNomeIDReturnErrorNoNameFound',()=>{

    var id="001";
    var array=[];
    var el1={}
    el1["id"]="002"
    el1["nome"]="macchina"
    array.push(el1);
    var ris=component.getNomeID(id,array)
    expect(ris).toEqual(-1)
  })

  it('id to nome works',()=>{

    var nome="macchina"

    var array=[];
    var el1={}
    el1["id"]="001"
    el1["nome"]="macchina"
    array.push(el1);

    var ris=component.getIDFromNome(nome,array)

    expect(ris).toEqual("001")
  })

  it('id to nome not works',()=>{

    var nome="macchinone rosso"

    var array=[];
    var el1={}
    el1["id"]="001"
    el1["nome"]="macchina"
    array.push(el1);

    var ris=component.getIDFromNome(nome,array)
    expect(ris).toEqual(-1)
  })

  it('ngAfterViewInit setta una view come invisibile',()=>{

    component.ngAfterViewInit()

    const content=(<HTMLInputElement>document.getElementById("box"))
    expect(content.style.display).toEqual("none")
  })

  it('compare Hours, scenario principale',()=>{

    var h1="18:15:00";
    var h2="18:16:00";

    var ris=component.compareHours(h1,h2)

    expect(ris).toBeTruthy()
  })

  it('compare Hours, stessa ora:min:sec',()=>{

    var h1="18:16:00";
    var h2="18:16:00";

    var ris=component.compareHours(h1,h2)

    expect(ris).toBeTruthy()
  })

  it('compare Hours, ora fine più grande di 2 minuti',()=>{

    var h1="18:16:00";
    var h2="18:18:00";

    var ris=component.compareHours(h1,h2)

    expect(ris).toBeFalsy()
  })

  it('compare Hours, ora fine più piccola',()=>{

    var h1="18:16:00";
    var h2="18:15:00";

    var ris=component.compareHours(h1,h2)

    expect(ris).toBeFalsy()
  })

  it('compare date, ',()=>{

    var d1="";
    var d2="";

    var ris=component.compareDate(d1,d2)

    expect(ris).toBeFalsy()
  })

  it('getID Test ',()=>{

    /*component._storicoService.getID();
    component._storicoService.getMapForID()

    var ris=component.getID()

    expect(ris).toBeTruthy()*/
    
   
  })

 

});
