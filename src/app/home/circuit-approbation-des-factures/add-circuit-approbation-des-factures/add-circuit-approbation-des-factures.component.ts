
import { Component, computed, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../../service/api/api.service';
import { CommonModule } from '@angular/common';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-add-circuit-approbation-des-factures',
  standalone: true, // Composant autonome
  imports: [CommonModule, ReactiveFormsModule], // Dépendances importées
  templateUrl: './add-circuit-approbation-des-factures.component.html',
  styleUrls: ['./add-circuit-approbation-des-factures.component.css']
})
export class AddCircuitApprobationDesFacturesComponent {
  reactiveForm_add_circuit_approbation_des_factures !: FormGroup;
  submitted: boolean = false
  loading_add_circuit_approbation_des_factures: boolean = false
  form_details: any = {}
  loading_get_details_add_circuit_approbation_des_factures_form = false
  @Input() id_projet:any;
  constructor(private formBuilder: FormBuilder, public api: ApiService, public activeModal: NgbActiveModal) { }

  ngOnInit(): void {
    this.get_details_add_circuit_approbation_des_factures_form()
    this.init_form()
  }
  init_form() {
    this.reactiveForm_add_circuit_approbation_des_factures = this.formBuilder.group({
      id_projet: [this.api.id_projet(), Validators.required],
      service: ["",Validators.required],
      telephone: [""],
      email: [""],
      observation: [""],
      nom: [""],
      prenom: [""],
    });
  }

  // acces facile au champs de votre formulaire
  get f(): any { return this.reactiveForm_add_circuit_approbation_des_factures.controls; }
  // validation du formulaire
  onSubmit_add_circuit_approbation_des_factures() {
    this.submitted = true;
    console.log(this.reactiveForm_add_circuit_approbation_des_factures.value)
    // stop here if form is invalid
    if (this.reactiveForm_add_circuit_approbation_des_factures.invalid) {
      return;
    }
    var circuit_approbation_des_factures = this.reactiveForm_add_circuit_approbation_des_factures.value
    this.add_circuit_approbation_des_factures(circuit_approbation_des_factures)
  }
  // vider le formulaire
  onReset_add_circuit_approbation_des_factures() {
    this.submitted = false;
    this.reactiveForm_add_circuit_approbation_des_factures.reset();
  }
  add_circuit_approbation_des_factures(circuit_approbation_des_factures: any) {
    this.loading_add_circuit_approbation_des_factures = true;
    this.api.taf_post("circuit_approbation_des_factures/add", circuit_approbation_des_factures, (reponse: any) => {
      this.loading_add_circuit_approbation_des_factures = false;
      if (reponse.status) {
        console.log("Opération effectuée avec succés sur la table circuit_approbation_des_factures. Réponse= ", reponse);
        this.onReset_add_circuit_approbation_des_factures()
        this.api.Swal_success("Opération éffectuée avec succés")
        this.activeModal.close(reponse)
      } else {
        console.log("L'opération sur la table circuit_approbation_des_factures a échoué. Réponse= ", reponse);
        this.api.Swal_error("L'opération a echoué")
      }
    }, (error: any) => {
      this.loading_add_circuit_approbation_des_factures = false;
    })
  }

  get_details_add_circuit_approbation_des_factures_form() {
    this.loading_get_details_add_circuit_approbation_des_factures_form = true;
    this.api.taf_post("circuit_approbation_des_factures/get_form_details", {}, (reponse: any) => {
      if (reponse.status) {
        this.form_details = reponse.data
        console.log("Opération effectuée avec succés sur la table circuit_approbation_des_factures. Réponse= ", reponse);
      } else {
        console.log("L'opération sur la table circuit_approbation_des_factures a échoué. Réponse= ", reponse);
        this.api.Swal_error("L'opération a echoué")
      }
      this.loading_get_details_add_circuit_approbation_des_factures_form = false;
    }, (error: any) => {
      this.loading_get_details_add_circuit_approbation_des_factures_form = false;
    })
  }
}
