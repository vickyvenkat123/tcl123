import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { City, CityConfig } from 'src/app/shared/models/customer-details.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CityConfigService {
  url: string = environment.url;
  constructor(private http: HttpClient) { }

  getTemplates(customerId: string) {
    var token = sessionStorage.getItem("token") || "";
    const headers = new HttpHeaders().set('Authorization', token);
    headers.append("Content-Type", "application/json");
    return this.http.get(this.url + '/userservice/templates/customer/' + customerId, { headers });
  }

  addNewCity(city: City, cityConfig: CityConfig) {
    var token = sessionStorage.getItem("token") || "";
    const headers = new HttpHeaders().set('Authorization', token);
    headers.append("Content-Type", "application/json");
    var request = {
      "active": city.active,
      "address": city.address,
      "customer": city.customer,
      "cityConfig": {
        "batteryLowColorCode": cityConfig.batteryLowColorCode,
        "abnormalBatteryPercentValue": cityConfig.abnormalBatteryPercentValue,
        "hazardousColorCode": cityConfig.hazardousColorCode,
        "hierarchylevel": cityConfig.hierarchylevel,
        "mailNotificationAllowed": cityConfig.mailNotificationAllowed,
        "zoneThresholdEnabled": cityConfig.zoneThresholdEnabled,
        "zoneThreshold": cityConfig.zoneThreshold,
        "sosColorCode": cityConfig.sosColorCode,
        "fallColorCode": cityConfig.fallColorCode,
        "idleColorCode": cityConfig.idleColorCode,
        "hazardousAlertEmailTemplate": cityConfig.healthAlertEmailTemplate,
        "hazardousAlertSMSTemplate": cityConfig.hazardousAlertSMSTemplate,
        "healthAlertEmailTemplate": cityConfig.healthAlertEmailTemplate,
        "healthAlertSMSTemplate": cityConfig.healthAlertSMSTemplate,
        "batteryAlertEmailTemplate": cityConfig.batteryAlertEmailTemplate,
        "batteryAlertSMSTemplate": cityConfig.batteryAlertSMSTemplate,
      },
      "cityName": city.cityName,
      "description": city.description,
      "emailId": city.emailId,
      "phoneNumber": city.phoneNumber,
    }
    return this.http.post(this.url + '/userservice/cities', request, { headers });

  }
}
