import { NgClass, NgIf } from '@angular/common';
import { AfterViewInit, Component, effect, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from 'src/app/service/api/api.service';
import { ListCircuitApprobationDesFacturesComponent } from "../../circuit-approbation-des-factures/list-circuit-approbation-des-factures/list-circuit-approbation-des-factures.component";
import { ListFactureComponent } from "../../facture/list-facture/list-facture.component";
import moment from 'moment';
import { AddAvenantProjetComponent } from '../../avenant-projet/add-avenant-projet/add-avenant-projet.component';
import { EditAvenantProjetComponent } from '../../avenant-projet/edit-avenant-projet/edit-avenant-projet.component';
import { DetailsAvenantComponent } from '../../avenant-projet/details-avenant/details-avenant.component';
// import ApexCharts from 'apexcharts';
import { PourcentagePartenaireComponent } from "../../dashboard/pourcentage-partenaire/pourcentage-partenaire.component";
import { PourcentageMontantComponent } from "../../dashboard/pourcentage-montant/pourcentage-montant.component";
import { MontantRestantComponent } from "../../dashboard/montant-restant/montant-restant.component"; // Assurez-vous d'importer ApexCharts
import { EditProjetComponent } from '../edit-projet/edit-projet.component';


@Component({
  selector: 'app-details-projet',
  imports: [NgIf, ListCircuitApprobationDesFacturesComponent, ListFactureComponent, PourcentagePartenaireComponent, PourcentageMontantComponent, MontantRestantComponent, NgClass],
  templateUrl: './details-projet.component.html',
  styleUrl: './details-projet.component.css'
})
export class DetailsProjetComponent implements OnInit{
  @ViewChild('myChartCanvas') canvasRef!: ElementRef<HTMLCanvasElement>;

  loading_get_detail_projet = false
  loading_get_stats_projet = false
  selected_projet: any = undefined
  selected_projet_reducer: any = undefined
  les_avenants: any = undefined
  les_stats: any = undefined
  les_stats_filter: any = undefined

  les_partenaires: any = [];
  les_pourcentages_partenaire: any = [];
  les_totales: any = [];
  facture_avd: any = [];
  montant_total_projet: any = [];

  stats: any = {
    total_decompte: 0,
    decompte_realise: 0,
    decompte_en_litige: 0,
    decompte_restant: 0,
    facture_non_paye: 0,
    prochaine_facture: 0,
    cumul_montant: 0,
    montant_total: 0,
    montant_restant_a_facturer: 0,


  };
  cdr: any;
  chart: any;
  pourcentage_montant: any;
  pourcentage_rest: any;
  noms: any = [];
  chart1: any;
  chart2: any;
  condition_facture: any;
  constructor(public api: ApiService, private modalService: NgbModal, private route: ActivatedRoute) {
    
  }
  // private chart: ApexCharts | null = null;
  ngOnInit(): void {
    // alert(this.api.id_projet())
    // gestion de notification
    const id_projet =this.route.snapshot.paramMap.get('id_projet')!;
    const id_facture = this.route.snapshot.paramMap.get('id_facture');
    console.log('id_facture',id_facture);
    
    if (id_facture) {
      // alert(id_projet)
      // console.warn("signal",id_projet)
      this.get_detail_projet(id_projet)
      // this.api.id_projet.set(id_projet);
    } else {
      this.route.params.subscribe((param: any) => {
        console.log('id du projet', param.id)
        this.get_detail_projet(param.id)
        this.api.id_projet.set(param.id);
        // this.get_stats_projet(param.id)
        console.log("mes stats", this.get_stats_projet(param.id))
      });
    }
    //console.log('id du projet de id_prjet()',this.api.id_projet())

  }
  duree_en_mois(date_debut: any, date_fin: any) {
    return moment(date_fin).diff(moment(date_debut), 'month');
  }

  get_detail_projet(id: any) {
    this.loading_get_detail_projet = true;
    this.api.taf_post("projet/get_detail", { id_projet: +id }, (reponse: any) => {
      if (reponse.status) {
        this.selected_projet = reponse.data.projet;
        console.log("selected_projets", this.selected_projet);
        this.les_pourcentages_partenaire = reponse.data.pourcentage_partenaires;
        console.log("les_pourcentages_partenaire et solener", this.les_pourcentages_partenaire);

        this.selected_projet = reponse.data.projet.reduce((cumul: any, actu: any) => {
          let copy = Object.assign({}, actu);
          let is_index = cumul.findIndex((one_partenaire: { id_projet: any; }) => one_partenaire.id_projet === actu.id_projet);

          if (is_index !== -1) {
            if (copy.id_partenaire) {
              cumul[is_index].les_partenaires.push({
                id_partenaire: copy.id_partenaire,
                pourcentage_partenaire: copy.pourcentage_partenaire,
                nom_partenaire: copy.nom_partenaire
              });
              cumul[is_index].total_pourcentage_partenaire += +copy.pourcentage_partenaire;
              cumul[is_index].pourcentage_solener = 100 - cumul[is_index].total_pourcentage_partenaire;
            } else {
              cumul[is_index].pourcentage_solener = 100;
            }
          } else {
            if (copy.id_partenaire) {
              copy.les_partenaires = [{
                id_partenaire: copy.id_partenaire,
                pourcentage_partenaire: copy.pourcentage_partenaire,
                nom_partenaire: copy.nom_partenaire
              }];
              copy.total_pourcentage_partenaire = +copy.pourcentage_partenaire;
              copy.pourcentage_solener = 100 - (copy.total_pourcentage_partenaire || 0);
            } else {
              copy.total_pourcentage_partenaire = 0;
              copy.pourcentage_solener = 100;
            }
            cumul.push(copy);
          }
          return cumul;
        }, [])[0];
        this.montant_total_projet = reponse.data.montant_total_projet || 0;
        console.log("montant_total_projet", this.montant_total_projet);

        this.les_avenants = reponse.data.avenants;
        this.api.les_avenants.set(reponse.data.avenants);
        this.les_partenaires = reponse.data.partenaires;
        console.log("les_partenaires", this.les_partenaires);
        this.les_totales = reponse.data.total_montant;
        console.log("les_totales", this.les_totales);
        this.facture_avd = reponse.data.montant_facture_avd;
        console.log("facture  avd", this.facture_avd);

        this.get_stats_projet(id);
        console.log("get_stats_projet(this.api.id_projet())", this.api.id_projet())

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
  get_stats_projet(id: any) {
    this.loading_get_stats_projet = true;
    this.api.taf_post("projet/get_stats", { id_projet: +id }, (reponse: any) => {
      if (reponse.status) {
        this.les_stats = reponse.data;
        this.api.les_avenant_factures.set(reponse.data);
        console.log("les_stats", this.les_stats);

        // Vérifiez si selected_projet est défini
        console.log("selected_projet", this.selected_projet);
        this.condition_facture = this.selected_projet ? this.selected_projet.condition_facture : null;
        console.log("condition_facture", this.condition_facture);

        // Initialiser les statistiques
        this.stats.decompte_realise = 0;
        this.stats.cumul_montant = 0;
        this.stats.montant_total = 0;

        let deja_vu: any = [];
        this.les_stats.map((one: any) => {
          this.stats.decompte_realise += 1;
          this.stats.cumul_montant += +one.montant_decompte;
          this.stats.montant_total += (deja_vu.find((one_deja: any) => one_deja.id_avenant == one.id_avenant)) ? 0 : +one.montant;
          deja_vu.push(one);
        });
        // Montant restant à facturer
        console.warn("hi", this.stats.montant_total, this.stats.cumul_montant);
        this.stats.montant_restant_a_facturer = this.stats.montant_total - this.stats.cumul_montant;

        // Décompte en litige
        this.stats.decompte_en_litige = this.les_stats.filter((one: any) => {
          return (+one.montant_decompte - +one.montant_encaisse) !== 0;
        }).length;

        // Calculer le total_decompte
        let total_decompte = 0;
        this.les_stats_filter = this.les_stats.filter((value: any, index: any, self: any[]) =>
          index === self.findIndex((t) =>
            t.id_avenant === value.id_avenant &&
            t.id_projet === value.id_projet &&
            t.id_bailleur === value.id_bailleur
          )
        );
        //   console.log("Après filtrage (doublons supprimés) :", this.les_stats_filter);
        this.les_stats_filter.forEach((one: any) => {
          const duree = this.api.duree_en_mois(one.ordre_service, one.date_fin);
          if (typeof duree === 'number' && !isNaN(duree) && this.condition_facture && !isNaN(parseFloat(this.condition_facture)) && parseFloat(this.condition_facture) > 0) {
            total_decompte += Math.floor(duree / parseFloat(this.condition_facture));

          } else {
            console.log(`Invalid values: duree=${duree}, condition_decompte=${this.condition_facture}`);
          }
        });
        this.stats.total_decompte = total_decompte;



        //decompte restant
        this.stats.decompte_restant = this.stats.total_decompte - this.stats.decompte_realise;

        // Calculer les factures non payées
        this.stats.facture_non_paye = this.les_stats.filter((one: any) => {
          return (+one.montant_decompte - +one.montant_encaisse) > 0;
        }).length;

        // Calculer la prochaine facture
        const prochaine_facture = this.les_stats.filter((one: any) => {
          return (+one.montant_decompte - +one.montant_encaisse) > 0;
        })[0];

        if (prochaine_facture) {
          const date_emission = moment(prochaine_facture.date_emission); // Date d'émission
          const condition_facture = this.selected_projet ? parseInt(this.selected_projet.condition_facture, 10) : null; // Récupérer la condition de facturation

          if (condition_facture) {
            // date_emission + condition_facture mois
            console.log("date_emission", date_emission);
            const date_prochaine_facture = date_emission.add(condition_facture, 'months');


            const today = moment(); // Date actuelle
            const joursRestants = date_prochaine_facture.diff(today, 'days');

            this.stats.prochaine_facture = joursRestants >= 0 ? joursRestants : 0;
          } else {
            this.stats.prochaine_facture = null;
          }
        } else {
          this.stats.prochaine_facture = null;
        }
        this.cdr?.detectChanges();
        console.log("Opération effectuée avec succès sur la table stats. Réponse= ", this.les_stats);
      } else {
        console.log("L'opération sur la table stats a échoué. Réponse= ", reponse);
        this.api.Swal_error("L'opération a échoué");
      }
      this.loading_get_stats_projet = false;
    }, (error: any) => {
      this.loading_get_stats_projet = false;
    });
  }
  openModal_add_avenant() {
    let options: any = {
      centered: true,
      scrollable: true,
      size: "xl"//'sm' | 'lg' | 'xl' | string
    }
    const modalRef = this.modalService.open(AddAvenantProjetComponent, { ...options, backdrop: 'static' })

    modalRef.componentInstance.cb_after_add_avenant.subscribe((event: any) => {
      if (event.status) {
        // Ici tu mets à jour ta liste d'avenants (ex : recharger depuis API)
        this.get_detail_projet(this.api.id_projet());
        this.get_stats_projet(this.api.id_projet());

        // Optionnel : fermer la modal après succès
        modalRef.close();
      }
    });

    modalRef.result.then(() => {
      // Optionnel : gestion fermeture modale
    }).catch(() => {
      // Optionnel : gestion fermeture modale par l'utilisateur
    });
  }
  openModal_edit_avenant_projet(one_avenant_projet: any, index: any) {
    let options: any = {
      centered: true,
      scrollable: true,
      size: "xl"//'sm' | 'lg' | 'xl' | string
    }
    one_avenant_projet.index = index;
    const modalRef = this.modalService.open(EditAvenantProjetComponent, { ...options, backdrop: 'static', })
    modalRef.componentInstance.avenant_projet_to_edit = one_avenant_projet;

    modalRef.componentInstance.cb_after_edit_avenant.subscribe((event: any) => {
      if (event.status) {
        // Ici tu mets à jour ta liste d'avenants (ex : recharger depuis API)
        this.get_detail_projet(this.api.id_projet());
        this.get_stats_projet(this.api.id_projet());

        // Optionnel : fermer la modal après succès
        modalRef.close();
      }
    });
    modalRef.result.then(() => {
      // Optionnel : gestion fermeture modale
    }).catch(() => {
      // Optionnel : gestion fermeture modale par l'utilisateur
    });

  }
  openModal_details_avenant_projet(one_avenant_projet: any, index: any) {
    let options: any = {
      centered: true,
      scrollable: true,
      size: "xl"//'sm' | 'lg' | 'xl' | string
    }
    one_avenant_projet.index = index;
    one_avenant_projet.pourcentage_solener = this.selected_projet.pourcentage_solener;
    const modalRef = this.modalService.open(DetailsAvenantComponent, { ...options, backdrop: 'static', })
    modalRef.componentInstance.one_avenant = one_avenant_projet;
    modalRef.result.then((result: any) => {
      console.log('Modal closed with:', result);
      if (result?.status) {
        this.get_detail_projet(this.api.id_projet());
      } else {

      }
    })
  }
  openModal_edit_projet(one_projet: any) {
    let options: any = {
      centered: true,
      scrollable: true,
      size: "xl"//'sm' | 'lg' | 'xl' | string
    }
    const modalRef = this.modalService.open(EditProjetComponent, { ...options, backdrop: 'static', })
    modalRef.componentInstance.projet_to_edit = one_projet;
    modalRef.result.then((result: any) => {
      console.log('Modal closed with:', result);
      if (result?.status) {
        // this.get_projet()
        this.get_detail_projet(this.api.id_projet());
      } else {

      }
    })
  }
  update_change_facture(event: { status: boolean }) {
    if (event?.status) {
      this.get_detail_projet(this.api.id_projet());
      this.get_stats_projet(this.api.id_projet());
    }
  }

}

