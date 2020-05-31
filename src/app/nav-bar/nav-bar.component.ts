import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {
  public inFirstPage;
  public inSecondPage;
  public inThirdPage;
  public inFourthPage;
  public inFifthPage;

  constructor() { }

  ngOnInit(): void {
  }

  changePage(newpage : number){
    switch(newpage){
      case 1:
        this.inFirstPage="background-color: dimgrey";
        this.inSecondPage="";
        this.inThirdPage="";
        this.inFourthPage="";
        this.inFifthPage="";
        break;
      case 2:
        this.inFirstPage="";
        this.inSecondPage="background-color: dimgrey";
        this.inThirdPage="";
        this.inFourthPage="";
        this.inFifthPage="";
        break;
      case 3:
        this.inFirstPage="";
        this.inSecondPage="";
        this.inThirdPage="background-color: dimgrey";
        this.inFourthPage="";
        this.inFifthPage="";
        break;
      case 4:
        this.inFirstPage="";
        this.inSecondPage="";
        this.inThirdPage="";
        this.inFourthPage="background-color: dimgrey";
        this.inFifthPage="";
        break;
      case 5:
        this.inFirstPage="";
        this.inSecondPage="";
        this.inThirdPage="";
        this.inFourthPage="";
        this.inFifthPage="background-color: dimgrey";
        break;
    }
  }

}
