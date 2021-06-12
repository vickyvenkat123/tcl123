import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { ChartType } from 'chart.js';
import { CustomerConfigService } from 'src/app/core/services/customer-config.service';
import { DashboardService } from 'src/app/core/services/dashboard.service';
import { City, Customer, Plant, Site } from 'src/app/shared/models/customer-details.model';
import { EmployeeDeviceStatus } from 'src/app/shared/models/employee-dashboard-dto.model';
import { Zone, ZoneResponseDto } from 'src/app/shared/models/zone.model';
import * as fs from 'file-saver';

@Component({
  selector: 'app-zone-dashboard',
  templateUrl: './zone-dashboard.component.html',
  styleUrls: ['./zone-dashboard.component.css']
})
export class ZoneDashboardComponent implements OnInit {

  constructor(private customerConfigService: CustomerConfigService, private dashboardService: DashboardService, private activatedRoute: ActivatedRoute) { }
  @ViewChild('panzoomDiv') panzoomDiv: ElementRef | undefined;
  isShownNav: boolean = false;
  check: boolean = false;
  cities: City[] = new Array<City>();
  cityNames: string[] = new Array<string>("All");
  cityId: string = "";
  plantId: string = "";
  plants: Plant[] = new Array<Plant>();
  plantNames: string[] = new Array<string>("All");
  siteId: string = "";
  sites: Site[] = new Array<Site>();
  siteNames: string[] = new Array<string>("All");
  hotZone: boolean = false;
  selectedCity: string = "All";
  selectedPlant: string = "All";
  selectedSite: string = "All";
  customers: Customer[] = new Array<Customer>();
  zoneResponseDto: ZoneResponseDto = new ZoneResponseDto();
  chartOptions: any;
  chartColors: any;
  doughnutChartLabels: string[] = ['Hot Zones', 'Live Zones'];
  demodoughnutChartData: number[] = [7280, 1];
  doughnutChartType: ChartType = 'doughnut';
  pageNo: number = 0;
  size: number = 10;
  sizeChanged: boolean = false;
  totalNoOfPages: number = 0;
  zones: Zone[] = new Array<Zone>();
  showEmployeeList: boolean = false;
  showZoneList: boolean = true;
  enableFirstPager: boolean = false;
  enablePreviousPager: boolean = false;
  enableNextPager: boolean = false
  enableLastPager: boolean = false;
  showFirstPager: boolean = false;
  showSecondPager: boolean = false;
  showThirdPager: boolean = false;
  showFourthPager: boolean = false;
  showFifthPager: boolean = false;
  firstPager: number = 0;
  secondPager: number = 0;
  thirdPager: number = 0;
  fourthPager: number = 0;
  fifthPager: number = 0;
  selectedPageValue: number = 0;
  showPagination: boolean = false;
  searchEmployeeId: string = "";
  displayedColumnsForZoneList: string[] = ['Zone Name', 'Zone Threshold', 'Employee Count', 'Hot Zone', 'Site Name', 'Plant Name', 'City Name', 'Started At'];
  displayedColumnsForEmployeeList: string[] = ['Employee Id', 'Employee Name', 'Device Id', 'Serial Number', 'Hot Zone', 'Zone', 'Site', 'Plant', 'City'];
  dataSourceForZones: any;
  dataSourceForEmployees: any;
  searchZoneName: string = "";
  zoneType: string = "All";
  zoneOptions: string[] = ["All", "Hot Zone"];
  employeeDeviceStatus: EmployeeDeviceStatus[] = new Array<EmployeeDeviceStatus>();
  searchZoneId: string = "";
  zoneId: string = "";
  route: boolean = false;
  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(async params => {
      if (params['zoneId']) {
        this.route = true;
        this.getCities();
        this.getPlantsByCityId(this.cityId);
        this.zoneId = params['zoneId'];
        this.cityId = params['cityId'];
        setTimeout(() => {
          this.selectedCity = this.cities.find(city => city.cityId === this.cityId)?.cityName!;
        }, 200);
        this.siteId = params['siteId'];
        setTimeout(() => {
          this.selectedPlant = this.plants.find(plant => plant.plantId === this.plantId)?.plantName!;
        }, 400);
        this.plantId = params['plantId'];
        this.getSiteDetailsByPlantId(this.plantId);
        setTimeout(() => {
          this.selectedSite = this.sites.find(site => site.siteId === this.siteId)?.siteName!;
        }, 300);
      }
    });

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
    this.customerConfigService.getCustomersList().subscribe(
      (res: any) => {
        this.customers = res.data;
      })

    if (!this.route) {
      this.cityId = "All";
      this.siteId = "All";
      this.plantId = "All";
      this.getCities();
    }
    this.route = false;
    this.getZonesCount();
    this.getZoneDataByPageSizeCPSAndHotZone(this.pageNo, this.size);
  }


  showHideNavigation() {
    this.isShownNav = !this.isShownNav;
    if (this.check == false) {
      this.check = true;
    } else {
      this.check = false;
    }
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

  getZonesCount() {
    this.dashboardService.getZoneCount(sessionStorage.getItem("customerId") || "", this.cityId, this.plantId, this.siteId).subscribe((res: any) => {
      this.zoneResponseDto = res.data;
    })

  }

  cityChanged(event: any) {
    var selectedCity = event.value;
    this.plantNames = ["All"];
    if (selectedCity !== "All") {
      var cityId = this.cities.find(city => city.cityName === selectedCity)?.cityId;
      if (cityId) {
        this.cityId = cityId;
        this.getZonesCount();
        this.sizeChanged = true;
        this.pageNo = 0;
        this.selectedPageValue = 0;
        this.getZoneDataByPageSizeCPSAndHotZone(this.pageNo, this.size);
        this.getPlantsByCityId(cityId);
      }
    }
    else {
      //All city selected
      this.cityId = this.selectedCity;
      this.getZonesCount();
      this.sizeChanged = true;
      this.pageNo = 0;
      this.selectedPageValue = 0;
      this.getZoneDataByPageSizeCPSAndHotZone(this.pageNo, this.size);
    }
  }
  getPlantsByCityId(cityId: string) {
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

  plantChanged(event: any) {
    var selectedPlant = event.value;
    this.siteNames = ["All"];
    if (selectedPlant !== "All") {
      var plantId = this.plants.find(plant => plant.plantName === selectedPlant)?.plantId;
      if (plantId) {
        this.plantId = plantId;
        this.getZonesCount();
        this.sizeChanged = true;
        this.pageNo = 0;
        this.selectedPageValue = 0;
        this.getZoneDataByPageSizeCPSAndHotZone(this.pageNo, this.size);
        this.getPlantsByCityId(plantId);
      }
    }
    else {
      //All Plant selected
      this.plantId = this.selectedPlant;
      this.getZonesCount();
      this.sizeChanged = true;
      this.pageNo = 0;
      this.selectedPageValue = 0;
      this.getZoneDataByPageSizeCPSAndHotZone(this.pageNo, this.size);
    }
  }

  getSiteDetailsByPlantId(plantId: string) {
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

  siteChanged(event: any) {
    var selectedSite = event.value;
    if (selectedSite !== "All") {
      var siteId = this.sites.find(site => site.siteName === selectedSite)?.siteId;
      if (siteId) {
        this.siteId = siteId;
        this.getZonesCount();
        this.sizeChanged = true;
        this.pageNo = 0;
        this.selectedPageValue = 0;
        this.getZoneDataByPageSizeCPSAndHotZone(this.pageNo, this.size);
      }
    }
    else {
      //All Sites selected
      this.siteId = this.selectedSite;
      this.getZonesCount();
      this.sizeChanged = true;
      this.pageNo = 0;
      this.selectedPageValue = 0;
      this.getZoneDataByPageSizeCPSAndHotZone(this.pageNo, this.size);
    }
  }

  getZoneDataByPageSizeCPSAndHotZone(pageNo: number, size: number) {
    this.dashboardService.getZoneDataByPageSizeCPSAndHotZone(sessionStorage.getItem("customerId") || "", pageNo, size,
      this.cityId, this.plantId, this.siteId, this.searchZoneId, this.hotZone).subscribe((res: any) => {
        if (res == null) {
          this.zones = [];
          this.dataSourceForZones = new MatTableDataSource(this.zones);
        }
        if (res != null && res.status == 200) {
          this.zones = res.data;
          this.dataSourceForZones = new MatTableDataSource(this.zones);
          this.pagination();
        }
      })
  }

  pagination() {
    if (this.zoneResponseDto.totalZones > this.size) {
      this.showPagination = true;
      if (this.zoneResponseDto.totalZones % this.size == 0) {
        this.totalNoOfPages = this.zoneResponseDto.totalZones / this.size;
        this.displayButtonsAndValues();
      }
      else {
        this.totalNoOfPages = Math.floor(this.zoneResponseDto.totalZones / this.size) + 1;
        this.displayButtonsAndValues();
      }
    }
    else {
      this.showPagination = false;
    }
  }
  // events
  chartClicked(e: any): void {
    //console.log(e);
  }

  chartHovered(e: any): void {
    //console.log(e);
  }



  exportZones() {
    this.dashboardService.exportZonesOfZoneDashboard(sessionStorage.getItem("customerId") || "", this.cityId, this.plantId, this.siteId, this.hotZone).subscribe((data: any) => {
      var headers = data.headers.get('Content-disposition').toString();
      var fileName = headers.substring((headers.indexOf('=') + 1), headers.length);
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, fileName);
    })


  }

  onSizeChange(data: any) {
    this.size = data.target.value;
    this.sizeChanged = true;
    this.pageNo = 0;
    this.selectedPageValue = 0;
    this.getZoneDataByPageSizeCPSAndHotZone(this.pageNo, this.size);
  }

  pagerNumClicked(pageNumber: number, position: number) {
    if (pageNumber == 1) {
      this.pageNo = 0;
      this.displayButtonsAndValues();
    }
    else {
      if (position >= 4) {
        this.selectedPageValue = pageNumber;
        if (this.showFifthPager && this.showFourthPager && this.showThirdPager && this.showSecondPager) {
          this.firstPager = pageNumber - 2;
          this.secondPager = pageNumber - 1;
          this.thirdPager = pageNumber;
          this.fourthPager = pageNumber + 1;
          this.fifthPager = pageNumber + 2;
          if (this.totalNoOfPages < (this.secondPager) || this.totalNoOfPages < (this.thirdPager) || this.totalNoOfPages < (this.fourthPager) || this.totalNoOfPages < (this.fifthPager)) {
            this.fifthPager = this.totalNoOfPages;
            this.fourthPager = this.totalNoOfPages - 1;
            this.thirdPager = this.totalNoOfPages - 2;
            this.secondPager = this.totalNoOfPages - 3;
            this.firstPager = this.totalNoOfPages - 4;
          }
        }
        else if (this.showFourthPager && this.showThirdPager && this.showSecondPager) {
          this.firstPager = pageNumber - 2;
          this.secondPager = pageNumber - 1;
          this.thirdPager = pageNumber;
          this.fourthPager = pageNumber + 1;
          if (this.totalNoOfPages < (this.secondPager) || this.totalNoOfPages < (this.thirdPager) || this.totalNoOfPages < (this.fourthPager)) {
            this.fourthPager = this.totalNoOfPages;
            this.thirdPager = this.totalNoOfPages - 1;
            this.secondPager = this.totalNoOfPages - 2;
            this.firstPager = this.totalNoOfPages - 3;
          }
        }

        this.enableFirstPager = true;
        this.enablePreviousPager = true;
        if (this.thirdPager != this.totalNoOfPages) {
          this.enableLastPager = true;
          this.enableNextPager = true;
        }
        else {
          this.enableLastPager = false;
          this.enableNextPager = false;
        }
      }
      else if (position <= 3 && (this.thirdPager == 3 || pageNumber <= 3)) {
        this.firstPager = 1;
        if (this.showSecondPager)
          this.secondPager = 2;
        if (this.showThirdPager)
          this.thirdPager = 3;
        if (this.showFourthPager)
          this.fourthPager = 4;
        if (this.showFifthPager)
          this.fifthPager = 5;
        this.selectedPageValue = pageNumber;
        this.enableFirstPager = false;
        this.enablePreviousPager = false;
        if (this.selectedPageValue != 1) {
          this.enableFirstPager = true;
          this.enablePreviousPager = true;
        }
      }
      else if (position <= 3) {
        this.selectedPageValue = pageNumber;
        this.firstPager = pageNumber - 2 == 0 ? 1 : pageNumber - 2;
        if (this.showSecondPager)
          this.secondPager = pageNumber - 1 == this.firstPager ? pageNumber : pageNumber - 1;
        if (this.showThirdPager)
          this.thirdPager = pageNumber == this.secondPager ? pageNumber : pageNumber;
        if (this.showFourthPager)
          this.fourthPager = pageNumber + 1;
        if (this.showFifthPager)
          this.fifthPager = pageNumber + 2;
        this.enableFirstPager = false;
        this.enablePreviousPager = false;
      }
    }
    if (this.totalNoOfPages == this.selectedPageValue) {
      this.enableLastPager = false;
      this.enableNextPager = false;
    }
    else {
      this.enableLastPager = true;
      this.enableNextPager = true;
    }
    if (this.selectedPageValue == 1) {
      this.enableFirstPager = false;
      this.enablePreviousPager = false;
    }
    else {
      this.enableFirstPager = true;
      this.enablePreviousPager = true;
    }
    //API call
    this.pageNo = this.selectedPageValue - 1;
    this.getZoneDataByPageSizeCPSAndHotZone(this.pageNo, this.size);

  }

  pagerClicked(pageIndex: string) {
    if (pageIndex === "last") {
      if (this.showFifthPager && this.showFourthPager && this.showThirdPager && this.showSecondPager) {
        this.fifthPager = this.totalNoOfPages;
        this.fourthPager = this.totalNoOfPages - 1;
        this.thirdPager = this.totalNoOfPages - 2;
        this.secondPager = this.totalNoOfPages - 3;
        this.firstPager = this.totalNoOfPages - 4;
      }
      else if (this.showFourthPager && this.showThirdPager && this.showSecondPager) {
        this.fourthPager = this.totalNoOfPages;
        this.thirdPager = this.totalNoOfPages - 1;
        this.secondPager = this.totalNoOfPages - 2;
        this.firstPager = this.totalNoOfPages - 3;
      }
      else if (this.showThirdPager && this.showSecondPager) {
        this.thirdPager = this.totalNoOfPages;
        this.secondPager = this.totalNoOfPages - 1;
        this.firstPager = this.totalNoOfPages - 2;
      }
      else if (this.showSecondPager) {
        this.secondPager = this.totalNoOfPages;
        this.firstPager = this.totalNoOfPages - 1;
      }

      this.selectedPageValue = this.totalNoOfPages;
      this.enableLastPager = false;
      this.enableNextPager = false;
      this.enableFirstPager = true;
      this.enablePreviousPager = true;
    }
    else if (pageIndex === "next") {
      //alert(this.selectedPageValue);
      if (this.selectedPageValue <= 2) {
        this.selectedPageValue = this.selectedPageValue + 1;
        this.enableFirstPager = true;
        this.enablePreviousPager = true;
        this.enableLastPager = true;
        this.enableNextPager = true;
      }
      else {
        this.selectedPageValue = this.selectedPageValue + 1;
        if (this.showFifthPager && this.showFourthPager && this.showThirdPager && this.showSecondPager) {
          this.firstPager = this.selectedPageValue - 2;
          this.secondPager = this.selectedPageValue - 1;
          this.thirdPager = this.selectedPageValue;
          this.fourthPager = this.selectedPageValue + 1;
          this.fifthPager = this.selectedPageValue + 2;
          if (this.totalNoOfPages < (this.secondPager) || this.totalNoOfPages < (this.thirdPager) || this.totalNoOfPages < (this.fourthPager) || this.totalNoOfPages < (this.fifthPager)) {
            this.fifthPager = this.totalNoOfPages;
            this.fourthPager = this.totalNoOfPages - 1;
            this.thirdPager = this.totalNoOfPages - 2;
            this.secondPager = this.totalNoOfPages - 3;
            this.firstPager = this.totalNoOfPages - 4;
          }
        }
        else if (this.showFourthPager && this.showThirdPager && this.showSecondPager) {
          this.firstPager = this.selectedPageValue - 1;
          this.secondPager = this.selectedPageValue;
          this.thirdPager = this.selectedPageValue + 1;
          this.fourthPager = this.selectedPageValue + 2;
          if (this.totalNoOfPages < (this.secondPager) || this.totalNoOfPages < (this.thirdPager) || this.totalNoOfPages < (this.fourthPager)) {
            this.fourthPager = this.totalNoOfPages;
            this.thirdPager = this.totalNoOfPages - 1;
            this.secondPager = this.totalNoOfPages - 2;
            this.firstPager = this.totalNoOfPages - 3;
          }
        }
        else if (this.showThirdPager && this.showSecondPager) {
          this.firstPager = this.selectedPageValue;
          this.secondPager = this.selectedPageValue + 1;
          this.thirdPager = this.selectedPageValue + 2;
          if (this.totalNoOfPages < (this.secondPager) || this.totalNoOfPages < (this.thirdPager)) {
            this.thirdPager = this.totalNoOfPages;
            this.secondPager = this.totalNoOfPages - 1;
            this.firstPager = this.totalNoOfPages - 2;
          }
        }
        else if (this.showSecondPager) {
          this.firstPager = this.selectedPageValue;
          this.secondPager = this.selectedPageValue + 1;
          if (this.totalNoOfPages < this.secondPager) {
            this.secondPager = this.totalNoOfPages;
            this.firstPager = this.totalNoOfPages - 1;
          }
        }

        this.enableFirstPager = true;
        this.enablePreviousPager = true;
        this.enableLastPager = true;
        this.enableNextPager = true;
        // if (this.totalNoOfPages < (this.secondPager) || this.totalNoOfPages < (this.thirdPager) || this.totalNoOfPages < (this.fourthPager) || this.totalNoOfPages < (this.fifthPager)) {
        //   this.fifthPager = this.totalNoOfPages;
        //   this.fourthPager = this.totalNoOfPages - 1;
        //   this.thirdPager = this.totalNoOfPages - 2;
        //   this.secondPager = this.totalNoOfPages - 3;
        //   this.firstPager = this.totalNoOfPages - 4;
        // }
        if (this.totalNoOfPages == this.selectedPageValue) {
          this.enableLastPager = false;
          this.enableNextPager = false;
        }
      }

    }
    else if (pageIndex === "previous") {
      this.selectedPageValue = this.selectedPageValue - 1;
      if (this.selectedPageValue != 1) {
        if (this.fifthPager == this.totalNoOfPages && (this.selectedPageValue == this.fourthPager || this.selectedPageValue == this.thirdPager)) {
          this.enableLastPager = true;
          this.enableNextPager = true;
        }
        else if (this.selectedPageValue >= 3) {
          this.firstPager = this.selectedPageValue - 2;
          this.secondPager = this.selectedPageValue - 1;
          this.thirdPager = this.selectedPageValue;
          this.fourthPager = this.selectedPageValue + 1;
          this.fifthPager = this.selectedPageValue + 2;
          this.enableFirstPager = true;
          this.enablePreviousPager = true;
        }
      }
      else {
        this.enableFirstPager = false;
        this.enablePreviousPager = false;
      }
    }
    else { //first
      if (this.showFifthPager && this.showFourthPager && this.showThirdPager && this.showSecondPager) {
        this.firstPager = 1;
        this.secondPager = 2;
        this.thirdPager = 3;
        this.fourthPager = 4;
        this.fifthPager = 5;
      }
      else if (this.showFourthPager && this.showThirdPager && this.showSecondPager) {
        this.firstPager = 1;
        this.secondPager = 2;
        this.thirdPager = 3;
        this.fourthPager = 4;
      }
      else if (this.showThirdPager && this.showSecondPager) {
        this.firstPager = 1;
        this.secondPager = 2;
        this.thirdPager = 3;
      }
      else if (this.showSecondPager) {
        this.firstPager = 1;
        this.secondPager = 2;
      }

      this.selectedPageValue = 1;
      this.enableFirstPager = false;
      this.enablePreviousPager = false;
      this.enableLastPager = true;
      this.enableNextPager = true;
    }

    //API call
    this.pageNo = this.selectedPageValue - 1;
    this.getZoneDataByPageSizeCPSAndHotZone(this.pageNo, this.size);
  }

  displayButtonsAndValues() {
    if (this.showPagination) {
      this.showSecondPager = false;
      this.showThirdPager = false;
      this.showFourthPager = false;
      this.showFifthPager = false;
      if (this.pageNo == 0) {
        this.firstPager = 0;
        if ((this.totalNoOfPages > this.firstPager) || this.sizeChanged) {
          this.showFirstPager = true;
          this.firstPager = 1;
          this.selectedPageValue = this.firstPager;
        }

        if (((this.totalNoOfPages - this.firstPager) > 0)) {
          this.showSecondPager = true;
          this.secondPager = 2;
        }
        if (((this.totalNoOfPages - this.secondPager) > 0)) {
          this.showThirdPager = true;
          this.thirdPager = 3;
        }
        if (((this.totalNoOfPages - this.thirdPager) > 0) && this.thirdPager != 0) {
          this.showFourthPager = true;
          this.fourthPager = 4;
        }
        if (((this.totalNoOfPages - this.fourthPager) > 0) && this.fourthPager != 0) {
          this.showFifthPager = true;
          this.fifthPager = 5;
        }
        if (this.totalNoOfPages > this.secondPager) {
          this.enableNextPager = true;
          this.enableLastPager = true;
        }
      }
      else { // pageNo >0
        if (this.totalNoOfPages > this.firstPager) {
          this.showFirstPager = true;
        }
        if ((this.totalNoOfPages - this.firstPager) > 0) {
          this.showSecondPager = true;
        }
        if (this.totalNoOfPages - this.secondPager > 0) {
          this.showThirdPager = true;
        }
        if ((this.totalNoOfPages - this.thirdPager) > 0 && this.thirdPager != 0) {
          this.showFourthPager = true;
        }
        if ((this.totalNoOfPages - this.fourthPager) > 0 && this.fourthPager != 0) {
          this.showFifthPager = true;
        }
      }
      this.sizeChanged = false;
    }
  }

  onEnter() {
    this.getZoneDataByPageSizeCPSAndHotZone(this.pageNo, this.size);
  }

  showEmployees() {
    this.showEmployeeList = true;
    this.showZoneList = false;
    this.pageNo = 0;
    this.size = 10;
    this.getZonesCount();
    this.getEmployeesForZoneDashboard("", "");

  }

  showEmployeesByZoneId(zoneId: string) {
    this.showEmployeeList = true;
    this.showZoneList = false;
    this.pageNo = 0;
    this.size = 10;
    this.getZonesCount();
    this.getEmployeesForZoneDashboard(zoneId, "");
  }

  getEmployeesForZoneDashboard(zoneId: string, search: string) {
    this.dashboardService.getEmployeesForZoneDashboard(sessionStorage.getItem("customerId") || "", this.pageNo, this.size,
      this.cityId, this.plantId, this.siteId, zoneId, search).subscribe((res: any) => {

        if (res == null) {
          this.showPagination = false;
          this.employeeDeviceStatus = [];
          this.dataSourceForEmployees = new MatTableDataSource(this.employeeDeviceStatus);
        }
        if (res != null && res.status == 200) {
          this.employeeDeviceStatus = res.data;
          this.dataSourceForEmployees = new MatTableDataSource(this.employeeDeviceStatus);
          this.pagination();
        }


      });
  }

  showZones() {
    this.showEmployeeList = false;
    this.showZoneList = true;
    this.pageNo = 0;
    this.size = 10;

  }

  sortData(sort: Sort) {
    // const data = this.employeeZoneDtos.slice();
    // this.sortedData = data.sort((a:any, b:any) => {
    //   const isAsc = sort.direction === 'asc';
    //   switch (sort.active) {
    //     case 'zoneName': return this.compare(a.zoneName, b.zoneName, isAsc);
    //     case 'count': return this.compare(a.count, b.count, isAsc);
    //     case 'beaconCount': return this.compare(a.beaconCount, b.beaconCount, isAsc);
    //     default: return 0;
    //   }
    // });
  }

  compare(a: number | string, b: number | string, isAsc: boolean) {
    if ((a < b) && isAsc) {
      return -1;
    }
    else if ((a > b) && isAsc) {
      return 1;
    }
    else if ((a < b) && !isAsc) {
      return 1;
    }
    else
      return -1;

    // (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  onZoneTypeChange(event: any) {
    if (event.value === "Hot Zone") {
      this.hotZone = true;
    }
    else {
      this.hotZone = false;
    }
    this.getZoneDataByPageSizeCPSAndHotZone(this.pageNo, this.size);
    this.getZonesCount();
  }

  onEmployeeIdEnter() {
    this.getEmployeesForZoneDashboard("", this.searchEmployeeId);
  }

  exportEmployees() {
    this.dashboardService.exportEmployeesOfZoneDashboard(sessionStorage.getItem("customerId") || "", this.hotZone).subscribe((data: any) => {
      if(data.headers.get('Content-disposition')!=null){
      var headers = data.headers.get('Content-disposition').toString();
      var fileName = headers.substring((headers.indexOf('=') + 1), headers.length);
    }
    else {
      fileName = "Employee Report";
    }
    let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, fileName);
    
  })
}
  
}
