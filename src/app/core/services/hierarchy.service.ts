import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HierarchyService {
  url: string = environment.url;
  constructor(private http: HttpClient) { }

  getMapListForSiteId(siteId: string) {
    var token = sessionStorage.getItem("token") || "";
    const headers = new HttpHeaders().set('Authorization', token);
    headers.append("Content-Type", "application/json");
    return this.http.get(this.url + '/hierarchyservice/getMapListForSiteId/' + siteId, { headers });
  }

  getMapDataByMapId(mapId: string) {
    var token = sessionStorage.getItem("token") || "";
    const headers = new HttpHeaders().set('Authorization', token);
    headers.append("Content-Type", "application/json");
    headers.append("Access-Control-Allow-Origin", "*");
    return this.http.get(this.url + '/hierarchyservice/map/' + mapId, { headers });
  }

  getZoneAndBeaconDetailAccordingHierarchyLevelMapId(mapId: string) {
    var token = sessionStorage.getItem("token") || "";
    const headers = new HttpHeaders().set('Authorization', token);
    headers.append("Content-Type", "application/json");
    return this.http.get(this.url + '/hierarchyservice/rest/getZoneAndBeaconDetailAccordingHierarchyLevelMapId/' + mapId, { headers });
  }

  getBeaconDetailsByZoneAndSiteId(siteId: any, zoneId: any) {
    var token = sessionStorage.getItem("token") || "";
    const headers = new HttpHeaders().set('Authorization', token);
    headers.append("Content-Type", "application/json");
    return this.http.get(this.url + '/hierarchyservice/zones/beacon/details?siteId=' + siteId + '&zoneId=' + zoneId, { headers });

  }

}
