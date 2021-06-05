import { Component, OnInit } from '@angular/core';
import { ChartType } from 'chart.js';
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

}
