import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GatewayService {
  url: string = environment.url;

  constructor(private http: HttpClient) { }

  getNetworkStatus(customerId: string) {
    var token = sessionStorage.getItem("token") || "";
    const headers = new HttpHeaders().set('Authorization', token);
    headers.append("Content-Type", "application/json");
    return this.http.get(this.url + '/dashboardservice/gateways/count?customerId=' + customerId,
      { headers })
  }

  getTotalInstalledGateways(customerId: string) {
    var token = sessionStorage.getItem("token") || "";
    const headers = new HttpHeaders().set('Authorization', token);
    headers.append("Content-Type", "application/json");
    return this.http.get(this.url + '/dashboardservice/gateways/status?customerId=' + customerId,
      { headers })
  }

  getWorkingGateways(customerId: string, type: string) {
    var token = sessionStorage.getItem("token") || "";
    const headers = new HttpHeaders().set('Authorization', token);
    headers.append("Content-Type", "application/json");
    return this.http.get(this.url + '/dashboardservice/gateways/status?customerId=' + customerId + '&type=' + type,
      { headers })
  }

  getNonWorkingGateways(customerId: string) {
    var token = sessionStorage.getItem("token") || "";
    const headers = new HttpHeaders().set('Authorization', token);
    headers.append("Content-Type", "application/json");
    return this.http.get(this.url + '/dashboardservice/gateways/status?customerId=' + customerId + '&type=Not%20Working',
      { headers })
  }

  getNetworkUptime(customerId: string) {
    var token = sessionStorage.getItem("token") || "";
    const headers = new HttpHeaders().set('Authorization', token);
    headers.append("Content-Type", "application/json");
    return this.http.get(this.url + '/dashboardservice/gateways/status/uptime?customerId=' + customerId,
      { headers })
  }

  getCityList(customerId: string) {
    var token = sessionStorage.getItem("token") || "";
    const headers = new HttpHeaders().set('Authorization', token);
    headers.append("Content-Type", "application/json");
    return this.http.get(this.url + '/userservice/cities?customerId=' + customerId,
      { headers })
  }
  // getExecutiveAlerts(customerId: string, fromDate: string, toDate: string, cityId: string, plantId: string, siteId: string) {
  //   var token = sessionStorage.getItem("token") || "";
  //   const headers = new HttpHeaders().set('Authorization', token);
  //   headers.append("Content-Type", "application/json");
  //   return this.http.get(this.url + '/dashboardservice/executive/dashboard/alert/summary?fromDate=' + fromDate + '&todate=' + toDate + '&customerId=' + customerId + '&cityId=' + cityId + '&plantId=' + plantId + '&siteId=' + siteId,
  //     { headers: headers });
  // }
  downloadNetworkUpTimeHistoricalReport(customerId: string, fromDate: string, toDate: string, cityId: string) {
    var token = sessionStorage.getItem("token") || "";
    const headers = new HttpHeaders().set('Authorization', token);
    headers.append("Content-Type", "application/json");
    return this.http.get(this.url + '/dashboardservice/gateways/export/histroical?customerId=' +
      customerId + '&fromDate=' + fromDate + '&toDate=' + toDate + '&cityId=' + cityId,
      { responseType: 'blob', observe: 'response', headers: headers })
  }

  getTotalInstalledGatewaysExport(customerId: string) {
    var token = sessionStorage.getItem("token") || "";
    const headers = new HttpHeaders().set('Authorization', token);
    headers.append("Content-Type", "application/json");
    return this.http.get(this.url + '/deviceservice/gateways/export?customerId=' + customerId,
      { headers })
  }

  getWorkingGatewaysExport(customerId: string, workingStatus: string) {
    var token = sessionStorage.getItem("token") || "";
    const headers = new HttpHeaders().set('Authorization', token);
    headers.append("Content-Type", "application/json");
    return this.http.get(this.url + '/deviceservice/gateways/export?customerId=' + customerId + '&workingStatus=' + workingStatus,
      { headers })
  }

  getNonWorkingGatewaysExport(customerId: string) {
    var token = sessionStorage.getItem("token") || "";
    const headers = new HttpHeaders().set('Authorization', token);
    headers.append("Content-Type", "application/json");
    return this.http.get(this.url + '/deviceservice/gateways/export?customerId=' + customerId + '&workingStatus=Not%20Working',
      { headers })
  }
  getNetworkUptimeExport(customerId: string) {
    var token = sessionStorage.getItem("token") || "";
    const headers = new HttpHeaders().set('Authorization', token);
    headers.append("Content-Type", "application/json");
    return this.http.get(this.url + '/dashboardservice/gateways/export/uptime/historical?customerId=' + customerId,
      { headers })
  }
getAllGatewaysExport(customerId: string){
  var token = sessionStorage.getItem("token") || "";
  const headers = new HttpHeaders().set('Authorization', token);
  headers.append("Content-Type", "application/json");
  return this.http.get(this.url + '/dashboardservice/gateways/export/historical?customerId=' + customerId,
    { headers })
}
}