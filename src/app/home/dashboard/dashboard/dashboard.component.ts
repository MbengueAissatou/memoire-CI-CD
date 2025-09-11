import { CommonModule } from '@angular/common';
import { Component, OnChanges, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import moment from 'moment';
import { ApiService } from 'src/app/service/api/api.service';
import { PourcentageMontantComponent } from "../pourcentage-montant/pourcentage-montant.component";
import { MontantRestantComponent } from "../montant-restant/montant-restant.component";
import { TauxFacturationComponent } from "../stats/taux-facturation/taux-facturation.component";
import { CaParClientComponent } from "../stats/ca-par-client/ca-par-client.component";
import { MontantComparerComponent } from "../stats/montant-comparer/montant-comparer.component";
import { CaMensuelComponent } from "../stats/ca-mensuel/ca-mensuel.component";
import { CaParProjetComponent } from "../stats/ca-par-projet/ca-par-projet.component";

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, FormsModule, PourcentageMontantComponent, MontantRestantComponent, TauxFacturationComponent, CaParClientComponent, MontantComparerComponent, CaMensuelComponent, CaParProjetComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  filter: any = {
    date_debut: moment().subtract(1, "M").format("YYYY-MM-DD"),
    date_fin: moment().format("YYYY-MM-DD"),
  }
  les_donnees: any = [];
  les_stats: any = [];


  loading_get_card_dashboard = false
  loading_get_stats_dashboard = false;
  date_period_choice = 4;
  constructor(public api: ApiService) {
  }

  ngOnInit(): void {
    // this.get_card_dashboard();
    // this.get_stats_dashboard();
    this.date_period_choice_change();
  }
  get_card_dashboard() {
    this.loading_get_card_dashboard = true;
    this.api.taf_post("dashboard/card", this.filter, (reponse: any) => {
      if (reponse.status) {
        this.les_donnees = reponse.data;
        console.log("les_donnees", this.les_donnees);
      } else {
        alert("L'opération a échoué");
      }
      this.loading_get_card_dashboard = false;
    }, (error: any) => {
      this.loading_get_card_dashboard = false;
    });
  }
  get_stats_dashboard() {
    this.loading_get_stats_dashboard = true;
    this.api.taf_post("dashboard/stats", this.filter, (reponse: any) => {
      if (reponse.status) {
        this.les_stats = reponse.data;
        console.log("les_stats yyy", this.les_stats);
      } else {
        alert("L'opération a échoué");
      }
      this.loading_get_stats_dashboard = false;
    }, (error: any) => {
      this.loading_get_stats_dashboard = false;
    });
  }
  date_change() {
    this.get_card_dashboard();
    this.get_stats_dashboard();
  }

  date_period_choice_change() {
    if (this.date_period_choice == 1) {// Mensuel
      this.filter.date_debut = moment(this.api.format_current_date().jma3).startOf("M").format("YYYY-MM-DD");
      this.filter.date_fin = moment(this.api.format_current_date().jma3).endOf("M").format("YYYY-MM-DD");
    } else if (this.date_period_choice == 2) {// Trimestriel
      this.filter.date_debut = moment(this.api.format_current_date().jma3).startOf("Q").format("YYYY-MM-DD");
      this.filter.date_fin = moment(this.api.format_current_date().jma3).endOf("Q").format("YYYY-MM-DD");
      // } else if (this.date_period_choice == 3) {// Semestriel
      //   this.filter.date_debut = moment(this.api.format_current_date().jma3).startOf("Q").format("YYYY-MM-DD");
      //   this.filter.date_fin = moment(this.filter.date_debut).endOf("Q").format("YYYY-MM-DD");
    } else if (this.date_period_choice == 4) {// Annuel
      this.filter.date_debut = moment(this.api.format_current_date().jma3).startOf("y").format("YYYY-MM-DD");
      this.filter.date_fin = moment(this.filter.date_debut).endOf("y").format("YYYY-MM-DD");
    } else if (this.date_period_choice == 5) {// Autres
      // this.filter.date_debut=this.filter.date_fin;
    }
    // this.get_commande()
    console.warn("date", this.filter)
    this.date_change();
  }

}
