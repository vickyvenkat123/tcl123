import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { MatOption } from '@angular/material/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AlertRuleService } from 'src/app/core/alert-rule.service';
import { CustomerConfigService } from 'src/app/core/services/customer-config.service';
import { AlertRuleRequestDto } from 'src/app/shared/models/alert-rule.model';
import { City, Plant, Site } from 'src/app/shared/models/customer-details.model';
import { Employee } from 'src/app/shared/models/employee.model';
import { ErrorModalComponent } from '../../../error-modal/error-modal.component';

@Component({
  selector: 'app-view-alert-rule',
  templateUrl: './view-alert-rule.component.html',
  styleUrls: ['./view-alert-rule.component.css']
})
export class ViewAlertRuleComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<ViewAlertRuleComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private formBuilder: FormBuilder,
    private customerConfigService: CustomerConfigService, private alertRuleService: AlertRuleService, private dialog: MatDialog) { }
  alertName: string = "";
  alertRuleId: string = "";
  hierarchyLevel: string = this.data.hierarchyType;
  editMode: boolean = false;
  viewMode: boolean = false;
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
  cityName: string = sessionStorage.getItem("cityName") || "";
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
  customerName: string = sessionStorage.getItem("customerName") || "";
  loggedInUserType: string = sessionStorage.getItem("role") || "";
  userType: string = "";
  showDisabledCity: boolean = false;
  alertRuleRequestDto: AlertRuleRequestDto = new AlertRuleRequestDto();
  customerId: string = sessionStorage.getItem("customerId") || "";
  userId: string = sessionStorage.getItem("userId") || "";

  ngOnInit(): void {
    this.getAlertRuleConfiguration(this.data.ruleObject.alertRuleId);
    if (this.data.editOrView === "edit") {
      this.editMode = true;
      this.viewMode = false;
    }
    else if (this.data.editOrView === "view") {
      this.editMode = false;
      this.viewMode = true;
    }
    this.alertTypeList = [{ "alertId": "144", "alertName": "SOS For Tracker" }, { "alertId": "37", "alertName": "Hazardous For Tracker" }];
    this.notificationTypeList = [{ "name": "Email", "id": "Email" }, { "name": "SMS", "id": "SMS" }];
    this.alertName = this.data.ruleObject.alertRuleName;
    this.alertRuleId = this.data.ruleObject.alertRuleId;
    this.selectedHierarchy = this.data.ruleObject.hierarchyType[0] + this.data.ruleObject.hierarchyType.substring(1, this.data.ruleObject.hierarchyType.length).toLowerCase();
    this.selectedCustomer = this.customerName;
  }

  getAlertRuleConfiguration(ruleId: string) {
    this.alertRuleService.getAlertRuleConfiguration(ruleId).subscribe((res: any) => {
      this.alertRuleRequestDto = res.data;
      if (this.selectedHierarchy === "Plant") {
        if (this.loggedInUserType == "CUSTOMERADMIN" || this.loggedInUserType == "SUPERADMIN") {
          this.selectedCity = "All";
          this.showMultiCityList = false;
          this.showSingleCityList = true;
        }
        else {
          this.showDisabledCity = true;
          this.selectedCity = this.cityName;
        }
        this.getPlantsByCityId(this.alertRuleRequestDto.city.cityId);
        this.selectedCity = this.alertRuleRequestDto.city.cityName;
        this.selectedPlant = this.alertRuleRequestDto.plantList.map(p => { return p.plantId });
        this.plantForm.value.selectedPlant = this.selectedPlant;
        this.plantForm.controls.selectedPlant.setValue(this.selectedPlant);

        this.showPlantList = false;
        this.showMultiPlantList = true;
        this.showSiteList = false;
        this.showSingleSiteSelectList = false;
        this.showMultiSiteList = false;
        this.showMultiEmployeeList = false;
        this.showAllEmployees = false;
        this.selectedPlant = "All";
      }
      if (this.selectedHierarchy === "Site") {
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
          this.selectedCity = this.cityName;
        }
        this.getSiteDetailsByPlantId(this.alertRuleRequestDto.plant);
        this.selectedCity = this.alertRuleRequestDto.city.cityName;
        this.selectedPlant = this.alertRuleRequestDto.plant.plantId;
        this.plantForm.value.selectedPlant = this.selectedPlant;
        this.selectedSite = this.alertRuleRequestDto.siteList.map(s => { return s.siteId });
        this.siteForm.value.selectedSite = this.selectedSite;
        this.siteForm.controls.selectedSite.setValue(this.selectedSite);
        this.getCities();
        this.getPlantsByCityId(this.alertRuleRequestDto.city.cityId);
        this.showPlantList = true;
        this.showMultiPlantList = false;
        //this.showSiteList = true;
        this.showMultiSiteList = true;
        this.showSingleSiteSelectList = false;
        this.showMultiEmployeeList = false;
        //this.selectedSite = "Select";
        this.showAllEmployees = false;
        //this.siteForm.value.selectedSite = "Select";
      }
      if (this.selectedHierarchy === "Employee") {
        this.getPlantsByCityId(this.alertRuleRequestDto.city.cityId);
        this.getSiteDetailsByPlantId(this.alertRuleRequestDto.plant);
        this.getEmployeesBySiteId(this.alertRuleRequestDto.site);

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
          this.selectedCity = this.cityName;
        }

        this.selectedCity = this.alertRuleRequestDto.city.cityName;
        this.selectedPlant = this.alertRuleRequestDto.plant.plantId;
        this.plantForm.value.selectedPlant = this.selectedPlant;
        this.selectedSite = this.alertRuleRequestDto.site.siteId;
        this.siteForm.value.selectedSite = this.selectedSite;
        this.selectedEmployee = this.alertRuleRequestDto.employee.map(e => { return e.employeeId });
        this.employeeForm.value.selectedEmployee = this.selectedEmployee;
        this.employeeForm.controls.selectedEmployee.setValue(this.selectedEmployee);
        this.getCities();
        //this.selectedCity = this.alertRuleRequestDto.cityList && this.alertRuleRequestDto.cityList.length != 0? this.alertRuleRequestDto.cityList:this.alertRuleRequestDto.city;
        this.cityForm.value.selectedCity = this.selectedCity;
        //this.selectedPlant =  this.alertRuleRequestDto.plantList && this.alertRuleRequestDto.plantList.length != 0? this.alertRuleRequestDto.plantList:this.alertRuleRequestDto.plant;
        //this.selectedSite =  this.alertRuleRequestDto.siteList && this.alertRuleRequestDto.siteList.length != 0? this.alertRuleRequestDto.siteList:this.alertRuleRequestDto.site;
        //this.selectedEmployee = this.alertRuleRequestDto.employee ? this.alertRuleRequestDto.employee: [];
        this.showPlantList = true;
        this.showMultiPlantList = false;
        this.showSingleSiteSelectList = true;
        this.showMultiSiteList = false;
        this.showSiteList = false;
        this.showMultiEmployeeList = true;
        //this.selectedEmployee = "Select";
        //this.employeeForm.value.selectedEmployee = "Select";
        this.showAllEmployees = true;
      }
      if (this.selectedHierarchy === "City") {
        if (this.loggedInUserType == "CUSTOMERADMIN" || this.loggedInUserType == "SUPERADMIN") {
          this.showMultiCityList = true;
          this.showSingleCityList = false;
        }
        else {
          this.showDisabledCity = true;
          this.selectedCity = this.cityName;
        }
        this.getCities();
        this.selectedCity = this.alertRuleRequestDto.cityList.map(c => { return c.cityId });
        this.cityForm.value.selectedCity = this.selectedCity;
        this.cityForm.controls.selectedCity.setValue(this.selectedCity);
        this.showPlantList = false;
        this.showMultiPlantList = false;
        this.showSiteList = false;
        this.showSingleSiteSelectList = false;
        this.showMultiEmployeeList = false;
        this.showAllEmployees = false;
      }
      if (this.selectedHierarchy === "Customer") {
        this.showSiteList = false;
        this.showSingleCityList = false;
        this.showMultiCityList = false;
        this.showSingleSiteSelectList = false;
        this.showPlantList = false;
        this.showMultiPlantList = false;
        this.showMultiEmployeeList = false;
        this.showMultiSiteList = false;
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

  cityChanged() {
    if (this.selectedCity === "Select") {
    }
    else {
      this.selectedPlant = "All";
      if (this.selectedHierarchy === "Site" || this.selectedHierarchy === "Employee") {
        this.showPlantList = true;
      }
      this.cityForm.value.selectedCity = this.selectedCity;
      this.plantForm.value.selectedPlant = "All";
      this.plantForm.controls.selectedPlant.patchValue(["All"]);
      var selectedCity = this.cities.find(city => (city.cityId == this.selectedCity));
      this.getPlantsByCityId(selectedCity.cityId);
    }
  }

  getPlantsByCityId(cityId: string) {
    this.customerConfigService.getPlantsDetailsByCityId(cityId.toString()).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.plants = res.data;
        }
      })
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

  getSiteDetailsByPlantId(plant: any) {
    this.customerConfigService.getSiteDetailsByPlantId(plant.plantId.toString()).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.sites = res.data;
          //this.selectedSite = "All";
          //this.siteForm.value.selectedSite = "All";
          //this.siteForm.controls.selectedSite.patchValue(["All"]);
          if (this.selectedHierarchy === "Site") {
            this.showMultiSiteList = true;
            this.showSingleSiteSelectList = false;
          }
          else if (this.selectedHierarchy === "Employee") {
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
          //this.selectedEmployee = "All";
          //this.employeeForm.value.selectedEmployee = "All";
          // this.employeeForm.controls.selectedEmployee.patchValue(["All"]);
          this.showMultiEmployeeList = true;
          this.showAllEmployees = true;
          this.showMultiSiteList = false;
          this.showSiteList = false;
          this.showSingleSiteSelectList = true;
        }
      })
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
    if (this.selectedHierarchy === "Site") {
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
    if (this.selectedHierarchy === "Employee") {
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

    if (this.selectedHierarchy === "Employee") {
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
    if (this.selectedHierarchy === "Site" || this.selectedHierarchy === "Employeee") {
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

    this.alertRuleService.updateAlertRule(this.alertName, this.alertRuleId, this.selectedHierarchy.toString().toUpperCase(), this.customerId, this.customerName, this.cityList, alertTypes,
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

  public closeMe() {
    this.dialogRef.close();
  }
}