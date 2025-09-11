
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../../service/api/api.service';
import { CommonModule } from '@angular/common';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-edit-circuit-approbation-des-factures',
  standalone: true, // Composant autonome
  imports: [CommonModule, ReactiveFormsModule], // Dépendances importées
  templateUrl: './edit-circuit-approbation-des-factures.component.html',
  styleUrls: ['./edit-circuit-approbation-des-factures.component.css']
})
export class EditCircuitApprobationDesFacturesComponent {
  reactiveForm_edit_circuit_approbation_des_factures !: FormGroup;
  submitted: boolean = false
  loading_edit_circuit_approbation_des_factures: boolean = false
  @Input()
  circuit_approbation_des_factures_to_edit: any = {}
  form_details: any = {}
  loading_get_details_edit_circuit_approbation_des_factures_form = false
  constructor(private formBuilder: FormBuilder, public api: ApiService, public activeModal: NgbActiveModal) {

  }
  ngOnInit(): void {
    this.get_details_edit_circuit_approbation_des_factures_form()
    this.update_form(this.circuit_approbation_des_factures_to_edit)
  }
  // mise à jour du formulaire
  update_form(circuit_approbation_des_factures_to_edit: any) {
    this.reactiveForm_edit_circuit_approbation_des_factures = this.formBuilder.group({
      id_projet: [circuit_approbation_des_factures_to_edit.id_projet, Validators.required],
      service: [circuit_approbation_des_factures_to_edit.service, Validators.required],
      telephone: [circuit_approbation_des_factures_to_edit.telephone],
      email: [circuit_approbation_des_factures_to_edit.email],
      observation: [circuit_approbation_des_factures_to_edit.observation],
      nom: [circuit_approbation_des_factures_to_edit.nom],
      prenom: [circuit_approbation_des_factures_to_edit.prenom],
    });
  }

  // acces facile au champs de votre formulaire
  get f(): any { return this.reactiveForm_edit_circuit_approbation_des_factures.controls; }
  // validation du formulaire
  onSubmit_edit_circuit_approbation_des_factures() {
    this.submitted = true;
    console.log(this.reactiveForm_edit_circuit_approbation_des_factures.value)
    // stop here if form is invalid
    if (this.reactiveForm_edit_circuit_approbation_des_factures.invalid) {
      return;
    }
    var circuit_approbation_des_factures = this.reactiveForm_edit_circuit_approbation_des_factures.value
    this.edit_circuit_approbation_des_factures({
      condition: JSON.stringify({ id_circuit_approbation_des_factures: this.circuit_approbation_des_factures_to_edit.id_circuit_approbation_des_factures }),
      data: JSON.stringify(circuit_approbation_des_factures)
    })
  }
  // vider le formulaire
  onReset_edit_circuit_approbation_des_factures() {
    this.submitted = false;
    this.reactiveForm_edit_circuit_approbation_des_factures.reset();
  }
  edit_circuit_approbation_des_factures(circuit_approbation_des_factures: any) {
    this.loading_edit_circuit_approbation_des_factures = true;
    this.api.taf_post("circuit_approbation_des_factures/edit", circuit_approbation_des_factures, (reponse: any) => {
      if (reponse.status) {
        this.activeModal.close(reponse)
        console.log("Opération effectuée avec succés sur la table circuit_approbation_des_factures. Réponse= ", reponse);
        //this.onReset_edit_circuit_approbation_des_factures()
        this.api.Swal_success("Opération éffectuée avec succés")
      } else {
        console.log("L'opération sur la table circuit_approbation_des_factures a échoué. Réponse= ", reponse);
        this.api.Swal_error("L'opération a echoué")
      }
      this.loading_edit_circuit_approbation_des_factures = false;
    }, (error: any) => {
      this.loading_edit_circuit_approbation_des_factures = false;
    })
  }
  get_details_edit_circuit_approbation_des_factures_form() {
    this.loading_get_details_edit_circuit_approbation_des_factures_form = true;
    this.api.taf_post("circuit_approbation_des_factures/get_form_details", {}, (reponse: any) => {
      if (reponse.status) {
        this.form_details = reponse.data
        console.log("Opération effectuée avec succés sur la table circuit_approbation_des_factures. Réponse= ", reponse);
      } else {
        console.log("L'opération sur la table circuit_approbation_des_factures a échoué. Réponse= ", reponse);
        this.api.Swal_error("L'opération a echoué")
      }
      this.loading_get_details_edit_circuit_approbation_des_factures_form = false;
    }, (error: any) => {
      this.loading_get_details_edit_circuit_approbation_des_factures_form = false;
    })
  }
}
