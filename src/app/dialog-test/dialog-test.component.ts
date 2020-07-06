import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms'
import { MatDialog, MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';


@Component({
  selector: 'app-dialog-test',
  templateUrl: './dialog-test.component.html',
  styleUrls: ['./dialog-test.component.css']
})
export class DialogTestComponent implements OnInit {

  

  constructor(


    private dialogRef: MatDialogRef<DialogTestComponent>

  ) {

  }

  ngOnInit(): void {


  }

  save() {
    this.dialogRef.close();
  }

  close() {
    
    this.dialogRef.close();
  }

}
