import { Component, OnInit } from '@angular/core';
import { CustomerConfigService } from 'src/app/core/services/customer-config.service';
import { DashboardService } from 'src/app/core/services/dashboard.service';
import { City, Customer, Plant } from 'src/app/shared/models/customer-details.model';
import { CardStatusDto, CardUtilizationResponse, UtilizationDashboardDto } from 'src/app/shared/models/utilization-dashboard-dto.model';
import { ChartDataSets, ChartOptions, ChartType, PluginServiceGlobalRegistration } from 'chart.js';
import { FormBuilder } from '@angular/forms';
import * as fs from 'file-saver';
import { DatePipe } from '@angular/common';
import { ErrorModalComponent } from '../../error-modal/error-modal.component';
import { MatDialog } from '@angular/material/dialog';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import * as pluginDataLabels from 'chartjs-plugin-datalabels';
import { Color, Label } from 'ng2-charts';

@Component({
  selector: 'app-utilization-dashboard',
  templateUrl: './utilization-dashboard.component.html',
  styleUrls: ['./utilization-dashboard.component.css']
})
export class UtilizationDashboardComponent implements OnInit {

  constructor(private customerConfigService: CustomerConfigService, private dashboardService: DashboardService, private formBuilder: FormBuilder, private dialog: MatDialog,) { }

  customers: Customer[] = new Array<Customer>();
  customerNames: string[] = new Array<string>();
  cities: City[] = new Array<City>();
  cityNames: string[] = new Array<string>('All');
  plants: Plant[] = new Array<Plant>();
  plantNames: string[] = new Array<string>('All');
  selectedCustomer: string = "";
  selectedCity: string = "All";
  selectedPlant: string = "All";
  customerId: string = sessionStorage.getItem("customerId") || "";
  cityId: string = "All";
  plantId: string = "All";
  utilizationDashboardDto: UtilizationDashboardDto = new UtilizationDashboardDto();
  cardStatusDto: CardStatusDto[] = new Array<CardStatusDto>();
  cardsDetectedArray: number[] = new Array<number>();
  cardsNotDetectedArray: number[] = new Array<number>();
  inactiveCardsArray: number[] = new Array<number>();
  reportDateArray: string[] = new Array<string>();
  cardUtilizationResponse: CardUtilizationResponse = new CardUtilizationResponse();
  countDataFetched: boolean = false;
  chartOptions: any;
  datePipe: DatePipe = new DatePipe('en-US');
  chartColors: any;
  chartColorsForDistributed :any= [{
    backgroundColor: ['#3D85C6','#BC1D19'],
  }];
  doughnutChartLabels: string[] = ['Distributed Cards', 'Non Distributed Cards'];
  doughnutChartLabelsForDistributed: string[] = ['Cards Detected', 'Cards Not Detected'];
  demodoughnutChartData: number[] = new Array<number>();
  demodoughnutChartDataForDistributed: number[] = new Array<number>();
  doughnutChartPlugins = [<PluginServiceGlobalRegistration>pluginDataLabels];
  doughnutOptions: ChartOptions = {
    responsive: true,
    //cutoutPercentage: 65,
    maintainAspectRatio: true,
    plugins: {
      datalabels: {
        color: 'white',
      }
    },
    legend: {
      display: true,
      position: 'left'
    },
  };
  doughnutChartType: ChartType = 'doughnut';
  Amcharts: any;
  exportForm = this.formBuilder.group({
    reportType: "totalCards"
  });

  exportUtilizationForm = this.formBuilder.group({
    reportType: "",
    dateForExport: new Date(),
    city: "All"
  });
  exportDate: string = "";
  lineChartLegend = true;
  lineChartType: ChartType = 'line';
  lineChartColors: Color[] = [
    { 
      backgroundColor: 'white',
      borderColor: '#2B5F8F',
    },
    { 
      backgroundColor: 'white',
      borderColor: '#3D85C6',
    },
    {
      backgroundColor:'white',
      borderColor:'#BC1D19'
    }

  ];

  // Define type of chart

  lineChartPlugins = [];

  chart: any;
  lineChartData: ChartDataSets[];

  //Labels shown on the x-axis
  lineChartLabels: Label[];

  // Define chart options
  lineChartOptions: ChartOptions = {
    responsive: true
  };
  safteyDataReceived:boolean = false;

  ngOnInit(): void {
    this.getCustomerList();
    this.getUtilizationCount();
    this.getCitiesByCustomerId();
    this.getCardUtilizationTrends();
    this.getCardUtilizationStauts();
    this.chartOptions = {
      responsive: true,
      cutoutPercentage: 90,
      maintainAspectRatio: false,
      title: {
        display: true,
        fontFamily: "quicksand-medium",
        fontSize: 16,
        fontColor: "#747d8c"
      },
      legend: {
        display: true
      },
      tooltips: {
        displayColors: false
      }
    };
    this.chartColors = [{
      backgroundColor: ['#3D85C6', '#2B5F8F'],
    }];
  }

  getUtilizationCount() {
    this.dashboardService.getCardUtilizationCount(this.customerId, this.cityId, this.plantId).subscribe((res: any) => {
      this.utilizationDashboardDto = res.data;
      this.countDataFetched = true;
      this.demodoughnutChartData.push(this.utilizationDashboardDto.distributed);
      this.demodoughnutChartData.push(this.utilizationDashboardDto.badges- this.utilizationDashboardDto.distributed);
      this.demodoughnutChartDataForDistributed.push(this.utilizationDashboardDto.workingBadges)
      this.demodoughnutChartDataForDistributed.push(this.utilizationDashboardDto.nonCommunicatingBadges)
    }
    )
  }

  getCitiesByCustomerId() {
    this.customerConfigService.getCities(this.customerId).subscribe((res: any) => {
      if (res.status == 200) {
        this.cities = res.data;
        this.cities.forEach(element => {
          this.cityNames.push(element.cityName);
        });
      }
    })
  }

  getCardUtilizationTrends() {
    this.dashboardService.getCardUtilizationTrends(this.customerId, this.cityId, this.plantId).subscribe((res: any) => {
       this.cardStatusDto = res.data;
       var cardDetecedArray = this.cardStatusDto.map(distributed => distributed.cardDeteced);
      var cardNotDetecedArray = this.cardStatusDto.map(distributed => distributed.cardNotDetected);
      var cardsNotOnNetworkArray = this.cardStatusDto.map(distributed => distributed.inActiveCards);
      var reportDatesArray = this.cardStatusDto.map(rd => this.datePipe.transform(rd.reportDate, 'yyyy-MM-dd')?.toString() || '');
      this.lineChartData = [
        { data: cardDetecedArray, label: 'Cards Detected' },
        { data: cardNotDetecedArray, label: 'Cards Not Detected' },
        { data: cardsNotOnNetworkArray, label: 'Cards Not On Network' }
      ];
      this.lineChartLabels = reportDatesArray;
      this.safteyDataReceived = true;
      
      //  var chart = am4core.create("chartdiv", am4charts.XYChart);

      // chart.data = this.cardStatusDto;

      // /* Create axes */
      // var dateAxis = chart.xAxes.push(new am4charts.DateAxis());

      // /* Create value axis */
      // var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());

      // /* Create series */
      // var series1 = chart.series.push(new am4charts.LineSeries());
      // series1.dataFields.valueY = "cardDeteced";
      // series1.dataFields.dateX = "reportDate";
      // series1.name = "Cards Detected";
      // series1.stroke = am4core.color("#FCD202");
      // series1.strokeWidth = 1;
      // let bullet = series1.bullets.push(new am4charts.Bullet());

      // var square = bullet.createChild(am4core.Rectangle);
      // square.width = 8;
      // square.height = 8;

      // // Add outline to the square bullet
      // square.fill = am4core.color("#FCD202");

      // var series2 = chart.series.push(new am4charts.LineSeries());
      // series2.dataFields.valueY = "inActiveCards";
      // series2.dataFields.dateX = "reportDate";
      // series2.name = "Inactive Cards";
      // series2.stroke = am4core.color("#B0DE09");
      // series2.strokeWidth = 1;
      // bullet = series2.bullets.push(new am4charts.Bullet());

      // var arrow = bullet.createChild(am4core.Triangle);
      // arrow.horizontalCenter = "middle";
      // arrow.verticalCenter = "middle";
      // arrow.fill = am4core.color("#B0DE09");
      // arrow.direction = "top";
      // arrow.width = 8;
      // arrow.height = 8;

      // var series3 = chart.series.push(new am4charts.LineSeries());
      // series3.dataFields.valueY = "cardNotDetected";
      // series3.dataFields.dateX = "reportDate";
      // series3.name = "Cards Not Detected";
      // series3.stroke = am4core.color("#ff4d4d");
      // series3.strokeWidth = 1;
      // bullet = series3.bullets.push(new am4charts.Bullet());

      // var arrow = bullet.createChild(am4core.Triangle);
      // arrow.horizontalCenter = "middle";
      // arrow.verticalCenter = "middle";
      // arrow.fill = am4core.color("#ff4d4d");
      // arrow.direction = "top";
      // arrow.width = 8;
      // arrow.height = 8;

      // series3.tooltipText = `
      //  Detected  : {cardDeteced}
      //  Not On Network: {inActiveCards}
      //  Not Detected : {cardNotDetected}`;
      // series3.tooltip.pointerOrientation = "vertical";
      // series3.tooltip.autoTextColor = true;

      // /* Add legend */
      // chart.legend = new am4charts.Legend();

      // /* Create a cursor */
      // chart.cursor = new am4charts.XYCursor();
    });
  }

  getCardUtilizationStauts() {
    this.dashboardService.getCardUtilizationStauts(this.customerId, this.cityId, this.plantId).subscribe((res: any) => {
      //this.dashboardService.getbadgeUtilizationStauts(this.customerId).subscribe((res: any) => {
      this.cardUtilizationResponse = res.data;
    })
  }

  getCustomerList() {
    this.customerConfigService.getCustomersList().subscribe(
      (res: any) => {
        this.customers = res.data;
        this.customers.forEach(element => {
          this.customerNames.push(element.customerName);
        });
        if (this.customerNames.length == 1)
          this.selectedCustomer = this.customerNames[0];
      }
    )
  }
  customerChanged(event: any) {

  }

  cityChanged(event: any) {
    var selectedCity = event.value;
    this.plantNames = ["All"];
    if (selectedCity !== "All") {
      var cityId = this.cities.find(city => city.cityName === selectedCity)?.cityId;
      if (cityId) {
        this.cityId = cityId;

        this.customerConfigService.getPlantsDetailsByCityId(cityId.toString()).subscribe(
          (res: any) => {
            if (res.status == 200) {
              this.plants = res.data;
              this.plants.forEach(element => {
                this.plantNames.push(element.plantName);
              });
            }
          })
        this.getUtilizationCount();
        this.getCardUtilizationTrends();
        this.getCardUtilizationStauts();
      }
    }
    else {
      //All city selected
      this.cityId = this.selectedCity;
      this.getUtilizationCount();
      this.getCardUtilizationTrends();
      this.getCardUtilizationStauts();
    }
  }

  plantChanged(event: any) {
    var selectedPlant = event.value;
    if (selectedPlant !== "All") {
      var plantId = this.plants.find(plant => plant.plantName === selectedPlant)?.plantId;
      if (plantId) {
        this.plantId = plantId;
        this.getUtilizationCount();
        this.getCardUtilizationTrends();
        this.getCardUtilizationStauts();
      }
    }
    else {
      //All city selected
      this.plantId = this.selectedPlant;
      this.getUtilizationCount();
      this.getCardUtilizationTrends();
      this.getCardUtilizationStauts();
    }
  }

  // events
  chartClicked(e: any): void {
    //console.log(e);
  }

  chartHovered(e: any): void {
    //console.log(e);
  }

  export() {
    var reportType = "";
    if (this.exportForm.value.reportType === "totalCards") {
      reportType = "TOTAL";
    }
    else if (this.exportForm.value.reportType === "distributedCards") {
      reportType = "DISTRIBUTED";
    }
    else if (this.exportForm.value.reportType === "liveCards") {
      reportType = "LIVE";
    }
    else {
      reportType = "Non_COMMUNICATION";
    }
    this.dashboardService.exportCardsDataByReportType(this.customerId, reportType, this.cityId, this.plantId).
      subscribe((res: any) => {
        var headers = res.headers.get('Content-disposition').toString();
        var fileName = headers.substring((headers.indexOf('=') + 1), headers.length);
        let blob = new Blob([res], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        fs.saveAs(blob, fileName);
      })

  }

  exportUtilization() {
    if (this.exportUtilizationForm.value.reportType === "") {
      //focus on report type select box
      return;
    }
    var cityId = "";
    if (this.exportUtilizationForm.value.city !== "All") {
      cityId = this.cities.find(city => city.cityName === this.exportUtilizationForm.value.city)?.cityId || '';
    }
    else {
      cityId = 'All';
    }
    this.exportDate = this.datePipe.transform(this.exportUtilizationForm.value.dateForExport, 'yyyy-MM-dd')?.toString() || '';
    this.dashboardService.exportUtilizationByType(this.exportUtilizationForm.value.reportType, this.customerId, cityId, this.exportDate).subscribe((res: any) => {
      if (res.headers.get('Content-disposition') != null) {
        var headers = res.headers.get('Content-disposition').toString();
        var fileName = headers.substring((headers.indexOf('=') + 1), headers.length);
        let blob = new Blob([res], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        fs.saveAs(blob, fileName);
      }
      else {
        this.dialog.open(ErrorModalComponent, {
          data: {
            message: "No Data Available.",
            header: "Error"
          }
        });
      }
    }
    )
  }

  lineChartClicked(event: any) {
    //console.log(event);
  }

  lineChartHovered(event: any) {
    // console.log(event);
  }
}
