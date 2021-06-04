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


    constructor(active: boolean, alertConfigurationList: Alert[], city: City, cityList: City[], createdLevel: string, customer: Customer, emailId: string, employee: boolean, firstName: string, firstTimeLogin: boolean, fullName: string, group: Group, lastName: string, mailNotificationAllowed: boolean, middleName: string, otpExpiryDate: string, otpGenerated: string, password: string, phoneNumber: string, plant: Plant, plantList: Plant[], salt: string, site: Site, siteList: Site[], smsnotificationAllowed: boolean, userId: string, type: string) {
        this.active = active;
        this.alertConfigurationList = alertConfigurationList;
        this.city = city;
        this.cityList = cityList;
        this.createdLevel = createdLevel;
        this.customer = customer;
        this.emailId = emailId;
        this.employee = employee;
        this.firstName = firstName;
        this.firstTimeLogin = firstTimeLogin;
        this.fullName = fullName;
        this.group = group;
        this.lastName = lastName;
        this.mailNotificationAllowed = mailNotificationAllowed;
        this.middleName = middleName;
        this.otpExpiryDate = otpExpiryDate;
        this.otpGenerated = otpGenerated;
        this.password = password;
        this.phoneNumber = phoneNumber;
        this.plant = plant;
        this.plantList = plantList;
        this.salt = salt;
        this.site = site;
        this.siteList = siteList;
        this.smsnotificationAllowed = smsnotificationAllowed;
        this.type = type;
        this.userId = userId;
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
    constructor(groupId: string, groupName: string) {
        this.groupId = groupId;
        this.groupName = groupName;
    }
}