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

  constructor(public dialogRef: MatDialogRef<MatDialogComponent>, @Inject(MAT_DIALOG_DATA) private data: any) {
    this.title = data.title;
    this.body = data.body;
  }

  ngOnInit(): void {
  }

  closeDialog(){
    this.dialogRef.close();
  }

}
