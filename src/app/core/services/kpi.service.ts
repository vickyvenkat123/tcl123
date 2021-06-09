import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class KpiService {

 
 

  constructor(private http :HttpClient) { }

  getkpiBell(){
    return this.http.get('https://demo.emptracker.iot.tatacommunications.com/api/v1/userservice/customers')
  }
  getkpiSOS(){
    return this.http.get('https://demo.emptracker.iot.tatacommunications.com/api/v1/userservice/customers/5d026850fbf97000016896cc')
  }
  getkpiBattery(){
    return this.http.get('https://demo.emptracker.iot.tatacommunications.com/api/v1/getLoggedInUser')
  }
  // requestDataFromMultipleSources(): Observable<any[]> {
  //   const response1 = this.getkpiBell(),
  //     response2 = this.getkpiSOS(),
  //     response3 = this.getkpiBattery();
  //   // Observable.forkJoin (RxJS 5) changes to just forkJoin() in RxJS 6
  //   return forkJoin([response1, response2, response3]);
  // }

}
