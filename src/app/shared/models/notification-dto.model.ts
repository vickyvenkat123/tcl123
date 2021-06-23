import { City, Plant, Site } from "./customer-details.model";
import { EmployeeDO, ZoneDO } from "./employee-dashboard-dto.model";

export class NotificationDto {
    alert: number;
    newAlerts: NewAlertDto[];
    totalCount: number;
    constructor() {
        this.alert = 0;
        this.newAlerts = new Array<NewAlertDto>();
        this.totalCount = 0;
    }
}

export class NewAlertDto {
    alertId: string;
    alertName: string
    alertNotificationId: string;
    alertType: string;
    customerId: string;
    deviceId: string;
    deviceParamId: string;
    employee: EmployeeDO;
    iotServerDateTimeStamp: string;
    lastKnownLocation: LastKnownLocationDO;
    zone: ZoneDO;

    constructor() {
        this.alertId = "";
        this.alertName = "";
        this.alertNotificationId = "";
        this.alertType = "";
        this.customerId = "";
        this.deviceId = "";
        this.deviceParamId = "";
        this.employee = new EmployeeDO();
        this.iotServerDateTimeStamp = "";
        this.lastKnownLocation = new LastKnownLocationDO();
        this.zone = new ZoneDO();
    }
}

export class LastKnownLocationDO {
    beaconId: number;
    city: City;
    iotServerDateTimeStamp: string;
    plant: Plant;
    site: Site;
    zone: ZoneDO;

    constructor() {
        this.beaconId = 0;
        this.city = new City();
        this.iotServerDateTimeStamp = "";
        this.plant = new Plant();
        this.site = new Site();
        this.zone = new ZoneDO();
    }
}