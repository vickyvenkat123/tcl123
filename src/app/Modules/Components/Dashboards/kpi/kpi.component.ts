import { Component, OnInit } from '@angular/core';
import { ChartType, ChartDataSets, ChartOptions } from 'chart.js';
import { Color, Label, SingleDataSet } from 'ng2-charts';
@Component({
  selector: 'app-kpi',
  templateUrl: './kpi.component.html',
  styleUrls: ['./kpi.component.css']
})
export class KpiComponent implements OnInit {
  chartOptions: any;
  chartColors: any;
  doughnutChartLabels: string[] = ['Hot Zones', 'Live Zones'];
  demodoughnutChartData: number[] = [7280, 1];
  doughnutChartType: ChartType = 'doughnut';
  pageNo: number = 0;
  size: number = 10;
  sizeChanged: boolean = false;
  totalNoOfPages: number = 0;
  lineChartType: ChartType = 'line';
  public barChartOptions: ChartOptions = {
    responsive: true,
  };
  constructor() { }

  ngOnInit(): void {
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
    { data: [0, 13, 10, 16, 6, 2], label: 'SOS' }
  ];

  //Labels shown on the x-axis
  lineChartLabels: Label[] = ['23-04-2021', '22-04-2021', '21-04-2021', '20-04-2021', '19-04-2021', '18-04-2021'];

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
    console.log(event);
  }

  lineChartHovered(event: any) {
    console.log(event);
  }
  public barChartLabels: Label[] = ['2006', '2007', '2008', '2009', '2010', '2011', '2012'];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  public barChartPlugins = [];

  public barChartData: ChartDataSets[] = [
    { data: [65, 59, 80, 81, 56, 55, 40], label: 'Live mobile' },
    { data: [28, 48, 40, 19, 86, 27, 90], label: 'Total mobile' }
  ];

}
