import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { MatOption } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { AlertRuleService } from 'src/app/core/alert-rule.service';
import { CustomerConfigService } from 'src/app/core/services/customer-config.service';
import { alertrule } from 'src/app/shared/models/alert-rule.model';
import { City, CustomerDetails, Plant, Site } from 'src/app/shared/models/customer-details.model';
import { Employee } from 'src/app/shared/models/employee.model';
import { ErrorModalComponent } from '../../error-modal/error-modal.component';
import { ChangeRuleStatusComponent } from './change-rule-status/change-rule-status.component';
import { ViewAlertRuleComponent } from './view-alert-rule/view-alert-rule.component';

@Component({
  selector: 'app-alert-rule',
  templateUrl: './alert-rule.component.html',
  styleUrls: ['./alert-rule.component.css']
})
export class AlertRuleComponent implements OnInit {

  constructor(private alertRuleService: AlertRuleService, private formBuilder: FormBuilder, private dialog: MatDialog, private customerConfigService: CustomerConfigService) { }
  showSearch: boolean = false;
  showSearchResult: boolean = false;
  pageNo: number = 0;
  totalNoOfPages: number = 0;
  size: number = 10;
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
  dataSourceForRules: any;
  alertRuleList: alertrule[] = new Array<alertrule>();
  totalRecords: number = 0;
  loggedInUserType: string = sessionStorage.getItem("role") || "";
  userType: string = "";
  customerName: string = sessionStorage.getItem("customerName") || "";
  cityName: string = sessionStorage.getItem("cityName") || "";
  cityId: string = sessionStorage.getItem("cityId") || "";
  displayedColumnsForBeaconList: string[] = ['Alert Name', 'Customer', 'User Name', 'User Type', 'Hierarchy Level', 'Created Date', 'Email', 'SMS', 'Status', 'Actions'];
  userId: string = sessionStorage.getItem("userId") || "";
  hierarchyList: any;
  notificationTypeList: any;
  alertTypeList: any;
  selectedHierarchy: any;
  selectedType: any;
  selectedCustomer: any;
  selectedCity: any;
  selectedPlant: any;
  selectedSite: any;
  selectedEmployee: any;
  selectedNotification: any;
  @ViewChild('allSelected') allSelected: MatOption;
  @ViewChild('allPlantSelected') allPlantSelected: MatOption;
  @ViewChild('allSiteSelected') allSiteSelected: MatOption;
  @ViewChild('allEmployeeSelected') allEmployeeSelected: MatOption;
  @ViewChild('allNotificationSelected') allNotificationSelected: MatOption;
  @ViewChild('allCitySelected') allCitySelected: MatOption;
  userName: string = "";
  customerDetails: any;
  alertForm = this.formBuilder.group({
    alertDropdown: new FormControl(['All']),
  });
  typeForm = this.formBuilder.group({
    selectedType: new FormControl(['All']),
  });
  plantForm = this.formBuilder.group({
    selectedPlant: new FormControl(['All']),
  });
  siteForm = this.formBuilder.group({
    selectedSite: new FormControl(['All']),
  });
  employeeForm = this.formBuilder.group({
    selectedEmployee: new FormControl(['All']),
  });
  cityForm = this.formBuilder.group({
    selectedCity: new FormControl(['All']),
  });
  notifyForm = this.formBuilder.group({
    selectedNotification: new FormControl(['All']),
  });

  alertName: string = "";
  customerId: string = sessionStorage.getItem("customerId") || "";
  cities: City[] = new Array<City>();
  plants: Plant[] = new Array<Plant>();
  sites: Site[] = new Array<Site>();
  employees: Employee[] = new Array<Employee>();
  plantNames: string[] = new Array<string>();
  showPlantList: boolean = false;
  showMultiPlantList: boolean = false;
  showSiteList: boolean = false;
  showMultiSiteList: boolean = false;
  showMultiEmployeeList: boolean = false;
  showSingleSiteSelectList: boolean = false;
  showAllEmployees: boolean = false;
  showMultiCityList: boolean = false;
  showSingleCityList: boolean = false;
  employeeList = [];
  plantList = [];
  siteList = [];
  cityList = [];
  customerList = [];
  email: boolean = Boolean(sessionStorage.getItem("email")) || false;
  sms: boolean = Boolean(sessionStorage.getItem("sms")) || false;
  searchUserName: string = "";
  showDisabledCity: boolean = false;

  ngOnInit(): void {
    if (this.loggedInUserType === "SUPERADMIN") {
      this.showSearch = true;
    }
    else {
      this.showSearchResult = true;
    }
    this.hierarchyList = [{ "name": "Customer", "id": "CUSTOMER" }, { "name": "City", "id": "CITY" }, { "name": "Plant", "id": "PLANT" }, { "name": "Site", "id": "SITE" }, { "name": "Employee", "id": "EMPLOYEE" }];
    // this.notificationTypeList = [{ "name": "Email", "id": "Email" }, { "name": "SMS", "id": "SMS" }, { "name": "Pop-Up", "id": "PopUP" }];
    this.notificationTypeList = [{ "name": "Email", "id": "Email" }, { "name": "SMS", "id": "SMS" }];
    this.alertTypeList = [{ "alertId": "144", "alertName": "SOS For Tracker" }, { "alertId": "37", "alertName": "Hazardous For Tracker" }];
    this.getAlertRuleListPageAndSize();
    this.setHieraNotiAlertList();
    if (this.loggedInUserType !== "SUPERADMIN") {
      this.getCities();
    }
  }

  setHieraNotiAlertList() {
    if (this.loggedInUserType === 'CITYADMIN' || this.loggedInUserType === 'DOCTOR' || this.loggedInUserType === 'CCB' || this.loggedInUserType === 'OPERATIONS_EXECUTIVE' || this.loggedInUserType === 'SAFETY_EXECUTIVE') {
      this.selectedHierarchy = "CITY";
      this.hierarchyList = [{ "name": "City", "id": "CITY" }, { "name": "Plant", "id": "PLANT" }, { "name": "Site", "id": "SITE" }, { "name": "Employee", "id": "EMPLOYEE" }];
      if (this.email) {
        this.notificationTypeList = { "name": "Email", "id": "Email" };
      }
      if (this.sms) {
        this.notificationTypeList.push({ "name": "SMS", "id": "SMS" });
      }
      this.selectedNotification = "All";
      this.selectedType = "All";
      this.selectedCustomer = this.customerName;
      this.selectedCity = this.cityName;
      this.showDisabledCity = true;
      this.cityForm.value.selectedCity = this.cityName;
    }
    else if (this.loggedInUserType === 'CUSTOMERADMIN') {
      this.selectedHierarchy = "CUSTOMER";
      this.hierarchyList = [{ "name": "Customer", "id": "CUSTOMER" }, { "name": "City", "id": "CITY" }, { "name": "Plant", "id": "PLANT" }, { "name": "Site", "id": "SITE" }, { "name": "Employee", "id": "EMPLOYEE" }];
      if (this.email) {
        this.notificationTypeList = { "name": "Email", "id": "Email" };
      }
      if (this.sms) {
        this.notificationTypeList.push({ "name": "SMS", "id": "SMS" });
      }
      this.selectedNotification = "All";
      this.selectedType = "All";
      this.selectedCustomer = this.customerName;
      this.showMultiCityList = false;
      this.showSingleCityList = false;
      this.cityForm.value.selectedCity = this.cityName;
    }
    else if (this.loggedInUserType === 'SUPERADMIN') {
    }
  }

  getAlertRuleListPageAndSize() {
    this.alertRuleService.getAlertRuleList(this.pageNo, this.size).subscribe((res: any) => {
      if (res == null) {
        this.alertRuleList = [];
        this.totalRecords = 0;
        this.dataSourceForRules = new MatTableDataSource(this.alertRuleList);
      }
      if (res != null && res.status == 200) {
        this.alertRuleList = res.data;
        this.totalRecords = res.count;
        this.dataSourceForRules = new MatTableDataSource(this.alertRuleList);
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

    if (this.searchUserName !== "") {
      var startIndex = this.size * this.pageNo;
      var endIndex = this.size * this.pageNo + this.size - 1;
      endIndex = endIndex < this.alertRuleList.length ? endIndex : (this.totalRecords - 1);
      var arrayOfSearch = [];
      for (let index = startIndex; index <= endIndex; index++) {
        arrayOfSearch.push(this.alertRuleList[index]);
      }
      this.dataSourceForRules = new MatTableDataSource(arrayOfSearch);
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
    if (this.searchUserName === "" || (this.searchUserName !== "" && this.alertRuleList.length == 0)) {
      this.getAlertRuleListPageAndSize();
    }
    else {
      this.pagination();
    }
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
    if (this.searchUserName === "" || (this.searchUserName !== "" && this.alertRuleList.length == 0)) {
      this.getAlertRuleListPageAndSize();
    }
    else {
      this.pagination();
    }
  }

  onSizeChange(data: any) {
    this.size = data.target.value;
    this.pageNo = 0;
    this.sizeChanged = true;
    this.selectedPageValue = 0;
    if (this.searchUserName === "") {
      this.getAlertRuleListPageAndSize();
    }
    else {
      this.pagination();
    }
  }

  sortData(event: any) {

  }

  search() {
    if (this.userName === "") {
      this.dialog.open(ErrorModalComponent, {
        data: {
          message: "Please type valid User Name",
          header: "Error"
        }
      });
      return;
    }
    this.alertRuleService.getUserByUserId(this.userName).subscribe((res: any) => {
      this.customerDetails = res.data;
      this.showSearch = false;
      this.showSearchResult = true;
      this.selectedHierarchy = "CUSTOMER";
      this.customerName = this.customerDetails.customer.customerName;
      this.selectedCustomer = this.customerName;
      this.customerId = this.customerDetails.customer.customerId;
      this.userType = this.customerDetails.userType;
      this.getCities();
      this.userId = this.customerDetails.userId;
    }, error => {
      this.dialog.open(ErrorModalComponent, {
        data: {
          message: error.error.message,
          header: "Error"
        }
      });

    });
  }

  getCities() {
    this.customerConfigService.getCities(this.customerId).subscribe((res: any) => {
      if (res.status == 200) {
        this.cities = res.data;
        if (this.loggedInUserType !== "CUSTOMERADMIN" && this.loggedInUserType !== "SUPERADMIN") {
          this.getPlantsByCityId(this.cities.find(city => city.cityName === this.selectedCity).cityId);
        }
      }
    })
  }

  getPlantsByCityId(cityId: string) {
    this.customerConfigService.getPlantsDetailsByCityId(cityId.toString()).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.plants = res.data;
        }
      })
  }

  save() {
    if (this.alertName === "") {
      this.dialog.open(ErrorModalComponent, {
        data: {
          message: "Please Fill All Mandatory Fields",
          header: "Error"
        }
      });
      return;
    }
    if (this.selectedHierarchy === "SITE") {
      if (this.plantForm.value.selectedPlant === "Select") {
        this.dialog.open(ErrorModalComponent, {
          data: {
            message: "Please Select Plant",
            header: "Error"
          }
        });
        return
      }

      if (this.showSiteList && this.siteForm.value.selectedSite[0] === "All") {
        this.dialog.open(ErrorModalComponent, {
          data: {
            message: "Please Select Site",
            header: "Error"
          }
        });
        return;
      }
    }
    if (this.selectedHierarchy === "EMPLOYEE") {
      if (this.showPlantList && (this.plantForm.value.selectedPlant[0] === "All" || this.plantForm.value.selectedPlant[0] === "select")) {
        this.dialog.open(ErrorModalComponent, {
          data: {
            message: "Please Select Plant",
            header: "Error"
          }
        });
        return;
      }

      if ((this.showSiteList && this.siteForm.value.selectedSite[0] === "All") || (this.showSingleSiteSelectList && (this.siteForm.value.selectedSite[0] === "Select" || this.siteForm.value.selectedSite[0] === "All"))) {
        this.dialog.open(ErrorModalComponent, {
          data: {
            message: "Please Select Site",
            header: "Error"
          }
        });
        return;
      }
    }

    var alertTypes = [];
    if (this.alertForm.value.alertDropdown[0] === "All") {
      alertTypes = ["144", "37"];
    } else {
      alertTypes = [];
      alertTypes.push(this.alertForm.value.alertDropdown);
    }

    if (this.notifyForm.value.selectedNotification[0] === "All") {
      this.sms = true;
      this.email = true;
    } else {
      if (this.notifyForm.value.selectedNotification.includes('Email')) {
        this.email = true;
      }
      if (this.notifyForm.value.selectedNotification.includes('SMS')) {
        this.sms = true;
      }

    }
    var selectedEmployee = this.employeeForm.value.selectedEmployee.toString().split(',');

    if (this.selectedHierarchy === "EMPLOYEE") {
      if (selectedEmployee && selectedEmployee[0] === "All") {
        for (let i = 0; i < this.employees.length; i++) {
          var employeeDo = {
            "empId": this.employees[i].empId,
            "employeeId": this.employees[i].employeeId,
            "name": this.employees[i].fullName,
          }
          this.employeeList.push(employeeDo);
        }

      }
      else if (selectedEmployee && selectedEmployee.length > 1) {
        for (let i = 0; i < selectedEmployee.length; i++) {
          employeeDo = {
            "empId": this.employees.find(employee => employee.employeeId === selectedEmployee[i]).empId,
            "employeeId": this.employees.find(employee => employee.employeeId === selectedEmployee[i]).employeeId,
            "name": this.employees.find(employee => employee.employeeId === selectedEmployee[i]).fullName,
          }
          this.employeeList.push(employeeDo);
        }
      }
      else if (selectedEmployee && selectedEmployee[0] !== "All" && selectedEmployee.length == 1) {
        employeeDo = {
          "empId": this.employees.find(employee => employee.employeeId === selectedEmployee[0]).empId,
          "employeeId": this.employees.find(employee => employee.employeeId === selectedEmployee[0]).employeeId,
          "name": this.employees.find(employee => employee.employeeId === selectedEmployee[0]).fullName,
        }
        this.employeeList.push(employeeDo);
      }
    }

    var selectedPlant = this.plantForm.value.selectedPlant.toString().split(',');
    if (this.selectedHierarchy == "PLANT" || this.selectedHierarchy == "SITE" || this.selectedHierarchy == "EMPLOYEE") {
      if (selectedPlant && selectedPlant[0] == "All") {
        for (let i = 0; i < this.plants.length; i++) {
          var plantDo = {
            "plantId": this.plants[i].plantId,
            "plantName": this.plants[i].plantName
          }
          this.plantList.push(plantDo);
        }
      }
      else if (selectedPlant && selectedPlant.length > 1) {
        // this.selectedPlant = this.plantForm.controls.selectedPlant.value;
        for (let i = 0; i < selectedPlant.length; i++) {
          plantDo = {
            "plantId": this.plants.find(plant => plant.plantId === selectedPlant[i]).plantId,
            "plantName": this.plants.find(plant => plant.plantId === selectedPlant[i]).plantName,
          }
          this.plantList.push(plantDo);
        }
      }
      else if (selectedPlant && selectedPlant[0] !== "All" && selectedPlant.length == 1) {
        plantDo = {
          "plantId": this.plants.find(plant => plant.plantId === selectedPlant[0]).plantId,
          "plantName": this.plants.find(plant => plant.plantId === selectedPlant[0]).plantName,
        }
        this.plantList.push(plantDo);
      }
    }
    var selectedSite = this.siteForm.value.selectedSite.toString().split(',');
    if (this.selectedHierarchy === "SITE" || this.selectedHierarchy === "EMPLOYEE") {
      if (selectedSite && this.selectedSite[0] === "All") {
        for (let i = 0; i < this.sites.length; i++) {
          var siteDo = {
            "siteId": this.sites[0].siteId,
            "siteName": this.sites[0].siteName
          }
          this.siteList.push(siteDo);
        }

      }
      else if (selectedSite && selectedSite.length > 1) {
        for (let i = 0; i < selectedSite.length; i++) {
          var siteDo = {
            "siteId": this.sites.find(site => site.siteId == selectedSite[i]).siteId,
            "siteName": this.sites.find(site => site.siteId == selectedSite[i]).siteName,
          }
          this.siteList.push(siteDo);
        }
      }

      else if (selectedSite && selectedSite[0] !== "All" && selectedSite.length == 1) {
        var siteDo = {
          "siteId": this.sites.find(site => site.siteId == selectedSite[0]).siteId,
          "siteName": this.sites.find(site => site.siteId == selectedSite[0]).siteName,
        }
        this.siteList.push(siteDo);
      }
    }

    var selectedCity = this.cityForm.value.selectedCity.toString().split(',');
    if (selectedCity && selectedCity[0] === "All") {
      for (let i = 0; i < this.cities.length; i++) {
        var cityDo = {
          "cityId": this.cities[0].cityId,
          "cityName": this.cities[0].cityName
        }
        this.cityList.push(cityDo);
      }

    }
    else if (selectedCity && selectedCity.length > 1) {
      for (let i = 0; i < selectedCity.length; i++) {
        cityDo = {
          "cityId": this.cities.find(city => city.cityId == selectedCity[i]).cityId,
          "cityName": this.cities.find(city => city.cityId == selectedCity[i]).cityName
        }
        this.cityList.push(cityDo);
      }
    }
    else if (selectedCity && selectedCity[0] !== "All" && selectedCity.length == 1) {
      cityDo = {
        "cityId": this.cities.find(city => city.cityId == selectedCity[0]).cityId,
        "cityName": this.cities.find(city => city.cityId == selectedCity[0]).cityName,
      }
      this.cityList.push(cityDo);
    }
    var userType = "";
    if (this.loggedInUserType === "SUPERADMIN") {
      userType = this.userType;
    }
    else {
      userType = this.loggedInUserType;
    }

    this.alertRuleService.saveAlertRule(this.alertName, this.selectedHierarchy, this.customerId, this.customerName, this.cityList, alertTypes,
      this.plantList, this.siteList, this.employeeList, this.userId, userType, this.email, this.sms).subscribe((res: any) => {
        if (res.status == 200) {
          this.dialog.open(ErrorModalComponent, {
            data: {
              message: res.message,
              header: "Info"
            }
          });
          window.location.reload();
        }

        else {
          this.dialog.open(ErrorModalComponent, {
            data: {
              message: res.message,
              header: "Error"
            }
          });
        }
      },
        error => {
          this.dialog.open(ErrorModalComponent, {
            data: {
              message: error.message,
              header: "Info"
            }
          });
        })
  }

  clear() {

  }
  hierarchyChanged() {
    if (this.selectedHierarchy === "PLANT") {
      if (this.loggedInUserType == "CUSTOMERADMIN" || this.loggedInUserType == "SUPERADMIN") {
        this.selectedCity = "All";
        this.showMultiCityList = false;
        this.showSingleCityList = true;
      }
      else {
        this.showDisabledCity = true;
      }
      this.showPlantList = false;
      this.showMultiPlantList = true;
      this.showSiteList = false;
      this.showSingleSiteSelectList = false;
      this.showMultiSiteList = false;
      this.showMultiEmployeeList = false;
      this.showAllEmployees = false;
      this.selectedPlant = "All";
    }
    if (this.selectedHierarchy === "SITE") {
      if (this.loggedInUserType == "CUSTOMERADMIN" || this.loggedInUserType == "SUPERADMIN") {
        this.showMultiCityList = false;
        this.showSingleCityList = true;
        this.selectedCity = "All";
        this.selectedPlant = 'All';
        this.plantForm.value.selectedPlant = "All";
      }
      else {
        this.selectedPlant = "Select";
        this.plantForm.value.selectedPlant = "Select";
        this.showDisabledCity = true;
      }
      this.showPlantList = true;
      this.showMultiPlantList = false;
      this.showSiteList = true;
      this.showMultiSiteList = false;
      this.showSingleSiteSelectList = false;
      this.showMultiEmployeeList = false;
      this.selectedSite = "Select";
      this.showAllEmployees = false;
      this.siteForm.value.selectedSite = "Select";
    }
    if (this.selectedHierarchy === "EMPLOYEE") {
      if (this.loggedInUserType == "CUSTOMERADMIN" || this.loggedInUserType == "SUPERADMIN") {
        this.showMultiCityList = false;
        this.showSingleCityList = true;
        this.selectedCity = "All";
        this.selectedPlant = "All";
        this.plantForm.value.selectedPlant = "All";
        this.selectedSite = "All";
        this.siteForm.value.selectedSite = "All";
      }
      else {
        this.selectedPlant = "Select";
        this.selectedSite = "Select";
        this.siteForm.value.selectedSite = "Select";
        this.showDisabledCity = true;
      }
      this.showPlantList = true;
      this.showMultiPlantList = false;
      this.showSingleSiteSelectList = true;
      this.showMultiSiteList = false;
      this.showSiteList = false;
      this.showMultiEmployeeList = true;
      this.selectedEmployee = "Select";
      this.employeeForm.value.selectedEmployee = "Select";
      this.showAllEmployees = false;
    }
    if (this.selectedHierarchy === "CITY") {
      if (this.loggedInUserType == "CUSTOMERADMIN" || this.loggedInUserType == "SUPERADMIN") {
        this.showMultiCityList = true;
        this.showSingleCityList = false;
      }
      else {
        this.showDisabledCity = true;
      }
      this.showPlantList = false;
      this.showMultiPlantList = false;
      this.showSiteList = false;
      this.showSingleSiteSelectList = false;
      this.showMultiEmployeeList = false;
      this.showAllEmployees = false;
    }
    if (this.selectedHierarchy === "CUSTOMER") {
      this.showSiteList = false;
      this.showSingleCityList = false;
      this.showMultiCityList = false;
      this.showSingleSiteSelectList = false;
      this.showPlantList = false;
      this.showMultiPlantList = false;
      this.showMultiEmployeeList = false;
      this.showMultiSiteList = false;
    }
  }

  getSiteDetailsByPlantId(plant: any) {
    this.customerConfigService.getSiteDetailsByPlantId(plant.plantId.toString()).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.sites = res.data;
          this.selectedSite = "All";
          this.siteForm.value.selectedSite = "All";
          this.siteForm.controls.selectedSite.patchValue(["All"]);
          if (this.selectedHierarchy === "SITE") {
            this.showMultiSiteList = true;
            this.showSingleSiteSelectList = false;
          }
          else if (this.selectedHierarchy === "EMPLOYEE") {
            this.showMultiSiteList = false;
            this.showSingleSiteSelectList = true;
          }
          this.showSiteList = false;
        }
      })
  }

  getEmployeesBySiteId(site: any) {
    this.alertRuleService.getEmployeesBySiteId(site.siteId).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.employees = res.data;
          this.showAllEmployees = true;
          this.selectedEmployee = "All";
          this.employeeForm.value.selectedEmployee = "All";
          this.employeeForm.controls.selectedEmployee.patchValue(["All"]);
          this.showMultiEmployeeList = true;
          this.showAllEmployees = true;
          this.showMultiSiteList = false;
          this.showSiteList = false;
          this.showSingleSiteSelectList = true;
        }
      })
  }
  tosslePerOne() {
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

  toggleAllSelection() {
    if (this.allSelected.selected) {
      this.allSelected.deselect();
      this.alertForm.controls.alertDropdown.patchValue(["All"]);
    } else {
      this.alertForm.controls.alertDropdown.patchValue(["All"]);
    }
  }

  tosslePlantPerOne() {
    if (this.allPlantSelected.selected) {
      this.allPlantSelected.deselect();
      return false;
    }
    if (this.plantForm.controls.selectedPlant.value.length == this.plants.length) {
      this.allPlantSelected.select();
      this.plantForm.controls.selectedPlant.patchValue(["All"]);
      return false;
    }
    return false;

  }

  toggleAllPlantSelection() {
    if (this.allPlantSelected.selected) {
      this.allPlantSelected.deselect();
      this.plantForm.controls.selectedPlant.patchValue(["All"]);
    } else {
      this.plantForm.controls.selectedPlant.patchValue(["All"]);
    }
  }

  tossleSitePerOne() {
    if (this.allSiteSelected.selected) {
      this.allSiteSelected.deselect();
      return false;
    }
    if (this.siteForm.controls.selectedSite.value.length == this.sites.length) {
      this.allSiteSelected.select();
      this.siteForm.controls.selectedSite.patchValue(["All"]);
      return false;
    }
    return false;

  }

  toggleAllSiteSelection() {
    if (this.allSiteSelected.selected) {
      this.allSiteSelected.deselect();
      this.siteForm.controls.selectedSite.patchValue(["All"]);
    } else {
      this.siteForm.controls.selectedSite.patchValue(["All"]);
    }
  }

  plantChanged() {
    if (this.selectedPlant === "Select") {
      this.showSiteList = true;
      this.showMultiSiteList = false;
    }
    else {
      this.plantForm.value.selectedPlant = this.selectedPlant;
      var selectedPlant = this.plants.find(plant => (plant.plantId == this.selectedPlant));
      this.getSiteDetailsByPlantId(selectedPlant);
    }
  }

  siteChanged() {
    this.siteForm.value.selectedSite = this.selectedSite;
    var selectedSite = this.sites.find(site => site.siteId == this.selectedSite);
    this.getEmployeesBySiteId(selectedSite);
  }

  toggleAllEmployeeSelection() {
    if (this.allEmployeeSelected.selected) {
      this.allEmployeeSelected.deselect();
      this.employeeForm.controls.selectedEmployee.patchValue(["All"]);
      return false;
    }
    if (this.employeeForm.controls.selectedEmployee.value.length == this.employees.length) {
      this.allEmployeeSelected.select();
      this.employeeForm.controls.selectedEmployee.patchValue(["All"]);
      return false;
    }
    return false;
  }

  tossleEmployeePerOne() {
    if (this.allEmployeeSelected.selected) {
      this.allEmployeeSelected.deselect();
      return false;
    }
    if (this.employeeForm.controls.selectedEmployee.value.length == this.employees.length) {
      this.allEmployeeSelected.select();
      this.employeeForm.controls.selectedEmployee.patchValue(["All"]);
      return false;
    }
    return false;
  }

  toggleAllNotificationSelection() {
    if (this.allNotificationSelected.selected) {
      this.allNotificationSelected.deselect();
      this.notifyForm.controls.selectedNotification.patchValue(["All"]);
      return false;
    }
    if (this.notifyForm.controls.selectedNotification.value.length == this.notificationTypeList.length) {
      this.allNotificationSelected.select();
      this.notifyForm.controls.selectedNotification.patchValue(["All"]);
      return false;
    }
    return false;
  }

  tossleNotificationPerOne() {
    if (this.allNotificationSelected.selected) {
      this.allNotificationSelected.deselect();
      return false;
    }
    if (this.notifyForm.controls.selectedNotification.value.length == this.notificationTypeList.length) {
      this.allNotificationSelected.select();
      this.notifyForm.controls.selectedNotification.patchValue(["All"]);
      return false;
    }
    return false;
  }

  toggleAllCitySelection() {
    if (this.allCitySelected.selected) {
      this.allCitySelected.deselect();
      this.cityForm.controls.selectedCity.patchValue(["All"]);
      return false;
    }
    if (this.cityForm.controls.selectedCity.value.length == this.cities.length) {
      this.allCitySelected.select();
      this.cityForm.controls.selectedCity.patchValue(["All"]);
      return false;
    }
    return false;
  }

  tossleCityPerOne() {
    if (this.allCitySelected.selected) {
      this.allCitySelected.deselect();
      return false;
    }
    if (this.cityForm.controls.selectedCity.value.length == this.cities.length) {
      this.allCitySelected.select();
      this.cityForm.controls.selectedCity.patchValue(["All"]);
      return false;
    }
    return false;

  }

  cityChanged() {
    if (this.selectedCity === "Select") {
    }
    else {
      this.selectedPlant = "All";
      if (this.selectedHierarchy === "SITE" || this.selectedHierarchy === "EMPLOYEE") {
        this.showPlantList = true;
      }
      this.cityForm.value.selectedCity = this.selectedCity;
      this.plantForm.value.selectedPlant = "All";
      this.plantForm.controls.selectedPlant.patchValue(["All"]);
      var selectedCity = this.cities.find(city => (city.cityId == this.selectedCity));
      this.getPlantsByCityId(selectedCity.cityId);
    }
  }

  onEnter() {
    if (this.searchUserName === "") {
      this.getAlertRuleListPageAndSize();
    }
    else {
      this.alertRuleService.getAlertRulesByUserName(this.searchUserName).subscribe((res: any) => {
        if (res.status == 204) {
          this.pageNo = 0;
          this.showPagination = false;
          this.alertRuleList = [];
          this.totalRecords = 0;
          this.dataSourceForRules = new MatTableDataSource(this.alertRuleList);
        }
        if (res != null && res.status == 200) {
          this.alertRuleList = res.data;
          this.totalRecords = res.count;
          this.pagination();
        }
      })
    }
  }

  editOrViewRule(editOrView: string, ruleObject: any) {
    if (editOrView === "edit") {
      var object = this.alertRuleList.find(rule => rule.alertRuleId === ruleObject.alertRuleId);
      this.dialog.open(ViewAlertRuleComponent, {
        data: {
          ruleObject: object, editOrView: "edit"
        }
      });
    }
    else if (editOrView === "view") {
      var object = this.alertRuleList.find(rule => rule.alertRuleId === ruleObject.alertRuleId);
      this.dialog.open(ViewAlertRuleComponent, {
        data: {
          ruleObject: object, editOrView: "view"
        }
      });
    }
  }

  changeRuleStatus(ruleObject: any) {
    this.dialog.open(ChangeRuleStatusComponent, {
      data: {
        ruleId: ruleObject.alertRuleId,
        ruleName: ruleObject.alertRuleName,
        status: ruleObject.active,
        header: "Info"
      }
    });
  }
}