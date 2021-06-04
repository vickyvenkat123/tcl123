import { City, Customer, Plant, Site } from "./customer-details.model";
import { Zone } from "./zone.model";

export class Beacon {
    active: boolean;
    assetName: string;
    beaconId: number;
    beaconType: string;
    city: City;
    createdBy: string;
    customer: Customer;
    deveui: string;
    deviceClass: string;
    deviceFirmwareVersion: number;
    deviceHWVersion: number;
    deviceStatus: string;
    iotServerDateTimeStamp: string;
    modelNumber: string;
    modifiedBy: string;
    oemName: string;
    plant: Plant;
    serialNumber: string;
    site: Site;
    zone: Zone;
    constructor() {
        this.active = false;
        this.assetName = "";
        this.beaconId = 0;
        this.beaconType = "";
        this.city = new City();
        this.createdBy = "";
        this.customer = new Customer();
        this.deveui = "";
        this.deviceClass = "";
        this.deviceFirmwareVersion = 0;
        this.deviceHWVersion = 0;
        this.deviceStatus = "";
        this.iotServerDateTimeStamp = "";
        this.modelNumber = "";
        this.modifiedBy = "";
        this.oemName = "";
        this.plant = new Plant();
        this.serialNumber = "";
        this.site = new Site();
        this.zone = new Zone();
    }
}
