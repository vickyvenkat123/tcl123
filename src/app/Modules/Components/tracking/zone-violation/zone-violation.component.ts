import { Component, OnInit } from '@angular/core';
import { City, Plant, Site } from 'src/app/shared/models/customer-details.model';
import * as moment from 'moment';
import { CustomerConfigService } from 'src/app/core/services/customer-config.service';
import { DashboardService } from 'src/app/core/services/dashboard.service';
import { ViolationResponseDtoResponse, ZoneResponseDto, ZoneViolations } from 'src/app/shared/models/zone.model';
import { MatTableDataSource } from '@angular/material/table';
import { Sort } from '@angular/material/sort';
import * as fs from 'file-saver';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-zone-violation',
  templateUrl: './zone-violation.component.html',
  styleUrls: ['./zone-violation.component.css']
})
export class ZoneViolationComponent implements OnInit {
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
  violationResponseDtoResponse: ViolationResponseDtoResponse = new ViolationResponseDtoResponse();
  totalViolations: number = 0;
  zoneResponseDtos: ZoneResponseDto[] = new Array<ZoneResponseDto>();
  dataSourceForZoneViolations: any;
  pageNo: number = 0;
  totalNoOfPages: number = 0;
  size: number = 5;
  sizeChanged: boolean = false;
  selectedPageValue: number = 0;
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
  showPagination: boolean = false;
  displayedColumnsForZoneViolations: string[] = ['Zone Name', 'Total Violations', 'Date'];
  displayedColumnsForZoneViolationDetails: string[] = ['Zone Name', 'Employee Id', 'Employee Name', 'Serial No', 'Date', 'Entry Time', 'Exit Time', 'Duration(mins)'];
  totalRecords: number = 0;
  showZoneViolationDetails: boolean = false;
  exportForm = this.formBuilder.group({
    reportType: "status"
  });
  zoneId: string = "";

  pageNoForZVD: number = 0;
  totalNoOfPagesForZVD: number = 0;
  sizeForZVD: number = 5;
  sizeChangedForZVD: boolean = false;
  selectedPageValueForZVD: number = 0;
  enableFirstPagerForZVD: boolean = false;
  enablePreviousPagerForZVD: boolean = false;
  enableNextPagerForZVD: boolean = false
  enableLastPagerForZVD: boolean = false;
  showFirstPagerForZVD: boolean = false;
  showSecondPagerForZVD: boolean = false;
  showThirdPagerForZVD: boolean = false;
  showFourthPagerForZVD: boolean = false;
  showFifthPagerForZVD: boolean = false;
  firstPagerForZVD: number = 0;
  secondPagerForZVD: number = 0;
  thirdPagerForZVD: number = 0;
  fourthPagerForZVD: number = 0;
  fifthPagerForZVD: number = 0;
  showPaginationForZVD: boolean = false;
  totalRecordsForZVD: number = 0;
  zoneViolationsArray: ZoneViolations[] = new Array<ZoneViolations>();
  zoneViolationsEntireArray: ZoneViolations[] = new Array<ZoneViolations>();
  dataSourceForZoneViolationDetails: any;

  constructor(private customerConfigService: CustomerConfigService, private dashboardService: DashboardService, private formBuilder: FormBuilder) { }
  public options: any = {
    'locale': { 'format': 'DD-MM-YYYY', 'separator': ' to ' },
    fromDate: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()),
    toDate: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()),
  };

  ngOnInit(): void {
    this.getCities();
    this.fromDate = (moment(new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate())).format('YYYY-MM-DD'));
    this.toDate = (moment(new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate())).format('YYYY-MM-DD'));
    this.getTotalViolationsCount();
    this.getTotalViolationsSummaryByPageAndSize();

  }

  clear() {
    this.selectedCity = "All";
    this.plantNames = ["All"];
    this.siteNames = ["All"];
    this.fromDate = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());
    this.toDate = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());
    this.dateTextInput = moment(this.fromDate).format('DD-MM-YYYY') + " to " + moment(this.toDate).format('DD-MM-YYYY');
  }

  search() {
    this.fromDate = (moment(this.fromDate).format('YYYY-MM-DD'));
    this.toDate = (moment(this.toDate).format('YYYY-MM-DD'));
    this.getTotalViolationsCount();
    this.getTotalViolationsSummaryByPageAndSize();
    //this.getExecutiveAlerts();
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

  getTotalViolationsCount() {
    this.dashboardService.getZoneViolationCount(this.customerId, this.fromDate, this.toDate, this.cityId, this.plantId, this.siteId).subscribe((res: any) => {
      this.violationResponseDtoResponse = res.data;
      this.totalViolations = res.data.totalViolations;
    })
  }

  getTotalViolationsSummaryByPageAndSize() {
    this.dashboardService.getTotalViolationsSummaryByPageAndSize(this.customerId, this.fromDate, this.toDate, this.cityId, this.plantId, this.siteId, this.pageNo, this.size).subscribe((res: any) => {
      if (res == null) {
        this.zoneResponseDtos = [];
        this.dataSourceForZoneViolations = new MatTableDataSource(this.zoneResponseDtos);
      }
      if (res != null && res.status == 200) {
        this.zoneResponseDtos = res.data;
        this.dataSourceForZoneViolations = new MatTableDataSource(this.zoneResponseDtos);
        this.totalRecords = res.count;
        this.pagination();
      }
    })
  }

  // getSites() {
  //   this.customerConfigService.getSitesByCustomerId(sessionStorage.getItem("customerId") || "").subscribe((res: any) => {
  //     if (res.status == 200) {
  //       this.siteCount = res.data.length;
  //     }
  //   })
  // }

  // getPlants() {
  //   this.customerConfigService.getPlantsByCustomerId(sessionStorage.getItem("customerId") || "").subscribe((res: any) => {
  //     if (res.status == 200) {
  //       this.plantCount = res.data.length;
  //     }
  //   })
  // }

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

  pagination() {
    if (this.totalRecords > this.size) {
      this.showPagination = true;
      if (this.totalRecords % this.size == 0) {
        this.totalNoOfPages = this.totalRecords / this.size;
        this.displayButtonsAndValues();
      }
      else {
        this.totalNoOfPages = Math.floor(this.totalRecords / this.size) + 1;
        this.displayButtonsAndValues();
      }
    }
    else {
      this.showPagination = false;
    }
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
    this.getTotalViolationsSummaryByPageAndSize();
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
    this.getTotalViolationsSummaryByPageAndSize();

  }

  onSizeChange(data: any) {
    this.size = data.target.value;
    this.pageNo = 0;
    this.sizeChanged = true;
    this.selectedPageValue = 0;
    this.showZoneViolationDetails = false;
    this.getTotalViolationsSummaryByPageAndSize();
  }
  sortData(sort: Sort) { }

  exportZoneViolationSummary() {
    this.dashboardService.exportZoneViolationSummary(this.customerId, this.fromDate, this.toDate, this.cityId, this.plantId, this.siteId).subscribe((data: any) => {
      var headers = data.headers.get('Content-disposition').toString();
      var fileName = headers.substring((headers.indexOf('=') + 1), headers.length);
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, fileName);
    })
  }

  exportZoneViolationStatus() {
    this.dashboardService.exportZoneViolationStatus(this.customerId, this.fromDate, this.toDate, this.cityId, this.plantId, this.siteId).subscribe((data: any) => {
      var headers = data.headers.get('Content-disposition').toString();
      var fileName = headers.substring((headers.indexOf('=') + 1), headers.length);
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, fileName);
    })
  }

  openZone(zoneId: string) {
    this.showZoneViolationDetails = true;
    this.zoneId = zoneId;
    this.getZoneViolationDetailsByPageAndSize();
  }

  getZoneViolationDetailsByPageAndSize() {
    if (this.zoneViolationsEntireArray.length == 0) {
      this.dashboardService.getZoneViolationDetails(this.customerId, this.fromDate, this.toDate, this.cityId, this.plantId, this.siteId, this.pageNoForZVD, this.sizeForZVD, this.zoneId).subscribe((res: any) => {
        if (res == null) {
          this.zoneViolationsEntireArray = [];
          this.totalRecordsForZVD = 0;
          this.dataSourceForZoneViolationDetails = new MatTableDataSource(this.zoneViolationsEntireArray);
        }
        if (res != null && res.status == 200) {
          this.zoneViolationsEntireArray = res.data;
          //this.dataSourceForZoneViolationDetails = new MatTableDataSource(this.zoneViolationsArray);
          this.totalRecordsForZVD = res.count;
          this.paginationForZVD();
        }
      }
      )
    }
    else {
      this.paginationForZVD();
    }
  }

  export() {
    if (this.exportForm.value.reportType === "status") {
      this.exportZoneViolationStatus();
    }
    else {
      this.exportZoneViolationSummary();
    }

  }

  paginationForZVD() {
    if (this.totalRecordsForZVD > this.sizeForZVD) {
      this.showPaginationForZVD = true;
      if (this.totalRecordsForZVD % this.sizeForZVD == 0) {
        this.totalNoOfPagesForZVD = this.totalRecordsForZVD / this.sizeForZVD;
        this.displayButtonsAndValuesForZVD();
      }
      else {
        this.totalNoOfPagesForZVD = Math.floor(this.totalRecordsForZVD / this.sizeForZVD) + 1;
        this.displayButtonsAndValuesForZVD();
      }
    }
    else {
      this.showPaginationForZVD = false;
    }
    //show pageWiseData
    this.zoneViolationsArray = [];
    var startIndex = this.sizeForZVD * this.pageNoForZVD;
    var endIndex = this.sizeForZVD * this.pageNoForZVD + this.sizeForZVD - 1;
    endIndex = endIndex < this.zoneViolationsEntireArray.length ? endIndex: (this.zoneViolationsEntireArray.length - 1) ;
    for (let index = startIndex; index <= endIndex; index++) {
      this.zoneViolationsArray.push(this.zoneViolationsEntireArray[index]);
    }
    this.dataSourceForZoneViolationDetails = new MatTableDataSource(this.zoneViolationsArray);

  }

  onSizeChangeForZVD(data: any) {
    this.sizeForZVD = data.target.value;
    this.pageNoForZVD = 0;
    this.sizeChangedForZVD = true;
    this.selectedPageValueForZVD = 0;
    this.getTotalViolationsSummaryByPageAndSize();
  }
  pagerClickedForZVD(pageIndex: string) {
    if (pageIndex === "last") {
      if (this.showFifthPagerForZVD && this.showFourthPagerForZVD && this.showThirdPagerForZVD && this.showSecondPagerForZVD) {
        this.fifthPagerForZVD = this.totalNoOfPagesForZVD;
        this.fourthPagerForZVD = this.totalNoOfPagesForZVD - 1;
        this.thirdPagerForZVD = this.totalNoOfPagesForZVD - 2;
        this.secondPagerForZVD = this.totalNoOfPagesForZVD - 3;
        this.firstPagerForZVD = this.totalNoOfPagesForZVD - 4;
      }
      else if (this.showFourthPagerForZVD && this.showThirdPagerForZVD && this.showSecondPagerForZVD) {
        this.fourthPagerForZVD = this.totalNoOfPagesForZVD;
        this.thirdPagerForZVD = this.totalNoOfPagesForZVD - 1;
        this.secondPagerForZVD = this.totalNoOfPagesForZVD - 2;
        this.firstPagerForZVD = this.totalNoOfPagesForZVD - 3;
      }
      else if (this.showThirdPagerForZVD && this.showSecondPagerForZVD) {
        this.thirdPagerForZVD = this.totalNoOfPagesForZVD;
        this.secondPagerForZVD = this.totalNoOfPagesForZVD - 1;
        this.firstPagerForZVD = this.totalNoOfPagesForZVD - 2;
      }
      else if (this.showSecondPagerForZVD) {
        this.secondPagerForZVD = this.totalNoOfPagesForZVD;
        this.firstPagerForZVD = this.totalNoOfPagesForZVD - 1;
      }

      this.selectedPageValueForZVD = this.totalNoOfPagesForZVD;
      this.enableLastPagerForZVD = false;
      this.enableNextPagerForZVD = false;
      this.enableFirstPagerForZVD = true;
      this.enablePreviousPagerForZVD = true;
    }
    else if (pageIndex === "next") {
      //alert(this.selectedPageValueForZVD);
      if (this.selectedPageValueForZVD <= 2) {
        this.selectedPageValueForZVD = this.selectedPageValueForZVD + 1;
        this.enableFirstPagerForZVD = true;
        this.enablePreviousPagerForZVD = true;
        this.enableLastPagerForZVD = true;
        this.enableNextPagerForZVD = true;
      }
      else {
        this.selectedPageValueForZVD = this.selectedPageValueForZVD + 1;
        if (this.showFifthPagerForZVD && this.showFourthPagerForZVD && this.showThirdPagerForZVD && this.showSecondPagerForZVD) {
          this.firstPagerForZVD = this.selectedPageValueForZVD - 2;
          this.secondPagerForZVD = this.selectedPageValueForZVD - 1;
          this.thirdPagerForZVD = this.selectedPageValueForZVD;
          this.fourthPagerForZVD = this.selectedPageValueForZVD + 1;
          this.fifthPagerForZVD = this.selectedPageValueForZVD + 2;
          if (this.totalNoOfPagesForZVD < (this.secondPagerForZVD) || this.totalNoOfPagesForZVD < (this.thirdPagerForZVD) || this.totalNoOfPagesForZVD < (this.fourthPagerForZVD) || this.totalNoOfPagesForZVD < (this.fifthPagerForZVD)) {
            this.fifthPagerForZVD = this.totalNoOfPagesForZVD;
            this.fourthPagerForZVD = this.totalNoOfPagesForZVD - 1;
            this.thirdPagerForZVD = this.totalNoOfPagesForZVD - 2;
            this.secondPagerForZVD = this.totalNoOfPagesForZVD - 3;
            this.firstPagerForZVD = this.totalNoOfPagesForZVD - 4;
          }
        }
        else if (this.showFourthPagerForZVD && this.showThirdPagerForZVD && this.showSecondPagerForZVD) {
          this.firstPagerForZVD = this.selectedPageValueForZVD - 1;
          this.secondPagerForZVD = this.selectedPageValueForZVD;
          this.thirdPagerForZVD = this.selectedPageValueForZVD + 1;
          this.fourthPagerForZVD = this.selectedPageValueForZVD + 2;
          if (this.totalNoOfPagesForZVD < (this.secondPagerForZVD) || this.totalNoOfPagesForZVD < (this.thirdPagerForZVD) || this.totalNoOfPagesForZVD < (this.fourthPagerForZVD)) {
            this.fourthPagerForZVD = this.totalNoOfPagesForZVD;
            this.thirdPagerForZVD = this.totalNoOfPagesForZVD - 1;
            this.secondPagerForZVD = this.totalNoOfPagesForZVD - 2;
            this.firstPagerForZVD = this.totalNoOfPagesForZVD - 3;
          }
        }
        else if (this.showThirdPagerForZVD && this.showSecondPagerForZVD) {
          this.firstPagerForZVD = this.selectedPageValueForZVD;
          this.secondPagerForZVD = this.selectedPageValueForZVD + 1;
          this.thirdPagerForZVD = this.selectedPageValueForZVD + 2;
          if (this.totalNoOfPagesForZVD < (this.secondPagerForZVD) || this.totalNoOfPagesForZVD < (this.thirdPagerForZVD)) {
            this.thirdPagerForZVD = this.totalNoOfPagesForZVD;
            this.secondPagerForZVD = this.totalNoOfPagesForZVD - 1;
            this.firstPagerForZVD = this.totalNoOfPagesForZVD - 2;
          }
        }
        else if (this.showSecondPagerForZVD) {
          this.firstPagerForZVD = this.selectedPageValueForZVD;
          this.secondPagerForZVD = this.selectedPageValueForZVD + 1;
          if (this.totalNoOfPagesForZVD < this.secondPagerForZVD) {
            this.secondPagerForZVD = this.totalNoOfPagesForZVD;
            this.firstPagerForZVD = this.totalNoOfPagesForZVD - 1;
          }
        }

        this.enableFirstPagerForZVD = true;
        this.enablePreviousPagerForZVD = true;
        this.enableLastPagerForZVD = true;
        this.enableNextPagerForZVD = true;
        // if (this.totalNoOfPagesForZVD < (this.secondPagerForZVD) || this.totalNoOfPagesForZVD < (this.thirdPagerForZVD) || this.totalNoOfPagesForZVD < (this.fourthPagerForZVD) || this.totalNoOfPagesForZVD < (this.fifthPagerForZVD)) {
        //   this.fifthPagerForZVD = this.totalNoOfPagesForZVD;
        //   this.fourthPagerForZVD = this.totalNoOfPagesForZVD - 1;
        //   this.thirdPagerForZVD = this.totalNoOfPagesForZVD - 2;
        //   this.secondPagerForZVD = this.totalNoOfPagesForZVD - 3;
        //   this.firstPagerForZVD = this.totalNoOfPagesForZVD - 4;
        // }
        if (this.totalNoOfPagesForZVD == this.selectedPageValueForZVD) {
          this.enableLastPagerForZVD = false;
          this.enableNextPagerForZVD = false;
        }
      }

    }
    else if (pageIndex === "previous") {
      this.selectedPageValueForZVD = this.selectedPageValueForZVD - 1;
      if (this.selectedPageValueForZVD != 1) {
        if (this.fifthPagerForZVD == this.totalNoOfPagesForZVD && (this.selectedPageValueForZVD == this.fourthPagerForZVD || this.selectedPageValueForZVD == this.thirdPagerForZVD)) {
          this.enableLastPagerForZVD = true;
          this.enableNextPagerForZVD = true;
        }
        else if (this.selectedPageValueForZVD >= 3) {
          this.firstPagerForZVD = this.selectedPageValueForZVD - 2;
          this.secondPagerForZVD = this.selectedPageValueForZVD - 1;
          this.thirdPagerForZVD = this.selectedPageValueForZVD;
          this.fourthPagerForZVD = this.selectedPageValueForZVD + 1;
          this.fifthPagerForZVD = this.selectedPageValueForZVD + 2;
          this.enableFirstPagerForZVD = true;
          this.enablePreviousPagerForZVD = true;
        }
      }
      else {
        this.enableFirstPagerForZVD = false;
        this.enablePreviousPagerForZVD = false;
      }
    }
    else { //first
      if (this.showFifthPagerForZVD && this.showFourthPagerForZVD && this.showThirdPagerForZVD && this.showSecondPagerForZVD) {
        this.firstPagerForZVD = 1;
        this.secondPagerForZVD = 2;
        this.thirdPagerForZVD = 3;
        this.fourthPagerForZVD = 4;
        this.fifthPagerForZVD = 5;
      }
      else if (this.showFourthPagerForZVD && this.showThirdPagerForZVD && this.showSecondPagerForZVD) {
        this.firstPagerForZVD = 1;
        this.secondPagerForZVD = 2;
        this.thirdPagerForZVD = 3;
        this.fourthPagerForZVD = 4;
      }
      else if (this.showThirdPagerForZVD && this.showSecondPagerForZVD) {
        this.firstPagerForZVD = 1;
        this.secondPagerForZVD = 2;
        this.thirdPagerForZVD = 3;
      }
      else if (this.showSecondPagerForZVD) {
        this.firstPagerForZVD = 1;
        this.secondPagerForZVD = 2;
      }

      this.selectedPageValueForZVD = 1;
      this.enableFirstPagerForZVD = false;
      this.enablePreviousPagerForZVD = false;
      this.enableLastPagerForZVD = true;
      this.enableNextPagerForZVD = true;
    }

    //API call
    this.pageNoForZVD = this.selectedPageValueForZVD - 1;
    this.getZoneViolationDetailsByPageAndSize();
  }

  pagerNumClickedForZVD(pageNumber: number, position: number) {
    if (pageNumber == 1) {
      this.pageNoForZVD = 0;
      this.displayButtonsAndValuesForZVD();
    }
    else {
      if (position >= 4) {
        this.selectedPageValueForZVD = pageNumber;
        if (this.showFifthPagerForZVD && this.showFourthPagerForZVD && this.showThirdPagerForZVD && this.showSecondPagerForZVD) {
          this.firstPagerForZVD = pageNumber - 2;
          this.secondPagerForZVD = pageNumber - 1;
          this.thirdPagerForZVD = pageNumber;
          this.fourthPagerForZVD = pageNumber + 1;
          this.fifthPagerForZVD = pageNumber + 2;
          if (this.totalNoOfPagesForZVD < (this.secondPagerForZVD) || this.totalNoOfPagesForZVD < (this.thirdPagerForZVD) || this.totalNoOfPagesForZVD < (this.fourthPagerForZVD) || this.totalNoOfPagesForZVD < (this.fifthPager)) {
            this.fifthPagerForZVD = this.totalNoOfPagesForZVD;
            this.fourthPagerForZVD = this.totalNoOfPagesForZVD - 1;
            this.thirdPagerForZVD = this.totalNoOfPagesForZVD - 2;
            this.secondPagerForZVD = this.totalNoOfPagesForZVD - 3;
            this.firstPagerForZVD = this.totalNoOfPagesForZVD - 4;
          }
        }
        else if (this.showFourthPagerForZVD && this.showThirdPagerForZVD && this.showSecondPagerForZVD) {
          this.firstPagerForZVD = pageNumber - 2;
          this.secondPagerForZVD = pageNumber - 1;
          this.thirdPagerForZVD = pageNumber;
          this.fourthPagerForZVD = pageNumber + 1;
          if (this.totalNoOfPagesForZVD < (this.secondPagerForZVD) || this.totalNoOfPagesForZVD < (this.thirdPager) || this.totalNoOfPagesForZVD < (this.fourthPagerForZVD)) {
            this.fourthPagerForZVD = this.totalNoOfPagesForZVD;
            this.thirdPagerForZVD = this.totalNoOfPagesForZVD - 1;
            this.secondPagerForZVD = this.totalNoOfPagesForZVD - 2;
            this.firstPagerForZVD = this.totalNoOfPagesForZVD - 3;
          }
        }

        this.enableFirstPagerForZVD = true;
        this.enablePreviousPagerForZVD = true;
        if (this.thirdPagerForZVD != this.totalNoOfPagesForZVD) {
          this.enableLastPagerForZVD = true;
          this.enableNextPagerForZVD = true;
        }
        else {
          this.enableLastPagerForZVD = false;
          this.enableNextPagerForZVD = false;
        }
      }
      else if (position <= 3 && (this.thirdPagerForZVD == 3 || pageNumber <= 3)) {
        this.firstPagerForZVD = 1;
        if (this.showSecondPagerForZVD)
          this.secondPagerForZVD = 2;
        if (this.showThirdPagerForZVD)
          this.thirdPagerForZVD = 3;
        if (this.showFourthPagerForZVD)
          this.fourthPagerForZVD = 4;
        if (this.showFifthPagerForZVD)
          this.fifthPagerForZVD = 5;
        this.selectedPageValueForZVD = pageNumber;
        this.enableFirstPagerForZVD = false;
        this.enablePreviousPagerForZVD = false;
        if (this.selectedPageValueForZVD != 1) {
          this.enableFirstPagerForZVD = true;
          this.enablePreviousPagerForZVD = true;
        }
      }
      else if (position <= 3) {
        this.selectedPageValueForZVD = pageNumber;
        this.firstPagerForZVD = pageNumber - 2 == 0 ? 1 : pageNumber - 2;
        if (this.showSecondPagerForZVD)
          this.secondPagerForZVD = pageNumber - 1 == this.firstPagerForZVD ? pageNumber : pageNumber - 1;
        if (this.showThirdPagerForZVD)
          this.thirdPagerForZVD = pageNumber == this.secondPagerForZVD ? pageNumber : pageNumber;
        if (this.showFourthPagerForZVD)
          this.fourthPagerForZVD = pageNumber + 1;
        if (this.showFifthPagerForZVD)
          this.fifthPagerForZVD = pageNumber + 2;
        this.enableFirstPagerForZVD = false;
        this.enablePreviousPagerForZVD = false;
      }
    }
    if (this.totalNoOfPagesForZVD == this.selectedPageValueForZVD) {
      this.enableLastPagerForZVD = false;
      this.enableNextPagerForZVD = false;
    }
    else {
      this.enableLastPagerForZVD = true;
      this.enableNextPagerForZVD = true;
    }
    if (this.selectedPageValueForZVD == 1) {
      this.enableFirstPagerForZVD = false;
      this.enablePreviousPagerForZVD = false;
    }
    else {
      this.enableFirstPagerForZVD = true;
      this.enablePreviousPagerForZVD = true;
    }
    //API call
    this.pageNoForZVD = this.selectedPageValueForZVD - 1;
    this.getZoneViolationDetailsByPageAndSize();

  }

  displayButtonsAndValuesForZVD() {
    if (this.showPaginationForZVD) {
      this.showSecondPagerForZVD = false;
      this.showThirdPagerForZVD = false;
      this.showFourthPagerForZVD = false;
      this.showFifthPagerForZVD = false;
      if (this.pageNoForZVD == 0) {
        this.firstPagerForZVD = 0;
        if ((this.totalNoOfPagesForZVD > this.firstPagerForZVD) || this.sizeChangedForZVD) {
          this.showFirstPagerForZVD = true;
          this.firstPagerForZVD = 1;
          this.selectedPageValueForZVD = this.firstPagerForZVD;
        }

        if (((this.totalNoOfPagesForZVD - this.firstPagerForZVD) > 0)) {
          this.showSecondPagerForZVD = true;
          this.secondPagerForZVD = 2;
        }
        if (((this.totalNoOfPagesForZVD - this.secondPagerForZVD) > 0)) {
          this.showThirdPagerForZVD = true;
          this.thirdPagerForZVD = 3;
        }
        if (((this.totalNoOfPagesForZVD - this.thirdPagerForZVD) > 0) && this.thirdPagerForZVD != 0) {
          this.showFourthPagerForZVD = true;
          this.fourthPagerForZVD = 4;
        }
        if (((this.totalNoOfPagesForZVD - this.fourthPagerForZVD) > 0) && this.fourthPagerForZVD != 0) {
          this.showFifthPagerForZVD = true;
          this.fifthPagerForZVD = 5;
        }
        if (this.totalNoOfPagesForZVD > this.secondPagerForZVD) {
          this.enableNextPagerForZVD = true;
          this.enableLastPagerForZVD = true;
        }
      }
      else { // pageNoForZVDForZVD >0
        if (this.totalNoOfPagesForZVD > this.firstPagerForZVD) {
          this.showFirstPagerForZVD = true;
        }
        if ((this.totalNoOfPagesForZVD - this.firstPagerForZVD) > 0) {
          this.showSecondPagerForZVD = true;
        }
        if (this.totalNoOfPagesForZVD - this.secondPagerForZVD > 0) {
          this.showThirdPagerForZVD = true;
        }
        if ((this.totalNoOfPagesForZVD - this.thirdPagerForZVD) > 0 && this.thirdPagerForZVD != 0) {
          this.showFourthPagerForZVD = true;
        }
        if ((this.totalNoOfPagesForZVD - this.fourthPagerForZVD) > 0 && this.fourthPagerForZVD != 0) {
          this.showFifthPagerForZVD = true;
        }
      }
      this.sizeChangedForZVD = false;
    }
  }

  sortDataForZVD(event: any) {
  }

  exportZoneViolationDetails() {
    this.dashboardService.exportZoneViolationDetails(this.customerId, this.fromDate, this.toDate, this.cityId, this.plantId, this.siteId, this.zoneId).subscribe((data: any) => {
      var headers = data.headers.get('Content-disposition').toString();
      var fileName = headers.substring((headers.indexOf('=') + 1), headers.length);
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, fileName);
    })
  }
}