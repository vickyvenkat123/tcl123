import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ChangePasswordService {
  url: string = environment.url;
  constructor(private http: HttpClient) { }

  changePasswordMethod(oldPassword: string, newPassword: string) {
    var token = sessionStorage.getItem("token") || "";
    const headers = new HttpHeaders().set('Authorization', token);
    headers.append("Content-Type", "application/json");
    var request = {
      "oldPassword": oldPassword,
      "password": newPassword
    };
    return this.http.put(this.url + '/password', request, { headers });

  }
}
