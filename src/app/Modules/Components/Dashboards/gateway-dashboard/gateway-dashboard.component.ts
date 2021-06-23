import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'
import { GatewayService } from 'src/app/core/services/gateway.service';
import { GatewaysCountDo, NetworkUptimeDto, CityCountDO } from 'src/app/shared/models/gateways-count-do.model';
import { City } from 'src/app/shared/models/customer-details.model';
import * as fs from 'file-saver';
import { FormControl, FormBuilder } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { CustomerConfigService } from 'src/app/core/services/customer-config.service';
import * as moment from 'moment';
import { ErrorModalComponent } from '../../error-modal/error-modal.component';
import { MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'app-gateway-dashboard',
  templateUrl: './gateway-dashboard.component.html',
  styleUrls: ['./gateway-dashboard.component.css']
})
export class GatewayDashboardComponent implements OnInit {

  isShownNav: boolean = false;
  check: boolean = false;
  citydata: any;
  cities: City[] = new Array<City>();
  type: string = "Working";
  getcitylist: any;
  getworkingdata: any;
  getnotworkingdata: any;
  customerId: string = sessionStorage.getItem("customerId") || "";
  fromDate: any;
  toDate: any;
  selectedCity: string = "All";
  cityId: string = "";
  workingStatus: string = "workingStatus"
  checkoutForm = this.formBuilder.group({
    gatewayDropdown: "nwDownTimeReport",
    reportType: '',
    fromDate: new Date(),
    toDate: new Date(),
    cityDropdown: ""
  });
  cityNames: string[] = new Array<string>();

  constructor(private router: Router, private gatewayService: GatewayService, private formBuilder: FormBuilder, private customerConfigService: CustomerConfigService, private dialog: MatDialog) { }
  networkStatusData: GatewaysCountDo = new GatewaysCountDo();
  totalInstalledGatewaysData: GatewaysCountDo = new GatewaysCountDo();
  workingGatewaysData: GatewaysCountDo = new GatewaysCountDo();
  nonWorkingGatewaysData: GatewaysCountDo = new GatewaysCountDo();
  networkUptimeData: GatewaysCountDo = new GatewaysCountDo();
  networkUptimeDto: NetworkUptimeDto = new NetworkUptimeDto();
  cityCountDO: CityCountDO = new CityCountDO();
  city: City = new City();
  disableDatesAndCity: boolean = false;
  public options: any = {
    'locale': { 'format': 'DD-MM-YYYY', 'separator': ' to ' },
    fromDate: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() - 1),
    toDate: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() - 1),
    maxDate: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()),
  };
  datePipe: DatePipe = new DatePipe('en-US');
  currentTime: any = new Date();

  ngOnInit(): void {
    this.networkStatus();
    this.totalInstalledGateways();
    this.workingGateways(this.type);
    this.nonWorkingGateways();
    this.networkUptime();
    //this.customerList();
  }

  showHideNavigation() {
    this.isShownNav = !this.isShownNav;
    if (this.check == false) {
      this.check = true;
    } else {
      this.check = false;
    }
  }
  // customerList() {
  //   this.customerConfigService.getCustomersList().subscribe(
  //     (res: any) => {
  //       this.customerListData = res.data
  //       console.log("GetCustomerList" + res);
  //     }
  //   )
  // }

  onSubmit() {
  }


  networkStatus() {
    this.gatewayService.getNetworkStatus(sessionStorage.getItem("customerId") || "").subscribe(
      (result: any) => {
        this.networkStatusData = result.data;
        if (this.networkStatusData.networkUptime.toString().indexOf('.') != -1) {
          this.networkStatusData.networkUptime = Number(this.networkStatusData.networkUptime.toString().substring(0, this.networkStatusData.networkUptime.toString().indexOf('.') + 3));
        }
        console.log("networkStatusData" + this.networkStatusData)
      })
  }

  totalInstalledGateways() {
    this.gatewayService.getTotalInstalledGateways(sessionStorage.getItem("customerId") || "").subscribe(
      (result: any) => {
        this.totalInstalledGatewaysData = result.data
        this.totalInstalledGatewaysData.statusList.forEach(element => {
          this.cities.push(element.city);
        });
        this.cities.forEach(element => {
          this.cityNames.push(element.cityName);
        });
      })
  }

  workingGateways(type: string) {
    this.gatewayService.getWorkingGateways(sessionStorage.getItem("customerId") || "" && this.customerId, type).subscribe(
      (result: any) => {
        this.workingGatewaysData = result.data;
      })
  }

  nonWorkingGateways() {
    this.gatewayService.getNonWorkingGateways(sessionStorage.getItem("customerId") || "").subscribe(
      (result: any) => {
        this.nonWorkingGatewaysData = result.data;
        // alert(this.nonWorkingGatewaysData.statusList)
      })
  }

  networkUptime() {
    this.gatewayService.getNetworkUptime(sessionStorage.getItem("customerId") || "").subscribe(
      (result: any) => {
        this.networkUptimeData = result.data;
        this.networkUptimeData.networkStatusList.forEach(element => {
          if (element.upTimePercentage.toString().indexOf('.') != -1) {
            element.upTimePercentage = Number(element.upTimePercentage.toString().substring(0, element.upTimePercentage.toString().indexOf('.') + 3));
          }
        });
      }
    )
  }
  export() {
    if (this.checkoutForm.value.fromDate == null) {
      this.fromDate = (moment(new Date()).format('YYYY-MM-DD'));
    }
    else {
      this.fromDate = (moment(this.checkoutForm.value.fromDate).format('YYYY-MM-DD'));
    }
    if (this.checkoutForm.value.toDate == null) {
      this.toDate = (moment(new Date()).format('YYYY-MM-DD'));
    }
    else {
      this.toDate = (moment(this.checkoutForm.value.toDate).format('YYYY-MM-DD'));
    }

    if (this.checkoutForm.value.cityDropdown !== "") {
      this.cityId = this.cities.find(city => city.cityName === this.checkoutForm.value.cityDropdown)?.cityId || "";
    }

    if (this.checkoutForm.value.gatewayDropdown === "totalInstalledGateways") {
      this.gatewayService.getTotalInstalledGatewaysExport(sessionStorage.getItem("customerId") || "").subscribe((data: any) => {
        var headers = data.headers.get('Content-disposition').toString();
        var fileName = headers.substring((headers.indexOf('=') + 1), headers.length)
        let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        fs.saveAs(blob, fileName);
      })

    }
    else if (this.checkoutForm.value.gatewayDropdown === "workingGateways") {
      this.gatewayService.getWorkingGatewaysExport(sessionStorage.getItem("customerId") || "" && this.customerId).subscribe((data: any) => {
        var headers = data.headers.get('Content-disposition').toString();
        var fileName = headers.substring((headers.indexOf('=') + 1), headers.length)
        let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        fs.saveAs(blob, fileName);
      })
    }
    else if (this.checkoutForm.value.gatewayDropdown == "nonWokingGateways") {
      this.gatewayService.getNonWorkingGatewaysExport(sessionStorage.getItem("customerId") || "").subscribe((data: any) => {
        var headers = data.headers.get('Content-disposition').toString();
        var fileName = headers.substring((headers.indexOf('=') + 1), headers.length)
        let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        fs.saveAs(blob, fileName);
      })
    }

    else if (this.checkoutForm.value.gatewayDropdown == "networkUptime") {
      this.gatewayService.getNetworkUptimeExport(sessionStorage.getItem("customerId") || "", this.cityId, this.fromDate, this.toDate).subscribe((data: any) => {
        if (data.headers.get('Content-disposition') != null) {
          var headers = data.headers.get('Content-disposition')?.toString();
          var fileName = headers.substring((headers.indexOf('=') + 1), headers.length)
          let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
          fs.saveAs(blob, fileName);
        }
        else {
          this.dialog.open(ErrorModalComponent, {
            data: {
              message: "No Data Available.",
              header: "Error"
            }
          });
        }
      })
    }
    else if (this.checkoutForm.value.gatewayDropdown == "nwDownTimeReport") {
      this.gatewayService.getDownTimeExport(sessionStorage.getItem("customerId") || "", this.cityId, this.fromDate, this.toDate).subscribe((data: any) => {
        if (data.headers.get('Content-disposition') != null) {
          var headers = data.headers.get('Content-disposition')?.toString();
          var fileName = headers.substring((headers.indexOf('=') + 1), headers.length)
          let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
          fs.saveAs(blob, fileName);
        }
        else {
          this.dialog.open(ErrorModalComponent, {
            data: {
              message: "No Data Available.",
              header: "Error"
            }
          });
        }
      })
    }

    else if (this.checkoutForm.value.gatewayDropdown == "historicalReport") {
      this.gatewayService.getHistoricalExport(sessionStorage.getItem("customerId") || "", this.cityId, this.fromDate, this.toDate).subscribe((data: any) => {
        if (data.headers.get('Content-disposition') != null) {
          var headers = data.headers.get('Content-disposition')?.toString();
          var fileName = headers.substring((headers.indexOf('=') + 1), headers.length)
          let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
          fs.saveAs(blob, fileName);
        }
        else {
          this.dialog.open(ErrorModalComponent, {
            data: {
              message: "No Data Available.",
              header: "Error"
            }
          });
        }
      })
    }
  }

  cityChanged(event: any) {
    this.checkoutForm.value.cityDropdown = event.value;
  }

  gatewayTypeChange(event: any) {
    if (event.value === "totalInstalledGateways" || event.value === "workingGateways" || event.value === "nonWokingGateways") {
      this.disableDatesAndCity = true;
    }
    else
      this.disableDatesAndCity = false;
  }

  fromDateEntered() {
    if (this.checkoutForm.value.fromDate == null) {
      this.checkoutForm.patchValue({ fromDate: (moment(new Date()).format('YYYY-MM-DD')) });
    }
  }

  toDateEntered() {
    if (this.checkoutForm.value.toDate == null) {
      this.checkoutForm.patchValue({ toDate: (moment(new Date()).format('YYYY-MM-DD')) });
    }
  }
}