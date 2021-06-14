import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class KpiService {
  getkpicalender() {
    return this.http.get('https://demo.emptracker.iot.tatacommunications.com/api/v1/userservice/customers/5d026850fbf97000016896cc');
  }

 
 

  constructor(private http :HttpClient) { }

  getkpiBell(){
    return this.http.get('');
  }
  getkpiSOS(){
    return this.http.get('');
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

