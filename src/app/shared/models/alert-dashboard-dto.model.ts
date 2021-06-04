export class AlertDashboardDto {
    batteryLowColorCode:string;
    batteryPercentAlertValue:number;
    batteryPercentCount: number;
    hazardousColorCode:string;
    hotZoneCount : number;
    hzCount: number;
    sosColorCode:string;
    sosCount:number;
    totalRecords: number;
    totalZones: number;

    constructor(){
        this.batteryLowColorCode = "";
        this.batteryPercentAlertValue = 0;
        this.batteryPercentCount = 0;
        this.hazardousColorCode = "";
        this.hotZoneCount = 0;
        this.hzCount = 0;
        this.sosColorCode = "";
        this.sosCount = 0;
        this.totalRecords = 0;
        this.totalZones = 0;
    }
}
