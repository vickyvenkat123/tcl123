import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild, HostListener, AfterViewInit } from '@angular/core';
import { CustomerConfigService } from 'src/app/core/services/customer-config.service';
import { DashboardService } from 'src/app/core/services/dashboard.service';
import { AlertDashboardDto, BatteryStatusDto, SafetyAlertsDayCount } from 'src/app/shared/models/alert-dashboard-dto.model';
import { Site } from 'src/app/shared/models/customer-details.model';
import { EmployeeDashboardDto, EmployeeDeviceStatus } from 'src/app/shared/models/employee-dashboard-dto.model';
import { ChartType } from 'chart.js';
import { FormControl } from '@angular/forms';
import { HierarchyLevelMapDto } from 'src/app/shared/models/hierarchy-level-map-dto.model';
import { HierarchyService } from 'src/app/core/services/hierarchy.service';
import * as fs from 'file-saver';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { Color, Label, SingleDataSet } from 'ng2-charts';
import { DatePipe } from '@angular/common';
import { EmployeeZoneDto } from 'src/app/shared/models/employee-zone-dto.model';
import { Zone } from 'src/app/shared/models/zone.model';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DataSource } from '@angular/cdk/table';
import { MatDialog } from '@angular/material/dialog';
import { BeaconListModalComponent } from './beacon-list-modal/beacon-list-modal.component';
import { filter } from 'rxjs/operators';
import { Router } from '@angular/router';
import * as $ from 'jquery';
import { PinchZoomComponent } from 'src/app/shared/Components/pinch-zoom/pinch-zoom.component';
import * as pluginDataLabels from 'chartjs-plugin-datalabels';
import { PluginServiceGlobalRegistration } from 'chart.js';
import { Legend } from '@amcharts/amcharts4/charts';
import panzoom from "panzoom";

@Component({
  selector: 'app-operational-dashboard',
  templateUrl: './operational-dashboard.component.html',
  styleUrls: ['./operational-dashboard.component.css']
})
export class OperationalDashboardComponent implements OnInit, AfterViewInit {
  pageOfItems: Array<any> = new Array<any>();
  chartType: ChartType = 'doughnut';
  lineChartType: ChartType = 'line';
  chartLabels: Array<string> = new Array<string>();
  chartData: Array<number> = new Array<number>();
  autoCompleteList: Array<string> = new Array<string>();
  myControl = new FormControl();
  searchOptionArray: Array<string> = new Array<string>();
  @ViewChild('autocompleteInput') autocompleteInput!: ElementRef;
  @ViewChild('pinch') pinchZoom!: PinchZoomComponent;
  @ViewChild('scene', { static: true }) scene: ElementRef;
  panZoomController;
  zoomLevels: number[];

  currentZoomLevel: number;

  zoom() {
    const isSmooth = false;
    const scale = this.currentZoomLevel;


    if (scale) {
      const transform = this.panZoomController.getTransform();
      const deltaX = transform.x;
      const deltaY = transform.y;
      const offsetX = scale + deltaX;
      const offsetY = scale + deltaY;

      if (isSmooth) {
        this.panZoomController.smoothZoom(0, 0, scale);
      } else {
        this.panZoomController.zoomTo(offsetX, offsetY, scale);
      }
    }

  }
  zoomReset(){
    this.panZoomController.zoomAbs(0, 0, 1);
    this.currentZoomLevel = 1;
  }

  zoomToggle(zoomIn: boolean) {
    const idx = this.zoomLevels.indexOf(this.currentZoomLevel);
    if (zoomIn) {
      if (typeof this.zoomLevels[idx + 1] !== 'undefined') {
        this.currentZoomLevel = this.zoomLevels[idx + 1];
      }
    } else {
      if (typeof this.zoomLevels[idx - 1] !== 'undefined') {
        this.currentZoomLevel = this.zoomLevels[idx - 1];
      }
    }
    if (this.currentZoomLevel === 1) {
      this.panZoomController.moveTo(0, 0);
      this.panZoomController.zoomAbs(0, 0, 1);
    } else {
      this.zoom();
    }
  }

  ngAfterViewInit() {

    this.zoomLevels = [0.1, 0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2, 2.5, 3];
    this.currentZoomLevel = this.zoomLevels[4];
    // panzoom(document.querySelector('#scene'));
  
    setTimeout(() => {
      this.panZoomController = panzoom(document.querySelector('#canvasBGImage'));
    }, 8000);
   
  }
  @Output() onSelectedOption = new EventEmitter();
  selectable = true;
  removable = true;
  searchEmployeeId: string = "";
  chartOptions: any = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      datalabels: {
        color: 'white',
      }
    },
    legend: {
      position: 'left'
    }
  }

  pieChartColors: Array<any> = new Array<any>();

  gridApi: any;
  gridColumnApi: any;
  columnDefs: any;
  defaultColDef: any;
  rowData: any;
  filteredData: any;
  params: any;
  enableFirstPager: boolean = false;
  enablePreviousPager: boolean = false;
  enableNextPager: boolean = false
  enableLastPager: boolean = false;
  showFirstPager: boolean = false;
  showSecondPager: boolean = false;
  showThirdPager: boolean = false;
  showFourthPager: boolean = false;
  showFifthPager: boolean = false;
  firstPager: number = 0;
  secondPager: number = 0;
  thirdPager: number = 0;
  fourthPager: number = 0;
  fifthPager: number = 0;
  showPagination: boolean = false;
  selectedPageValue: number = 0;
  displayedColumns: string[] = ['Zone Name', 'Count', 'Beacon Count'];
  @ViewChild(MatSort) sort: MatSort | undefined;
  totalNoOfEmployeesOfZone: number = 0;
  showImage: any;
  scale: any;
  scaleMultiplier: any;

  constructor(private customerConfigService: CustomerConfigService, private dashboardService: DashboardService, private hierarchyService: HierarchyService, private dialog: MatDialog, private router: Router) {
    this.columnDefs = [
      {
        field: 'employee.name',
        headerName: 'Employee Name',
      },
      {
        field: 'employee.employeeId',
        headerName: 'Employee Id',
        width: 150,
      },
      {
        field: 'device.deviceId',
        headerName: 'Device Id',
        width: 200,
      },
      {
        field: 'iotServerDateTimeStamp',
        headerName: 'Time Stamp',
        comparator: this.dateComparator,
        width: 250,
      },
      {
        field: 'zone.zoneName',
        headerName: 'Zone',
      },
      {
        field: 'sosCount',
        headerName: 'SOS'
      },
      {
        field: 'batteryPercentage',
        headerName: 'BATT(%)'
      },
      {
        field: 'hzCount',
        headerName: 'HZ'
      },
    ];
    this.defaultColDef = {
      width: 170,
      sortable: true,
    };
  }

  sites: Site[] = new Array<Site>();
  filteredSites: Site[] = new Array<Site>();
  selectedSiteName: string = "";
  selectedSiteId: string = "";
  selectedCityId: string = "";
  selectedPlantId: string = "";
  @ViewChild('selectList', { static: false })
  selectList!: ElementRef;
  filterText: any;
  searchInput: String = '';
  searchResult: Array<any> = [];
  pageNo: number = 0;
  totalNoOfPages: number = 0;
  size: number = 10;
  sizeChanged: boolean = false;
  employeeDashboardDto: EmployeeDashboardDto = new EmployeeDashboardDto();
  employeeDeviceStatus: EmployeeDeviceStatus = new EmployeeDeviceStatus();
  hierarchyLevelMapDto: HierarchyLevelMapDto = new HierarchyLevelMapDto();
  hierarchyLevelMapDtoForMapData: HierarchyLevelMapDto = new HierarchyLevelMapDto();
  canvasBackgroundImage: string = "";
  @ViewChild("canvasBGImage") canvasBGImage: ElementRef | undefined;
  @ViewChild("canvas") chessCanvas: ElementRef | undefined;
  @ViewChild("canvasupper") canvasupper: ElementRef | any;
  @ViewChild('panzoomDiv') panzoomDiv: ElementRef | undefined;
  ctxUpper: any;
  ctx: any;
  beaconIdList: Array<any> = [];
  arrayOfObject: Array<any> = [];
  zones: Zone[] = new Array<Zone>();
  employeeZoneDtos: EmployeeZoneDto[] = new Array<EmployeeZoneDto>();
  alertDashboardDto: AlertDashboardDto = new AlertDashboardDto();
  showEmployeeList: boolean = true;
  showZoneList: boolean = false;
  selected: any;
  datePipe: DatePipe = new DatePipe('en-US');
  selectedHieararchy: string = "";
  dataSource: any;
  canvasHeight: any;
  canvasWidth: any;
  @ViewChild('canvasDiv') canvasDiv: any;
  myImage: any;
  isProcessingOrNotForMap: boolean = false;
  panzoom: HTMLElement | undefined;
  batteryStatusDto: BatteryStatusDto = new BatteryStatusDto();
  safetyAlertsDayCounts: SafetyAlertsDayCount[] = new Array<SafetyAlertsDayCount>();

  ngOnInit(): void {
    this.myImage = new Image(32, 32);
    this.myImage.src = './assets/images/Beacon-black.png';
    this.customerConfigService.getSites().subscribe(
      (res: any) => {
        this.selectedSiteName = res.data[0].siteName;
        this.selectedSiteId = res.data[0].siteId;
        this.selectedCityId = res.data[0].city.cityId;
        this.selectedPlantId = res.data[0].plant.plantId;
        this.sites = res.data;
        this.filteredSites = this.sites;
        this.getEmployeesOfSiteByPageAndSize(this.pageNo, this.size);
        this.getAlertCounts(this.pageNo, this.size);
        this.getBatteryStatus();
        this.getSafetyAlertCount();
        //this.onGridReady(this.params);
        // this.filteredSites = this.sites;
      }
    )
  }

  //ngAfterViewInit(): void {
    // if (this.panzoomDiv) {
    //   (this.panzoomDiv.nativeElement).panzoom({
    //     $zoomIn: ('.zoom-in'),
    //     $zoomOut: ('.zoom-out'),
    //     $zoomRange: ('.zoom-range'),
    //     $reset: ('.reset')
    //   });
    // }
    // var elem = document.getElementById('panzoomDiv') as HTMLElement;
    // const panzoom = Panzoom(document.getElementById('panzoom') as HTMLElement,
    // {
    //   minScale: 1,
    //   maxScale: 5,
    //   contain: 'outside'
    // });

    // (document.getElementById("zoomIn") as HTMLElement) .addEventListener('click', panzoom.zoomIn);
    // (document.getElementById("zoomOut") as HTMLElement).addEventListener('click', panzoom.zoomOut);
    // (document.getElementById("reset") as HTMLElement).addEventListener('reset', panzoom.reset);



  //}

  getBatteryStatus() {
    this.dashboardService.getBatteryStatus(sessionStorage.getItem("userId") || "", this.selectedSiteId).subscribe((res: any) => {
      this.batteryStatusDto = res.data;
      this.sum = this.batteryStatusDto.low + this.batteryStatusDto.normal + this.batteryStatusDto.high;
      this.demodoughnutChartData = [this.batteryStatusDto.low, this.batteryStatusDto.normal, this.batteryStatusDto.high];
    })
  }

  getSafetyAlertCount() {
    this.dashboardService.getSafetyAlertCount(sessionStorage.getItem("userId") || "", this.selectedSiteId).subscribe((res: any) => {
      this.safetyAlertsDayCounts = res.data;
      var hzCountArray = this.safetyAlertsDayCounts.map(hz => hz.hzCount);
      var sosCountArray = this.safetyAlertsDayCounts.map(sos => sos.sosCount);
      var reportDatesArray = this.safetyAlertsDayCounts.map(rd => this.datePipe.transform(rd.reportDate, 'yyyy-MM-dd')?.toString() || '');
      this.lineChartData = [
        { data: hzCountArray, label: 'Hazardous' },
        { data: sosCountArray, label: 'SOS' }
      ];
      this.lineChartLabels = reportDatesArray;
      //this.sum = this.batteryStatusDto.low + this.batteryStatusDto.normal + this.batteryStatusDto.high;
      //this.demodoughnutChartData = [this.batteryStatusDto.low, this.batteryStatusDto.normal, this.batteryStatusDto.high];
    })
  }

  pipeForDate(iotDate: Date) {
    return this.datePipe.transform(iotDate, 'dd-MM-yyyy HH:mm');
  }

  onGridReady(params: any) {
    this.params = params;
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.gridApi.setDomLayout("autoHeight");
  }

  dateComparator(date1: string, date2: string) {
    var date1Number = new Date(date1);
    var dateFirst = this.datePipe.transform(date1Number, 'dd-MM-yyyy HH:mm');
    var date2Number = new Date(date2);
    var dateSecond = this.datePipe.transform(date2Number, 'dd-MM-yyyy HH:mm');
    if (dateFirst === null && dateSecond === null) {
      return 0;
    }
    if (dateFirst === null) {
      return -1;
    }
    if (dateSecond === null) {
      return 1;
    }
    return (dateFirst > dateSecond);
  }

  monthToComparableNumber(date: string) {
    if (date === undefined || date === null || date.length !== 10) {
      return null;
    }
    var yearNumber = date.substring(6, 10);
    var monthNumber = date.substring(3, 5);
    var dayNumber = date.substring(0, 2);
    var result = Number(yearNumber) * 10000 + Number(monthNumber) * 100 + dayNumber;
    return result;
  }

  // onEnter(){
  //   if (this.searchAthelete === "") {
  //     this.filteredData = this.rowData;
  //   }
  //   else {
  //     console.log(this.rowData);
  //     this.filteredData = this.rowData.filter((row:any) => row.athlete.toUpperCase() === this.searchAthelete.toUpperCase());
  //   }
  // }

  onSearch(data: any) {
    if (data.term === "") {
      this.filteredSites = this.sites;
    }
    else {
      this.filteredSites = this.sites.filter(site => site.siteName.toUpperCase().startsWith(data.term.toUpperCase()));
    }
  }

  onChange(data: any) {
    if (data.siteId) {
      this.selectedSiteId = data.siteId;
      this.selectedCityId = data.city.cityId;
      this.selectedPlantId = data.plant.plantId;
      this.getEmployeesOfSiteByPageAndSize(this.pageNo, this.size);
      this.getAlertCounts(this.pageNo, this.size);
    }
  }

  onClear() {
    this.filteredSites = this.sites;
    this.selectedSiteId = this.sites[0].siteId;
  }

  onClose() {
    // this.filteredSites = this.sites;
  }

  getEmployeesOfSiteByPageAndSize(pageNo: number, size: number) {
    this.dashboardService.getEmployeesOfSiteByPageAndSize(this.selectedSiteId, pageNo, size).subscribe(
      (res: any) => {
        this.employeeDashboardDto = res.data;
        this.pagination();
      })
  }

  getAlertCounts(pageNo: number, size: number) {
    this.dashboardService.getAlertCounts(this.selectedSiteId, pageNo, size).subscribe(
      (res: any) => {
        this.alertDashboardDto = res.data;
        this.buildPieChartForOvercrowding();
      })
  }

  buildPieChartForOvercrowding() {
    this.chartData = [this.alertDashboardDto.totalZones, this.alertDashboardDto.hotZoneCount];
    this.chartLabels = [this.alertDashboardDto.totalZones + "  Live Zones", this.alertDashboardDto.hotZoneCount + "  Hot Zones"];
    this.pieChartColors = [{
      backgroundColor: ['#3D85C6', '#2B5F8F'],
    }];
  }

  // events
  chartClicked(e: any): void {
    //console.log(e);
  }

  chartHovered(e: any): void {
    // console.log(e);
  }

  // onSiteChange(data: any) {
  //   this.selectedSiteName = data.target.value;
  //   var selectedSiteObj = this.sites.find(site => site.siteName == this.selectedSiteName);
  //   this.selectedSiteId = selectedSiteObj!.siteId;
  //   this.pageNo = 0;
  //   this.selectedPageValue = 0;
  //   this.getEmployeesOfSiteByPageAndSize(this.pageNo, this.size);
  //   this.getAlertCounts(this.pageNo, this.size);
  // }


  showEmployees() {
    this.showEmployeeList = true;
    this.showZoneList = false;
    this.getEmployeesOfSiteByPageAndSize(this.pageNo, this.size);
    this.getAlertCounts(this.pageNo, this.size);
  }

  showZones() {
    this.showZoneList = true;
    this.showEmployeeList = false;
    this.getMapListForSiteId(this.selectedSiteId);
  }

  onSizeChange(data: any) {
    this.size = data.target.value;
    this.pageNo = 0;
    this.sizeChanged = true;
    this.selectedPageValue = 0;
    this.getEmployeesOfSiteByPageAndSize(this.pageNo, this.size);
  }

  getMapListForSiteId(siteId: string) {
    this.hierarchyService.getMapListForSiteId(siteId).subscribe(
      (res: any) => {
        this.hierarchyLevelMapDto = res.data;
        this.selectedHieararchy = this.hierarchyLevelMapDto.hierarchyLevelMapList[0].hierarchyLevelMapName;
        this.getMapDataByMapId(this.hierarchyLevelMapDto.hierarchyLevelMapList[0].hierarchyLevelMapId);
      })
  }

  getMapDataByMapId(mapId: string) {
    this.hierarchyService.getMapDataByMapId(mapId).subscribe((res: any) => {
      this.hierarchyLevelMapDtoForMapData = res.data;
      this.canvasBackgroundImage = this.hierarchyLevelMapDtoForMapData.hierarchyLevelMap.mapImage;
      this.getImageOrCanvasSize(this.canvasBackgroundImage);
      if (this.chessCanvas) {
        this.ctx = this.chessCanvas.nativeElement.getContext("2d");
      }
      if (this.ctx)
        this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
      if (this.canvasupper) {
        this.ctxUpper = this.canvasupper.nativeElement.getContext("2d");
      }
      //commemted during emptracker
      this.drawZoneWithEmployeeCount(this.ctx);
      for (var i = 0; i < this.zones.length; i++) {
        //this.ZoneDoList.push(this.zones[i].zoneId);
        if (this.zones[i] && this.zones[i].listOfBeacon != null) {
          for (let j = 0; j < this.zones[i].listOfBeacon.length; j++) {
            if (this.beaconIdList.indexOf(this.zones[i].listOfBeacon[j].beaconId.toString()) > -1) {
              let box: any = {};
              box["beaconId"] = this.zones[i].listOfBeacon[j].beaconId;
              box["zoneName"] = this.zones[i].zoneName;
              box["xCoordinates"] = this.zones[i].listOfBeacon[j].beaconXAxisCoordinate;
              box["yCoordinates"] = this.zones[i].listOfBeacon[j].beaconYAxisCoordinate;
              this.arrayOfObject.push(box);
              // this.selectedZone = this.zones[i].zoneName;
              //this.highLightZone(this.zones[i].zoneXAxisCoordinates, this.zones[i].zoneYAxisCoordinates, this.ctx);
            }
          }
        }
      }
    }
    )
    this.isProcessingOrNotForMap = true;
    this.getZoneStatus(mapId, this.selectedSiteId);
    this.getZoneAndBeaconDetailAccordingHierarchyLevelMapId(mapId);
  }

  getImageOrCanvasSize(imageSrc: string) {
    var qwerty = new Image();
    var _self = this;
    qwerty.onload = function () {
      // this.width contains image width 
      _self.canvasHeight = qwerty.height;
      _self.canvasWidth = qwerty.width;
      if (_self.canvasBGImage) {
        _self.canvasBGImage.nativeElement.src = qwerty.src;
      }
      // this.height contains image height
    };
    qwerty.src = imageSrc;
  }

  getZoneAndBeaconDetailAccordingHierarchyLevelMapId(mapId: string) {
    this.hierarchyService.getZoneAndBeaconDetailAccordingHierarchyLevelMapId(mapId).subscribe((res: any) => {
      this.zones = res.data.zoneList;
      this.zones.sort((a, b) => Math.min(...a.zoneXAxisCoordinates) <= Math.min(...b.zoneXAxisCoordinates) ? -1 : 1);
    }
    )
  }

  getZoneStatus(mapId: string, siteId: string) {
    this.dashboardService.getZoneStatus(mapId, siteId).subscribe((res: any) => {
      this.employeeZoneDtos = res.data;
      this.totalNoOfEmployeesOfZone = this.employeeZoneDtos.filter((item) => item.count)
        .map((item) => +item.count)
        .reduce((sum, current) => sum + current);
      this.dataSource = new MatTableDataSource(this.employeeZoneDtos);
      this.dataSource.sort = this.sort;
    }
    )
  }

  sortedData: EmployeeZoneDto[] = new Array<EmployeeZoneDto>();;


  sortData(sort: Sort) {
    const data = this.employeeZoneDtos.slice();
    this.sortedData = data.sort((a: any, b: any) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'zoneName': return this.compare(a.zoneName, b.zoneName, isAsc);
        case 'count': return this.compare(a.count, b.count, isAsc);
        case 'beaconCount': return this.compare(a.beaconCount, b.beaconCount, isAsc);
        default: return 0;
      }
    });
  }

  compare(a: number | string, b: number | string, isAsc: boolean) {
    if ((a < b) && isAsc) {
      return 1;
    }
    else if ((a > b) && isAsc) {
      return -1;
    }
    else if ((a < b) && !isAsc) {
      return -1;
    }
    else
      return 1;

    // (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  onEnter() {
    if (this.searchEmployeeId === "") {
      this.getEmployeesOfSiteByPageAndSize(this.pageNo, this.size);
    }
    else {
      this.dashboardService.searchEmployeeBySiteAndEmployeeId(this.selectedSiteId, this.searchEmployeeId, this.pageNo, this.size).subscribe(
        (res: any) => {
          this.employeeDashboardDto.employeestatus = res.data;
          this.employeeDashboardDto.totalRecords = this.employeeDashboardDto.employeestatus.length;
          this.pagination();
        })
    }
  }

  pagination() {
    if (this.employeeDashboardDto.totalRecords > this.size) {
      this.showPagination = true;
      if (this.employeeDashboardDto.totalRecords % this.size == 0) {
        this.totalNoOfPages = this.employeeDashboardDto.totalRecords / this.size;
        this.displayButtonsAndValues();
      }
      else {
        this.totalNoOfPages = Math.floor(this.employeeDashboardDto.totalRecords / this.size) + 1;
        this.displayButtonsAndValues();
      }
    }
    else {
      this.showPagination = false;
    }
  }

  displayButtonsAndValues() {
    if (this.showPagination) {
      this.showSecondPager = false;
      this.showThirdPager = false;
      this.showFourthPager = false;
      this.showFifthPager = false;
      if (this.pageNo == 0) {
        this.firstPager = 0;
        if ((this.totalNoOfPages > this.firstPager) || this.sizeChanged) {
          this.showFirstPager = true;
          this.firstPager = 1;
          this.selectedPageValue = this.firstPager;
        }

        if (((this.totalNoOfPages - this.firstPager) > 0)) {
          this.showSecondPager = true;
          this.secondPager = 2;
        }
        if (((this.totalNoOfPages - this.secondPager) > 0)) {
          this.showThirdPager = true;
          this.thirdPager = 3;
        }
        if (((this.totalNoOfPages - this.thirdPager) > 0) && this.thirdPager != 0) {
          this.showFourthPager = true;
          this.fourthPager = 4;
        }
        if (((this.totalNoOfPages - this.fourthPager) > 0) && this.fourthPager != 0) {
          this.showFifthPager = true;
          this.fifthPager = 5;
        }
        if (this.totalNoOfPages > this.secondPager) {
          this.enableNextPager = true;
          this.enableLastPager = true;
        }
      }
      else { // pageNo >0
        if (this.totalNoOfPages > this.firstPager) {
          this.showFirstPager = true;
        }
        if ((this.totalNoOfPages - this.firstPager) > 0) {
          this.showSecondPager = true;
        }
        if (this.totalNoOfPages - this.secondPager > 0) {
          this.showThirdPager = true;
        }
        if ((this.totalNoOfPages - this.thirdPager) > 0 && this.thirdPager != 0) {
          this.showFourthPager = true;
        }
        if ((this.totalNoOfPages - this.fourthPager) > 0 && this.fourthPager != 0) {
          this.showFifthPager = true;
        }
      }
      this.sizeChanged = false;
    }
  }

  export() {
    //let workbook = new Workbook();
    //let worksheet = workbook.addWorksheet('ProductSheet');
    this.dashboardService.exportEmployees(this.selectedSiteId).subscribe((data: any) => {
      var headers = data.headers.get('Content-disposition').toString();
      var fileName = headers.substring((headers.indexOf('=') + 1), headers.length);
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, fileName);
    })
  }

  pagerNumClicked(pageNumber: number, position: number) {
    if (pageNumber == 1) {
      this.pageNo = 0;
      this.displayButtonsAndValues();
    }
    else {
      if (position >= 4) {
        this.selectedPageValue = pageNumber;
        if (this.showFifthPager && this.showFourthPager && this.showThirdPager && this.showSecondPager) {
          this.firstPager = pageNumber - 2;
          this.secondPager = pageNumber - 1;
          this.thirdPager = pageNumber;
          this.fourthPager = pageNumber + 1;
          this.fifthPager = pageNumber + 2;
          if (this.totalNoOfPages < (this.secondPager) || this.totalNoOfPages < (this.thirdPager) || this.totalNoOfPages < (this.fourthPager) || this.totalNoOfPages < (this.fifthPager)) {
            this.fifthPager = this.totalNoOfPages;
            this.fourthPager = this.totalNoOfPages - 1;
            this.thirdPager = this.totalNoOfPages - 2;
            this.secondPager = this.totalNoOfPages - 3;
            this.firstPager = this.totalNoOfPages - 4;
          }
        }
        else if (this.showFourthPager && this.showThirdPager && this.showSecondPager) {
          this.firstPager = pageNumber - 2;
          this.secondPager = pageNumber - 1;
          this.thirdPager = pageNumber;
          this.fourthPager = pageNumber + 1;
          if (this.totalNoOfPages < (this.secondPager) || this.totalNoOfPages < (this.thirdPager) || this.totalNoOfPages < (this.fourthPager)) {
            this.fourthPager = this.totalNoOfPages;
            this.thirdPager = this.totalNoOfPages - 1;
            this.secondPager = this.totalNoOfPages - 2;
            this.firstPager = this.totalNoOfPages - 3;
          }
        }

        this.enableFirstPager = true;
        this.enablePreviousPager = true;
        if (this.thirdPager != this.totalNoOfPages) {
          this.enableLastPager = true;
          this.enableNextPager = true;
        }
        else {
          this.enableLastPager = false;
          this.enableNextPager = false;
        }
      }
      else if (position <= 3 && (this.thirdPager == 3 || pageNumber <= 3)) {
        this.firstPager = 1;
        if (this.showSecondPager)
          this.secondPager = 2;
        if (this.showThirdPager)
          this.thirdPager = 3;
        if (this.showFourthPager)
          this.fourthPager = 4;
        if (this.showFifthPager)
          this.fifthPager = 5;
        this.selectedPageValue = pageNumber;
        this.enableFirstPager = false;
        this.enablePreviousPager = false;
        if (this.selectedPageValue != 1) {
          this.enableFirstPager = true;
          this.enablePreviousPager = true;
        }
      }
      else if (position <= 3) {
        this.selectedPageValue = pageNumber;
        this.firstPager = pageNumber - 2 == 0 ? 1 : pageNumber - 2;
        if (this.showSecondPager)
          this.secondPager = pageNumber - 1 == this.firstPager ? pageNumber : pageNumber - 1;
        if (this.showThirdPager)
          this.thirdPager = pageNumber == this.secondPager ? pageNumber : pageNumber;
        if (this.showFourthPager)
          this.fourthPager = pageNumber + 1;
        if (this.showFifthPager)
          this.fifthPager = pageNumber + 2;
        this.enableFirstPager = false;
        this.enablePreviousPager = false;
      }
    }
    if (this.totalNoOfPages == this.selectedPageValue) {
      this.enableLastPager = false;
      this.enableNextPager = false;
    }
    else {
      this.enableLastPager = true;
      this.enableNextPager = true;
    }
    if (this.selectedPageValue == 1) {
      this.enableFirstPager = false;
      this.enablePreviousPager = false;
    }
    else {
      this.enableFirstPager = true;
      this.enablePreviousPager = true;
    }
    //API call
    this.pageNo = this.selectedPageValue - 1;
    this.getEmployeesOfSiteByPageAndSize(this.pageNo, this.size);

  }

  pagerClicked(pageIndex: string) {
    if (pageIndex === "last") {
      if (this.showFifthPager && this.showFourthPager && this.showThirdPager && this.showSecondPager) {
        this.fifthPager = this.totalNoOfPages;
        this.fourthPager = this.totalNoOfPages - 1;
        this.thirdPager = this.totalNoOfPages - 2;
        this.secondPager = this.totalNoOfPages - 3;
        this.firstPager = this.totalNoOfPages - 4;
      }
      else if (this.showFourthPager && this.showThirdPager && this.showSecondPager) {
        this.fourthPager = this.totalNoOfPages;
        this.thirdPager = this.totalNoOfPages - 1;
        this.secondPager = this.totalNoOfPages - 2;
        this.firstPager = this.totalNoOfPages - 3;
      }
      else if (this.showThirdPager && this.showSecondPager) {
        this.thirdPager = this.totalNoOfPages;
        this.secondPager = this.totalNoOfPages - 1;
        this.firstPager = this.totalNoOfPages - 2;
      }
      else if (this.showSecondPager) {
        this.secondPager = this.totalNoOfPages;
        this.firstPager = this.totalNoOfPages - 1;
      }

      this.selectedPageValue = this.totalNoOfPages;
      this.enableLastPager = false;
      this.enableNextPager = false;
      this.enableFirstPager = true;
      this.enablePreviousPager = true;
    }
    else if (pageIndex === "next") {
      //alert(this.selectedPageValue);
      if (this.selectedPageValue <= 2) {
        this.selectedPageValue = this.selectedPageValue + 1;
        this.enableFirstPager = true;
        this.enablePreviousPager = true;
        this.enableLastPager = true;
        this.enableNextPager = true;
      }
      else {
        this.selectedPageValue = this.selectedPageValue + 1;
        if (this.showFifthPager && this.showFourthPager && this.showThirdPager && this.showSecondPager) {
          this.firstPager = this.selectedPageValue - 2;
          this.secondPager = this.selectedPageValue - 1;
          this.thirdPager = this.selectedPageValue;
          this.fourthPager = this.selectedPageValue + 1;
          this.fifthPager = this.selectedPageValue + 2;
          if (this.totalNoOfPages < (this.secondPager) || this.totalNoOfPages < (this.thirdPager) || this.totalNoOfPages < (this.fourthPager) || this.totalNoOfPages < (this.fifthPager)) {
            this.fifthPager = this.totalNoOfPages;
            this.fourthPager = this.totalNoOfPages - 1;
            this.thirdPager = this.totalNoOfPages - 2;
            this.secondPager = this.totalNoOfPages - 3;
            this.firstPager = this.totalNoOfPages - 4;
          }
        }
        else if (this.showFourthPager && this.showThirdPager && this.showSecondPager) {
          this.firstPager = this.selectedPageValue - 1;
          this.secondPager = this.selectedPageValue;
          this.thirdPager = this.selectedPageValue + 1;
          this.fourthPager = this.selectedPageValue + 2;
          if (this.totalNoOfPages < (this.secondPager) || this.totalNoOfPages < (this.thirdPager) || this.totalNoOfPages < (this.fourthPager)) {
            this.fourthPager = this.totalNoOfPages;
            this.thirdPager = this.totalNoOfPages - 1;
            this.secondPager = this.totalNoOfPages - 2;
            this.firstPager = this.totalNoOfPages - 3;
          }
        }
        else if (this.showThirdPager && this.showSecondPager) {
          this.firstPager = this.selectedPageValue;
          this.secondPager = this.selectedPageValue + 1;
          this.thirdPager = this.selectedPageValue + 2;
          if (this.totalNoOfPages < (this.secondPager) || this.totalNoOfPages < (this.thirdPager)) {
            this.thirdPager = this.totalNoOfPages;
            this.secondPager = this.totalNoOfPages - 1;
            this.firstPager = this.totalNoOfPages - 2;
          }
        }
        else if (this.showSecondPager) {
          this.firstPager = this.selectedPageValue;
          this.secondPager = this.selectedPageValue + 1;
          if (this.totalNoOfPages < this.secondPager) {
            this.secondPager = this.totalNoOfPages;
            this.firstPager = this.totalNoOfPages - 1;
          }
        }

        this.enableFirstPager = true;
        this.enablePreviousPager = true;
        this.enableLastPager = true;
        this.enableNextPager = true;
        // if (this.totalNoOfPages < (this.secondPager) || this.totalNoOfPages < (this.thirdPager) || this.totalNoOfPages < (this.fourthPager) || this.totalNoOfPages < (this.fifthPager)) {
        //   this.fifthPager = this.totalNoOfPages;
        //   this.fourthPager = this.totalNoOfPages - 1;
        //   this.thirdPager = this.totalNoOfPages - 2;
        //   this.secondPager = this.totalNoOfPages - 3;
        //   this.firstPager = this.totalNoOfPages - 4;
        // }
        if (this.totalNoOfPages == this.selectedPageValue) {
          this.enableLastPager = false;
          this.enableNextPager = false;
        }
      }

    }
    else if (pageIndex === "previous") {
      this.selectedPageValue = this.selectedPageValue - 1;
      if (this.selectedPageValue != 1) {
        if (this.fifthPager == this.totalNoOfPages && (this.selectedPageValue == this.fourthPager || this.selectedPageValue == this.thirdPager)) {
          this.enableLastPager = true;
          this.enableNextPager = true;
        }
        else if (this.selectedPageValue >= 3) {
          this.firstPager = this.selectedPageValue - 2;
          this.secondPager = this.selectedPageValue - 1;
          this.thirdPager = this.selectedPageValue;
          this.fourthPager = this.selectedPageValue + 1;
          this.fifthPager = this.selectedPageValue + 2;
          this.enableFirstPager = true;
          this.enablePreviousPager = true;
        }
      }
      else {
        this.enableFirstPager = false;
        this.enablePreviousPager = false;
      }
    }
    else { //first
      if (this.showFifthPager && this.showFourthPager && this.showThirdPager && this.showSecondPager) {
        this.firstPager = 1;
        this.secondPager = 2;
        this.thirdPager = 3;
        this.fourthPager = 4;
        this.fifthPager = 5;
      }
      else if (this.showFourthPager && this.showThirdPager && this.showSecondPager) {
        this.firstPager = 1;
        this.secondPager = 2;
        this.thirdPager = 3;
        this.fourthPager = 4;
      }
      else if (this.showThirdPager && this.showSecondPager) {
        this.firstPager = 1;
        this.secondPager = 2;
        this.thirdPager = 3;
      }
      else if (this.showSecondPager) {
        this.firstPager = 1;
        this.secondPager = 2;
      }

      this.selectedPageValue = 1;
      this.enableFirstPager = false;
      this.enablePreviousPager = false;
      this.enableLastPager = true;
      this.enableNextPager = true;
    }

    //API call
    this.pageNo = this.selectedPageValue - 1;
    this.getEmployeesOfSiteByPageAndSize(this.pageNo, this.size);
  }

  lineChartData: ChartDataSets[];

  //Labels shown on the x-axis
  lineChartLabels: Label[];

  // Define chart options
  lineChartOptions: ChartOptions = {
    responsive: true
  };

  // Define colors of chart segments
  lineChartColors: Color[] = [
    { // dark grey
      backgroundColor: 'white',
      borderColor: '#2B5F8F',
    },
    { // red
      backgroundColor: 'white',
      borderColor: '#BC1D19',
    }
  ];

  // Set true to show legends
  lineChartLegend = true;

  // Define type of chart

  lineChartPlugins = [];

  // events
  lineChartClicked(event: any) {
    //console.log(event);
  }

  lineChartHovered(event: any) {
    // console.log(event);
  }

  doughnutOptions: ChartOptions = {
    responsive: true,
    //cutoutPercentage: 65,
    maintainAspectRatio: true,
    plugins: {
      datalabels: {
        color: 'white',
        formatter: (value, ctx) => {
          var perc = ((value * 100) / this.sum).toFixed(2) + "%";
          return perc;
        },
      }
      // labels: {
      //   render: 'Percentage',
      //   fontColor: ['black', 'white', 'green'],
      //   fontSize:20,
      //   precision: 2
      // }
    },
    // title: {
    //   display: true,
    //   fontFamily: "quicksand-medium",
    //   fontSize: 16,
    //   fontColor: "#747d8c"
    // },
    legend: {
      display: true,
      position: 'left'
    },
  };
  sum: number = 0;
  demodoughnutChartData: SingleDataSet = [];
  doughnutChartLabels: Label[] = ['Low', 'Normal', 'High'];
  doughnutChartType: ChartType = 'doughnut';
  doughnutChartPlugins = [<PluginServiceGlobalRegistration>pluginDataLabels];
  pieChartLegend = true;
  chartColors = [{
    backgroundColor: ['#BC1D19', '#3D85C6', '#2B5F8F'],
  }];

  showBeaconList(zoneId: string) {
    this.dialog.open(BeaconListModalComponent, {
      data: {
        siteId: this.selectedSiteId, zoneId: zoneId
      }
    });
  }

  navigateToZoneDashboard(zoneId: string) {
    this.router.navigate(["live-zone"], {
      queryParams: {
        zoneId: zoneId, cityId: this.selectedCityId, plantId: this.selectedPlantId,
        siteId: this.selectedSiteId
      }
    });
  }

  mousemove(event: any) {
    var offsetTop = this.removeDecimalPart(this.canvasupper.nativeElement.getBoundingClientRect().top);
    var offsetLeft = this.removeDecimalPart(this.canvasupper.nativeElement.getBoundingClientRect().left);
    var mouseX = event.pageX - parseInt(offsetLeft);
    var mouseY = event.pageY - parseInt(offsetTop);
    this.ctxUpper.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
    var zone = this.getClickedZoneFromzones(mouseX, mouseY);


    if (zone) {
      this.ctxUpper.textBaseline = 'top';
      let text: string;
      text = "    " + zone['zoneName'] + "    ";
      var width = this.ctxUpper.measureText(text).width;
      var xCoordinate = this.getXcoordinateForTitle(this.canvasWidth, event.pageX, parseInt(offsetLeft), width);

      this.ctxUpper.fillStyle = 'rgba(12, 12, 12, 0.6)';
      this.ctxUpper.fillRect(xCoordinate + 1, mouseY - 3, width, parseInt("20px", 10));
      this.ctxUpper.fillStyle = '#fff';
      this.ctxUpper.fillRect(xCoordinate, mouseY - 5, width - 1, parseInt("19px", 10));

      this.ctxUpper.fillStyle = '#000';

      this.ctxUpper.shadowColor = 'green';
      this.ctxUpper.font = "12px Arial";
      this.ctxUpper.fillText(text, xCoordinate, mouseY - 1);
      this.ctxUpper.restore();
    }
  }
  removeDecimalPart(value: any) {
    var number = '' + value;
    var args = number.split(".", 2);
    return args[0];
  }

  getXcoordinateForTitle(canvasWidth: any, pageX: any, offsetLeft: number, textWidth: number) {
    var divWidth = this.canvasDiv.nativeElement.offsetWidth;

    if (canvasWidth > divWidth) {
      canvasWidth = divWidth;
      //pageX = pageX + (jQuery("#employeZone").width());
    }

    if (((canvasWidth + offsetLeft) - pageX) < textWidth) {
      return (pageX - offsetLeft) - textWidth;
    } else {
      return pageX - offsetLeft;
    }
  }

  getClickedZoneFromzones(x: any, y: any) {
    var zone;
    if (this.zones) {
      for (var index = 0; index < this.zones.length; index++) {
        var zoneXcoordinates = this.zones[index].zoneXAxisCoordinates;
        var zoneYcoordinates = this.zones[index].zoneYAxisCoordinates;
        var vertices = zoneXcoordinates.length - 1;

        if (this.checkPointLieInPolygon(vertices, zoneXcoordinates, zoneYcoordinates, x, y)) {
          zone = this.zones[index];
          return zone;
        }
        return;
      }
    }
    return zone;

  }

  checkPointLieInPolygon(nvert: any, vertx: any, verty: any, testx: any, testy: any) {
    var i, j, c = false;
    for (i = 0, j = nvert - 1; i < nvert; j = i++) {
      if (((verty[i] > testy) != (verty[j] > testy)) &&
        (testx < (vertx[j] - vertx[i]) * (testy - verty[i]) / (verty[j] - verty[i]) + vertx[i])) {
        c = !c;
      }

    }
    return c;
  }

  drawZoneWithEmployeeCount(ctx: CanvasRenderingContext2D) {
    // let zoneId='5e29c57266b5860001b3a5c8';

    this.zones.sort((a: any, b: any) => Math.min(...a.zoneXAxisCoordinates) <= Math.min(...b.zoneXAxisCoordinates) ? -1 : 1);
    for (let i = 0; i < Object.keys(this.zones).length; i++) {
      let box: any = {};
      let k = 0;
      let move: any;
      let line: Array<any> = [];
      let minX = 0;
      let minY = 0;
      if (this.zones[i].zoneXAxisCoordinates.length > 0) {
        minX = this.zones[i].zoneXAxisCoordinates.reduce((prev: any, curr: any) => prev < curr ? prev : curr);
      }

      if (this.zones[i].zoneYAxisCoordinates.length > 0) {
        minY = this.zones[i].zoneYAxisCoordinates.reduce((prev: any, curr: any) => prev < curr ? prev : curr);
      }

      // ctx.fillStyle = "blue";
      ctx.font = "bold 16px Arial";
      move = { x: this.zones[i].zoneXAxisCoordinates[k], y: this.zones[i].zoneYAxisCoordinates[k] };
      for (k = 1; k < this.zones[i].zoneXAxisCoordinates.length; k++) {
        line.push({ x: this.zones[i].zoneXAxisCoordinates[k], y: this.zones[i].zoneYAxisCoordinates[k] });

      }
      box["lineStyle"] = "black";
      box["fillStyle"] = this.hexToRgb(this.zones[i].color, 0.35);
      box["moveTo"] = move;
      box["lineTo"] = line;
      var coordinates = this.getPolygonCentroid(Object.assign([], line));
      //if(data[i].zoneId==zoneId){
      //console.log("zoneName",data[i].zoneName,zoneId,data[i].zoneId);
      // DrawingZoneBeacon.drawImage(coordinates.x - 7, coordinates.y, ctx, employeeImage, 16, 12);
      this.drawImage(coordinates.x, coordinates.y, ctx, 16, 12);
      //}
      //   if (employeeCount) {
      //    ctx.fillText(employeeCount, coordinates.x, coordinates.y);
      //  }
      ctx.globalAlpha = 1;
      this.drawBox(box, ctx, this.zones.indexOf(this.zones[i]) + 1, minX, minY, i + 1);

      if (this.zones[i].listOfBeacon != null) {
        for (let j = 0; j < this.zones[i].listOfBeacon.length; j++) {
          this.drawBeacon(this.zones[i].listOfBeacon[j].beaconXAxisCoordinate, this.zones[i].listOfBeacon[j].beaconYAxisCoordinate, ctx);
        }
      }


    }
  }

  drawBox(box: any, ctx: any, boxLabel: any, min_x: any, min_y: any, boxIndex?: any) {
    ctx.beginPath();
    ctx.globalAlpha = 1;
    ctx.font = 'bold 12pt Calibri';
    ctx.fillStyle = 'black';
    ctx.textAlign = 'center';
    ctx.fillText(boxIndex, min_x + 10, min_y + 12);
    ctx.moveTo(box.moveTo.x, box.moveTo.y);
    for (var i = 0; i < box.lineTo.length; i++) {
      ctx.lineTo(box.lineTo[i].x, box.lineTo[i].y);
    }
    ctx.closePath();
    ctx.fillStyle = box.fillStyle;
    ctx.fill();
    ctx.lineWidth = 1;
    ctx.strokeStyle = box.lineStyle;

    ctx.stroke();

  }

  drawBeacon(xCoordinates: any, yCoordinates: any, ctx: any) {
    ctx.drawImage(this.myImage, xCoordinates - 15, yCoordinates - 11, 12, 12);

  }
  drawImage(xCoordinates: any, yCoordinates: any, ctx: any, height: any, width: any) {

    //ctx.drawImage(this.myImage, xCoordinates - 15, yCoordinates - 11, height, width);
  }

  getPolygonCentroid(pts: any) {
    var first = pts[0], last = pts[pts.length - 1];
    var twicearea = 0,
      x = 0, y = 0, f = 0,
      nPts = pts.length,
      p1, p2;
    if (first && last) {
      if (first.x != last.x || first.y != last.y) pts.push(first);
      for (var i = 0, j = nPts - 1; i < nPts; j = i++) {
        p1 = pts[i]; p2 = pts[j];
        f = p1.x * p2.y - p2.x * p1.y;
        twicearea += f;
        x += (p1.x + p2.x) * f;
        y += (p1.y + p2.y) * f;
      }
      f = twicearea * 3;
    }
    return { x: x / f, y: y / f };
  }

  hexToRgb(hex: any, opacity: any) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? "rgba(" + parseInt(result[1], 16) + "," + parseInt(result[2], 16) + "," + parseInt(result[3], 16) + "," + opacity + ")" : null;
  }

  highlightZone(index: any) {
    let zonArray = [];
    this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
    this.drawZoneWithEmployeeCountHighlight(this.zones, this.ctx, this.myImage);
    zonArray.push(this.zones[index]);
    this.drawZoneWithEmployeeCountHighlight(zonArray, this.ctx, this.myImage, index);

  }

  drawZoneWithEmployeeCountHighlight(data: Array<any>, ctx: CanvasRenderingContext2D, image: any, countIndex?: any) {
    // let zoneId='5e29c57266b5860001b3a5c8';

    data.sort((a, b) => Math.min(...a.zoneXAxisCoordinates) <= Math.min(...b.zoneXAxisCoordinates) ? -1 : 1);

    for (let i = 0; i < data.length; i++) {
      let box: any = {};
      let k = 0;
      let move: any;
      let line: Array<any> = [];
      let minX = 0;
      let minY = 0;
      if (data[i].zoneXAxisCoordinates.length > 0) {
        minX = data[i].zoneXAxisCoordinates.reduce((prev: any, curr: any) => prev < curr ? prev : curr);
      }

      if (data[i].zoneYAxisCoordinates.length > 0) {
        minY = data[i].zoneYAxisCoordinates.reduce((prev: any, curr: any) => prev < curr ? prev : curr);
      }

      ctx.fillStyle = "blue";
      ctx.font = "bold 16px Arial";
      move = { x: data[i].zoneXAxisCoordinates[k], y: data[i].zoneYAxisCoordinates[k] };
      for (k = 1; k < data[i].zoneXAxisCoordinates.length; k++) {
        line.push({ x: data[i].zoneXAxisCoordinates[k], y: data[i].zoneYAxisCoordinates[k] });
      }
      box["lineStyle"] = "green";
      box["fillStyle"] = this.hexToRgb(data[i].color, 0.35);
      box["moveTo"] = move;
      box["lineTo"] = line;
      var coordinates = this.getPolygonCentroid(Object.assign([], line));
      if (countIndex) {
        if (data[i].zoneId == this.zones[countIndex].zoneId) {
          //console.log("zoneName", data[i].zoneName, this.zones[countIndex].zoneId, data[i].zoneId);
          // DrawingZoneBeacon.drawImage(coordinates.x - 7, coordinates.y, ctx, employeeImage, 16, 12);
          this.drawImage(coordinates.x, coordinates.y, ctx, 16, 12);
        }
      }
      ctx.globalAlpha = 1;
      if (countIndex) {
        box["fillStyle"] = this.hexToRgb(data[i].hoverColor, 0.35);
        this.drawBox(box, ctx, countIndex, minX, minY, i + 1);
      }
      else {
        box["fillStyle"] = this.hexToRgb(data[i].color, 0.35);
        this.drawBox(box, ctx, i + 1, minX, minY, i + 1);
      }

      if (data[i].listOfBeacon != null) {
        for (let j = 0; j < data[i].listOfBeacon.length; j++) {
          this.drawBeacon(data[i].listOfBeacon[j].beaconXAxisCoordinate, data[i].listOfBeacon[j].beaconYAxisCoordinate, ctx);
        }
      }
    }
  }
}