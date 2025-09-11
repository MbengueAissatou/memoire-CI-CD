import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import ApexCharts from 'apexcharts'; // Assurez-vous d'importer ApexCharts
import moment from 'moment';
import { ApiService } from 'src/app/service/api/api.service';

@Component({
  selector: 'app-taux-facturation',
  imports: [],
  templateUrl: './taux-facturation.component.html',
  styleUrl: './taux-facturation.component.css'
})
export class TauxFacturationComponent {
  @ViewChild('myChartCanvas') canvasRef!: ElementRef<HTMLCanvasElement>;
  chart: any;
  @Input()
  les_stats: any = [];

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
    if (changes.les_stats.currentValue.taux_facturation) {
      this.les_stats=changes.les_stats.currentValue.taux_facturation;
      this.init_chart();
    }
  }

  init_chart() {
    const options = {
      series: this.les_stats.map((p: any) => parseFloat(p.taux_facturation)),
      chart: {
        type: 'donut',
        height: 350
      },
      plotOptions: {
        pie: {
          startAngle: -90,
          endAngle: 90,
          offsetY: 10
        }
      },
      labels: this.les_stats.map((p: any) => p.client),
      dataLabels: {
        enabled: true,
        formatter: function (val: any, opts: any) {
          const value = opts.w.globals.series[opts.seriesIndex];
          return value + ' %';
        }
      },
      tooltip: {
        y: {
          formatter: function (val: any) {
            return val + ' %';
          }
        }
      },
      legend: {
        position: 'bottom'
      }
    };

    if (this.chart) {
      this.chart.destroy();
    }

    this.chart = new ApexCharts(document.querySelector("#chart_taux_facturation"), options);
    this.chart.render();
  }

}
