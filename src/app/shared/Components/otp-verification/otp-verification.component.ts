import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ForgotPasswordService } from 'src/app/core/services/forgot-password.service';
import { ErrorModalComponent } from 'src/app/Modules/Components/error-modal/error-modal.component';

@Component({
  selector: 'app-otp-verification',
  templateUrl: './otp-verification.component.html',
  styleUrls: ['./otp-verification.component.css']
})
export class OtpVerificationComponent implements OnInit {

  forgotPassword: any;
  data: any;
  errorMsg: string = "";
  showError: boolean = false;
  userId: string = "";
  constructor(private forgotPasswordService: ForgotPasswordService, private router: Router, private dialog: MatDialog, private activatedRoute: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      this.userId = params['userId'];
    });
  }

  sendOTP() {
    this.forgotPasswordService.sendOTP(this.userId).subscribe((res: any) => {
      console.log("this.data" + this.data);
      this.router.navigate(["otp-verification"], { queryParams: { userId: this.userId } });
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
  otp: number = 0;
  onOtpChange(event: any) {
    this.otp = event;
  }

  submitOTP() {
    if (this.otp.toString().length != 6) {
      alert("Enter all Values");
      return;
    }
    else {
      this.forgotPasswordService.verifyOTP(this.otp.toString(), this.userId).subscribe((res: any) => {
        if (res.status == 200) {
          this.router.navigate(["reset-password"],{ queryParams: { userId: this.userId}});
        }
      }, (error) => {
        this.dialog.open(ErrorModalComponent, {
          data: {
            message: error.error.message,
            header:"Info"
          }
        }); 
      }
      )
    }
    }
  }
