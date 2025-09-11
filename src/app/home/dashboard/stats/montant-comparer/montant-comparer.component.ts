import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import moment from 'moment';
import { ApiService } from 'src/app/service/api/api.service';
import ApexCharts from 'apexcharts'; // Assurez-vous d'importer ApexCharts

@Component({
  selector: 'app-montant-comparer',
  imports: [],
  templateUrl: './montant-comparer.component.html',
  styleUrl: './montant-comparer.component.css'
})
export class MontantComparerComponent {
  @ViewChild('myChartCanvas') canvasRef!: ElementRef<HTMLCanvasElement>;
  chart: any;
  @Input()
  les_stats: any = [];
  loading_get_card_dashboard = false
  loading_get_stats_dashboard = false;
  chart1: any;
  filter: any = {
    commercial: "",
    recherche: "",
    zone: "",
    type_poussin: "",
    date_debut: moment().subtract(1, "M").format("YYYY-MM-DD"),
    date_fin: moment().format("YYYY-MM-DD"),
  }
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
    if (changes.les_stats.currentValue.comparer_montant) {
      this.les_stats = changes.les_stats.currentValue.comparer_montant;
      this.init_chart();
    }
  }

  init_chart() {
    const options = {
      series: [
        {
          name: 'Montant facturé',
          data: this.les_stats.map((p: any) => p.montant_facture)
        },
        {
          name: 'Montant encaissé',
          data: this.les_stats.map((p: any) => p.montant_encaisse)
        }
      ],
      chart: {
        type: 'bar',
        height: 350,
        toolbar: {
          show: false
        }
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '55%',
          endingShape: 'rounded'
        }
      },
      dataLabels: {
        enabled: true,
        formatter: function (val: any) {
          return val.toLocaleString() + ' FCFA';
        }
      },
      xaxis: {
        categories: this.les_stats.map((p: any) => p.mois),
        labels: {
          rotate: -45
        }
      },
      yaxis: {
        labels: {
          formatter: function (val: any) {
            return val.toLocaleString();
          }
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

    if (this.chart) {
      this.chart.destroy();
    }

    this.chart = new ApexCharts(document.querySelector("#chart_comparer_montant"), options);
    this.chart.render();
  }
}
