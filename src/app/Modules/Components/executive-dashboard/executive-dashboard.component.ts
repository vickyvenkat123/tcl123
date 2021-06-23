import { Component, Input, OnInit, Output, ViewChild, EventEmitter } from '@angular/core';
import { CustomerConfigService } from 'src/app/core/services/customer-config.service';
import { City, Plant, Site } from 'src/app/shared/models/customer-details.model';
import { DaterangepickerComponent } from 'ng2-daterangepicker';
import * as moment from 'moment';
import { DashboardService } from 'src/app/core/services/dashboard.service';
import { ResponseDto } from 'src/app/shared/models/response-dto.model';
import { ChartType } from 'chart.js';


@Component({
  selector: 'app-executive-dashboard',
  templateUrl: './executive-dashboard.component.html',
  styleUrls: ['./executive-dashboard.component.css']
})
export class ExecutiveDashboardComponent implements OnInit {

  constructor(private customerConfigService: CustomerConfigService, private dashboardService: DashboardService) { }
  public options: any = {
    'locale': { 'format': 'YYYY-MM-DD', 'separator': ' to ' },
    fromDate: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() - 1),
    toDate: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() - 1),
    'maxDate': new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() - 1),
  };
  cities: City[] = new Array<City>();
  cityNames: string[] = new Array<string>("All");
  cityId: string = "All";
  plantId: string = "All";
  plants: Plant[] = new Array<Plant>();
  plantNames: string[] = new Array<string>("All");
  siteId: string = "All";
  sites: Site[] = new Array<Site>();
  siteNames: string[] = new Array<string>("All");
  hotZone: boolean = false;
  selectedCity: string = "All";
  selectedPlant: string = "All";
  selectedSite: string = "All";
  customerId: string = sessionStorage.getItem("customerId") || "";
  fromDate: any;
  toDate: any;
  selectedDateValue: any;
  dateTextInput: any;
  responsDto: ResponseDto = new ResponseDto();
  plantCount: number = 0;
  siteCount: number = 0;

  ngOnInit(): void {
    this.getCities();
    this.fromDate = (moment(new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() - 1)).format('YYYY-MM-DD'));
    this.toDate = (moment(new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() - 1)).format('YYYY-MM-DD'));
    this.getExecutiveAlerts();
    this.getPlants();
    this.getSites();
  }

  getCities() {
    this.customerConfigService.getCities(sessionStorage.getItem("customerId") || "").subscribe((res: any) => {
      if (res.status == 200) {
        this.cities = res.data;
        this.cities.forEach(element => {
          this.cityNames.push(element.cityName);
        });
      }
    })
  }

  getSites() {
    this.customerConfigService.getSitesByCustomerId(sessionStorage.getItem("customerId") || "").subscribe((res: any) => {
      if (res.status == 200) {
        this.siteCount = res.data.length;
      }
    })
  }

  getPlants() {
    this.customerConfigService.getPlantsByCustomerId(sessionStorage.getItem("customerId") || "").subscribe((res: any) => {
      if (res.status == 200) {
        this.plantCount = res.data.length;
      }
    })
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
      }
    }
    else {
      //All city selected
      this.cityId = this.selectedCity;
      this.selectedPlant = "All";
      this.selectedSite = "All";
    }
  }

  plantChanged(event: any) {
    var selectedPlant = event.value;
    this.siteNames = ["All"];
    if (selectedPlant !== "All") {
      var plantId = this.plants.find(plant => plant.plantName === selectedPlant)?.plantId;
      if (plantId) {
        this.plantId = plantId;

        this.customerConfigService.getSiteDetailsByPlantId(plantId.toString()).subscribe(
          (res: any) => {
            if (res.status == 200) {
              this.sites = res.data;
              this.sites.forEach(element => {
                this.siteNames.push(element.siteName);
              });
            }
          })
      }
    }
    else {
      //All Plant selected
      this.plantId = this.selectedPlant;
    }
  }

  siteChanged(event: any) {
    var selectedSite = event.value;
    if (selectedSite !== "All") {
      var siteId = this.sites.find(site => site.siteName === selectedSite)?.siteId;
      if (siteId) {
        this.siteId = siteId;
      }
    }
    else {
      //All Sites selected
      this.siteId = this.selectedSite;
    }
  }


  clear() {
    this.selectedCity = "All";
    this.plantNames = ["All"];
    this.siteNames = ["All"];
    this.fromDate = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() - 1);
    this.toDate = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() - 1);
    this.dateTextInput = moment(this.fromDate).format('DD-MM-YYYY') + " to " + moment(this.toDate).format('DD-MM-YYYY');
  }

  search() {
    this.fromDate = (moment(this.fromDate).format('YYYY-MM-DD'));
    this.toDate = (moment(this.toDate).format('YYYY-MM-DD'));
    this.getExecutiveAlerts();
  }

  getExecutiveAlerts() {
    this.dashboardService.getExecutiveAlerts(this.customerId, this.fromDate, this.toDate, this.cityId, this.plantId, this.siteId).subscribe((res: any) => {
      this.responsDto = res.data;
      this.barChartData = [
        {data: [this.responsDto.sosAvg,this.responsDto.hzAvg,this.responsDto.batteryAvg]},
      ]; 
      // this.barChartData = [
      //   {data: [3,5,8]},
      // ]; 
    })

  }

  public calendarCanceled(e: any) {
    console.log(e);
  }

  public calendarApplied(e: any) {
    console.log(e);
  }
  public selectedDate(value: any) {
    this.selectedDateValue = value;
    this.fromDate = moment(this.selectedDateValue.start).format('YYYY-MM-DD');
    this.toDate = moment(this.selectedDateValue.end).format('YYYY-MM-DD');
  }
  public barChartOptions = {
    scaleShowVerticalLines: false,
    responsive: true,
    borderWidth:0,
    scales: {
      yAxes: [{
          ticks: {
              beginAtZero: true,
              stepSize :5, 
          },
          gridLines:{
            drawOnChartArea:false
        }
      }],
      xAxes:[{
        gridLines:{
          drawOnChartArea:false
      }
    }]
  },
  };
  public colors = [{
    backgroundColor: ['#3D85C6', '#2B5F8F', '#BC1D19'],
  }];;
  public barChartLabels = ['SOS', 'Hazardous', 'Battery'];
  public barChartType:ChartType = 'bar';
  public barChartLegend = false;
  public barChartData = [
    {data: [1,3,5]},
  ];

}
