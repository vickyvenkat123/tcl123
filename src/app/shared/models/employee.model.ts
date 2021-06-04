import { Customer, Plant, Site } from "./customer-details.model";
import { DeviceDO } from "./employee-dashboard-dto.model";

export class Employee {
    active:	boolean;
    city: CityDO;
    createdBy: string;
    createdDate:	string;
    customer: Customer;
    device:	DeviceDO;
    dob: string;
    emailId: string;
    empId: string;
    employeeId: string;
    endDate: string;
    firstName: string;
    fullName: string;
    gender: string;
    isMapped: number;
    jobType: string;
    lastName: string;
    middleName: string;
    modifiedBy: string
    modifiedDate: string;
    phoneNumber: string;
    photo: string;
    plant: Plant;
    reportingTo: ReportingTo;
    // shift: ShiftDO;
    site: Site;
    startDate: string;
    user: boolean;
    userConfig: UserConfigDO;
    userId: string;
constructor(){
    this.active = false;
    this.city = new CityDO();
    this.createdBy = '';
    this.createdDate = '';
    this.customer = new Customer();
    this.device = new DeviceDO();
    this.dob = '';
    this.emailId = '';
    this.empId = '';
    this.employeeId = '';
    this.endDate = '';
    this.firstName = '';
    this.fullName = '';
    this.gender = '';
    this.isMapped = 0;
    this.jobType = '';
    this.lastName = '';
    this.middleName = '';
    this.modifiedBy = '';
    this.modifiedDate = '';
    this.phoneNumber = '';
    this.photo = '';
    this.plant = new Plant();
    this.reportingTo = new ReportingTo( );
    // this.shift = new ShiftDO(); 
    this.site = new Site();
    this.startDate = '';
    this.user = false;
    this.userConfig = new UserConfigDO();
    this.userId = '';
}
}
export class CityDO{
    cityId: string;
    cityName: string;
constructor(){
    this.cityId = '';
    this.cityName = '';
}
}
export class ReportingTo{
    empId: string;
    employeeId: string;
    name: string
    constructor(){
        this.empId = '';
        this.employeeId = '';
        this.name = ''
    }
}
// export class ShiftDO{
//     shiftId: string;
//     shiftName: string;
//     constructor(){
//         this.shiftId: '';
//         this.shiftName: '' ;
//     }
// }
export class UserConfigDO{
    city: CityDO;
    cityList: CityDO[];
    createdLevel: string;
    customer: Customer;
    emailId: string;
    employee: boolean;
    firstName: string;
    group: GroupDO[];
    lastName: string;
    middleName: string;
    password: string;
    phoneNumber: string;
    plant: Plant;
    plantList: Plant[];
    site: Site;
    siteList: Site[];
    userId: string
    userType: string
constructor(){
    this.city = new CityDO();
    this.cityList = new Array<CityDO>();
    this.createdLevel = '';
    this.customer = new Customer();
    this.emailId = '';
    this.employee = false;
    this.firstName = '';
    this.group = new Array<GroupDO>();
    this.lastName = '';
    this.middleName = '';
    this.password = '';
    this.phoneNumber = '';
    this.plant = new Plant();
    this.plantList = new Array<Plant>();
    this.site = new Site();
    this.siteList = new Array<Site>();
    this.userId = '';
    this.userType = '';
}
}
export class GroupDO{
    groupId: string;
    groupName: string;
    constructor(){
        this.groupId = '';
        this.groupName = '';
    }
}