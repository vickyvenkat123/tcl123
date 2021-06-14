import { Component, OnInit } from '@angular/core';
import { ChartType, ChartDataSets, ChartOptions } from 'chart.js';
import { Color, Label, MultiDataSet, SingleDataSet } from 'ng2-charts';
import { KpiService } from 'src/app/core/services/kpi.service';
import { GatewayService } from 'src/app/core/services/gateway.service';
import { GatewaysCountDo, NetworkUptimeDto, CityCountDO } from 'src/app/shared/models/gateways-count-do.model';
import { DatePipe } from '@angular/common';
import { FormGroup, FormControl } from '../../../../../../node_modules/@angular/forms';
import { any } from '@amcharts/amcharts4/.internal/core/utils/Array';

@Component({
  selector: 'app-kpi',
  templateUrl: './kpi.component.html',
  styleUrls: ['./kpi.component.css'],
})
export class KpiComponent implements OnInit {
  networkStatusData: GatewaysCountDo = new GatewaysCountDo(); 
  chartOptions: any;
  chartColors: any;
  ExportData : any;
  doughnutChartLabels: string[] = [];
  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl()
  });
  public doughnutChartData: MultiDataSet = [
    [350, 450, 100],
  ];
  //   public doughnutChartColors: any[] = 
  // [
  //     {
  //         backgroundColor: 'rgba(177,200,84,0.2)'
  //     }
  // ]
  doughnutChartType: ChartType = 'doughnut';
  pageNo: number = 0;
  size: number = 10;
  sizeChanged: boolean = false;
  totalNoOfPages: number = 0;
  lineChartType: ChartType = 'line';
  public barChartOptions: ChartOptions = {
    responsive: true,
  };

  public date = new Date();

  kpiAlertData: any;
  kpiSOSData: any;
  kpiBatteData: any;
  Date!: Date;
  kpicalender: any;
  kpiExportData: any;
  getKPIExportData: any;

  constructor(private kpi: KpiService, private gatewayService: GatewayService, private datePipe: DatePipe,) { }
 

  ngOnInit(): void {
    this.chartOptions = {
      responsive: true,
      cutoutPercentage: 90,
      maintainAspectRatio: false,
      title: {
        display: true,
        fontFamily: 'quicksand-medium',
        fontSize: 16,
        fontColor: '#747d8c',
      },
      legend: {
        display: true,
      },
      tooltips: {
        displayColors: false,
      },
    };
    this.getKPIcalender();
    this.Date = new Date();
    // this.getKPISOS();
    this.getKPIBattery();
    this.getKPIAlerts()
      ;
      this.getKPIExportData();
  }
  getKPIcalender() {
    this.kpi.getkpicalender().subscribe((res: any) => {
      this.getKPIcalender = res;
      console.log(res);
    })
  }
  // events
  chartClicked(e: any): void {
    //console.log(e);
  }

  chartHovered(e: any): void {
    //console.log(e);
  }
  lineChartData: ChartDataSets[] = [
    { data: [1, 3, 27, 8, 12, 5], label: 'Hazardous' },
    { data: [0, 13, 10, 16, 6, 2], label: 'SOS' },
  ];

  //Labels shown on the x-axis
  lineChartLabels: Label[] = [
    '23-04-2021',
    '22-04-2021',
    '21-04-2021',
    '20-04-2021',
    '19-04-2021',
    '18-04-2021',
  ];

  // Define chart options
  lineChartOptions: ChartOptions = {
    responsive: true,
  };

  // Define colors of chart segments
  lineChartColors: Color[] = [
    {
      // dark grey
      backgroundColor: 'white',
      borderColor: '#2B5F8F',
    },
    {
      // red
      backgroundColor: 'white',
      borderColor: '#BC1D19',
    },
  ];

  // Set true to show legends
  lineChartLegend = true;

  // Define type of chart

  lineChartPlugins = [];

  // events
  lineChartClicked(event: any) {
    console.log(event);
  }

  lineChartHovered(event: any) {
    console.log(event);
  }
  public barChartLabels: Label[] = [
    '2006',
    '2007',
    '2008',
    '2009',
    '2010',
    '2011',
    '2012',
  ];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  public barChartPlugins = [];

  public barChartData: ChartDataSets[] = [
    { data: [65, 59, 80, 81, 56, 55, 40], label: 'Live mobile' },
    { data: [28, 48, 40, 19, 86, 27, 90], label: 'Total mobile' },
  ];

  //SOS
  // getKPISOS() {
  //   this.kpi.getkpiSOS().subscribe(res => {
  //     this.kpiSOSData = res;
  //     console.log(res);
  //   });
  // }


  //Battery
  getKPIBattery() {
    this.kpi.getkpiBattery().subscribe(res => {
      this.kpiBatteData = res;
      console.log(res);
    })
  }



  //Alerts
  getKPIAlerts() {
    this.kpi.getkpiBell().subscribe((res) => {
      this.kpiAlertData = res;
      console.log(res);
    });
    
  }

  networkStatus() {
    this.gatewayService.getNetworkStatus(sessionStorage.getItem("customerId") || "").subscribe(
      (result: any) => {
        this.networkStatusData = result.data;
        if (this.networkStatusData.networkUptime.toString().indexOf('.') != -1) {
          this.networkStatusData.networkUptime = Number(this.networkStatusData.networkUptime.toString().substring(0, this.networkStatusData.networkUptime.toString().indexOf('.') + 3));
        }
        console.log("networkStatusData" + this.networkStatusData)
      })
  }
  getExportData(){
    this.kpi.getKPIExport().subscribe((res)=>{
      this.kpiExportData=res;
      console.log(res);
    })
  }
}