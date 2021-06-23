import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { CustomerConfigService } from 'src/app/core/services/customer-config.service';
import { LoginService } from 'src/app/core/services/login.service';
import * as CryptoJS from 'crypto-js';
import { AuthGuard } from 'src/app/core/auth.guard';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  fieldTextType: any;
  repeatFieldTextType: any;
  showErrorMsg: boolean = false;
  errorMsg: string = "";
  userIdErrorMsg: string = "";
  showUserIdError: boolean = false;
  showPasswordError: boolean = false;
  passwordErrorMsg: string = "";
  checkoutForm = this.formBuilder.group({
    userId: '',
    password: ''
  });
  constructor(private formBuilder: FormBuilder, private loginService: LoginService, private router: Router, private customerConfigService: CustomerConfigService,
    private authGuard: AuthGuard) {
  }

  ngOnInit(): void {
  }
  onSubmit() {
    if (this.checkoutForm.value.userId !== "" && this.checkoutForm.value.password !== "") {
      if (this.checkoutForm.value.password.length <= 6) {
        this.errorMsg = "Entered character length should be greater than 6";
        this.showPasswordError = false;
        this.showErrorMsg = true;
        return;
      }
      else {
        var routeToNavigate="";
        var encryptedPassword = this.passwordConversion(this.checkoutForm.value.password);
        this.loginService.login(this.checkoutForm.value.userId, encryptedPassword).subscribe(
          (res: any) => {
            sessionStorage.setItem("token", res.access_token);
            this.customerConfigService.getLoggedInUser().subscribe(
              (result: any) => {
                sessionStorage.setItem("userId", result.userId);
                sessionStorage.setItem("userDetails", JSON.stringify(result));
                sessionStorage.setItem("customerId", result.customer?.customerId);
                sessionStorage.setItem("cityId", result.city?.cityId);
                sessionStorage.setItem("cityName", result.city?.cityName);
                sessionStorage.setItem("customerName", result.customer?.customerName);
                sessionStorage.setItem("role", result.userType);
                localStorage.setItem('STATE', 'true');
                this.authGuard.addAuthorities();
                if(result.authorities.map(function (item: any) {
                  return item.authority;
                }).includes("ROLE_EXECUTIVE_DASHBOARD")){
                  routeToNavigate = 'executive-dashboard';
                }
                else{
                  routeToNavigate = 'operational-dashboard';
                }
                if (res.status == 200) {
                  this.router.navigate([routeToNavigate]);
                }
              }
            )
          },
          (error) => {
            this.showErrorMsg = true;
            this.errorMsg = error.error.message;
          }

        );
      }
      //      this.checkoutForm.reset();
    }
    if (this.checkoutForm.value.userId === "" && this.checkoutForm.value.password === "") {
      this.userIdErrorMsg = "This field is required";
      this.showUserIdError = true;
      this.passwordErrorMsg = "This field is required";
      this.showPasswordError = true;
    }
    if (this.checkoutForm.value.userId === "") {
      this.userIdErrorMsg = "This field is required";
      this.showUserIdError = true;
    }
    if (this.checkoutForm.value.password === "") {
      this.passwordErrorMsg = "This field is required";
      this.showPasswordError = true;
    }
    if (this.checkoutForm.value.userId !== "") {
      this.showUserIdError = false;
    }
    if (this.checkoutForm.value.password !== "") {
      this.showPasswordError = false;
    }
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

  funResetPassword() {
    this.router.navigateByUrl("forgotpassword");
  }
  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }

  toggleRepeatFieldTextType() {
    this.repeatFieldTextType = !this.repeatFieldTextType;
  }

  userIdEntered(){
    if (this.checkoutForm.value.userId !== "") {
      this.showUserIdError = false;
    }
    if (this.checkoutForm.value.userId === "") {
      this.showUserIdError = true;
    }
  }

  passwordEntered(){
    if (this.checkoutForm.value.password !== "") {
      this.showPasswordError = false;
    }
    if (this.checkoutForm.value.password === "") {
      this.showPasswordError = true;
    }
  }
}