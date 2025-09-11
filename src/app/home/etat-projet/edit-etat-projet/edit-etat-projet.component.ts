
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../../service/api/api.service';
import { CommonModule } from '@angular/common';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DataService } from 'src/app/service/data/data.service';
import { NgSelectModule } from '@ng-select/ng-select';
@Component({
  selector: 'app-edit-etat-projet',
  standalone: true, // Composant autonome
  imports: [CommonModule, ReactiveFormsModule, NgSelectModule], // Dépendances importées
  templateUrl: './edit-etat-projet.component.html',
  styleUrls: ['./edit-etat-projet.component.css']
})
export class EditEtatProjetComponent {
  reactiveForm_edit_etat_projet !: FormGroup;
  submitted: boolean = false
  loading_edit_etat_projet: boolean = false
  @Input()
  etat_projet_to_edit: any = {}
  form_details: any = {}
  loading_get_details_edit_etat_projet_form = false
  constructor(private formBuilder: FormBuilder, public api: ApiService, public activeModal: NgbActiveModal, public data: DataService) {

  }
  ngOnInit(): void {
    this.get_details_edit_etat_projet_form()
    this.update_form(this.etat_projet_to_edit)
  }
  // mise à jour du formulaire
  update_form(etat_projet_to_edit: any) {
    this.reactiveForm_edit_etat_projet = this.formBuilder.group({
      nom: [etat_projet_to_edit.nom, Validators.required],
      description: [etat_projet_to_edit.description],
      couleur: [etat_projet_to_edit.couleur],
      icone: [etat_projet_to_edit.icone]

    });
  }

  // acces facile au champs de votre formulaire
  get f(): any { return this.reactiveForm_edit_etat_projet.controls; }
  // validation du formulaire
  onSubmit_edit_etat_projet() {
    this.submitted = true;
    console.log(this.reactiveForm_edit_etat_projet.value)
    // stop here if form is invalid
    if (this.reactiveForm_edit_etat_projet.invalid) {
      return;
    }
    var etat_projet = this.reactiveForm_edit_etat_projet.value
    this.edit_etat_projet({
      condition: JSON.stringify({ id_etat_projet: this.etat_projet_to_edit.id_etat_projet }),
      data: JSON.stringify(etat_projet)
    })
  }
  // vider le formulaire
  onReset_edit_etat_projet() {
    this.submitted = false;
    this.reactiveForm_edit_etat_projet.reset();
  }
  edit_etat_projet(etat_projet: any) {
    this.loading_edit_etat_projet = true;
    this.api.taf_post("etat_projet/edit", etat_projet, (reponse: any) => {
      if (reponse.status) {
        this.activeModal.close(reponse)
        console.log("Opération effectuée avec succés sur la table etat_projet. Réponse= ", reponse);
        //this.onReset_edit_etat_projet()
        this.api.Swal_success("Opération éffectuée avec succés")
      } else {
        console.log("L'opération sur la table etat_projet a échoué. Réponse= ", reponse);
        this.api.Swal_error("L'opération a echoué")
      }
      this.loading_edit_etat_projet = false;
    }, (error: any) => {
      this.loading_edit_etat_projet = false;
    })
  }
  get_details_edit_etat_projet_form() {
    this.loading_get_details_edit_etat_projet_form = true;
    this.api.taf_post("etat_projet/get_form_details", {}, (reponse: any) => {
      if (reponse.status) {
        this.form_details = reponse.data
        console.log("Opération effectuée avec succés sur la table etat_projet. Réponse= ", reponse);
      } else {
        console.log("L'opération sur la table etat_projet a échoué. Réponse= ", reponse);
        this.api.Swal_error("L'opération a echoué")
      }
      this.loading_get_details_edit_etat_projet_form = false;
    }, (error: any) => {
      this.loading_get_details_edit_etat_projet_form = false;
    })
  }
}
