import { Component, OnInit } from '@angular/core';
import { Site } from 'src/app/shared/models/customer-details.model';
import { DashboardService } from 'src/app/core/services/dashboard.service';
import { EmployeeDashboardDto } from 'src/app/shared/models/employee-dashboard-dto.model';
import { AlertDashboardDto } from 'src/app/shared/models/alert-dashboard-dto.model';
import { Employee, ReportingTo } from 'src/app/shared/models/employee.model'
import { EmpteackingService } from 'src/app/core/services/empteacking.service';
import * as moment from 'moment';


@Component({
  selector: 'app-employee-tracking',
  templateUrl: './employee-tracking.component.html',
  styleUrls: ['./employee-tracking.component.css']
})
export class EmployeeTrackingComponent implements OnInit {

  sites: Site[] = new Array<Site>();
  selectedSiteId: string = "";
  filteredSites: Site[] = new Array<Site>();
  selectedSiteName: string = "";
  pageNo: number = 0;
  size: number = 10;
  employeeDashboardDto: EmployeeDashboardDto = new EmployeeDashboardDto();
  employee: Employee[] = new Array<Employee>();
  reportingTo: ReportingTo = new ReportingTo();
  alertDashboardDto: AlertDashboardDto = new AlertDashboardDto();
  employeeDashboardDtoData: any;
  dateTextInput: any;
  selectedDateValue: any;
  fromDate: any;
  toDate: any;
  searchEmployeeId: string = "";


  constructor(private emptrackingService: EmpteackingService, private dashboardService: DashboardService) { }
  public options: any = {
    'locale': { 'format': 'DD-MM-YYYY', 'separator': ' to ' },
    fromDate: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() - 1),
    toDate: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() - 1),
    'maxDate': new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() - 1),
  };
  public selectedDate(value: any) {
    this.selectedDateValue = value;
    this.fromDate = moment(this.selectedDateValue.start).format('YYYY-MM-DD');
    this.toDate = moment(this.selectedDateValue.end).format('YYYY-MM-DD');
  }
  public calendarCanceled(e: any) {
    console.log(e);
  }
  public calendarApplied(e: any) {
    console.log(e);
  }
  ngOnInit(): void {
    this.emptrackingService.getSites().subscribe(
      (res: any) => {
        this.selectedSiteName = res.data[0].siteName;
        this.selectedSiteId = res.data[0].siteId;
        this.sites = res.data;
        this.filteredSites = this.sites;
        this.getEmployeeOfSiteByPageAndSize(this.pageNo, this.size);
      }
    )
  }

  onSearch(data: any) {
    if (data.term === "") {
      this.filteredSites = this.sites;
    }
    else {
      this.filteredSites = this.sites.filter(site => site.siteName.toUpperCase().startsWith(data.term.toUpperCase()));
    }
  }

  onClear() {
    this.filteredSites = this.sites;
    this.selectedSiteId = this.sites[0].siteId;
  }

  onClose() {
    // this.filteredSites = this.sites;
  }

  getEmployeeOfSiteByPageAndSize(pageNo: number, size: number) {
    this.emptrackingService.getEmployeeOfSiteByPageAndSize(this.selectedSiteId, pageNo, size).subscribe(
      (res: any) => {
        this.employee = res.data
        console.log("Epmloyee Data" + this.employee[0].empId)
        // this.pagination();
      })
  }
  onChange(data: any) {
    if (data.siteId) {
      this.selectedSiteId = data.siteId;
      this.getEmployeeOfSiteByPageAndSize(this.pageNo, this.size);
      // this.getAlertCounts(this.pageNo, this.size);
    }
  }
  tab='location'

  onchanges(val:any){
    this.tab = val
  }
  onEnter() {
    if (this.searchEmployeeId === "") {
      this.getEmployeeOfSiteByPageAndSize(this.pageNo, this.size);
    }
    // else {
    //   this.emptrackingService.searchEmployeeBySiteAndEmployeeId(this.selectedSiteId, this.searchEmployeeId, this.pageNo, this.size).subscribe(
    //     (res: any) => {
    //       this.employee= res.data;
    //     })
    // }
  }
}
