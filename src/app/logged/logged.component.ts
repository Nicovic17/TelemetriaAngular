import { Component, NgZone, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppcomponentService } from '../appcomponent.service';

@Component({
  selector: 'app-loggedpage',
  templateUrl: './logged.component.html',
  styleUrls: ['./logged.component.css']
})
export class LoggedComponent implements OnInit {

  constructor(public _appComponentService: AppcomponentService, private ngZone: NgZone, private router: Router) { }

  ngOnInit(): void {
  }

 async logout() {
    const ris = await this._appComponentService.logout();
    localStorage.setItem('mostraResize','true');
    this.ngZone.run(()=>{
      this.router.navigate(['/notloggedpage']);
    });
    return ris;
  }

}
