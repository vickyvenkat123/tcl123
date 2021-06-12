import { Component, OnInit } from '@angular/core';
import { Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { CustomerConfigService } from 'src/app/core/services/customer-config.service';
import { DeviceService } from 'src/app/core/services/device.service';
import { Beacon } from 'src/app/shared/models/beacon.model';
import { City, Plant, Site } from 'src/app/shared/models/customer-details.model';
import * as fs from 'file-saver';

@Component({
  selector: 'app-beacon-last-communication',
  templateUrl: './beacon-last-communication.component.html',
  styleUrls: ['./beacon-last-communication.component.css']
})
export class BeaconLastCommunicationComponent implements OnInit {

  constructor(private customerConfigService: CustomerConfigService, private deviceService: DeviceService) { }

  ngOnInit(): void {
    this.getCities();
    this.getBeaconByPageAndSize();
  }
  customerId: string = sessionStorage.getItem("customerId") || "";
  cities: City[] = new Array<City>();
  cityNames: string[] = new Array<string>("All");
  cityId: string = "";
  plantId: string = "";
  plants: Plant[] = new Array<Plant>();
  plantNames: string[] = new Array<string>("All");
  selectedCity: string = "All";
  selectedPlant: string = "All";
  pageNo: number = 0;
  totalNoOfPages: number = 0;
  size: number = 10;
  sizeChanged: boolean = false;
  selectedPageValue: number = 0;
  beaconList: Beacon[] = new Array<Beacon>();
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
  searchBeaconId: string = "";
  displayedColumnsForBeaconList: string[] = ['Beacon ID', 'Beacon Type', 'Serial Number', 'Zone Name', 'Plant Name', 'Site Name', 'Last Communication'];
  dataSourceForBeacons: any;
  totalRecords: number = 0;
  getCities() {
    this.customerConfigService.getCities(this.customerId).subscribe((res: any) => {
      if (res.status == 200) {
        this.cities = res.data;
        this.cities.forEach(element => {
          this.cityNames.push(element.cityName);
        });
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
        this.sizeChanged = true;
        this.pageNo = 0;
        this.selectedPageValue = 0;
        //        this.getZoneDataByPageSizeCPSAndHotZone(this.pageNo, this.size);
        this.getPlantsByCityId(cityId);
      }
    }
    else {
      //All city selected
      this.cityId = "";
      this.sizeChanged = true;
      this.pageNo = 0;
      this.selectedPageValue = 0;
      //      this.getZoneDataByPageSizeCPSAndHotZone(this.pageNo, this.size);
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
    if (selectedPlant !== "All") {
      var plantId = this.plants.find(plant => plant.plantName === selectedPlant)?.plantId;
      if (plantId) {
        this.plantId = plantId;
        //this.getZonesCount();
        this.sizeChanged = true;
        this.pageNo = 0;
        this.selectedPageValue = 0;
        //this.getZoneDataByPageSizeCPSAndHotZone(this.pageNo, this.size);
        this.getPlantsByCityId(plantId);
      }
    }
    else {
      //All Plant selected
      this.plantId = "";
      //this.getZonesCount();
      this.sizeChanged = true;
      this.pageNo = 0;
      this.selectedPageValue = 0;
      //this.getZoneDataByPageSizeCPSAndHotZone(this.pageNo, this.size);
    }
  }

  reset() {
    this.selectedCity = "All";
    this.selectedPlant = "All";
    this.plantNames = ["All"];
  }
  search() {
    this.getBeaconByPageAndSize();
  }

  getBeaconByPageAndSize() {
    this.deviceService.getBeaconByPageAndSize(this.customerId, this.cityId, this.plantId, this.pageNo, this.size).subscribe((res: any) => {
      if (res == null) {
        this.beaconList = [];
        this.totalRecords = 0;
        this.dataSourceForBeacons = new MatTableDataSource(this.beaconList);
      }
      if (res != null && res.status == 200) {
        this.beaconList = res.data;
        this.totalRecords = res.totalRecords;
        this.dataSourceForBeacons = new MatTableDataSource(this.beaconList);
        this.pagination();
      }
    })
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
    this.getBeaconByPageAndSize();
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
    this.getBeaconByPageAndSize();

  }

  onBeaconIdEnter() {
    this.getBeaconsForBeaconId(this.searchBeaconId);
  }

  getBeaconsForBeaconId(beacondId: string) {
    if (beacondId === "") {
      this.getBeaconByPageAndSize();
    }
    else {
      this.deviceService.getBeaconsForBeaconId(beacondId).subscribe((res: any) => {
        if (res == null) {
          this.getBeaconByPageAndSize();
        }
        if (res != null && res.status == 200) {
          this.beaconList = res.data;
          this.totalRecords = res.totalRecords;
          this.dataSourceForBeacons = new MatTableDataSource(this.beaconList);
          this.pagination();
        }
      })
    }

  }

  onSizeChange(data: any) {
    this.size = data.target.value;
    this.pageNo = 0;
    this.sizeChanged = true;
    this.selectedPageValue = 0;
    this.getBeaconByPageAndSize();
  }

  sortData(sort: Sort) { }
  exportBeaconData() {
    this.deviceService.exportBeaconData(this.customerId).subscribe((data: any) => {
      var headers = data.headers.get('Content-disposition').toString();
      //var fileName = headers.substring((headers.indexOf('=') + 1), headers.length);
      var fileName = "Beacon-Inventory";
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, fileName);
    })
  }
}