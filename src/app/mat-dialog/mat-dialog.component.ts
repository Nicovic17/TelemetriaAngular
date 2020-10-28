import {Component, Inject, OnInit} from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-mat-dialog',
  templateUrl: './mat-dialog.component.html',
  styleUrls: ['./mat-dialog.component.css']
})
export class MatDialogComponent implements OnInit {
  public title;
  public body: [];
  public isChoice = false;
  public isPersonalized = false;
  public choices: any;

  constructor(public dialogRef: MatDialogRef<MatDialogComponent>, @Inject(MAT_DIALOG_DATA) private data: any) {
    this.title = data.title;
    this.body = data.body;
    if (data.isChoice === true){
      this.isChoice = true;
    }else{
      if (data.isPersonalized === true){
        this.isPersonalized = true;
        this.choices = data.choices;
      }
    }
  }

  ngOnInit(): void {
  }

  closeDialog(){
    this.dialogRef.close();
  }
  yesChoice(){
    this.dialogRef.close(1);
  }
  noChoice(){
    this.dialogRef.close(0);
  }
  personalizedChoice(val){
    this.dialogRef.close(val);
  }

}
