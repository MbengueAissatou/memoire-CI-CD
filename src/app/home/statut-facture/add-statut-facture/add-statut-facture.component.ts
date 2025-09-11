
import { Component, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../../service/api/api.service';
import { CommonModule } from '@angular/common';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-add-statut-facture',
  standalone: true, // Composant autonome
  imports: [CommonModule, ReactiveFormsModule], // Dépendances importées
  templateUrl: './add-statut-facture.component.html',
  styleUrls: ['./add-statut-facture.component.css']
})
export class AddStatutFactureComponent {
  reactiveForm_add_statut_facture !: FormGroup;
  submitted:boolean=false
  loading_add_statut_facture :boolean=false
  form_details: any = {}
  loading_get_details_add_statut_facture_form = false
  constructor(private formBuilder: FormBuilder,public api:ApiService, public activeModal: NgbActiveModal) { }

  ngOnInit(): void {
      this.get_details_add_statut_facture_form()
      this.init_form()
  }
  init_form() {
      this.reactiveForm_add_statut_facture  = this.formBuilder.group({
          nom: ["", Validators.required],
description: [""],
updated_at: ["", Validators.required]
      });
  }

  // acces facile au champs de votre formulaire
  get f(): any { return this.reactiveForm_add_statut_facture .controls; }
  // validation du formulaire
  onSubmit_add_statut_facture () {
      this.submitted = true;
      console.log(this.reactiveForm_add_statut_facture .value)
      // stop here if form is invalid
      if (this.reactiveForm_add_statut_facture .invalid) {
          return;
      }
      var statut_facture =this.reactiveForm_add_statut_facture .value
      this.add_statut_facture (statut_facture )
  }
  // vider le formulaire
  onReset_add_statut_facture () {
      this.submitted = false;
      this.reactiveForm_add_statut_facture .reset();
  }
  add_statut_facture(statut_facture: any) {
      this.loading_add_statut_facture = true;
      this.api.taf_post("statut_facture/add", statut_facture, (reponse: any) => {
      this.loading_add_statut_facture = false;
      if (reponse.status) {
          console.log("Opération effectuée avec succés sur la table statut_facture. Réponse= ", reponse);
          this.onReset_add_statut_facture()
          this.api.Swal_success("Opération éffectuée avec succés")
          this.activeModal.close(reponse)
      } else {
          console.log("L'opération sur la table statut_facture a échoué. Réponse= ", reponse);
          this.api.Swal_error("L'opération a echoué")
      }
    }, (error: any) => {
        this.loading_add_statut_facture = false;
    })
  }
  
  get_details_add_statut_facture_form() {
      this.loading_get_details_add_statut_facture_form = true;
      this.api.taf_post("statut_facture/get_form_details", {}, (reponse: any) => {
        if (reponse.status) {
          this.form_details = reponse.data
          console.log("Opération effectuée avec succés sur la table statut_facture. Réponse= ", reponse);
        } else {
          console.log("L'opération sur la table statut_facture a échoué. Réponse= ", reponse);
          this.api.Swal_error("L'opération a echoué")
        }
        this.loading_get_details_add_statut_facture_form = false;
      }, (error: any) => {
      this.loading_get_details_add_statut_facture_form = false;
    })
  }
}
