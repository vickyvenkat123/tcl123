import { HttpClient, HttpHandler } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { CityConfigService } from 'src/app/core/services/city-config.service';
import { CustomerConfigService } from 'src/app/core/services/customer-config.service';
import { City, CityConfig, Customer, CustomerDetails, Plant, Site } from 'src/app/shared/models/customer-details.model';
import { Template } from 'src/app/shared/models/template.model';
import { CityComponent } from './city/city.component';

@Component({
  selector: 'app-customer-config',
  templateUrl: './customer-config.component.html',
  styleUrls: ['./customer-config.component.css']
})
export class CustomerConfigComponent implements OnInit {
  constructor(private customerConfigService: CustomerConfigService, private cityConfigService: CityConfigService) { }
  loggedInUserDetails: any;
  customerDetail: Customer = new Customer();
  emailTemplate: any;
  smsTemplate: any;
  cities: City[] = new Array<City>();
  plants: Plant[] = new Array<Plant>();
  sites: Site[] = new Array<Site>();
  templates: Template[] = new Array<Template>();
  editedCityData: City = new City();
  cityConfig: CityConfig = new CityConfig();
  editedPlantData: Plant = new Plant();
  editedSiteData: Site = new Site();
  showCustomer: boolean = false;
  showCityList: boolean = false;
  showPlantList: boolean = false;
  showSiteList: boolean = false;
  customersDetails: any;
  citiesDetails: any;
  customer: Customer = new Customer();
  customerDetails: CustomerDetails = new CustomerDetails();
  customerName: string = "";
  newCity: boolean = false;
  editCityFlag: boolean = false;
  editCustomerFlag: boolean = false;
  ngOnInit(): void {
    // this.customerConfigService.getLoggedInUser().subscribe(
    //   (res: any) => {
    //     this.loggedInUserDetails = res;
    //     sessionStorage.setItem("customerId", res.customer.customerId);
    //     console.log(res);
    //   }
    // )

    this.customerConfigService.getCustomersList().subscribe(
      (res: any) => {
        console.log("GetCustomerList" + res);
        this.showCustomer = true;
        this.customer = res.data[0];
        this.customerName = res.data[0].customerName;
      }
    )

    this.customerConfigService.getCustomerData(sessionStorage.getItem("customerId") || "").subscribe(
      (res: any) => {
        this.customerDetails = res.data;
        sessionStorage.setItem("email", String(res.customerConfig.mailNotificationAllowed));
        sessionStorage.setItem("sms", String(res.customerConfig.smsnotificationAllowed));
      }
    )

    this.customerConfigService.getTemplates("EMAIL").subscribe(
      (res: any) => {
        this.templates = res.data;
        //console.log(res);
      }
    )

    this.customerConfigService.getTemplates("SMS").subscribe(
      (res: any) => {
        //console.log(res);
      }
    )

    this.getCitiesDetails();
  }

  getCitiesDetails() {
    this.customerConfigService.getCities(sessionStorage.getItem("customerId") || "").subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.cities = res.data;
          this.editedCityData = res.data[0];
        }
      }
    )
  }

  showCustomerCitiesPlantsSites(type: string) {
    if (type === "" || type === "customer") {
      this.showCustomer = true;
      this.showCityList = false;
      this.showPlantList = false;
      this.showSiteList = false;
      this.getCitiesDetails();
      this.editedPlantData = new Plant();
      this.editedSiteData = new Site();
    } else if (type === "cities") {
      this.showCityList = true;
      this.showCustomer = false;
      this.showPlantList = false;
      this.showSiteList = false;
      //this.editedPlantData = null;
      this.editedSiteData = new Site();
      this.editCity(this.editedCityData.cityId);
    }
    else if (type === "plants") {
      if (this.editedPlantData.plantName === "" && (!this.showCityList || this.showSiteList)) {
        alert("Please select a city first");
        return;
      }
      this.getPlantsDetailsByCityId(this.editedCityData.cityId);
      this.showCityList = false;
      this.showCustomer = false;
      this.showPlantList = true;
      //this.editedSiteData = null;
    }
    else {
      if (this.editedSiteData.siteName === "" && !this.showPlantList) {
        alert("Please select a plant first");
        return;
      }
      this.getSiteDetailsByPlantId(this.editedPlantData.plantId);
      this.showPlantList = false;
      this.showCustomer = false;
      this.showSiteList = true;
    }
  }

  editCustomer(customer: Customer) {
    this.editCustomerFlag = true;
  }

  editCity(cityId: string) {
    this.editCityFlag = true;
    this.customerConfigService.getCityDetailsById(cityId).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.editedCityData = res.data;
          this.cityConfig = res.data.cityConfig;
        }
      }
    )
    this.getPlantsDetailsByCityId(cityId);
  }

  getPlantsDetailsByCityId(cityId: string) {
    this.customerConfigService.getPlantsDetailsByCityId(cityId).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.plants = res.data;
          this.editedPlantData = res.data[0];
          //this.showCityList = false;
          this.showSiteList = false;
        }
      }
    )
  }

  editPlant(plantId: string) {
    this.customerConfigService.getPlantDetailsById(plantId).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.editedPlantData = res.data;
        }
      }
    )
    this.getSiteDetailsByPlantId(plantId);

  }

  getSiteDetailsByPlantId(plantId: string) {
    this.customerConfigService.getSiteDetailsByPlantId(plantId).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.sites = res.data;
          this.editedSiteData = res.data[0];
          this.showCityList = false;
          //this.showPlantList = false;
        }
      }
    )
  }

  editSite(siteId: string) {
    this.customerConfigService.getSiteDetailsById(siteId).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.editedSiteData = res.data;
        }
      }
    )
  }

  addCity() {
    this.editedCityData = new City();
    this.newCity = true;
    this.showCustomer = false;
    this.showCityList = true;
    this.showPlantList = false;
    this.showSiteList = false;
    this.editedPlantData = new Plant();
    this.editedSiteData = new Site();
    this.editedCityData.customer = this.cityConfig.customer;
    this.cityConfig.customer = new Customer();
  }

  addPlant() {

  }

  addSite() {

  }
}
