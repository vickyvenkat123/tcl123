import { City, Customer, Plant, Site } from "./customer-details.model";
import { EmployeeDO } from "./employee-dashboard-dto.model";
import { User, user } from "./user.model";

export class alertrule {
    active: boolean;
    alertRuleId: string;
    alertRuleName: string;
    createdDate: string;
    customer: Customer;
    emailAllowed: boolean;
    hierarchyType: string;
    modifiedBy: string;
    popupAllowed: boolean;
    smsAllowed: boolean;
    soundAllowed: boolean;
    user: user;

    constructor() {
        this.active = false;
        this.alertRuleId = "";
        this.alertRuleName = "";
        this.createdDate = "";
        this.customer = new Customer();
        this.emailAllowed = false;
        this.hierarchyType = "";
        this.modifiedBy = "";
        this.popupAllowed = false;
        this.smsAllowed = false;
        this.soundAllowed = false;
        this.user = new user();
    }
}

export class AlertRuleRequestDto {
    active: boolean;
    alertRuleId: string;
    alertRuleName: string
    alertType: string[];
    city: City;
    cityList: City[];
    createdDate: string;
    customer: Customer;
    customerList: Customer[];
    emailAllowed: boolean;
    employee: EmployeeDO[];
    hierarchyType: string;
    plant: Plant;
    plantList: Plant[];
    popupAllowed: boolean;
    site: Site;
    siteList: Site[];
    smsAllowed: boolean;
    soundAllowed: boolean;
    user: user;
    userName: string;
    constructor() {
        this.active = false;
        this.alertRuleId = "";
        this.alertRuleName = "";
        this.alertType = new Array<string>();
        this.city = new City();
        this.cityList = new Array<City>();
        this.createdDate = "";
        this.customer = new Customer();
        this.customerList = new Array<Customer>();
        this.emailAllowed = false;
        this.employee = new Array<EmployeeDO>();
        this.hierarchyType = "";
        this.plant = new Plant();
        this.plantList = new Array<Plant>();
        this.popupAllowed = false;
        this.site = new Site();
        this.siteList = new Array<Site>();
        this.smsAllowed = false;
        this.soundAllowed = false;
        this.user = new user();
        this.userName = "";
    }
}