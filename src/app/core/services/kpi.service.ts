import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class KpiService {
  getkpiData: any;
  getKPIExport: any;
  getkpiSOS: any;
  
 

 
 

  constructor(private http :HttpClient) { }

 
  
  getkpicalender() {
    
 let header = new HttpHeaders().set(
  "Authorization", sessionStorage.getItem("token")
   
);
  return this.http.get('https://emptracker.iot.tatacommunications.com/api/v1/userservice/customers/5d026850fbf97000016896cc', {headers:header});
  }
  getkpiBell(){
    let header = new HttpHeaders().set(
      "Authorization", sessionStorage.getItem("token")
       
    );
    return this.http.get('https://emptracker.iot.tatacommunications.com/api/v1/dashboardservice/dashboard/kpi/management?username=demouser@tcl.com&customerId=5d026850fbf97000016896cc', {headers:header});
  }
  getkpiExportData(){
    let header = new HttpHeaders().set(
      "Authorization", sessionStorage.getItem("token")
       
    );
    return this.http.get('https://emptracker.iot.tatacommunications.com/api/v1/reportservice/badge/kpi/management/pl/scheduled/export?customerId=600ea145d938ae00016fd456', {headers:header});
  }
  getkpiBattery(){
    return this.http.get('');
  }
 
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

