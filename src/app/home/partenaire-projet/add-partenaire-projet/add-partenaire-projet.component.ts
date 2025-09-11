
import { Component, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../../service/api/api.service';
import { CommonModule } from '@angular/common';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-add-partenaire-projet',
  standalone: true, // Composant autonome
  imports: [CommonModule, ReactiveFormsModule], // Dépendances importées
  templateUrl: './add-partenaire-projet.component.html',
  styleUrls: ['./add-partenaire-projet.component.css']
})
export class AddPartenaireProjetComponent {
  reactiveForm_add_partenaire_projet !: FormGroup;
  submitted:boolean=false
  loading_add_partenaire_projet :boolean=false
  form_details: any = {}
  loading_get_details_add_partenaire_projet_form = false
  constructor(private formBuilder: FormBuilder,public api:ApiService, public activeModal: NgbActiveModal) { }

  ngOnInit(): void {
      this.get_details_add_partenaire_projet_form()
      this.init_form()
  }
  init_form() {
      this.reactiveForm_add_partenaire_projet  = this.formBuilder.group({
          id_projet: ["", Validators.required],
id_partenaire: ["", Validators.required],
pourcentage_montant_base: [""],
updated_at: ["", Validators.required]
      });
  }

  // acces facile au champs de votre formulaire
  get f(): any { return this.reactiveForm_add_partenaire_projet .controls; }
  // validation du formulaire
  onSubmit_add_partenaire_projet () {
      this.submitted = true;
      console.log(this.reactiveForm_add_partenaire_projet .value)
      // stop here if form is invalid
      if (this.reactiveForm_add_partenaire_projet .invalid) {
          return;
      }
      var partenaire_projet =this.reactiveForm_add_partenaire_projet .value
      this.add_partenaire_projet (partenaire_projet )
  }
  // vider le formulaire
  onReset_add_partenaire_projet () {
      this.submitted = false;
      this.reactiveForm_add_partenaire_projet .reset();
  }
  add_partenaire_projet(partenaire_projet: any) {
      this.loading_add_partenaire_projet = true;
      this.api.taf_post("partenaire_projet/add", partenaire_projet, (reponse: any) => {
      this.loading_add_partenaire_projet = false;
      if (reponse.status) {
          console.log("Opération effectuée avec succés sur la table partenaire_projet. Réponse= ", reponse);
          this.onReset_add_partenaire_projet()
          this.api.Swal_success("Opération éffectuée avec succés")
          this.activeModal.close(reponse)
      } else {
          console.log("L'opération sur la table partenaire_projet a échoué. Réponse= ", reponse);
          this.api.Swal_error("L'opération a echoué")
      }
    }, (error: any) => {
        this.loading_add_partenaire_projet = false;
    })
  }
  
  get_details_add_partenaire_projet_form() {
      this.loading_get_details_add_partenaire_projet_form = true;
      this.api.taf_post("partenaire_projet/get_form_details", {}, (reponse: any) => {
        if (reponse.status) {
          this.form_details = reponse.data
          console.log("Opération effectuée avec succés sur la table partenaire_projet. Réponse= ", reponse);
        } else {
          console.log("L'opération sur la table partenaire_projet a échoué. Réponse= ", reponse);
          this.api.Swal_error("L'opération a echoué")
        }
        this.loading_get_details_add_partenaire_projet_form = false;
      }, (error: any) => {
      this.loading_get_details_add_partenaire_projet_form = false;
    })
  }
}
