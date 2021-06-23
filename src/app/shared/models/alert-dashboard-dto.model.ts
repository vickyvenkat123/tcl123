export class AlertDashboardDto {
    batteryLowColorCode: string;
    batteryPercentAlertValue: number;
    batteryPercentCount: number;
    hazardousColorCode: string;
    hotZoneCount: number;
    hzCount: number;
    sosColorCode: string;
    sosCount: number;
    totalRecords: number;
    totalZones: number;

    constructor() {
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

export class BatteryStatusDto {
    high: number;
    low: number;
    normal: number;
    constructor() {
        this.high = 0;
        this.low = 0;
        this.normal = 0;
    }
}

export class SafetyAlertsDayCount {
    hzCount: number;
    reportDate: string;
    sosCount: number;
    constructor() {
        this.hzCount = 0;
        this.reportDate = "";
        this.sosCount = 0;
    }
}