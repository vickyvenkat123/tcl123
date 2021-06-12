import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class LoginService {
  url: string = environment.url;
  secretKey:string = "MP2021";
  constructor(private http: HttpClient) { }

  login(username: string, password: string) {
    let request = {
      "username": username,
      "password": password,
      "grant_type": "password",
      "client_id": "swa-app"
    };
    return this.http.post(this.url + '/login/token', request);
  }

  logout() {
    var token = sessionStorage.getItem("token") || "";
    const headers = new HttpHeaders().set('Authorization', token);
    headers.append("Content-Type", "application/json");
    return this.http.get(this.url + '/logout', { headers });
  }

  isLoggedIn(){
    if(sessionStorage.getItem("token")!== ""){
    return true;
    }
    else{
      return false;
    }
  }
}
