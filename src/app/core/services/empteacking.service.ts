import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EmpteackingService {
  url: string = environment.url;

  constructor(private http: HttpClient) { }
  
  ///  GET SITES   ///////////   (1)  API-I
  getSites() {
    var token = sessionStorage.getItem("token") || "";
    const headers = new HttpHeaders().set('Authorization', token);
    headers.append("Content-Type", "application/json");
    return this.http.get(this.url + '/userservice/sites', { headers });
  }
  ///  GET  EMPLOYEES    //////////  (2) API-II
  getEmployeeOfSiteByPageAndSize(siteId: string, pageNo: number, size: number) {
    var token = sessionStorage.getItem("token") || "";
    const headers = new HttpHeaders().set('Authorization', token);
    headers.append("Content-Type", "application/json");
    return this.http.get(this.url + '/employeeservice/employees?siteId=' + siteId + '&page=' + pageNo + '&size=' + size,
      { headers })
  }
  // searchEmployeeBySiteAndEmployeeId(site:string, empId:string, zoneTypes:string, startDateTime:string, endDateTime:string){
  //   var token = sessionStorage.getItem("token") || "";
  //   const headers = new HttpHeaders().set('Authorization', token);
  //   headers.append("Content-Type", "application/json");
  //   return this.http.get.(this.url + '/reportservice/employees/tracking/v2/site'+ site + '?empId=' + empId +'&zoneTypes=' + zoneTypes + '&startDateTime=' + startDateTime + '&endDateTime=' + endDateTime )
  // }
}
