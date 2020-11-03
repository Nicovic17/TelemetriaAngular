import { Component, NgZone, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppcomponentService } from '../appcomponent.service';

@Component({
  selector: 'app-loggedpage',
  templateUrl: './loggedpage.component.html',
  styleUrls: ['./loggedpage.component.css']
})
export class LoggedpageComponent implements OnInit {

  constructor(public _appComponentService: AppcomponentService, private ngZone: NgZone, private router: Router) { }

  ngOnInit(): void {
  }

 async logout() {
    let ris= await this._appComponentService.logout();
    localStorage.setItem("mostraResize","true")
    this.ngZone.run(()=>{
      this.router.navigate(['/notloggedpage'])
    })
    return ris;
  }

}
