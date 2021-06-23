import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ChangePasswordService } from 'src/app/core/services/change-password.service';
import { ResetPasswordService } from 'src/app/core/services/reset-password.service';
import { ErrorModalComponent } from '../error-modal/error-modal.component';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  resetPassword: any;
  submitted = false;
  errorMsg: string = "";
  showError: boolean = false;
  showNewPasswordMessage: boolean = false;
  newPasswordError: string = "";
  showConfirmPasswordMessage: boolean = false;
  confirmPasswordError: string = "";
  userId: string = "";
  constructor(private resetPasswordService: ResetPasswordService, private formBuilder: FormBuilder, private router: Router, private dialog: MatDialog, private activatedRoute: ActivatedRoute) {
  }
  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      this.userId = params['userId'];
    });
    this.resetPassword = new FormGroup({
      newPassword: new FormControl("", [Validators.required, Validators.minLength(8)]),
      confirmPassword: new FormControl("", [Validators.required, Validators.minLength(8)]),
    },

    );
  }

  save() {
    this.validate();
    if (this.resetPassword.value.newPassword !== this.resetPassword.value.confirmPassword) {
      this.dialog.open(ErrorModalComponent, {
        data: {
          message: "New password does not match with confirm password",
          header: "header"
        }
      });
    }
    else {
      //save Logic
      var newPassword = this.passwordConversion(this.resetPassword.value.newPassword);
      this.resetPasswordService.resetPasswordMethod(this.userId, newPassword).
        subscribe((res: any) => {
          if (res.status == 200) {
            this.dialog.open(ErrorModalComponent, {
              data: {
                message: res.message,
                header: "Info"
              }
            });
            this.router.navigateByUrl('login');
          }
        }, (error) => {
          this.dialog.open(ErrorModalComponent, {
            data: {
              message: error.error.message,
              header: "Info"
            }
          });
        })
    }
  }


  validate() {
    //Entered character length should be greater than 8

    if (this.resetPassword.value.newPassword.length <= 8) {
      this.showNewPasswordMessage = true;
      if (this.resetPassword.value.newPassword.length == 0)
        this.newPasswordError = "This field is required";
      else
        this.newPasswordError = "Entered character length should be at least 8";
    }

    else if (!(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,15}$/.test(this.resetPassword.value.newPassword))) {
      this.showNewPasswordMessage = true;
      this.newPasswordError = "Password must have atleast a number,an uppercase, a lowercase and a special character";
    }
    else {
      this.showNewPasswordMessage = false;
    }
    if (this.resetPassword.value.confirmPassword.length <= 8) {
      this.showConfirmPasswordMessage = true;
      if (this.resetPassword.value.confirmPassword.length == 0)
        this.confirmPasswordError = "This field is required";
      else
        this.confirmPasswordError = "Entered character length should be at least 8";
    }
    else if (!(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,15}$/.test(this.resetPassword.value.confirmPassword))) {
      this.showConfirmPasswordMessage = true;
      this.confirmPasswordError = "Password must have atleast a number,an uppercase, a lowercase and a special character";
    }
    else {
      this.showConfirmPasswordMessage = false;
    }


    //Modal : New password does not match with confirm password.
    //Password must have atleast a number,an uppercase, a lowercase and a special character


  }

  passwordConversion(password: string) {
    var keys = '123456$#@$^@1ERF';
    var key = CryptoJS.enc.Utf8.parse(keys);
    var iv = CryptoJS.enc.Utf8.parse(keys);
    var encrypted = CryptoJS.AES.encrypt((password.toString()), key,
      {
        keySize: 128 / 8,
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      });
    return encrypted.toString();
  }

  goBackToLogin() {
    this.router.navigateByUrl("login");
  }



}

