import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'
import { GatewayService } from 'src/app/core/services/gateway.service';
import { GatewaysCountDo, NetworkUptimeDto, CityCountDO } from 'src/app/shared/models/gateways-count-do.model';
import { City } from 'src/app/shared/models/customer-details.model';
import { fstat } from 'node:fs';
import * as fs from 'file-saver';
import { FormControl, FormBuilder } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { S_IFIFO } from 'node:constants';
import { CustomerConfigService } from 'src/app/core/services/customer-config.service';
import * as moment from 'moment';


@Component({
  selector: 'app-gateway-dashboard',
  templateUrl: './gateway-dashboard.component.html',
  styleUrls: ['./gateway-dashboard.component.css']
})
export class GatewayDashboardComponent implements OnInit {

  isShownNav: boolean = false;
  check: boolean = false;
  customerListData: any;
  citydata: any;
  cities: City[] = new Array<City>();

  statusuptimedata: any;
  type: string = "Working";
  getcitylist: any;
  getworkingdata: any;
  getnotworkingdata: any;
  customerId: string = sessionStorage.getItem("customerId") || "";
  fromDate: any;
  toDate: any;
  // cityId: string = "";
  selectedCity: string = "All";
  cityId: string = "All";
  workingStatus: string = "workingStatus"
  checkoutForm = this.formBuilder.group({
    gatewayDropdown: "",
    reportType: ''
  });
  constructor(private router: Router, private gatewayService: GatewayService, private formBuilder: FormBuilder, private datePipe: DatePipe, private customerConfigService: CustomerConfigService) { }
  networkStatusData: GatewaysCountDo = new GatewaysCountDo();
  totalInstalledGatewaysData: GatewaysCountDo = new GatewaysCountDo();
  workingGatewaysData: GatewaysCountDo = new GatewaysCountDo();
  nonWorkingGatewaysData: GatewaysCountDo = new GatewaysCountDo();
  networkUptimeData: GatewaysCountDo = new GatewaysCountDo();
  networkUptimeDto: NetworkUptimeDto = new NetworkUptimeDto();
  cityCountDO: CityCountDO = new CityCountDO();
  city: City = new City()
  public options: any = {
    'locale': { 'format': 'DD-MM-YYYY', 'separator': ' to ' },
    fromDate: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() - 1),
    toDate: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() - 1),
    'maxDate': new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() - 1),
  };

  ngOnInit(): void {
    this.networkStatus();
    this.totalInstalledGateways();
    this.workingGateways(this.type);
    this.nonWorkingGateways();
    this.networkUptime();
    this.customerList();
  }

  showHideNavigation() {
    this.isShownNav = !this.isShownNav;
    if (this.check == false) {
      this.check = true;
    } else {
      this.check = false;
    }
  }
  customerList() {
    this.customerConfigService.getCustomersList().subscribe(
      (res: any) => {
        this.customerListData = res.data
        console.log("GetCustomerList" + res);
      }
    )
  }

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
  download() {
    alert("HI")
    // if (this.checkoutForm.value.gatewayDropdown !== "" && this.checkoutForm.value.fromDate !== Date && this.checkoutForm.value.toDate! == Date &&
    //   this.checkoutForm.value.reportType !== "") {
    //   return;
    // }

    if (this.checkoutForm.value.gatewayDropdown == "" && this.checkoutForm.value.gatewayDropdown == "2" && this.checkoutForm.value.gatewayDropdown == "3" && this.checkoutForm.value.gatewayDropdown == "4" && this.checkoutForm.value.gatewayDropdown == "5") {
      this.gatewayService.downloadNetworkUpTimeHistoricalReport(this.customerId, this.fromDate, this.toDate, this.cityId).subscribe((data: any) => {
        this.fromDate = (moment(this.fromDate).format('YYYY-MM-DD'));
        this.toDate = (moment(this.toDate).format('YYYY-MM-DD'));
        var headers = data.headers.get('Content-disposition').toString();
        var fileName = headers.substring((headers.indexOf('=') + 1), headers.length)
        let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      })
    }

    // else {
    //   this.checkoutForm.value.fromDate = this.datePipe.transform(this.checkoutForm.value.fromDate, 'yyyy-MM-dd');
    //   this.checkoutForm.value.toDate = this.datePipe.transform(this.checkoutForm.value.toDate, 'yyyy-MM-dd');
    // }
    else if (this.checkoutForm.value.gatewayDropdown == "") {
      this.gatewayService.getAllGatewaysExport(sessionStorage.getItem("customerId") || "").subscribe((data: any) => {
        var headers = data.headers.get('Content-disposition').toString();
        var fileName = headers.substring((headers.indexOf('=') + 1), headers.length)
        let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        fs.saveAs(blob, fileName);
      })
    }
    else if (this.checkoutForm.value.gatewayDropdown == "2") {
      this.gatewayService.getTotalInstalledGatewaysExport(sessionStorage.getItem("customerId") || "").subscribe((data: any) => {
        var headers = data.headers.get('Content-disposition').toString();
        var fileName = headers.substring((headers.indexOf('=') + 1), headers.length)
        let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        fs.saveAs(blob, fileName);
      })
    }
    else if (this.checkoutForm.value.gatewayDropdown == "3") {
      this.gatewayService.getWorkingGatewaysExport(sessionStorage.getItem("customerId") || "" && this.customerId, this.workingStatus).subscribe((data: any) => {
        var headers = data.headers.get('Content-disposition').toString();
        var fileName = headers.substring((headers.indexOf('=') + 1), headers.length)
        let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        fs.saveAs(blob, fileName);
      })
    }
    else if (this.checkoutForm.value.gatewayDropdown == "4") {
      this.gatewayService.getNonWorkingGatewaysExport(sessionStorage.getItem("customerId") || "").subscribe((data: any) => {
        var headers = data.headers.get('Content-disposition').toString();
        var fileName = headers.substring((headers.indexOf('=') + 1), headers.length)
        let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        fs.saveAs(blob, fileName);
      })
    }
    else if (this.checkoutForm.value.gatewayDropdown == "5") {
      this.gatewayService.getNetworkUptimeExport(sessionStorage.getItem("customerId") || "").subscribe((data: any) => {
        var headers = data.headers.get('Content-disposition').toString();
        var fileName = headers.substring((headers.indexOf('=') + 1), headers.length)
        let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        fs.saveAs(blob, fileName);
      })
    }
  }
  cityChanged(event: any) {
    var selectedCity = event.value;
      //All city selected
      this.cityId = this.selectedCity;
  }
}


