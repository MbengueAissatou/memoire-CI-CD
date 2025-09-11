import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import moment from 'moment';
import { ApiService } from 'src/app/service/api/api.service';
import ApexCharts from 'apexcharts'; // Assurez-vous d'importer ApexCharts

@Component({
  selector: 'app-ca-par-projet',
  imports: [],
  templateUrl: './ca-par-projet.component.html',
  styleUrl: './ca-par-projet.component.css'
})
export class CaParProjetComponent {
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
    if (changes.les_stats.currentValue.ca_par_projet) {
      this.les_stats=changes.les_stats.currentValue.ca_par_projet;
      this.init_chart();
    }
  }

  init_chart() {
    const options = {
      series: this.les_stats.map((p: any) => parseFloat(p.ca_projet)),
      chart: {  
        type: 'donut',
        height: 350
      },
      labels: this.les_stats.map((p: any) => p.code_projet),
      dataLabels: {
        enabled: true,
        formatter: function (val: any, opts: any) {
          const value = opts.w.globals.series[opts.seriesIndex];
          return value.toLocaleString() + ' FCFA';
        }
      },
      tooltip: {
        y: {
          formatter: function (val: any) {
            return val.toLocaleString() + ' FCFA';
          }
        }
      },
      legend: {
        position: 'bottom'
      }
    };
    console.log("series", options.series);
    console.log("labels", options.labels);
    if (this.chart) {
      this.chart.destroy();
    }

    this.chart = new ApexCharts(document.querySelector("#chart_ca_par_projet"), options);
    this.chart.render();
  }

}
