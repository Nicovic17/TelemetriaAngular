import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-gforce-section',
  templateUrl: './gforce-section.component.html',
  styleUrls: ['./gforce-section.component.css']
})
export class GforceSectionComponent implements OnInit {
  public x_axis = '16px';  //CENTER 16PX
  public y_axis = '-1px';  //CENTER -1PX
  constructor() { }

  ngOnInit(): void {
  }

}
