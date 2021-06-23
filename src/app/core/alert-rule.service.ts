import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AlertRuleService {

  url: string = environment.url;
  constructor(private http: HttpClient) { }

  getAlertRuleList(pageNo: number, size: number) {
    var token = sessionStorage.getItem("token") || "";
    const headers = new HttpHeaders().set('Authorization', token);
    headers.append("Content-Type", "application/json");
    return this.http.get(this.url + '/userservice/alert?page=' + pageNo + '&size=' + size, { headers: headers });
  }

  saveAlertRule(alertName: string, selectedHierarchy: string, customerId: string, customerName: string, cityList: any, alertTypes: any,
    plantList: any, siteList: any, employeeList: any, userId: string, userType: string, email: boolean, sms: boolean) {
    var token = sessionStorage.getItem("token") || "";
    const headers = new HttpHeaders().set('Authorization', token);
    headers.append("Content-Type", "application/json");
    var request;
    if (selectedHierarchy === "EMPLOYEE") {
      request = {
        "alertRuleName": alertName,
        "hierarchyType": selectedHierarchy,
        "customerList": [
          {
            "customerId": customerId,
            "customerName": customerName
          }
        ],
        "cityList": cityList,
        "siteList": siteList,
        "employee": employeeList,
        "plantList": plantList,
        "alertType": alertTypes,
        "popupAllowed": false,
        "emailAllowed": email,
        "smsAllowed": sms,
        "soundAllowed": false,
        "active": true,
        "user": {
          "userId": userId,
          "userType": userType
        }
      }
    }
    else if (selectedHierarchy === "CITY" || selectedHierarchy === "CUSTOMER") {
      request = {
        "alertRuleName": alertName,
        "hierarchyType": selectedHierarchy,
        "customerList": [
          {
            "customerId": customerId,
            "customerName": customerName
          }
        ],
        "cityList": cityList,
        "alertType": alertTypes,
        "popupAllowed": false,
        "emailAllowed": email,
        "smsAllowed": sms,
        "soundAllowed": false,
        "active": true,
        "user": {
          "userId": userId,
          "userType": userType
        }
      }
    }
    else if (selectedHierarchy === "SITE") {
      request = {
        "alertRuleName": alertName,
        "hierarchyType": selectedHierarchy,
        "customerList": [
          {
            "customerId": customerId,
            "customerName": customerName
          }
        ],
        "cityList": cityList,
        "siteList": siteList,
        "plantList": plantList,
        "alertType": alertTypes,
        "popupAllowed": false,
        "emailAllowed": email,
        "smsAllowed": sms,
        "soundAllowed": false,
        "active": true,
        "user": {
          "userId": userId,
          "userType": userType
        }
      }
    }
    else if (selectedHierarchy === "PLANT") {
      request = {
        "alertRuleName": alertName,
        "hierarchyType": selectedHierarchy,
        "customerList": [
          {
            "customerId": customerId,
            "customerName": customerName
          }
        ],
        "cityList": cityList,
        "plantList": plantList,
        "alertType": alertTypes,
        "popupAllowed": false,
        "emailAllowed": email,
        "smsAllowed": sms,
        "soundAllowed": false,
        "active": true,
        "user": {
          "userId": userId,
          "userType": userType
        }
      }
    }
    return this.http.post(this.url + '/userservice/alert', request, { headers });
  }

  updateAlertRule(alertName: string, alertId: string, selectedHierarchy: string, customerId: string, customerName: string, cityList: any, alertTypes: any,
    plantList: any, siteList: any, employeeList: any, userId: string, userType: string, email: boolean, sms: boolean) {
    var token = sessionStorage.getItem("token") || "";
    const headers = new HttpHeaders().set('Authorization', token);
    headers.append("Content-Type", "application/json");
    var request;
    if (selectedHierarchy === "EMPLOYEE") {
      request = {
        "alertRuleName": alertName,
        "alertRuleId": alertId,
        "hierarchyType": selectedHierarchy,
        "customerList": [
          {
            "customerId": customerId,
            "customerName": customerName
          }
        ],
        "cityList": cityList,
        "siteList": siteList,
        "employee": employeeList,
        "plantList": plantList,
        "alertType": alertTypes,
        "popupAllowed": false,
        "emailAllowed": email,
        "smsAllowed": sms,
        "soundAllowed": false,
        "active": true,
        "user": {
          "userId": userId,
          "userType": userType
        }
      }
    }
    else if (selectedHierarchy === "CITY" || selectedHierarchy === "CUSTOMER") {
      request = {
        "alertRuleName": alertName,
        "alertRuleId": alertId,
        "hierarchyType": selectedHierarchy,
        "customerList": [
          {
            "customerId": customerId,
            "customerName": customerName
          }
        ],
        "cityList": cityList,
        "alertType": alertTypes,
        "popupAllowed": false,
        "emailAllowed": email,
        "smsAllowed": sms,
        "soundAllowed": false,
        "active": true,
        "user": {
          "userId": userId,
          "userType": userType
        }
      }
    }
    else if (selectedHierarchy === "SITE") {
      request = {
        "alertRuleName": alertName,
        "alertRuleId": alertId,
        "hierarchyType": selectedHierarchy,
        "customerList": [
          {
            "customerId": customerId,
            "customerName": customerName
          }
        ],
        "cityList": cityList,
        "siteList": siteList,
        "plantList": plantList,
        "alertType": alertTypes,
        "popupAllowed": false,
        "emailAllowed": email,
        "smsAllowed": sms,
        "soundAllowed": false,
        "active": true,
        "user": {
          "userId": userId,
          "userType": userType
        }
      }
    }
    else if (selectedHierarchy === "PLANT") {
      request = {
        "alertRuleName": alertName,
        "alertRuleId": alertId,
        "hierarchyType": selectedHierarchy,
        "customerList": [
          {
            "customerId": customerId,
            "customerName": customerName
          }
        ],
        "cityList": cityList,
        "plantList": plantList,
        "alertType": alertTypes,
        "popupAllowed": false,
        "emailAllowed": email,
        "smsAllowed": sms,
        "soundAllowed": false,
        "active": true,
        "user": {
          "userId": userId,
          "userType": userType
        }
      }
    }
    return this.http.put(this.url + '/userservice/alert', request, { headers });
  }

  getEmployeesBySiteId(siteId: string) {
    var token = sessionStorage.getItem("token") || "";
    const headers = new HttpHeaders().set('Authorization', token);
    headers.append("Content-Type", "application/json");
    return this.http.get(this.url + '/employeeservice/employees?siteId=' + siteId + '&isMapped=1',
      { headers })
  }

  getUserByUserId(userId: string) {
    var token = sessionStorage.getItem("token") || "";
    const headers = new HttpHeaders().set('Authorization', token);
    headers.append("Content-Type", "application/json");
    return this.http.get(this.url + '/userservice//users/%7BuserId%7D?userId=' + userId,
      { headers })
  }

  getAlertRulesByUserName(searchUserName: string) {
    var token = sessionStorage.getItem("token") || "";
    const headers = new HttpHeaders().set('Authorization', token);
    headers.append("Content-Type", "application/json");
    return this.http.get(this.url + '/userservice/alert/alertRule/search?userName=' + searchUserName,
      { headers })
  }

  getAlertRuleConfiguration(ruleId: string) {
    var token = sessionStorage.getItem("token") || "";
    const headers = new HttpHeaders().set('Authorization', token);
    headers.append("Content-Type", "application/json");
    return this.http.get(this.url + '/userservice/alert/' + ruleId, { headers: headers });
  }

  updateAlertRuleStatus(active: boolean, alertRuleId: string, alertRuleName: string) {
    var token = sessionStorage.getItem("token") || "";
    const headers = new HttpHeaders().set('Authorization', token);
    headers.append("Content-Type", "application/json");
    var request = {
      "alertRuleName": alertRuleName,
      "alertRuleId": alertRuleId,
      "active": !active
    };
    return this.http.put(this.url + '/userservice/alert/status', request, { headers });
  }
}