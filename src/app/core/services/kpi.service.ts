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

 
  
  getkpicalender() {
    
 let header = new HttpHeaders().set(
  "Authorization", sessionStorage.getItem("token")
   
);
  return this.http.get('https://emptracker.iot.tatacommunications.com/api/v1/userservice/customers/5d026850fbf97000016896cc', {headers:header});
  }
  // getkpiBell(){
  //   let header = new HttpHeaders().set(
  //     "Authorization", sessionStorage.getItem("token")
       
  //   );
  //   return this.http.get(');
  // }
  
  getkpiExportData(){
    // let header = new HttpHeaders().set(
    //   "Authorization", sessionStorage.getItem('token')
    //   );
    // return this.http.get('https://emptracker.iot.tatacommunications.com/api/v1/dashboardservice/dashboard/kpi/management?username=demouser@tcl.com&customerId=5d026850fbf97000016896cc', {headers:header});
    // }



    var token = sessionStorage.getItem("token") || "";
    const headers = new HttpHeaders().set('Authorization', token);
    sessionStorage.getItem("customerId")
    headers.append("Content-Type", "application/json");
    return this.http.get(this.url + '/reportservice/badge/kpi/management/pl/scheduled/export?customerId='+ sessionStorage.getItem("customerId"),
      { responseType: 'blob', observe: 'response', headers: headers });
  }
  

  
  // getkpiBattery(){
  //   return this.http.get('');
  // }
 
  // requestDataFromMultipleSources(): Observable<any[]> {
  //   const response1 = this.getkpiBell(),
  //     response2 = this.getkpiSOS(),
  //     response3 = this.getkpiBattery();
  //   // Observable.forkJoin (RxJS 5) changes to just forkJoin() in RxJS 6
  //   return forkJoin([response1, response2, response3]);
  // }
}
function https(https: any) {
  throw new Error('Function not implemented.');
}

