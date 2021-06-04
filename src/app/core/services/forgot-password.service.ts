import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ForgotPasswordService {
  url: string = environment.url;
  constructor(private http: HttpClient) { }
  sendOTP(username: string) {
    var request = {
      username: username
    };
    return this.http.post(this.url + '/otp', request);

  }

  verifyOTP(otp: string,username:string) {
    var request = {
      otp: otp,
      username:username,
    };
    return this.http.put(this.url + '/otp', request);
  }
}
