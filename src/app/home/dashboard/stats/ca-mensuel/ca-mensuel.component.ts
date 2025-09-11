import { Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import ApexCharts from 'apexcharts'; // Assurez-vous d'importer ApexCharts
import moment from 'moment';
import { ApiService } from 'src/app/service/api/api.service';

@Component({
  selector: 'app-ca-mensuel',
  imports: [],
  templateUrl: './ca-mensuel.component.html',
  styleUrl: './ca-mensuel.component.css'
})
export class CaMensuelComponent implements OnInit , OnChanges{
  @ViewChild('myChartCanvas') canvasRef!: ElementRef<HTMLCanvasElement>;
  chart: any;
  @Input()
  les_stats: any = [];
  chart1: any;
  constructor(public api: ApiService) {

  }
  ngOnChanges(changes: any): void {
    if (changes.les_stats.currentValue.ca_mensuel) {
      this.les_stats=changes.les_stats.currentValue.ca_mensuel;
      this.init_chart();
    }
  }

  ngOnDestroy() {
    if (this.chart) {
      this.chart.destroy();
      this.chart = null;
    }
  }
  ngOnInit(): void {
  }

  init_chart() {
  const options = {
    series: [{
      name: 'CA Mensuel',
      data: this.les_stats.map((p: { ca_mensuel: any; }) => p.ca_mensuel)
    }],
    chart: {
      type: 'bar',
      height: 350
    },
    xaxis: {
      categories: this.les_stats.map((p: { mois: any; }) => p.mois)
    },
    dataLabels: {
      enabled: true,
      formatter: function (val: any) {
        return val.toLocaleString() + ' FCFA';
      },
      style: {
        fontSize: '12px',
        fontWeight: 'bold',
        colors: ['#000']
      }
    },
    legend: {
      position: 'bottom'
    }
  };

  if (this.chart) {
    this.chart.destroy();
  }

  this.chart = new ApexCharts(document.querySelector("#chart_ca_mensuel"), options);
  this.chart.render();
}




}
