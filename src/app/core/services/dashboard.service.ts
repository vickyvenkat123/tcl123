import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  //   headers.append("Content-Type", "application/json");
  //   return this.http.get(this.url + '/dashboardservice/dashboard/utilization/status?customerId=' + customerId,
  //     { headers: headers });
  // }

  url: string = environment.url;
  constructor(private http: HttpClient) { }

  getEmployeesOfSiteByPageAndSize(siteId: string, pageNo: number, size: number) {
    var token = sessionStorage.getItem("token") || "";
    const headers = new HttpHeaders().set('Authorization', token);
    headers.append("Content-Type", "application/json");
    return this.http.get(this.url + '/dashboardservice/operational/dashboard/employees?siteId=' + siteId + '&page=' + pageNo +
      '&size=' + size, { headers });
  }

  getAlertCounts(siteId: string, pageNo: number, size: number) {
    var token = sessionStorage.getItem("token") || "";
    const headers = new HttpHeaders().set('Authorization', token);
    headers.append("Content-Type", "application/json");
    return this.http.get(this.url + '/dashboardservice/operational/dashboard/alerts/count?siteId=' + siteId + '&page=' + pageNo +
      '&size=' + size, { headers });
  }

  searchEmployeeBySiteAndEmployeeId(siteId: string, employeeId: string, pageNo: number, size: number) {
    var token = sessionStorage.getItem("token") || "";
    const headers = new HttpHeaders().set('Authorization', token);
    headers.append("Content-Type", "application/json");
    return this.http.get(this.url + '/dashboardservice/operational/dashboard/'
      + 'employees/search?siteId=' + siteId + '&page=' + pageNo + '&size=' + size + '&employeeId=' + employeeId, { headers });

  }

  exportEmployees(siteId: string) {
    var token = sessionStorage.getItem("token") || "";
    const headers = new HttpHeaders().set('Authorization', token);
    headers.append("Content-Type", "application/json");
    return this.http.get(this.url + '/dashboardservice/operational/dashboard/employees/export?siteId=' + siteId,
      { responseType: 'blob', observe: 'response', headers: headers });
  }

  getZoneStatus(mapId: string, siteId: string) {
    var token = sessionStorage.getItem("token") || "";
    const headers = new HttpHeaders().set('Authorization', token);
    headers.append("Content-Type", "application/json");
    return this.http.get(this.url + '/dashboardservice/operational/dashboard/employees/zonestatus/' + mapId + '?siteId=' + siteId,
      { headers: headers });
  }

  getZoneCount(customerId: string, cityId: string, plantId: string, siteId: string) {
    var token = sessionStorage.getItem("token") || "";
    const headers = new HttpHeaders().set('Authorization', token);
    headers.append("Content-Type", "application/json");
    return this.http.get(this.url + '/dashboardservice/zones/count?customerId=' + customerId + '&cityId=' + cityId + '&plantId=' + plantId + '&siteId=' + siteId,
      { headers: headers });

  }

  getZoneDataByPageSizeCPSAndHotZone(customerId: string, pageNo: number, size: number, cityId: string, plantId: string, siteId: string, searchZoneName: string, hotZone: boolean) {
    var token = sessionStorage.getItem("token") || "";
    const headers = new HttpHeaders().set('Authorization', token);
    headers.append("Content-Type", "application/json");
    if (searchZoneName === "") {
      return this.http.get(this.url + '/dashboardservice/zones?customerId=' + customerId + '&page=' + pageNo + '&size=' + size + '&cityId=' + cityId + '&plantId=' + plantId + '&siteId=' + siteId + '&hotZone=' + hotZone,
        { headers: headers });
    }
    else {
      return this.http.get(this.url + '/dashboardservice/zones?customerId=' + customerId + '&page=' + pageNo + '&size=' + size + '&cityId=' + cityId + '&plantId=' + plantId + '&siteId=' + siteId + '&search=' + searchZoneName + '&hotZone=' + hotZone,
        { headers: headers });
    }
  }

  getEmployeesForZoneDashboard(customerId: string, pageNo: number, size: number, cityId: string, plantId: string, siteId: string, zoneId: string, search: string) {
    var token = sessionStorage.getItem("token") || "";
    const headers = new HttpHeaders().set('Authorization', token);
    headers.append("Content-Type", "application/json");
    var url = this.url + '/dashboardservice/zones/employees?customerId=' + customerId + '&page=' + pageNo + '&size=' + size;
    if (cityId !== "")
      url = url + '&cityId=' + cityId;
    if (plantId! == "")
      url = url + '&plantId=' + plantId;
    if (siteId !== "")
      url = url + '&siteId=' + siteId;
    if (zoneId != "")
      url = url + '&zoneId=' + zoneId;
    if (search != "")
      url = url + '&search=' + search;
    return this.http.get(url, { headers: headers });
  }

  getCardUtilizationCount(customerId: string, cityId: string, plantId: string) {
    var token = sessionStorage.getItem("token") || "";
    const headers = new HttpHeaders().set('Authorization', token);
    headers.append("Content-Type", "application/json");
    return this.http.get(this.url + '/dashboardservice/dashboard/card/utilization/count?customerId=' + customerId + '&cityId=' + cityId + '&plantId=' + plantId,
      { headers: headers });
  }

  getCardUtilizationTrends(customerId: string, cityId: string, plantId: string) {
    var token = sessionStorage.getItem("token") || "";
    const headers = new HttpHeaders().set('Authorization', token);
    headers.append("Content-Type", "application/json");
    return this.http.get(this.url + '/dashboardservice/dashboard/card/utilization/trends?customerId=' + customerId + '&cityId=' + cityId + '&plantId=' + plantId,
      { headers: headers });
  }

  getCardUtilizationStauts(customerId: string, cityId: string, plantId: string) {
    var token = sessionStorage.getItem("token") || "";
    const headers = new HttpHeaders().set('Authorization', token);
    headers.append("Content-Type", "application/json");
    return this.http.get(this.url + '/dashboardservice/dashboard/card/utilization/status?customerId=' + customerId + '&cityId=' + cityId + '&plantId=' + plantId,
      { headers: headers });
  }

  // getbadgeUtilizationStauts(customerId: string) {
  //   var token = sessionStorage.getItem("token") || "";
  //   const headers = new HttpHeaders().set('Authorization', token);
  //   headers.append("Content-Type", "application/json");
  //   return this.http.get(this.url + '/dashboardservice/dashboard/utilization/status?customerId=' + customerId,
  //     { headers: headers });
  // }

  exportCardsDataByReportType(customerId: string, reportType: string, cityId: string, plantId: string) {
    var token = sessionStorage.getItem("token") || "";
    const headers = new HttpHeaders().set('Authorization', token);
    headers.append("Content-Type", "application/json");
    return this.http.get(this.url + '/dashboardservice/dashboard/card/utilization/devices/export?customerId=' + customerId + '&reportType=' + reportType + '&cityId=' + cityId + '&plantId=' + plantId,
      { responseType: 'blob', observe: 'response', headers: headers });
  }

  getExecutiveAlerts(customerId: string, fromDate: string, toDate: string, cityId: string, plantId: string, siteId: string) {
    var token = sessionStorage.getItem("token") || "";
    const headers = new HttpHeaders().set('Authorization', token);
    headers.append("Content-Type", "application/json");
    return this.http.get(this.url + '/dashboardservice/executive/dashboard/alert/summary?fromDate=' + fromDate + '&todate=' + toDate + '&customerId=' + customerId + '&cityId=' + cityId + '&plantId=' + plantId + '&siteId=' + siteId,
      { headers: headers });
  }

  exportZonesOfZoneDashboard(customerId: string, cityId: string, plantId: string, siteId: string, hotZone: boolean) {
    var token = sessionStorage.getItem("token") || "";
    const headers = new HttpHeaders().set('Authorization', token);
    headers.append("Content-Type", "application/json");
    return this.http.get(this.url + '/dashboardservice/zones/export?customerId=' + customerId + '&cityId=' + cityId + '&plantId=' + plantId + '&siteId=' + siteId + '&hotZone=' + hotZone,
      { responseType: 'blob', observe: 'response', headers: headers });
  }

  exportEmployeesOfZoneDashboard(customerId: string, hotZone: boolean) {
    var token = sessionStorage.getItem("token") || "";
    const headers = new HttpHeaders().set('Authorization', token);
    headers.append("Content-Type", "application/json");
    return this.http.get(this.url + '/dashboardservice/zones/employees/export?customerId=' + customerId + '&hotZone=' + hotZone,
      { responseType: 'blob', observe: 'response', headers: headers });
  }

  exportUtilizationByType(type: string, customerId: string, cityId: string, date: string) {
    var token = sessionStorage.getItem("token") || "";
    const headers = new HttpHeaders().set('Authorization', token);
    headers.append("Content-Type", "application/json");
    if (cityId === "All") {
      return this.http.get(this.url + '/dashboardservice/dashboard/utilization/status/export?type=' + type +
        '&customerId=' + customerId + '&date=' + date,
        { responseType: 'blob', observe: 'response', headers: headers });
    } else {
      return this.http.get(this.url + '/dashboardservice/dashboard/utilization/status/export?type=' + type +
        '&customerId=' + customerId + '&cityId=' + cityId + '&date=' + date,
        { responseType: 'blob', observe: 'response', headers: headers });
    }
  }

  getZoneViolationCount(customerId: string, fromDate: string, toDate: string, cityId: string, plantId: string, siteId: string) {
    var token = sessionStorage.getItem("token") || "";
    const headers = new HttpHeaders().set('Authorization', token);
    headers.append("Content-Type", "application/json");
    return this.http.get(this.url + '/dashboardservice/zone/violations/summary/count?fromDate=' + fromDate + '&todate=' + toDate + '&customerId=' + customerId + '&cityId=' + cityId + '&plantId=' + plantId + '&siteId=' + siteId,
      { headers: headers });
  }

  getTotalViolationsSummaryByPageAndSize(customerId: string, fromDate: string, toDate: string, cityId: string, plantId: string, siteId: string, pageNo: number, size: number) {
    var token = sessionStorage.getItem("token") || "";
    const headers = new HttpHeaders().set('Authorization', token);
    headers.append("Content-Type", "application/json");
    return this.http.get(this.url + '/dashboardservice/zone/violations/summary?fromDate=' + fromDate + '&todate=' + toDate + '&page=' + pageNo + '&size=' + size + '&customerId=' + customerId + '&cityId=' + cityId + '&plantId=' + plantId + '&siteId=' + siteId,
      { headers: headers });
  }

  exportZoneViolationSummary(customerId: string, fromDate: string, toDate: string, cityId: string, plantId: string, siteId: string) {
    var token = sessionStorage.getItem("token") || "";
    const headers = new HttpHeaders().set('Authorization', token);
    headers.append("Content-Type", "application/json");
    return this.http.get(this.url + '/dashboardservice/zone/violations/summary/export?customerId=' + customerId + '&fromDate=' + fromDate + '&toDate=' + toDate + '&cityId=' + cityId + '&plantId=' + plantId + '&siteId=' + siteId,
      { responseType: 'blob', observe: 'response', headers: headers });
  }

  exportZoneViolationStatus(customerId: string, fromDate: string, toDate: string, cityId: string, plantId: string, siteId: string) {
    var token = sessionStorage.getItem("token") || "";
    const headers = new HttpHeaders().set('Authorization', token);
    headers.append("Content-Type", "application/json");
    return this.http.get(this.url + '/dashboardservice/zone/violations/zone/export?customerId=' + customerId + '&fromDate=' + fromDate + '&toDate=' + toDate + '&cityId=' + cityId + '&plantId=' + plantId + '&siteId=' + siteId,
      { responseType: 'blob', observe: 'response', headers: headers });
  }

  getZoneViolationDetails(customerId: string, fromDate: any, toDate: any, cityId: string, plantId: string, siteId: string, pageNo: number, size: number, zoneId: string) {
    var token = sessionStorage.getItem("token") || "";
    const headers = new HttpHeaders().set('Authorization', token);
    headers.append("Content-Type", "application/json");
    return this.http.get(this.url + '/dashboardservice/zone/violations/zone?&customerId=' + customerId + '&fromDate=' + fromDate + '&todate=' + toDate + '&page=' + '&cityId=' + cityId + '&plantId=' + plantId + '&siteId=' + siteId +
      '&pageNo=' + pageNo + '&size=' + size + '&zoneId=' + zoneId, { headers: headers });
  }

  exportZoneViolationDetails(customerId: string, fromDate: string, toDate: string, cityId: string, plantId: string, siteId: string, zoneId: string) {
    var token = sessionStorage.getItem("token") || "";
    const headers = new HttpHeaders().set('Authorization', token);
    headers.append("Content-Type", "application/json");
    return this.http.get(this.url + '/dashboardservice/zone/violations/zone/export?customerId=' + customerId + '&fromDate=' + fromDate + '&toDate=' + toDate + '&cityId=' + cityId + '&plantId=' + plantId + '&siteId=' + siteId + '&zoneId=' + zoneId,
      { responseType: 'blob', observe: 'response', headers: headers });
  }

  getBatteryStatus(userId: string, siteId: string) {
    var token = sessionStorage.getItem("token") || "";
    const headers = new HttpHeaders().set('Authorization', token);
    headers.append("Content-Type", "application/json");
    return this.http.get(this.url + '/dashboardservice/operational/dashboard/battery/status?&userId=' + userId + '&siteId=' + siteId, { headers: headers });
  }

  getSafetyAlertCount(userId: string, siteId: string) {
    var token = sessionStorage.getItem("token") || "";
    const headers = new HttpHeaders().set('Authorization', token);
    headers.append("Content-Type", "application/json");
    return this.http.get(this.url + '/dashboardservice/operational/dashboard/safety/alert/count?&userId=' + userId + '&siteId=' + siteId, { headers: headers });
  }
  getAlertsCount(){
    var token = sessionStorage.getItem("token") || "";
    const headers = new HttpHeaders().set('Authorization', token);
    headers.append("Content-Type", "application/json");
    return this.http.get(this.url + '/dashboardservice/alerts/count?&date=' +new Date().getTime(), { headers: headers });
  }
}