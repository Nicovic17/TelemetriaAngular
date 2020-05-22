import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-uninacorse',
  templateUrl: './uninacorse.component.html',
  styleUrls: ['./uninacorse.component.css']
})
export class UninacorseComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  logout()
  {
    document.getElementById("uninacorse").style.display="none";
  }

}
