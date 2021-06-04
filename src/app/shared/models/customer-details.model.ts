export class CustomerDetails {
    customerId: string;
    address: Address;
    createdBy: string;
    createdDate: string;
    customerConfig: CustomerConfig;
    customerLogo: string;
    customerName: string;
    dassIotAuth: string;
    description: string;
    emailId: string;
    groupEmailIds: string[];
    modifiedBy: string;
    modifiedDate: string;
    phoneNumber: string;
    roleTypes: string;

    constructor() {
        this.customerId = "";
        this.address = new Address();
        this.createdBy = "";
        this.createdDate = "";
        this.customerConfig = new CustomerConfig();
        this.customerLogo = "";
        this.customerName = "";
        this.dassIotAuth = "";
        this.description = "";
        this.emailId = "";
        this.groupEmailIds = new Array<string>();
        this.modifiedBy = "";
        this.modifiedDate = "";
        this.phoneNumber = "";
        this.roleTypes = "";
    }
}

export class Address {
    address1: string;
    address2: string;
    city: string;
    country: string;
    postalCode: string;
    state: string;

    constructor() {
        this.address1 = "";
        this.address2 = "";
        this.city = "";
        this.country = "";
        this.postalCode = "";
        this.state = "";
    }
}

export class CustomerConfig {
    abnormalBatteryPercentValue: number;
    activeSoundUrl: string;
    alertSoundUrls: string[];
    batteryAlertEmailTemplate: string;
    batteryAlertSMSTemplate: string;
    batteryLowColorCode: string;
    city: City;
    customer: Customer;
    dassAuth: DassAuth;
    hazardousAlertEmailTemplate: string;
    hazardousAlertSMSTemplate: string;
    hazardousColorCode: string;
    healthAlertEmailTemplate: string;
    healthAlertSMSTemplate: string;
    hierarchylevel: string;
    id: string;
    mailNotificationAllowed: boolean;
    maxHierarchyLevel: string;
    plant: Plant;
    site: Site;
    smsnotificationAllowed: boolean;
    sosColorCode: string;
    type: string;
    zoneThreshold: number;
    zoneThresholdEnabled: boolean;


    constructor() {
        this.abnormalBatteryPercentValue = 0;
        this.activeSoundUrl = "";
        this.alertSoundUrls = new Array<string>();
        this.batteryAlertEmailTemplate = "";
        this.batteryAlertSMSTemplate = "";
        this.batteryLowColorCode = "";
        this.city = new City();
        this.customer = new Customer();
        this.dassAuth = new DassAuth();
        this.hazardousAlertEmailTemplate = "";
        this.hazardousAlertSMSTemplate = "";
        this.hazardousColorCode = "";
        this.healthAlertEmailTemplate = "";
        this.healthAlertSMSTemplate = "";
        this.hierarchylevel = "";
        this.id = "";
        this.mailNotificationAllowed = false;
        this.maxHierarchyLevel = "";
        this.plant = new Plant();
        this.site = new Site();
        this.smsnotificationAllowed = false;
        this.sosColorCode = "";
        this.type = "";
        this.zoneThreshold = 0;
        this.zoneThresholdEnabled = false;
    }
}

export class City {
    cityId: string;
    cityName: string;
    active: boolean;
    templateExist: string;
    modifiedBy: string;
    modifiedDate: string;
    address: Address;
    description: string;
    //cityConfig: CityConfig;
    customer: Customer;
    emailId: string;
    phoneNumber: string;

    constructor() {
        this.cityId = "";
        this.cityName = "";
        this.active = true;
        this.templateExist = "";
        this.modifiedBy = "";
        this.modifiedDate = "";
        this.address = new Address();
        this.description = "";
        //this.cityConfig = new CityConfig();
        this.customer = new Customer();
        this.emailId = "";
        this.phoneNumber = "";
    }

    // constructor(cityId: string, cityName: string, active: string, templateExist: string, modifiedBy: string, modifiedDate: string, address: Address, cityConfig: CityConfig, customer: Customer) {
    //     this.cityId = cityId;
    //     this.cityName = cityName;
    //     this.active = active;
    //     this.templateExist = templateExist;
    //     this.modifiedBy = modifiedBy;
    //     this.modifiedDate = modifiedDate;
    //     this.address = address;
    //     this.cityConfig = cityConfig;
    //     this.customer = customer;
    // }
}

export class Customer {
    customerId: string;
    customerName: string;
    constructor() {
        this.customerId = "";
        this.customerName = "";
    }
}

export class DassAuth {
    dassIotAuthHeader: string;
    dassIotPassword: string;
    dassIotUserName: string;
    constructor() {
        this.dassIotAuthHeader = "";
        this.dassIotPassword = "";
        this.dassIotUserName = "";
    }
}

export class Plant {
    plantId: string;
    plantName: string;
    constructor() {
        this.plantId = "";
        this.plantName = "";
    }
}

export class Site {
    siteId: string;
    siteName: string;
    constructor() {
        this.siteId = "";
        this.siteName = "";
    }
}

export class CityConfig {
    abnormalBatteryPercentValue: number;
    activeSoundUrl: string;
    alertSoundUrls: string[];
    batteryAlertEmailTemplate: string;
    batteryAlertSMSTemplate: string;
    batteryLowColorCode: string;
    city: City;
    customer: Customer;
    dassAuth: DassAuth;
    hazardousAlertEmailTemplate: string;
    hazardousAlertSMSTemplate: string;
    hazardousColorCode: string;
    healthAlertEmailTemplate: string;
    healthAlertSMSTemplate: string;
    hierarchylevel: string;
    id: string;
    mailNotificationAllowed: boolean;
    maxHierarchyLevel: string;
    plant: Plant;
    site: Site;
    smsnotificationAllowed: boolean;
    sosColorCode: string;
    type: string;
    zoneThreshold: number;
    zoneThresholdEnabled: boolean;
    fallColorCode: string;
    idleColorCode: string;

    constructor() {
        this.abnormalBatteryPercentValue = 0;
        this.activeSoundUrl = "";
        this.alertSoundUrls = new Array<string>();
        this.batteryAlertEmailTemplate = "";
        this.batteryAlertSMSTemplate = "";
        this.batteryLowColorCode = "";
        this.city = new City();
        this.customer = new Customer();
        this.dassAuth = new DassAuth();
        this.hazardousAlertEmailTemplate = "";
        this.hazardousAlertSMSTemplate = "";
        this.hazardousColorCode = "";
        this.healthAlertEmailTemplate = "";
        this.healthAlertSMSTemplate = "";
        this.hierarchylevel = "";
        this.id = "";
        this.mailNotificationAllowed = false;
        this.maxHierarchyLevel = "";
        this.plant = new Plant();
        this.site = new Site();
        this.smsnotificationAllowed = false;
        this.sosColorCode = "";
        this.type = "";
        this.zoneThreshold = 0;
        this.zoneThresholdEnabled = false;
        this.fallColorCode = "";
        this.idleColorCode = "";
    }
}