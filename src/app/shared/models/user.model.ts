import { City, Customer, Plant, Site } from "./customer-details.model";

export class User {
    active: boolean;
    alertConfigurationList: Alert[];
    city: City;
    cityList: City[];
    createdLevel: string;
    customer: Customer;
    emailId: string;
    employee: boolean;
    firstName: string;
    firstTimeLogin: boolean;
    fullName: string;
    group: Group;
    lastName: string;
    mailNotificationAllowed: boolean;
    middleName: string;
    otpExpiryDate: string;
    otpGenerated: string;
    password: string;
    phoneNumber: string;
    plant: Plant;
    plantList: Plant[];
    salt: string;
    site: Site;
    siteList: Site[];
    smsnotificationAllowed: boolean;
    userId: string;
    type: string;   // enum [ PLANT_MANAGER, OPERATIONS_EXECUTIVE, SAFETY_EXECUTIVE, CCB, DOCTOR, CITYADMIN, SITEADMIN, CUSTOMERADMIN, SUPERADMIN, SUPERVISOR, PLANTADMIN ]


    constructor() {
        this.active = false;
        this.alertConfigurationList = new Array<Alert>();
        this.city = new City();
        this.cityList = new Array<City>();
        this.createdLevel = "";
        this.customer = new Customer();
        this.emailId = "";
        this.employee = false;
        this.firstName = "";
        this.firstTimeLogin = false;
        this.fullName = "";
        this.group = new Group();
        this.lastName = "";
        this.mailNotificationAllowed = false;
        this.middleName = "";
        this.otpExpiryDate = "";
        this.otpGenerated = "";
        this.password = "";
        this.phoneNumber = "";
        this.plant = new Plant();
        this.plantList = new Array<Plant>();
        this.salt = "";
        this.site = new Site();
        this.siteList = new Array<Site>();
        this.smsnotificationAllowed = false;
        this.type = "";
        this.userId = "";
    }
}

export class user {
    userId: string;
    userType: string;

    constructor() {
        this.userId = "";
        this.userType = "";
    }
}

export class Alert {
    alertId: string;
    alertName: string;
    emailAllowed: string;
    notificationAllowed: string;
    popUpAllowed: string;
    smsAllowed: string;
    soundAllowed: string;
    constructor(alertId: string, alertName: string, emailAllowed: string, notificationAllowed: string, popUpAllowed: string, smsAllowed: string, soundAllowed: string) {
        this.alertId = alertId;
        this.alertName = alertName;
        this.emailAllowed = emailAllowed;
        this.notificationAllowed = notificationAllowed;
        this.popUpAllowed = popUpAllowed;
        this.smsAllowed = smsAllowed;
        this.soundAllowed = soundAllowed;
    }
}

export class Group {
    groupId: string;
    groupName: string;
    constructor() {
        this.groupId = "";
        this.groupName = "";
    }
}