import { Component, OnInit } from '@angular/core';
import { AppcomponentService } from '../appcomponent.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {

  constructor(public appComponentService: AppcomponentService) { }

  ngOnInit(): void {
  }

  logout()
  {
    this.appComponentService.logout()
  }
}
