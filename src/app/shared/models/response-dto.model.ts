export class ResponseDto {
    activeUsers: number;
    avgHrs: number;
    batteryAvg: number;
    contactAvg: number;
    hotZonesAvg: number;
    hzAvg: number;
    hzZones: number;
    monitoredZones: number;
    restrictedZones: number;
    restrictedZonesAvg: number;
    sosAvg: number;
    totalBT: number;
    totalContacts: number;
    totalHZ: number;
    totalHotZones: number;
    totalSOS: number;
    totalUsers: number;
    totalViolatedZones: number;

    constructor() {
        this.activeUsers = 0;
        this.avgHrs = 0;
        this.batteryAvg = 0;
        this.contactAvg = 0;
        this.hotZonesAvg = 0;
        this.hzAvg = 0;
        this.hzZones = 0;
        this.monitoredZones = 0;
        this.restrictedZones = 0;
        this.restrictedZonesAvg = 0;
        this.sosAvg = 0;
        this.totalBT = 0;
        this.totalContacts = 0;
        this.totalHZ = 0;
        this.totalHotZones = 0;
        this.totalSOS = 0;
        this.totalUsers = 0;
        this.totalViolatedZones = 0;

    }

}
