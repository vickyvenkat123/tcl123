import { City, Customer, Plant, Site } from "./customer-details.model";

export class EmployeeDashboardDto {
    batteryPercentAlertValue: number;
    count: number;
    employeestatus: EmployeeDeviceStatus[];
    totalRecords: number;
    constructor() {
        this.batteryPercentAlertValue = 0;
        this.count = 0;
        this.employeestatus = new Array<EmployeeDeviceStatus>();
        this.totalRecords = 0;
    }
}

export class EmployeeDeviceStatus {
    batteryCount: number;
    batteryPercentage: number;
    city: City;
    customer: Customer;
    device: DeviceDO;
    employee: EmployeeDO;
    employeeExit: boolean;
    hzCount: number;
    id: string;
    iotServerDateTimeStamp: string;
    isHotZone: boolean;
    modifiedDate: string;
    plant: Plant;
    serialNo: string;
    shift: ShiftDO;
    site: Site;
    sosCount: number;
    uplinkCity: City;
    uplinkPlant: Plant;
    uplinkSite: Site;
    zone: ZoneDO;

    constructor() {
        this.batteryCount = 0;
        this.batteryPercentage = 0;
        this.city = new City();
        this.customer = new Customer();
        this.device = new DeviceDO();
        this.employee = new EmployeeDO();
        this.employeeExit = false;
        this.hzCount = 0;
        this.id = "";
        this.iotServerDateTimeStamp = "";
        this.isHotZone = false;
        this.modifiedDate = "";
        this.plant = new Plant();
        this.serialNo = "";
        this.shift = new ShiftDO();
        this.site = new Site();
        this.sosCount = 0;
        this.uplinkCity = new City();
        this.uplinkPlant = new Plant();
        this.uplinkSite = new Site();
        this.zone = new ZoneDO();
    }
}

export class DeviceDO {
    deviceId: string;
    serialNumber: string;

    constructor() {
        this.deviceId = "";
        this.serialNumber = "";
    }
}

export class EmployeeDO {
    empId: string;
    employeeId: string;
    name: string;
    reportingTo: string;

    constructor() {
        this.empId = "";
        this.employeeId = "";
        this.name = "";
        this.reportingTo = "";
    }
}

export class ShiftDO {
    shiftId: string;
    shiftName: string;

    constructor() {
        this.shiftId = "";
        this.shiftName = "";
    }
}

export class ZoneDO {
    zoneId: string;
    zoneName: string;

    constructor() {
        this.zoneId = "";
        this.zoneName = "";
    }
}