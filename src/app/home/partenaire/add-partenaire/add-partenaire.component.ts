
import { Component, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../../service/api/api.service';
import { CommonModule } from '@angular/common';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-add-partenaire',
  standalone: true, // Composant autonome
  imports: [CommonModule, ReactiveFormsModule], // Dépendances importées
  templateUrl: './add-partenaire.component.html',
  styleUrls: ['./add-partenaire.component.css']
})
export class AddPartenaireComponent {
  reactiveForm_add_partenaire !: FormGroup;
  submitted: boolean = false
  loading_add_partenaire: boolean = false
  form_details: any = {}
  loading_get_details_add_partenaire_form = false
  constructor(private formBuilder: FormBuilder, public api: ApiService, public activeModal: NgbActiveModal) { }

  ngOnInit(): void {
    this.get_details_add_partenaire_form()
    this.init_form()
  }
  init_form() {
    this.reactiveForm_add_partenaire = this.formBuilder.group({
      nom_partenaire: ["", Validators.required],
      description: [""],
      nom_point_focal: [""],
      numero_point_focal: [""],
      logo: [""],
    });
  }

  // acces facile au champs de votre formulaire
  get f(): any { return this.reactiveForm_add_partenaire.controls; }
  // validation du formulaire
  onSubmit_add_partenaire() {
    this.submitted = true;
    console.log(this.reactiveForm_add_partenaire.value)
    // stop here if form is invalid
    if (this.reactiveForm_add_partenaire.invalid) {
      return;
    }
    var partenaire = this.reactiveForm_add_partenaire.value
    this.add_partenaire(partenaire)
  }
  // vider le formulaire
  onReset_add_partenaire() {
    this.submitted = false;
    this.reactiveForm_add_partenaire.reset();
  }
  add_partenaire(partenaire: any) {
    this.loading_add_partenaire = true;
    this.api.taf_post("partenaire/add", partenaire, (reponse: any) => {
      this.loading_add_partenaire = false;
      if (reponse.status) {
        console.log("Opération effectuée avec succés sur la table partenaire. Réponse= ", reponse);
        this.onReset_add_partenaire()
        this.api.Swal_success("Opération éffectuée avec succés")
        this.activeModal.close(reponse)
      } else {
        console.log("L'opération sur la table partenaire a échoué. Réponse= ", reponse);
        this.api.Swal_error("L'opération a echoué")
      }
    }, (error: any) => {
      this.loading_add_partenaire = false;
    })
  }

  get_details_add_partenaire_form() {
    this.loading_get_details_add_partenaire_form = true;
    this.api.taf_post("partenaire/get_form_details", {}, (reponse: any) => {
      if (reponse.status) {
        this.form_details = reponse.data
        console.log("Opération effectuée avec succés sur la table partenaire. Réponse= ", reponse);
      } else {
        console.log("L'opération sur la table partenaire a échoué. Réponse= ", reponse);
        this.api.Swal_error("L'opération a echoué")
      }
      this.loading_get_details_add_partenaire_form = false;
    }, (error: any) => {
      this.loading_get_details_add_partenaire_form = false;
    })
  }
}
