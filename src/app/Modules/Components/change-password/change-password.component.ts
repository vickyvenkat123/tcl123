import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ChangePasswordService } from 'src/app/core/services/change-password.service';
import { ErrorModalComponent } from '../error-modal/error-modal.component';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {

  changePassword: any;
  data: any;
  errorMsg: string = "";
  showError: boolean = false;
  showOldPasswordMessage: boolean = false;
  oldPasswordError: string = "";
  showNewPasswordMessage: boolean = false;
  newPasswordError: string = "";
  showConfirmPasswordMessage: boolean = false;
  confirmPasswordError: string = "";
  constructor(private changePasswordService: ChangePasswordService, public dialogRef: MatDialogRef<ChangePasswordComponent>, private router: Router, private dialog: MatDialog) {
    this.changePassword = new FormGroup({
      oldPassword: new FormControl("", Validators.required),
      newPassword: new FormControl("", Validators.required),
      confirmPassword: new FormControl("", Validators.required),
    })
  }

  ngOnInit(): void {
  }

  sendOTP() {
    // if(this.changePassword.value.userId === ""){
    //   this.showError = true;  
    //   return;
    // }
    // this.changePasswordService.sendOTP(this.changePassword.value.userId).subscribe((res:any)=>{
    //   console.log("this.data"+this.data);
    //   this.router.navigateByUrl("resetpassword");
    // },
    // )
  }

  save() {
    this.validate();
    if (this.changePassword.value.newPassword !== this.changePassword.value.confirmPassword) {
      this.dialog.open(ErrorModalComponent, {
        data: {
          message: "New password does not match with confirm password",
          header: "header"
        }
      });
    }
    else {
      //save Logic
      var oldPassword = this.passwordConversion(this.changePassword.value.oldPassword);
      var newPassword = this.passwordConversion(this.changePassword.value.newPassword);
      this.changePasswordService.changePasswordMethod(oldPassword, newPassword).
        subscribe((res: any) => {
          if (res.status == 200) {
            this.dialogRef.close();
            this.router.navigateByUrl('login');
            this.dialog.open(ErrorModalComponent, {
              data: {
                message: "Password updated successfully.",
                header: "Info"
              }
            });
          }
        })
    }
  }

  validate() {
    //Entered character length should be greater than 8
    if (this.changePassword.value.oldPassword.length <= 8) {
      this.showOldPasswordMessage = true;
      if (this.changePassword.value.oldPassword.length == 0)
        this.oldPasswordError = "This field is required";
      else
        this.oldPasswordError = "Entered character length should be at least 8";
    }
    else if (!(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,15}$/.test(this.changePassword.value.oldPassword))) {
      this.showOldPasswordMessage = true;
      this.oldPasswordError = "Password must have at least a number,an uppercase, a lowercase and a special character";
    }
    else {
      this.showOldPasswordMessage = false;
    }
    if (this.changePassword.value.newPassword.length <= 8) {
      this.showNewPasswordMessage = true;
      if (this.changePassword.value.newPassword.length == 0)
        this.newPasswordError = "This field is required";
      else
        this.newPasswordError = "Entered character length should be greater than 8";
    }

    else if (!(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,15}$/.test(this.changePassword.value.newPassword))) {
      this.showNewPasswordMessage = true;
      this.newPasswordError = "Password must have at least a number,an uppercase, a lowercase and a special character";
    }
    else {
      this.showNewPasswordMessage = false;
    }
    if (this.changePassword.value.confirmPassword.length <= 8) {
      this.showConfirmPasswordMessage = true;
      if (this.changePassword.value.confirmPassword.length == 0)
        this.confirmPasswordError = "This field is required";
      else
        this.confirmPasswordError = "Entered character length should be at least 8";
    }
    else if (!(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,15}$/.test(this.changePassword.value.confirmPassword))) {
      this.showConfirmPasswordMessage = true;
      this.confirmPasswordError = "Password must have at least a number,an uppercase, a lowercase and a special character";
    }
    else {
      this.showConfirmPasswordMessage = false;
    }


    //Modal : New password does not match with confirm password.
    //Password must have at least a number,an uppercase, a lowercase and a special character


  }

  cancel() {
    this.dialogRef.close();
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
}