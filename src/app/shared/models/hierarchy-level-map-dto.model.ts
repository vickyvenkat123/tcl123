import { City, Customer, Plant, Site } from "./customer-details.model";

export class HierarchyLevelMapDto {
    hierarchyLevelMap: HierarchyLevelMap;
    hierarchyLevelMapDetail: HierarchyLevelMap;
    hierarchyLevelMapList: HierarchyLevelMap[];
    hierarchyLevelService: HierarchyLevelMap;

    constructor() {
        this.hierarchyLevelMap = new HierarchyLevelMap();
        this.hierarchyLevelMapDetail = new HierarchyLevelMap();
        this.hierarchyLevelMapList = new Array<HierarchyLevelMap>();
        this.hierarchyLevelService = new HierarchyLevelMap();
    }
}

export class HierarchyLevelMap {
    city: City;
    customer: Customer;
    hierarchyLevel: HierarchyLevel;
    hierarchyLevelId: string;
    hierarchyLevelMapId: string;
    hierarchyLevelMapName: string;
    imageOrientation: string;
    mapImage: string;
    pixelToAMeterForXAxis: number;
    pixelToAMeterForYAxis: number;
    plant: Plant;
    referenceXAxisPoint: number;
    referenceYAxisPoint: number;
    site: Site;
    constructor() {
        this.city = new City();
        this.customer = new Customer();
        this.hierarchyLevel = new HierarchyLevel();
        this.hierarchyLevelId = "";
        this.hierarchyLevelMapId = "";
        this.hierarchyLevelMapName = "";
        this.imageOrientation = "";
        this.mapImage = "";
        this.pixelToAMeterForXAxis = 0;
        this.pixelToAMeterForYAxis = 0;
        this.referenceXAxisPoint = 0;
        this.referenceYAxisPoint = 0;
        this.plant = new Plant();
        this.site = new Site();
    }
}

export class HierarchyLevel {
    city: City;
    createdBy: string;
    createdDate: string;
    customer: Customer;
    hierarchyLevelId: string;
    hierarchyLevelName: string;
    hierarchyMapUploaded: boolean;
    hierarchyTemplate: HierarchyTemplate;
    modifiedBy: string;
    modifiedDate: string;
    parentLevelId: string;
    plant: Plant;
    site: Site;

    constructor() {
        this.city = new City();
        this.createdBy = "";
        this.createdDate = "";
        this.customer = new Customer();
        this.hierarchyLevelId = "";
        this.hierarchyLevelName = "";
        this.hierarchyMapUploaded = false;
        this.hierarchyTemplate = new HierarchyTemplate();
        this.modifiedBy = "";
        this.modifiedDate = "";
        this.parentLevelId = "";
        this.plant = new Plant();
        this.site = new Site();
    }
}

export class HierarchyTemplate {
    city: City;
    createdBy: string;
    createdDate: string;
    customer: Customer;
    hierarchyLevel: number;
    hierarchyTemplateId: string;
    hierarchyTemplateName: string;
    modifiedBy: string;
    modifiedDate: string;
    plant: Plant;
    site: Site;

    constructor() {
        this.city = new City();
        this.createdBy = "";
        this.createdDate = "";
        this.customer = new Customer();
        this.hierarchyLevel = 0;
        this.hierarchyTemplateId = "";
        this.hierarchyTemplateName = "";
        this.modifiedBy = "";
        this.modifiedDate = "";
        this.plant = new Plant();
        this.site = new Site();
    }
}