import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class KpiService {
  getkpiData: any;
  getkpiSOS: any;
  
  url: string = environment.url;
 

 
 

  constructor(private http :HttpClient) { }

 
  getkpiDashboard(){
    let header = new HttpHeaders().set(
      "Authorization", sessionStorage.getItem("token")
       
    );
return this.http.get('https://emptracker.iot.tatacommunications.com/api/v1/dashboardservice/dashboard/kpi/management?username=cust.admin.east@tcl.com&customerId=600ea145d938ae00016fd456',{headers:header});
  }
  
  getkpicalender() {
    
 let header = new HttpHeaders().set(
  "Authorization", sessionStorage.getItem("token")
   
);
  return this.http.get('https://emptracker.iot.tatacommunications.com/api/v1/userservice/customers/5d026850fbf97000016896cc', {headers:header});
  }

  //KPI Data loass
//https://emptracker.iot.tatacommunications.com/api/v1/reportservice/badge/kpi/management/pl/scheduled/export?customerId=600ea145d938ae00016fd456
//https://emptracker.iot.tatacommunications.com/api/v1/reportservice/badge/kpi/management/pl/hazardous/export?customerId=600ea145d938ae00016fd456
 
//scheduled EXPORT
  
getkpiExportData(){
    var token = sessionStorage.getItem("token") || "";
    const headers = new HttpHeaders().set('Authorization', token);
    sessionStorage.getItem("customerId")
    headers.append("Content-Type", "application/json");
    return this.http.get(this.url + '/reportservice/badge/kpi/management/pl/scheduled/export?customerId='+ sessionStorage.getItem("customerId"),
      { responseType: 'blob', observe: 'response', headers: headers });
  }

  
  
 

  //KPI Data DELAY
  getkpiDelayExportData(type){
    var token = sessionStorage.getItem("token") || "";
    const headers = new HttpHeaders().set('Authorization', token);
    sessionStorage.getItem("customerId")
    headers.append("Content-Type", "application/json");
    return this.http.get(this.url + '/reportservice/badge/kpi/management/pl/scheduled/export?customerId='+ sessionStorage.getItem("customerId")+'&type='+type,
      { responseType: 'blob', observe: 'response', headers: headers });
  }
  
//KPI HealthIndex

getHealthIndexDataCW(){
     
 let header = new HttpHeaders().set(
  "Authorization", sessionStorage.getItem("token")
   
);
  return this.http.get('https://demo.emptracker.iot.tatacommunications.com/api/v1/uptimeservice/uptime?appName=CW', {headers:header});
}

getHealthIndexDataDASS(){
     
  let header = new HttpHeaders().set(
   "Authorization", sessionStorage.getItem("token")
    
 );
   return this.http.get('https://demo.emptracker.iot.tatacommunications.com/api/v1/uptimeservice/uptime?appName=DASS', {headers:header});
 }
} 

