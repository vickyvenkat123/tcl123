import { City, Customer, Plant, Site } from "./customer-details.model";
import { DeviceDO, EmployeeDO, ZoneDO } from "./employee-dashboard-dto.model";
import { HierarchyLevelMap } from "./hierarchy-level-map-dto.model";

export class Zone {
    city: City;
    color: string;
    createdBy: string;
    createdDate: string;
    currentEmployeeCount: number;
    customer: Customer;
    hierarchyLevelId: string
    hierarchyLevelMap: HierarchyLevelMap;
    hierarchyLevelMapId: string
    hotZoneStartedAt: string;
    hotZoneStoppedAt: string;
    isHotZone: boolean;
    lastUpdatedTimeStamp: string;
    listOfBeacon: BeaconVO[];
    modifiedBy: string;
    modifiedDate: string;
    plant: Plant;
    pointOfInterest: string;
    site: Site;
    typeOfHazardousZone: string;
    typeOfZone: string;
    violationEmployeeCount: number;
    violationEnabled: boolean;
    zoneId: string;
    zoneName: string;
    zoneSummaryUpdatedAt: string;
    zoneThreshold: number;
    zoneThresholdEnabled: boolean;
    zoneXAxisCoordinates: number[];
    zoneYAxisCoordinates: number[];

    constructor() {
        this.city = new City();
        this.color = "";
        this.createdBy = "";
        this.createdDate = "";
        this.currentEmployeeCount = 0;
        this.customer = new Customer();
        this.hierarchyLevelId = "";
        this.hierarchyLevelMap = new HierarchyLevelMap();
        this.hierarchyLevelMapId = "";
        this.hotZoneStartedAt = "";
        this.hotZoneStoppedAt = "";
        this.isHotZone = false;
        this.lastUpdatedTimeStamp = "";
        this.listOfBeacon = new Array<BeaconVO>();
        this.modifiedBy = "";
        this.modifiedDate = "";
        this.plant = new Plant();
        this.pointOfInterest = "";
        this.site = new Site();
        this.typeOfHazardousZone = "";
        this.typeOfZone = "";
        this.violationEmployeeCount = 0;
        this.violationEnabled = false;
        this.zoneId = "";
        this.zoneName = "";
        this.zoneSummaryUpdatedAt = "";
        this.zoneThreshold = 0;
        this.zoneThresholdEnabled = false;
        this.zoneXAxisCoordinates = [];
        this.zoneYAxisCoordinates = [];
    }
}

export class BeaconVO {
    beaconHeight: number;
    beaconId: number;
    beaconType: string;
    beaconXAxisCoordinate: string;
    beaconYAxisCoordinate: string;
    deveui: string;

    constructor() {
        this.beaconHeight = 0;
        this.beaconId = 0;
        this.beaconType = "";
        this.beaconXAxisCoordinate = "";
        this.beaconYAxisCoordinate = "";
        this.deveui = "";
    }
}

export class ZoneResponseDto {
    totalEmployees: number;
    totalHotZoneEmployees: number;
    totalHotZones: number;
    totalZones: number;
    constructor() {
        this.totalEmployees = 0;
        this.totalHotZoneEmployees = 0;
        this.totalHotZones = 0;
        this.totalZones = 0;
    }
}

export class ViolationResponseDtoResponse {
    data: ViolationResponseDto;
    error: boolean
    message: string;
    status: number;
    constructor() {
        this.data = new ViolationResponseDto();
        this.error = false;
        this.message = "";
        this.status = 0;
    }
}

export class ViolationResponseDto {
    totalViolations: number;
    constructor() {
        this.totalViolations = 0;
    }
}

export class ZoneViolationStatus {
    city: City;
    customer: Customer;
    id: string;
    modifiedDate: string;
    plant: Plant;
    reportDate: string;
    site: Site;
    totalViolations: number;
    zone: ZoneDO;
    constructor() {
        this.city = new City();
        this.customer = new Customer();
        this.id = "";
        this.modifiedDate = "";
        this.plant = new Plant();
        this.reportDate = "";
        this.site = new Site();
        this.totalViolations = 0;
        this.zone = new ZoneDO();
    }
}

export class ZoneViolations {
    city: City;
    customer: Customer;
    device: DeviceDO;
    duration: number;
    employee: EmployeeDO;
    entryTime: string;
    exitTime: string;
    id: string;
    iotServerDateTimeStamp: string;
    plant: Plant;
    site: Site;
    uplinkCity: City;
    uplinkPlant: Plant;
    uplinkSite: Site;
    zone: ZoneDO;

    constructor() {
        this.city = new City();
        this.customer = new Customer();
        this.device = new DeviceDO();
        this.duration = 0;
        this.employee = new EmployeeDO();
        this.entryTime = "";
        this.exitTime = "";
        this.id = "";
        this.iotServerDateTimeStamp = "";
        this.plant = new Plant();
        this.site = new Site();
        this.uplinkCity = new City();
        this.uplinkPlant = new Plant();
        this.uplinkSite = new Site();
        this.zone = new ZoneDO();
    }
}