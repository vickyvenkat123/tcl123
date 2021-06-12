import { City, Plant } from "./customer-details.model";

export class UtilizationDashboardDto {
    badges: number;
    distributed: number;
    nonCommunicatingBadges: number;
    workingBadges: number;
    constructor() {
        this.badges = 0;
        this.distributed = 0;
        this.nonCommunicatingBadges = 0;
        this.workingBadges = 0;
    }
}

export class CardStatusDto {
    reportDate:string;
    cardDeteced: number;
    cardDistributed: number;
    cardNotDetected: number;
    inActiveCards: number;
    constructor() {
        this.reportDate = "";
        this.cardDeteced = 0;
        this.cardDistributed = 0;
        this.cardNotDetected = 0;
        this.inActiveCards = 0;
    }
}

export class CardUtilizationResponse {
    hierarchyType: string;
    list: CardUtilizationDto[];
    total: CardUtilizationTotalDto[];
    totalDays: number;

    constructor() {
        this.hierarchyType = "";
        this.list = new Array<CardUtilizationDto>();
        this.total = new Array<CardUtilizationTotalDto>();
        this.totalDays = 0;
    }
}
export class CardUtilizationDto {
    city: City;
    cumulativeXDays: CardStatusDto;
    currentDay: CardStatusDto;
    hierarchyLevel: string;
    plant: Plant;
    previousDay: CardStatusDto;

    constructor() {
        this.city = new City();
        this.cumulativeXDays = new CardStatusDto();
        this.currentDay = new CardStatusDto();
        this.hierarchyLevel = "";
        this.plant = new Plant();
        this.previousDay = new CardStatusDto();
    }

}

export class CardUtilizationTotalDto {
    cumulativeXDaysTotal: CardStatusDto;
    currentDayTotal: CardStatusDto;
    previousDayTotal: CardStatusDto;

    constructor() {
        this.cumulativeXDaysTotal = new CardStatusDto();
        this.currentDayTotal = new CardStatusDto();
        this.previousDayTotal = new CardStatusDto();
    }
}