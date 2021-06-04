import { Component, OnInit } from '@angular/core';
import { CustomerConfigService } from 'src/app/core/services/customer-config.service';
import { DashboardService } from 'src/app/core/services/dashboard.service';
import { City, Customer, Plant } from 'src/app/shared/models/customer-details.model';
import { CardStatusDto, CardUtilizationResponse, UtilizationDashboardDto } from 'src/app/shared/models/utilization-dashboard-dto.model';
import { ChartType } from 'chart.js';
import { FormBuilder } from '@angular/forms';
import * as fs from 'file-saver';
import { DatePipe } from '@angular/common';
import { ErrorModalComponent } from '../error-modal/error-modal.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-utilization-dashboard',
  templateUrl: './utilization-dashboard.component.html',
  styleUrls: ['./utilization-dashboard.component.css']
})
export class UtilizationDashboardComponent implements OnInit {

  constructor(private customerConfigService: CustomerConfigService, private dashboardService: DashboardService, private formBuilder: FormBuilder, private dialog: MatDialog) { }
  customers: Customer[] = new Array<Customer>();
  customerNames: string[] = new Array<string>();
  cities: City[] = new Array<City>();
  cityNames: string[] = new Array<string>('All');
  plants: Plant[] = new Array<Plant>();
  plantNames: string[] = new Array<string>('All');
  selectedCustomer: string = "";
  selectedCity: string = "All";
  selectedPlant: string = "All";
  customerId: string = sessionStorage.getItem("customerId") || "";
  cityId: string = "All";
  plantId: string = "All";
  utilizationDashboardDto: UtilizationDashboardDto = new UtilizationDashboardDto();
  cardStatusDto: CardStatusDto = new CardStatusDto();
  cardUtilizationResponse: CardUtilizationResponse = new CardUtilizationResponse();
  countDataFetched: boolean = false;
  chartOptions: any;
  datePipe: DatePipe = new DatePipe('en-US');
  chartColors: any;
  doughnutChartLabels: string[] = ['Distributed Cards', 'Live Cards'];
  demodoughnutChartData: number[] = new Array<number>();
  doughnutChartType: ChartType = 'doughnut';
  exportForm = this.formBuilder.group({
    reportType: "totalCards"
  });

  exportUtilizationForm = this.formBuilder.group({
    reportType: "",
    dateForExport: new Date(),
    city: "All"
  });
  exportDate: string = "";

  ngOnInit(): void {
    this.getCustomerList();
    this.getUtilizationCount();
    this.getCitiesByCustomerId();
    this.getCardUtilizationTrends();
    this.getbadgeUtilizationStauts();
    this.chartOptions = {
      responsive: true,
      cutoutPercentage: 90,
      maintainAspectRatio: false,
      title: {
        display: true,
        fontFamily: "quicksand-medium",
        fontSize: 16,
        fontColor: "#747d8c"
      },
      legend: {
        display: true
      },
      tooltips: {
        displayColors: false
      }
    };
    this.chartColors = [{
      backgroundColor: ['#3D85C6', '#2B5F8F'],
    }];
  }

  getUtilizationCount() {
    this.dashboardService.getCardUtilizationCount(this.customerId, this.cityId, this.plantId).subscribe((res: any) => {
      this.utilizationDashboardDto = res.data;
      this.countDataFetched = true;
      this.demodoughnutChartData.push(this.utilizationDashboardDto.distributed);
      this.demodoughnutChartData.push(this.utilizationDashboardDto.workingBadges);
    }
    )
  }

  getCitiesByCustomerId() {
    this.customerConfigService.getCities(this.customerId).subscribe((res: any) => {
      if (res.status == 200) {
        this.cities = res.data;
        this.cities.forEach(element => {
          this.cityNames.push(element.cityName);
        });
      }
    })
  }

  getCardUtilizationTrends() {
    this.dashboardService.getCardUtilizationTrends(this.customerId, this.cityId, this.plantId).subscribe((res: any) => {
      this.cardStatusDto = res.data;
    }
    )
  }

  getbadgeUtilizationStauts() {
    this.dashboardService.getbadgeUtilizationStauts(this.customerId, this.cityId, this.plantId).subscribe((res: any) => {
      //this.dashboardService.getbadgeUtilizationStauts(this.customerId).subscribe((res: any) => {
      this.cardUtilizationResponse = res.data;
    })
  }

  getCustomerList() {
    this.customerConfigService.getCustomersList().subscribe(
      (res: any) => {
        this.customers = res.data;
        this.customers.forEach(element => {
          this.customerNames.push(element.customerName);
        });
        if (this.customerNames.length == 1)
          this.selectedCustomer = this.customerNames[0];
      }
    )
  }
  customerChanged(event: any) {

  }

  cityChanged(event: any) {
    var selectedCity = event.value;
    this.plantNames = ["All"];
    if (selectedCity !== "All") {
      var cityId = this.cities.find(city => city.cityName === selectedCity)?.cityId;
      if (cityId) {
        this.cityId = cityId;

        this.customerConfigService.getPlantsDetailsByCityId(cityId.toString()).subscribe(
          (res: any) => {
            if (res.status == 200) {
              this.plants = res.data;
              this.plants.forEach(element => {
                this.plantNames.push(element.plantName);
              });
            }
          })
        this.getUtilizationCount();
        this.getCardUtilizationTrends();
        this.getbadgeUtilizationStauts();
      }
    }
    else {
      //All city selected
      this.cityId = this.selectedCity;
      this.getUtilizationCount();
      this.getCardUtilizationTrends();
      this.getbadgeUtilizationStauts();
    }
  }

  plantChanged(event: any) {
    var selectedPlant = event.value;
    if (selectedPlant !== "All") {
      var plantId = this.plants.find(plant => plant.plantName === selectedPlant)?.plantId;
      if (plantId) {
        this.plantId = plantId;
        this.getUtilizationCount();
        this.getCardUtilizationTrends();
        this.getbadgeUtilizationStauts();
      }
    }
    else {
      //All city selected
      this.plantId = this.selectedPlant;
      this.getUtilizationCount();
      this.getCardUtilizationTrends();
      this.getbadgeUtilizationStauts();
    }
  }

  // events
  chartClicked(e: any): void {
    //console.log(e);
  }

  chartHovered(e: any): void {
    //console.log(e);
  }

  export() {
    var reportType = "";
    if (this.exportForm.value.reportType === "totalCards") {
      reportType = "TOTAL";
    }
    else if (this.exportForm.value.reportType === "distributedCards") {
      reportType = "DISTRIBUTED";
    }
    else if (this.exportForm.value.reportType === "liveCards") {
      reportType = "LIVE";
    }
    else {
      reportType = "Non_COMMUNICATION";
    }
    this.dashboardService.exportCardsDataByReportType(this.customerId, reportType, this.cityId, this.plantId).
      subscribe((res: any) => {
        var headers = res.headers.get('Content-disposition').toString();
        var fileName = headers.substring((headers.indexOf('=') + 1), headers.length);
        let blob = new Blob([res], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        fs.saveAs(blob, fileName);
      })

  }

  exportUtilization() {
    if (this.exportUtilizationForm.value.reportType === "") {
      //focus on report type select box
      return;
    }
    var cityId = "";
    if (this.exportUtilizationForm.value.city !== "All") {
      cityId = this.cities.find(city => city.cityName === this.exportUtilizationForm.value.city)?.cityId || '';
    }
    else {
      cityId = 'All';
    }
    this.exportDate = this.datePipe.transform(this.exportUtilizationForm.value.dateForExport, 'yyyy-MM-dd')?.toString() || '';
    this.dashboardService.exportUtilizationByType(this.exportUtilizationForm.value.reportType, this.customerId, cityId, this.exportDate).subscribe((res: any) => {
      if (res.headers.get('Content-disposition') != null) {
        var headers = res.headers.get('Content-disposition').toString();
        var fileName = headers.substring((headers.indexOf('=') + 1), headers.length);
        let blob = new Blob([res], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
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
    }
    )
  }
}
