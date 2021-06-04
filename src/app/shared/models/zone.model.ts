import { City, Customer, Plant, Site } from "./customer-details.model";
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