import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CustomerConfigService {
  url :string =  environment.url;
  constructor(private http: HttpClient) { }

  getLoggedInUser() {
    var token = sessionStorage.getItem("token") || "";
    const headers = new HttpHeaders().set('Authorization', token);
    headers.append("Content-Type", "application/json");
    return this.http.get(this.url +'/getLoggedInUser', { headers });
  }
  getCustomerData(customerId: string) {
    var token = sessionStorage.getItem("token") || "";
    const headers = new HttpHeaders().set('Authorization', token);
    headers.append("Content-Type", "application/json");
    return this.http.get(this.url +'/userservice/customers/' + customerId, { headers });
  }

  getCustomersList() {
    var token = sessionStorage.getItem("token") || "";
    const headers = new HttpHeaders().set('Authorization', token);
    headers.append("Content-Type", "application/json");
    return this.http.get(this.url +'/userservice/customers', { headers });
  }

  getTemplates(type: String) {
    var token = sessionStorage.getItem("token") || "";
    const headers = new HttpHeaders().set('Authorization', token);
    headers.append("Content-Type", "application/json");
    return this.http.get(this.url +'/userservice/templates?type=' + type, { headers });
  }

  getCities(customerId: string) {
    var token = sessionStorage.getItem("token") || "";
    const headers = new HttpHeaders().set('Authorization', token);
    headers.append("Content-Type", "application/json");
    return this.http.get(this.url +'/userservice/cities?customerId=' + customerId, { headers });
  }

  getCityDetailsById(cityId: string) {
    var token = sessionStorage.getItem("token") || "";
    const headers = new HttpHeaders().set('Authorization', token);
    headers.append("Content-Type", "application/json");
    return this.http.get(this.url +'/userservice/cities/' + cityId, { headers });
  }

  getPlantsDetailsByCityId(cityId: string) {
    var token = sessionStorage.getItem("token") || "";
    const headers = new HttpHeaders().set('Authorization', token);
    headers.append("Content-Type", "application/json");
    return this.http.get(this.url +'/userservice/plants?cityId=' + cityId, { headers });
  }

  getPlantDetailsById(plantId: string) {
    var token = sessionStorage.getItem("token") || "";
    const headers = new HttpHeaders().set('Authorization', token);
    headers.append("Content-Type", "application/json");
    return this.http.get(this.url +'/userservice/plants/' + plantId, { headers });
  }

  getSiteDetailsByPlantId(plantId: string) {
    var token = sessionStorage.getItem("token") || "";
    const headers = new HttpHeaders().set('Authorization', token);
    headers.append("Content-Type", "application/json");
    return this.http.get(this.url +'/userservice/sites?plantId=' + plantId, { headers });
  }

  getSiteDetailsById(siteId: string) {
    var token = sessionStorage.getItem("token") || "";
    const headers = new HttpHeaders().set('Authorization', token);
    headers.append("Content-Type", "application/json");
    return this.http.get(this.url +'/userservice/sites/' + siteId, { headers });
  }

  getSites(){
    var token = sessionStorage.getItem("token") || "";
    const headers = new HttpHeaders().set('Authorization', token);
    headers.append("Content-Type", "application/json");
    return this.http.get(this.url +'/userservice/sites', { headers });
  }

  getSitesByCustomerId(customerId:string){
    var token = sessionStorage.getItem("token") || "";
    const headers = new HttpHeaders().set('Authorization', token);
    headers.append("Content-Type", "application/json");
    return this.http.get(this.url +'/userservice/sites?customerId=' + customerId, { headers });
  }

  getPlantsByCustomerId(customerId:string){
    var token = sessionStorage.getItem("token") || "";
    const headers = new HttpHeaders().set('Authorization', token);
    headers.append("Content-Type", "application/json");
    return this.http.get(this.url +'/userservice/plants?customerId=' + customerId, { headers });
  }
}
