// import { City } from "./customer-details.model";

export class NetworkUptimeDto {
    city: City;
    upTimePercentage: number;
    constructor(){
        this.city = new City();
        this.upTimePercentage = 0;
    }
}
export class City{
    cityId:number;
    cityName: string;
    constructor(){
        this.cityId = 0;
        this.cityName = "";
    }
}
