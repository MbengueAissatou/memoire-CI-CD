import { NgClass, NgFor, NgStyle } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from 'src/app/service/api/api.service';

@Component({
  selector: 'app-details-facture',
  imports: [FormsModule, NgClass, NgStyle, NgFor],
  templateUrl: './details-facture.component.html',
  styleUrl: './details-facture.component.css'
})
export class DetailsFactureComponent {
  loading_get_circuits = false
  les_circuits: any[] = []
  selected_facture: any = undefined
  facture_to_edit: any = undefined
  loading_delete_facture = false
  id_projet: any;
  loading_add_circuit_facture = false;
  circuit_approbation_des_factures: any;

  stats: any = {
    montant_avd: 0,
    montant_apres_avd: 0,
    part_solener: 0
  }
  @Input() facture: any;

  constructor(public api: ApiService, public activeModal: NgbActiveModal) {

  }
  ngOnInit(): void {
    this.id_projet = this.api.id_projet();
    this.get_circuits()
    this.calcul_stats();
  }
  get_circuits() {
    this.loading_get_circuits = true;
    this.api.taf_post("circuit_facture/get_facture_circuit", { id_projet: this.id_projet, id_facture: this.facture.id_facture }, (reponse: any) => {
      if (reponse.status) {
        this.les_circuits = reponse.data
        console.log("Opération effectuée avec succés sur la table facture. Réponse= ", reponse);
      } else {
        console.log("L'opération sur la table facture a échoué. Réponse= ", reponse);
        this.api.Swal_error("L'opération a echoué")
      }
      this.loading_get_circuits = false;
    }, (error: any) => {
      this.loading_get_circuits = false;
    })
  }

  calcul_stats() {
    this.stats.montant_avd = (this.facture?.pourcentage_avd) ? (this.facture?.pourcentage_avd / 100) * (this.facture?.montant_decompte) : 0
    this.stats.montant_apres_avd = (this.stats.montant_avd) ? this.facture?.montant_decompte - (this.stats.montant_avd) : this.facture?.montant_decompte
    this.stats.part_solener = (this.facture?.total_pourcentage_partenaire) ? ((100 - this.facture?.total_pourcentage_partenaire) / 100) * this.stats.montant_apres_avd : (100 / 100) * this.stats.montant_apres_avd
  }

  submit_add_circuit_facture(circuit: any) {
    let circuit_facture = {
      id_circuit_approbation_des_factures: circuit.id_circuit_approbation_des_factures,
      id_facture: this.facture.id_facture,
      date: this.api.format_current_date().jma3
    }
    console.warn(circuit_facture);
    console.warn(this.circuit_approbation_des_factures);
    this.add_circuit_facture(circuit_facture);
  }
  add_circuit_facture(circuit_facture: any) {
    this.loading_add_circuit_facture = true;
    this.api.taf_post("circuit_facture/add", circuit_facture, (reponse: any) => {
      this.loading_add_circuit_facture = false;
      if (reponse.status) {
        console.log("Opération effectuée avec succés sur la table circuit_facture. Réponse= ", reponse);
        this.api.Swal_success("Opération éffectuée avec succés")
      } else {
        console.log("L'opération sur la table circuit_facture a échoué. Réponse= ", reponse);
        this.api.Swal_error("L'opération a echoué")
      }
    }, (error: any) => {
      this.loading_add_circuit_facture = false;
    })
  }

  trackByIndex(index: number, item: any): number {
    return index;
  }

  getColor(index: number): string {
    const colors = ['#e74c3c', '#1abc9c', '#9b59b6', '#f39c12', '#3498db'];
    return colors[index % colors.length]; // boucle les couleurs si +5 étapes
  }
}
