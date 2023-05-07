import * as moment from 'moment';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexDataLabels,
  ApexFill,
  ApexPlotOptions,
  ApexTitleSubtitle,
  ApexXAxis,
  ApexYAxis,
  ChartComponent,
} from 'ng-apexcharts';
import { map } from 'rxjs';
import { Travel } from 'src/app/models/travel';
import { Helpers } from 'src/app/shared/material/Helpers';

import { Component, OnInit, ViewChild } from '@angular/core';

import { DataServiceService } from '../../../shared/service/data-service.service';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  yaxis: ApexYAxis;
  xaxis: ApexXAxis;
  fill: ApexFill;
  title: ApexTitleSubtitle;
};

@Component({
  selector: 'app-travel-chart',
  templateUrl: './travel-chart.component.html',
  styleUrls: ['./travel-chart.component.scss'],
})
export class TravelChartComponent implements OnInit {
  @ViewChild('chart') chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;
  travels: Travel[];
  monthsList = Helpers.monthList();
  test = new Date();
  months = [];
  monthCounts: number[] = [];
  userId = 'ea5eg'; // localStorage.getItem('userId');
  loading = false;
  constructor(private dataService: DataServiceService) {
    this.months = this.generateMonth();
    console.log(this.months, 'Month');
  }

  ngOnInit(): void {
    this.loading = true;
    this.dataService
      .getTravels()
      .snapshotChanges()
      .pipe(
        map((actions) =>
          actions
            .map((a) => {
              const data = a.payload.doc.data() as Travel;
              data.id = a.payload.doc.id;
              return { ...data };
            })
            .filter(
              (travel) =>
                travel.userId == this.userId &&
                new Date(travel.start).getFullYear() == new Date().getFullYear()
            )
        )
      )
      .subscribe((dates) => {
        for (let index = 0; index < this.monthsList.length; index++) {
          let count = 0;
          dates.forEach((element) => {
            count += new Date(element.start).getMonth() == index ? 1 : 0;
          });
          this.monthCounts.push(count);
        }
        console.log(this.monthCounts);
        this.loading = false;
        this.createChart(this.monthCounts);
      });
  }

  createChart(values) {
    this.chartOptions = {
      series: [
        {
          name: 'Anzahl',
          data: values,
        },
      ],
      chart: {
        height: 350,
        type: 'bar',
        background: '#f7f7f7',
      },
      plotOptions: {
        bar: {
          dataLabels: {
            position: 'top', // top, center, bottom
          },
        },
      },
      dataLabels: {
        enabled: false,
      },
      xaxis: {
        labels: {
          rotate: -45,
        },
        categories: this.months,
        tickPlacement: 'on',
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: true,
        },
        crosshairs: {
          fill: {
            type: 'gradient',
            gradient: {
              colorFrom: '#3f51b5',
              colorTo: '#3f51b5',
              stops: [0, 100],
              opacityFrom: 0.4,
              opacityTo: 0.5,
            },
          },
        },
        tooltip: {
          enabled: true,
          offsetY: -35,
        },
      },
      fill: {
        colors: ['#3f51b5'],
      },
      yaxis: {
        axisBorder: {
          show: true,
        },
        axisTicks: {
          show: true,
        },
        labels: {
          show: true,
          formatter: function (value) {
            return Math.round(value).toString();
          },
        },
      },
      title: {
        text: 'Anzahl Reise',
        floating: true,
        offsetY: 320,
        align: 'center',
        style: {
          color: '#444',
        },
      },
    };
  }

  generateMonth() {
    let list = [];
    for (let index = 0; index < 12; index++) {
      list.push(
        moment(new Date(new Date().getFullYear(), index, 1)).format('MMMM')
      );
    }
    return list;
  }
}
