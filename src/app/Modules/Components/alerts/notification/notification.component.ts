import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { MatOption } from '@angular/material/core';
import { interval, Subscription } from 'rxjs';
import { CustomerConfigService } from 'src/app/core/services/customer-config.service';
import { DashboardService } from 'src/app/core/services/dashboard.service';
import { City, Plant, Site } from 'src/app/shared/models/customer-details.model';
import { NotificationDto } from 'src/app/shared/models/notification-dto.model';
import * as moment from 'moment';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit {
  subscription: Subscription;
  cities: City[] = new Array<City>();
  cityNames: string[] = new Array<string>("All");
  cityId: string = "";
  plantId: string = "";
  plants: Plant[] = new Array<Plant>();
  plantNames: string[] = new Array<string>("All");
  siteId: string = "";
  sites: Site[] = new Array<Site>();
  siteNames: string[] = new Array<string>("All");
  selectedCity: string = "All";
  selectedPlant: string = "All";
  selectedSite: string = "All";
  pageNo: number = 0;
  size: number = 10;
  sizeChanged: boolean = false;
  totalNoOfPages: number = 0;
  selectedPageValue: number = 0;
  notificationDto: NotificationDto = new NotificationDto();
  alertTypeList = [{ "alertId": "144", "alertName": "SOS For Tracker" }, { "alertId": "37", "alertName": "Hazardous For Tracker" }];
  alertStatusList = [{ "alertId": "acknowledged", "alertName": "Acknowledged" }, { "alertId": "resolved", "alertName": "Resolved" }];
  alertForm = this.formBuilder.group({
    alertDropdown: new FormControl(['All']),
  });
  @ViewChild('allSelected') allSelected: MatOption;
  reportDate:any;
  fromDate: any;
  toDate: any;
  selectedDateValue: any;
  dateTextInput: any;


  constructor(private customerConfigService: CustomerConfigService, private dashboardService: DashboardService, private formBuilder: FormBuilder) {
    this.subscription = interval(10000).subscribe((val) => {
      this.dashboardService.getAlertsCount().subscribe((res: any) => {
        this.notificationDto = res.data;
      })
    });
  }

  public options: any = {
    'locale': { 'format': 'YYYY-MM-DD', 'separator': ' to ' },
    fromDate: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()),
    toDate: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()),
  };

  ngOnInit(): void {
    this.getCities();
    this.reportDate = (moment(new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate())).format('YYYY-MM-DD'));
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
        this.getNotificationsData();
        this.getPlantsByCityId(cityId);
      }
    }
    else {
      //All city selected
      this.cityId = this.selectedCity;
      this.sizeChanged = true;
      this.pageNo = 0;
      this.selectedPageValue = 0;
      this.getNotificationsData();
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
        this.sizeChanged = true;
        this.pageNo = 0;
        this.selectedPageValue = 0;
        this.getNotificationsData();
        this.getSiteDetailsByPlantId(this.plantId);
      }
    }
    else {
      //All Plant selected
      this.plantId = this.selectedPlant;
      this.sizeChanged = true;
      this.pageNo = 0;
      this.selectedPageValue = 0;
      this.getNotificationsData();
    }
  }

  siteChanged(event: any) {
    var selectedSite = event.value;
    if (selectedSite !== "All") {
      var siteId = this.sites.find(site => site.siteName === selectedSite)?.siteId;
      if (siteId) {
        this.siteId = siteId;
        this.sizeChanged = true;
        this.pageNo = 0;
        this.selectedPageValue = 0;
        this.getNotificationsData();
      }
    }
    else {
      //All Sites selected
      this.siteId = this.selectedSite;
      this.sizeChanged = true;
      this.pageNo = 0;
      this.selectedPageValue = 0;
      this.getNotificationsData();
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

  getNotificationsData() {

  }

  toggleAllSelection(){
    if (this.allSelected.selected) {
      this.allSelected.deselect();
      this.alertForm.controls.alertDropdown.patchValue(["All"]);
    } else {
      this.alertForm.controls.alertDropdown.patchValue(["All"]);
    }
  }

  tosslePerOne(){
    if (this.allSelected.selected) {
      this.allSelected.deselect();
      return false;
    }
    if (this.alertForm.controls.alertDropdown.value.length == this.alertTypeList.length) {
      this.allSelected.select();
      this.alertForm.controls.alertDropdown.patchValue(["All"]);
      return false;
    }
    return false;
  }

  clear() {
    this.selectedCity = "All";
    this.plantNames = ["All"];
    this.siteNames = ["All"];
    this.reportDate = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());
  }
  public calendarCanceled(e: any) {
    console.log(e);
  }

  public selectedDate(value: any) {
    this.selectedDateValue = value;
    this.fromDate = moment(this.selectedDateValue.start).format('YYYY-MM-DD');
    this.toDate = moment(this.selectedDateValue.end).format('YYYY-MM-DD');
  }

  public calendarApplied(e: any) {
    console.log(e);
  }

}