import { CommonModule, NgIf } from '@angular/common';
import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/service/api/api.service';
import { ListCircuitApprobationDesFacturesComponent } from '../../circuit-approbation-des-factures/list-circuit-approbation-des-factures/list-circuit-approbation-des-factures.component';
import { ListFactureComponent } from '../../facture/list-facture/list-facture.component';
import ApexCharts from 'apexcharts'; // Assurez-vous d'importer ApexCharts

@Component({
  selector: 'app-montant-restant',
  imports: [NgIf, ListCircuitApprobationDesFacturesComponent, ListFactureComponent, CommonModule],
  templateUrl: './montant-restant.component.html',
  styleUrl: './montant-restant.component.css'
})
export class MontantRestantComponent {
  @ViewChild('myChartCanvas') canvasRef!: ElementRef<HTMLCanvasElement>;

  loading_get_detail_projet = false
  loading_get_stats_projet = false
  selected_projet: any = undefined
  les_avenants: any = undefined
  les_stats: any = undefined
  les_partenaires: any = [];
  les_pourcentages_partenaire: any = [];
  les_totales: any = [];
  chart2: any;
  pourcentage_montant: any;
  pourcentage_rest: any;
  noms: any = [];
  chart1: any;
  facture_avd: any = [];
  pourcentage_facture: any;
  montant_total_avd: number = 0;
  @Input() id_projet: any;

  constructor(public api: ApiService, private route: ActivatedRoute) {

  }
  ngOnInit(): void {
    this.get_detail_projet(this.id_projet);
  }

  // Nettoyage du graphique lors de la destruction du composant
  ngOnDestroy() {
    if (this.chart2) {
      this.chart2.destroy();
      this.chart2 = null;
    }
  }
  get_detail_projet(id: any) {
    this.loading_get_detail_projet = true;
    this.api.taf_post("projet/get_detail", { id_projet: +id }, (reponse: any) => {
      if (reponse.status) {
        this.facture_avd = reponse.data.montant_facture_avd;
        // Récupérer les pourcentages et les noms des partenaires
        // this.pourcentage_facture = this.facture_avd.map((partenaire: { pourcentage_facture: any; }) => partenaire.pourcentage_facture);
        this.pourcentage_facture = parseFloat(this.facture_avd.pourcentage_facture);
        console.log("pourcentage facture du get", this.pourcentage_facture);
        this.montant_total_avd = parseFloat(this.facture_avd.montant_total_avd);

        // Initialiser le graphique avec les données
        this.init_chart2();
        console.log("Opération effectuée avec succès sur la table projet. Réponse = le projet", this.selected_projet);
      } else {
        console.log("L'opération sur la table projet a échoué. Réponse = ", reponse);
        this.api.Swal_error("L'opération a échoué");
      }
      this.loading_get_detail_projet = false;
    }, (error: any) => {
      this.loading_get_detail_projet = false;
    });
  }
  // Initialisation du graphique
  init_chart2() {
    const valeur_facturee = Number(this.pourcentage_facture);
    const valeur_restante = 100 - valeur_facturee;

    const options = {
      series: [
        {
          name: 'Facturé'+' ('+ this.api.formatNumber(this.facture_avd.montant_facture_avd)+' FCFA)',
          data: [valeur_facturee]
        },
        {
          name: 'Restant'+' ('+ this.api.formatNumber(this.facture_avd.montant_restant_avd)+' FCFA)',
          data: [valeur_restante]
        }
      ],
      chart: {
        type: 'bar',
        stacked: true,
        stackType: "100%",
        height: (this.id_projet)?100:150
      },
      xaxis: {
        categories: [''],
      },
      plotOptions: {
        bar: {
          horizontal: true,
          borderRadius: 4,
          barHeight: '70%',
        }
      },
      dataLabels: {
        enabled: true,
        formatter: function (_val: any, opts: any) {
          // Afficher seulement pour la première série (Facturé)
          if (opts.seriesIndex === 0) {
            return _val + '%';
          }
          return ''; // Ne rien afficher pour "Restant"
        },
        style: {
          fontSize: '14px',
          fontWeight: 'bold',
          colors: ['#fff']
        }
      },
      colors: ['#B7673E', '#E0E0E0'], // Vert = Facturé, Gris = Restant
      legend: {
        show: false // Masquer la légende si souhaité
      }
    };

    if (this.chart2) {
      this.chart2.destroy();
    }

    this.chart2 = new ApexCharts(document.querySelector("#chart2"), options);
    this.chart2.render();
  }

}
