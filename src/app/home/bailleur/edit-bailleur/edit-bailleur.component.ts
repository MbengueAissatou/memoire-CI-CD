
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../../service/api/api.service';
import { CommonModule } from '@angular/common';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-edit-bailleur',
  standalone: true, // Composant autonome
  imports: [CommonModule, ReactiveFormsModule], // Dépendances importées
  templateUrl: './edit-bailleur.component.html',
  styleUrls: ['./edit-bailleur.component.css']
})
export class EditBailleurComponent {
  reactiveForm_edit_bailleur !: FormGroup;
  submitted: boolean = false
  loading_edit_bailleur: boolean = false
  @Input()
  bailleur_to_edit: any = {}
  form_details: any = {}
  loading_get_details_edit_bailleur_form = false
  constructor(private formBuilder: FormBuilder, public api: ApiService, public activeModal: NgbActiveModal) {

  }
  ngOnInit(): void {
    this.get_details_edit_bailleur_form()
    this.update_form(this.bailleur_to_edit)
  }
  // mise à jour du formulaire
  update_form(bailleur_to_edit: any) {
    this.reactiveForm_edit_bailleur = this.formBuilder.group({
      nom_bailleur: [bailleur_to_edit.nom_bailleur, Validators.required],
      abreviation: [bailleur_to_edit.abreviation,Validators.required],
      description: [bailleur_to_edit.description],
      nom_point_focal: [bailleur_to_edit.nom_point_focal],
      numero_point_focal: [bailleur_to_edit.numero_point_focal],
    });
  }

  // acces facile au champs de votre formulaire
  get f(): any { return this.reactiveForm_edit_bailleur.controls; }
  // validation du formulaire
  onSubmit_edit_bailleur() {
    this.submitted = true;
    console.log(this.reactiveForm_edit_bailleur.value)
    // stop here if form is invalid
    if (this.reactiveForm_edit_bailleur.invalid) {
      return;
    }
    var bailleur = this.reactiveForm_edit_bailleur.value
    this.edit_bailleur({
      condition: JSON.stringify({ id_bailleur: this.bailleur_to_edit.id_bailleur }),
      data: JSON.stringify(bailleur)
    })
  }
  // vider le formulaire
  onReset_edit_bailleur() {
    this.submitted = false;
    this.reactiveForm_edit_bailleur.reset();
  }
  edit_bailleur(bailleur: any) {
    this.loading_edit_bailleur = true;
    this.api.taf_post("bailleur/edit", bailleur, (reponse: any) => {
      if (reponse.status) {
        this.activeModal.close(reponse)
        console.log("Opération effectuée avec succés sur la table bailleur. Réponse= ", reponse);
        //this.onReset_edit_bailleur()
        this.api.Swal_success("Opération éffectuée avec succés")
      } else {
        console.log("L'opération sur la table bailleur a échoué. Réponse= ", reponse);
        this.api.Swal_error("L'opération a echoué")
      }
      this.loading_edit_bailleur = false;
    }, (error: any) => {
      this.loading_edit_bailleur = false;
    })
  }
  get_details_edit_bailleur_form() {
    this.loading_get_details_edit_bailleur_form = true;
    this.api.taf_post("bailleur/get_form_details", {}, (reponse: any) => {
      if (reponse.status) {
        this.form_details = reponse.data
        console.log("Opération effectuée avec succés sur la table bailleur. Réponse= ", reponse);
      } else {
        console.log("L'opération sur la table bailleur a échoué. Réponse= ", reponse);
        this.api.Swal_error("L'opération a echoué")
      }
      this.loading_get_details_edit_bailleur_form = false;
    }, (error: any) => {
      this.loading_get_details_edit_bailleur_form = false;
    })
  }
}
