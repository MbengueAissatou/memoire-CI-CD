
import { Component, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../../service/api/api.service';
import { CommonModule } from '@angular/common';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-add-circuit-facture',
  standalone: true, // Composant autonome
  imports: [CommonModule, ReactiveFormsModule], // Dépendances importées
  templateUrl: './add-circuit-facture.component.html',
  styleUrls: ['./add-circuit-facture.component.css']
})
export class AddCircuitFactureComponent {
  reactiveForm_add_circuit_facture !: FormGroup;
  submitted:boolean=false
  loading_add_circuit_facture :boolean=false
  form_details: any = {}
  loading_get_details_add_circuit_facture_form = false
  constructor(private formBuilder: FormBuilder,public api:ApiService, public activeModal: NgbActiveModal) { }

  ngOnInit(): void {
      this.get_details_add_circuit_facture_form()
      this.init_form()
  }
  init_form() {
      this.reactiveForm_add_circuit_facture  = this.formBuilder.group({
          id_facture: ["", Validators.required],
date: [""],
updated_at: ["", Validators.required]
      });
  }

  // acces facile au champs de votre formulaire
  get f(): any { return this.reactiveForm_add_circuit_facture .controls; }
  // validation du formulaire
  onSubmit_add_circuit_facture () {
      this.submitted = true;
      console.log(this.reactiveForm_add_circuit_facture .value)
      // stop here if form is invalid
      if (this.reactiveForm_add_circuit_facture .invalid) {
          return;
      }
      var circuit_facture =this.reactiveForm_add_circuit_facture .value
      this.add_circuit_facture (circuit_facture )
  }
  // vider le formulaire
  onReset_add_circuit_facture () {
      this.submitted = false;
      this.reactiveForm_add_circuit_facture .reset();
  }
  add_circuit_facture(circuit_facture: any) {
      this.loading_add_circuit_facture = true;
      this.api.taf_post("circuit_facture/add", circuit_facture, (reponse: any) => {
      this.loading_add_circuit_facture = false;
      if (reponse.status) {
          console.log("Opération effectuée avec succés sur la table circuit_facture. Réponse= ", reponse);
          this.onReset_add_circuit_facture()
          this.api.Swal_success("Opération éffectuée avec succés")
          this.activeModal.close(reponse)
      } else {
          console.log("L'opération sur la table circuit_facture a échoué. Réponse= ", reponse);
          this.api.Swal_error("L'opération a echoué")
      }
    }, (error: any) => {
        this.loading_add_circuit_facture = false;
    })
  }
  
  get_details_add_circuit_facture_form() {
      this.loading_get_details_add_circuit_facture_form = true;
      this.api.taf_post("circuit_facture/get_form_details", {}, (reponse: any) => {
        if (reponse.status) {
          this.form_details = reponse.data
          console.log("Opération effectuée avec succés sur la table circuit_facture. Réponse= ", reponse);
        } else {
          console.log("L'opération sur la table circuit_facture a échoué. Réponse= ", reponse);
          this.api.Swal_error("L'opération a echoué")
        }
        this.loading_get_details_add_circuit_facture_form = false;
      }, (error: any) => {
      this.loading_get_details_add_circuit_facture_form = false;
    })
  }
}
