import { NgIf } from '@angular/common';
import { Component, ElementRef, Input, input, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/service/api/api.service';
import { ListCircuitApprobationDesFacturesComponent } from '../../circuit-approbation-des-factures/list-circuit-approbation-des-factures/list-circuit-approbation-des-factures.component';
import { ListFactureComponent } from '../../facture/list-facture/list-facture.component';
import { PourcentagePartenaireComponent } from '../pourcentage-partenaire/pourcentage-partenaire.component';
import ApexCharts from 'apexcharts'; // Assurez-vous d'importer ApexCharts

@Component({
  selector: 'app-pourcentage-montant',
  imports: [NgIf, ListCircuitApprobationDesFacturesComponent, ListFactureComponent, PourcentagePartenaireComponent],
  templateUrl: './pourcentage-montant.component.html',
  styleUrl: './pourcentage-montant.component.css'
})
export class PourcentageMontantComponent {
  @ViewChild('myChartCanvas') canvasRef!: ElementRef<HTMLCanvasElement>;

  loading_get_detail_projet = false
  loading_get_stats_projet = false
  les_avenants: any = undefined
  les_stats: any = undefined
  les_partenaires: any = [];
  les_pourcentages_partenaire: any = [];
  les_totales: any = [];


  cdr: any;
  chart1: any;
  pourcentage_montant: any;
  pourcentage_rest: any;
  @Input() id_projet:any;

  constructor(public api: ApiService, private route: ActivatedRoute) {

  }
  ngOnInit(): void {
    this.get_detail_projet(this.id_projet);
  }
  ngOnDestroy() {
    if (this.chart1) {
      this.chart1.destroy();
      this.chart1 = null;
    }
  }
  get_detail_projet(id: any) {
    this.loading_get_detail_projet = true;
    this.api.taf_post("projet/get_detail", {id_projet:+id}, (reponse: any) => {
      if (reponse.status) {

        this.pourcentage_montant = +reponse.data.pourcentage_montant.pourcentage_montant_recu;
        this.pourcentage_rest = +reponse.data.pourcentage_montant.pourcentage_montant_restant;

        console.log("Pourcentage encaissé:", this.pourcentage_montant + "%");

        this.init_chart1();

      } else {
        console.log("L'opération sur la table projet a échoué. Réponse = ", reponse);
        this.api.Swal_error("L'opération a échoué");
      }
      this.loading_get_detail_projet = false;
    }, (error: any) => {
      this.loading_get_detail_projet = false;
    });
  }

  init_chart1() {
    const colors = ['#00E396', '#CCCCCC']; // Vert (encaissé), Gris (restant)


    var options = {
      // series: [this.pourcentage_montant, this.pourcentage_rest], // Utilisez les pourcentages récupérés
      series: [this.pourcentage_montant, this.pourcentage_rest], // Utilisez les pourcentages récupérés
      chart: {
        width: (this.id_projet)?300:380,
        type: 'donut',
      },
      labels: ["Montant encaissé", "Montant restant"],
      colors,
      dataLabels: {
        enabled: true,
        formatter: function (val: any, opts: any) {
          return opts.w.config.series[opts.seriesIndex] + '%'; // Affiche la valeur brute
        },
        style: {
          fontSize: '14px',
          fontWeight: 'bold',
          colors: ['#fff'] // facultatif pour plus de contraste
        }
      },
      responsive: [{
        breakpoint: 250,
        options: {
          chart: {
            width: 250
          },
          legend: {
            position: 'bottom'
          }
        }
      }],
      legend: {
        position: 'bottom'
      }
    };

    if (this.chart1) {
      this.chart1.destroy();
    }

    this.chart1 = new ApexCharts(document.querySelector("#chart1"), options);
    this.chart1.render();
  }
}
