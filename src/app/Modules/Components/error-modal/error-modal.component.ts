import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
@Component({
  selector: 'app-error-modal',
  templateUrl: './error-modal.component.html',
  styleUrls: ['./error-modal.component.css']
})

export class ErrorModalComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<ErrorModalComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private router: Router
  ) {
  }
  public closeMe() {
    this.dialogRef.close();
    if (this.data.reload === "alertrule") {
      window.location.reload();
    }
  }

  ngOnInit(): void { }
}