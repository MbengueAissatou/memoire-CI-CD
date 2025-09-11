import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/service/api/api.service';
import ApexCharts from 'apexcharts'; // Assurez-vous d'importer ApexCharts
import { NgIf } from '@angular/common';
import { ListCircuitApprobationDesFacturesComponent } from '../../circuit-approbation-des-factures/list-circuit-approbation-des-factures/list-circuit-approbation-des-factures.component';
import { ListFactureComponent } from '../../facture/list-facture/list-facture.component';


@Component({
  selector: 'app-pourcentage-partenaire',
  imports: [NgIf, ListCircuitApprobationDesFacturesComponent, ListFactureComponent],
  templateUrl: './pourcentage-partenaire.component.html',
  styleUrl: './pourcentage-partenaire.component.css'
})
export class PourcentagePartenaireComponent implements OnInit {
  @ViewChild('myChartCanvas') canvasRef!: ElementRef<HTMLCanvasElement>;

  loading_get_detail_projet = false
  loading_get_stats_projet = false
  selected_projet: any = undefined
  les_avenants: any = undefined
  les_stats: any = undefined
  les_partenaires: any = [];
  les_pourcentages_partenaire: any = [];
  pourcentage_soloner: any = [];
  pourcentage_list: any = [];

  les_totales: any = [];
  chart: any;
  pourcentage_montant: any;
  pourcentage_rest: any;
  noms: any = [];
  chart1: any;

  constructor(public api: ApiService, private route: ActivatedRoute) {

  }
  ngOnDestroy() {
    if (this.chart) {
      this.chart.destroy();
      this.chart = null;
    }
  }
  ngOnInit(): void {
    this.route.params.subscribe((param: any) => {
      console.warn(param.id)
      //  this.get_detail_projet(param.id)
      if(param.id){
        this.api.id_projet.set(param.id);
      this.get_detail_projet(param.id);
      }else{
              this.get_detail_projet(this.api.id_projet);

      }
      // this.api.id_projet.set(param.id);
      // // this.get_detail_projet(this.api.id_projet());
      // this.get_detail_projet(param.id);
      console.log("get detail_projet", param.id);
    });

    // this.init_chart();
  }
  get_detail_projet(id: any) {
    // console.log("get_detail_projet", this.api.id_projet());
    this.loading_get_detail_projet = true;
    this.api.taf_post("projet/get_detail", { id_projet: +id }, (reponse: any) => {
      if (reponse.status) {
        this.selected_projet = reponse.data.projet;
        console.log("selected_projet", this.selected_projet);

        this.les_pourcentages_partenaire = reponse.data.pourcentage_partenaires;
        console.log("les_pourcentages_partenaire et solener", this.les_pourcentages_partenaire);

        this.pourcentage_soloner = reponse.data.pourcentage_solener;
        console.log("pourcentage_solone", this.pourcentage_soloner);

        // Récupérer les pourcentages et les noms des partenaires et soloner
        const pourcentages = this.les_pourcentages_partenaire.map((partenaire: { pourcentage_partenaire: any; }) => partenaire.pourcentage_partenaire);
        console.log("pourcentages", pourcentages);
        const noms = this.selected_projet.map((partenaire: { nom_partenaire: any; }) => partenaire.nom_partenaire);
        console.log("noms", noms);
        // Initialiser le graphique avec les données
        // this.init_chart(pourcentages, noms);

        // Fusionner les partenaires et Solener
        this.pourcentage_list = this.les_pourcentages_partenaire.map((p: any) => ({
          nom: p.nom_partenaire,
          pourcentage: +p.pourcentage_partenaire || 0
        }));

        // Ajouter Solener si nécessaire
        if (this.pourcentage_soloner > 0) {
          this.pourcentage_list.push({
            nom: 'Solener',
            pourcentage: +this.pourcentage_soloner
          });
        }
        // Affichage (facultatif)
        console.log('pourcentage_list', this.pourcentage_list);
        this.init_chart();


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

  init_chart() {
    const palette = [
      '#008FFB', '#00E396', '#FEB019', '#FF4560', '#775DD0',
      '#3F51B5', '#546E7A', '#D4526E', '#8D5B4C', '#F86624'
    ]; // Palette personnalisée

    const colors = this.pourcentage_list.map((p: { nom: string; }, i: number) =>
      p.nom === 'Solener' ? '#B7673E' : palette[i % palette.length]
    );

    var options = {
      series: this.pourcentage_list.map((p: { pourcentage: any; }) => p.pourcentage), // Utilisez les pourcentages récupérés
      chart: {
        width: 320,
        type: 'pie',
      },
      labels: this.pourcentage_list.map((p: { nom: any; }) => p.nom), // Utilisez les noms des partenaires récupérés
      colors: colors,

      dataLabels: {
        enabled: true,
        formatter: function (val: any, opts: any) {
          return opts.w.config.series[opts.seriesIndex] + '%'; // Affiche la valeur brute
        },
        style: {
          fontSize: '14px',
          fontWeight: 'bold',
          colors: ['#fff'],
          // facultatif pour plus de contraste
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

    if (this.chart) {
      this.chart.destroy();
    }

    this.chart = new ApexCharts(document.querySelector("#chart"), options);
    this.chart.render();
  }
}

