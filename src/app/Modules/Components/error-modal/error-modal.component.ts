import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
@Component({
  selector: 'app-error-modal',
  templateUrl: './error-modal.component.html',
  styleUrls: ['./error-modal.component.css']
})

export class ErrorModalComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<ErrorModalComponent>, @Inject(MAT_DIALOG_DATA) public data: any
  ) {
  }
  public closeMe() {
    this.dialogRef.close();
  }

  ngOnInit(): void {
    }

}
