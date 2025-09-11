
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../../service/api/api.service';
import { CommonModule } from '@angular/common';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-edit-partenaire',
  standalone: true, // Composant autonome
  imports: [CommonModule, ReactiveFormsModule], // Dépendances importées
  templateUrl: './edit-partenaire.component.html',
  styleUrls: ['./edit-partenaire.component.css']
})
export class EditPartenaireComponent {
  reactiveForm_edit_partenaire !: FormGroup;
  submitted: boolean = false
  loading_edit_partenaire: boolean = false
  @Input()
  partenaire_to_edit: any = {}
  form_details: any = {}
  loading_get_details_edit_partenaire_form = false
  constructor(private formBuilder: FormBuilder, public api: ApiService, public activeModal: NgbActiveModal) {

  }
  ngOnInit(): void {
    this.get_details_edit_partenaire_form()
    this.update_form(this.partenaire_to_edit)
  }
  // mise à jour du formulaire
  update_form(partenaire_to_edit: any) {
    this.reactiveForm_edit_partenaire = this.formBuilder.group({
      nom_partenaire: [partenaire_to_edit.nom_partenaire, Validators.required],
      description: [partenaire_to_edit.description],
      nom_point_focal: [partenaire_to_edit.nom_point_focal],
      numero_point_focal: [partenaire_to_edit.numero_point_focal],
      logo: [partenaire_to_edit.logo],
    });
  }

  // acces facile au champs de votre formulaire
  get f(): any { return this.reactiveForm_edit_partenaire.controls; }
  // validation du formulaire
  onSubmit_edit_partenaire() {
    this.submitted = true;
    console.log(this.reactiveForm_edit_partenaire.value)
    // stop here if form is invalid
    if (this.reactiveForm_edit_partenaire.invalid) {
      return;
    }
    var partenaire = this.reactiveForm_edit_partenaire.value
    this.edit_partenaire({
      condition: JSON.stringify({ id_partenaire: this.partenaire_to_edit.id_partenaire }),
      data: JSON.stringify(partenaire)
    })
  }
  // vider le formulaire
  onReset_edit_partenaire() {
    this.submitted = false;
    this.reactiveForm_edit_partenaire.reset();
  }
  edit_partenaire(partenaire: any) {
    this.loading_edit_partenaire = true;
    this.api.taf_post("partenaire/edit", partenaire, (reponse: any) => {
      if (reponse.status) {
        this.activeModal.close(reponse)
        console.log("Opération effectuée avec succés sur la table partenaire. Réponse= ", reponse);
        //this.onReset_edit_partenaire()
        this.api.Swal_success("Opération éffectuée avec succés")
      } else {
        console.log("L'opération sur la table partenaire a échoué. Réponse= ", reponse);
        this.api.Swal_error("L'opération a echoué")
      }
      this.loading_edit_partenaire = false;
    }, (error: any) => {
      this.loading_edit_partenaire = false;
    })
  }
  get_details_edit_partenaire_form() {
    this.loading_get_details_edit_partenaire_form = true;
    this.api.taf_post("partenaire/get_form_details", {}, (reponse: any) => {
      if (reponse.status) {
        this.form_details = reponse.data
        console.log("Opération effectuée avec succés sur la table partenaire. Réponse= ", reponse);
      } else {
        console.log("L'opération sur la table partenaire a échoué. Réponse= ", reponse);
        this.api.Swal_error("L'opération a echoué")
      }
      this.loading_get_details_edit_partenaire_form = false;
    }, (error: any) => {
      this.loading_get_details_edit_partenaire_form = false;
    })
  }
}
