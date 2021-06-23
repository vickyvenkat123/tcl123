import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from "@angular/forms"
import { ForgotPasswordService } from 'src/app/core/services/forgot-password.service';
import { ActivatedRoute, Router } from '@angular/router'
import { MatDialog } from '@angular/material/dialog';
import { ErrorModalComponent } from '../error-modal/error-modal.component';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
  forgotPassword: any;
  data: any;
  errorMsg: string = "";
  showError: boolean = false;
  showModal: boolean = false;

  constructor(private forgotPasswordService: ForgotPasswordService, private router: Router, private dialog: MatDialog) {
    this.forgotPassword = new FormGroup({
      userId: new FormControl("", Validators.required),
    })
  }

  ngOnInit(): void {

  }

  sendOTP() {
    if (this.forgotPassword.value.userId === "") {
      this.showError = true;
      return;
    }
    this.forgotPasswordService.sendOTP(this.forgotPassword.value.userId).subscribe((res: any) => {
      console.log("this.data" + this.data);
      this.showModal = true;
    },
      (error) => {
        console.log(error.error);
        this.dialog.open(ErrorModalComponent, {
          data: {
            message: error.error.message,
            header: "Error"
          }
        });
      })
  }

  toLoginPage() {
    this.router.navigateByUrl("login");
  }
  navigatedOtpVerification() {
    this.router.navigate(["otp-verification"], { queryParams: { userId: this.forgotPassword.value.userId } });
  }
}