import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ResetPasswordService {
  url: string = environment.url;
  constructor(private http: HttpClient) { }
  resetPasswordMethod(username: string, newPassword: string) {
    var token = sessionStorage.getItem("token") || "";
    const headers = new HttpHeaders().set('Authorization', token);
    headers.append("Content-Type", "application/json");
    var request = {
      "username": username,
      "password": newPassword
    };
    return this.http.put(this.url + '/password', request, { headers });

  }
  // resetPassword(oldPassword: string, confirmPwd: string) {
  //   let request = {
  //     "oldPassword": "string",
  //     "otp": "string",
  //     "password": "string",
  //     "username": "string"
  //   }
  //   return this.http.post(this.url + '/password', request)
  // }
}
