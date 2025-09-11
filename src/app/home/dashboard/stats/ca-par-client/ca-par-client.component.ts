import { Component, ElementRef, Input, OnChanges, ViewChild } from '@angular/core';
import ApexCharts from 'apexcharts'; // Assurez-vous d'importer ApexCharts
import moment from 'moment';
import { ApiService } from 'src/app/service/api/api.service';

@Component({
  selector: 'app-ca-par-client',
  imports: [],
  templateUrl: './ca-par-client.component.html',
  styleUrl: './ca-par-client.component.css'
})
export class CaParClientComponent implements OnChanges{
  @ViewChild('myChartCanvas') canvasRef!: ElementRef<HTMLCanvasElement>;
  chart: any;
  @Input()
  les_stats: any = [];
  chart1: any;
  constructor(public api: ApiService) {

  }

  ngOnDestroy() {
    if (this.chart) {
      this.chart.destroy();
      this.chart = null;
    }
  }
  ngOnInit(): void {

  }
  ngOnChanges(changes: any): void {
    if (changes.les_stats.currentValue.ca_par_client) {
      this.les_stats=changes.les_stats.currentValue.ca_par_client;
      this.init_chart();
    }
  }
  init_chart() {
  const options = {
    series: [{
      name: 'Chiffre d’affaire',
      data: this.les_stats.map((p: any) => parseFloat(p.ca_client))
    }],
    chart: {
      height: 380,
      type: 'bar',
    },
    plotOptions: {
      bar: {
        borderRadius: 10,
        dataLabels: {
          position: 'top',
        },
      }
    },
    dataLabels: {
      enabled: true,
      formatter: function (val: number) {
        return val.toLocaleString() + ' FCFA';
      },
      offsetY: -20,
      style: {
        fontSize: '12px',
        colors: ["#304758"]
      }
    },
    xaxis: {
      categories: this.les_stats.map((p: any) => p.client),
      position: 'bottom',
      axisBorder: {
        show: false
      },
      axisTicks: {
        show: false
      },
      crosshairs: {
        fill: {
          type: 'gradient',
          gradient: {
            colorFrom: '#D8E3F0',
            colorTo: '#BED1E6',
            stops: [0, 100],
            opacityFrom: 0.4,
            opacityTo: 0.5,
          }
        }
      },
      tooltip: {
        enabled: true,
      }
    },
    yaxis: {
      axisBorder: {
        show: false
      },
      axisTicks: {
        show: false,
      },
      labels: {
        show: true,
        formatter: function (val: number) {
          return val.toLocaleString() + ' FCFA';
        }
      }
    },
    // title: {
    //   text: 'Chiffre d’affaires par client',
    //   floating: true,
    //   offsetY: 390,
    //   align: 'center',
    //   style: {
    //     color: '#444'
    //   }
    // },
    tooltip: {
      y: {
        formatter: function (val: number) {
          return val.toLocaleString() + ' FCFA';
        }
      }
    },
    legend: {
      show: false
    }
  };

  console.log("series", options.series);
  console.log("labels", options.xaxis.categories);

  if (this.chart) {
    this.chart.destroy();
  }
  this.chart = new ApexCharts(document.querySelector("#chart_ca_par_client"), options);
  this.chart.render();
}



}
