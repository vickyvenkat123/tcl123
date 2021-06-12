import { City } from "./customer-details.model";

export class GatewaysCountDo {

    gatewaysNotAllocatedToCity: number;
    gatewaysNotAllocatedToCityUptime: number;
    networkStatusList: NetworkUptimeDto[];
    networkUptime: number;
    statusList: CityCountDO[];
    statusUpdatedAt: string;
    totalInstalledGateways: number;
    totalNonWorkingGateways: number;
    totalOnboardedGateways: number;
    totalWorkingGateways: number;

    constructor() {
        this.gatewaysNotAllocatedToCity = 0;
        this.gatewaysNotAllocatedToCityUptime = 0;
        this.networkStatusList = new Array<NetworkUptimeDto>();
        this.networkUptime = 0;
        this.statusList = new Array<CityCountDO>();
        this.statusUpdatedAt = "";
        this.totalInstalledGateways = 0;
        this.totalNonWorkingGateways = 0
        this.totalOnboardedGateways = 0;
        this.totalWorkingGateways = 0;
    }
}
export class NetworkUptimeDto {
    city: City;
    upTimePercentage: number;
    constructor() {
        this.city = new City();
        this.upTimePercentage = 0;
    }
}


export class CityCountDO {
    city: City;
    count: number;
    constructor() {
        this.city = new City();
        this.count = 0;
    }
}
