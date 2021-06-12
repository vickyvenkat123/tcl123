import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DeviceService {
  url: string = environment.url;
  constructor(private http: HttpClient) { }

  getBeaconByPageAndSize(customerId: string, cityId: string, plantId: string, pageNo: number, size: number) {
    var token = sessionStorage.getItem("token") || "";
    const headers = new HttpHeaders().set('Authorization', token);
    headers.append("Content-Type", "application/json");
    var url = this.url + '/deviceservice/beacons?page=' + pageNo + '&size=' + size + '&customerId=' + customerId;
    if (cityId !== "All" && cityId !== "")
      url = url + '&cityId=' + cityId;
    if (plantId! == "" && plantId !== "")
      url = url + '&plantId=' + plantId;
    return this.http.get(url, { headers: headers });
  }

  getBeaconsForBeaconId(beaconId: string) {
    var token = sessionStorage.getItem("token") || "";
    const headers = new HttpHeaders().set('Authorization', token);
    headers.append("Content-Type", "application/json");
    var url = this.url + '/deviceservice/beacons?search=' + beaconId;
    return this.http.get(url, { headers: headers });

  }

  exportBeaconData(customerId: string) {
    var token = sessionStorage.getItem("token") || "";
    const headers = new HttpHeaders().set('Authorization', token);
    headers.append("Content-Type", "application/json");
    return this.http.get(this.url + '/deviceservice/beacons/export?customerId=' + customerId,
      { responseType: 'blob', observe: 'response', headers: headers });

  }
}