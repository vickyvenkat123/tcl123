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

  getTotalInstalledGatewaysExport(customerId: string) {
    var token = sessionStorage.getItem("token") || "";
    const headers = new HttpHeaders().set('Authorization', token);
    headers.append("Content-Type", "application/json");
    return this.http.get(this.url + '/deviceservice/gateways/export?customerId=' + customerId,
      { responseType: 'blob', observe: 'response', headers: headers })
  }

  getWorkingGatewaysExport(customerId: string) {
    var token = sessionStorage.getItem("token") || "";
    const headers = new HttpHeaders().set('Authorization', token);
    headers.append("Content-Type", "application/json");
    return this.http.get(this.url + '/deviceservice/gateways/export?customerId=' + customerId + '&workingStatus=Working',
      { responseType: 'blob', observe: 'response', headers: headers })
  }

  getNonWorkingGatewaysExport(customerId: string) {
    var token = sessionStorage.getItem("token") || "";
    const headers = new HttpHeaders().set('Authorization', token);
    headers.append("Content-Type", "application/json");
    return this.http.get(this.url + '/deviceservice/gateways/export?customerId=' + customerId + '&workingStatus=Not%20Working',
      { responseType: 'blob', observe: 'response', headers: headers })
  }

  getNetworkUptimeExport(customerId: string, cityId: string, fromDate: string, toDate: string) {
    var token = sessionStorage.getItem("token") || "";
    const headers = new HttpHeaders().set('Authorization', token);
    headers.append("Content-Type", "application/json");
    if (cityId === "") {
      return this.http.get(this.url + '/dashboardservice/gateways/export/uptime/histroical?customerId=' + customerId + '&fromDate=' + fromDate + '&toDate=' + toDate,
        { responseType: 'blob', observe: 'response', headers: headers })
    }
    else {
      return this.http.get(this.url + '/dashboardservice/gateways/export/uptime/histroical?customerId=' + customerId + '&cityId=' + cityId + 'fromDate=' + fromDate + '&toDate=' + toDate,
        { responseType: 'blob', observe: 'response', headers: headers })
    }
  }

  getHistoricalExport(customerId: string, cityId: string, fromDate: string, toDate: string) {
    var token = sessionStorage.getItem("token") || "";
    const headers = new HttpHeaders().set('Authorization', token);
    headers.append("Content-Type", "application/json");
    if (cityId === "") {
      return this.http.get(this.url + '/dashboardservice/gateways/export/historical?customerId=' + customerId + '&fromDate=' + fromDate + '&toDate=' + toDate,
        { responseType: 'blob', observe: 'response', headers: headers })
    }
    else {
      return this.http.get(this.url + '/dashboardservice/gateways/export/historical?customerId=' + customerId + '&fromDate=' + fromDate + '&toDate=' + toDate + '&cityId=' + cityId,
        { responseType: 'blob', observe: 'response', headers: headers })
    }
  }

  getDownTimeExport(customerId: string, cityId: string, fromDate: string, toDate: string) {
    var token = sessionStorage.getItem("token") || "";
    const headers = new HttpHeaders().set('Authorization', token);
    headers.append("Content-Type", "application/json");
    if (cityId === "") {
      return this.http.get(this.url + '/dashboardservice/gateways/export/network/summary?customerId=' + customerId + '&fromDate=' + fromDate + '&toDate=' + toDate,
        { responseType: 'blob', observe: 'response', headers: headers })
    }
    else {
      return this.http.get(this.url + '/dashboardservice/gateways/export/network/summary?customerId=' + customerId + '&fromDate=' + fromDate + '&toDate=' + toDate + '&cityId=' + cityId,
        { responseType: 'blob', observe: 'response', headers: headers })
    }
  }
}