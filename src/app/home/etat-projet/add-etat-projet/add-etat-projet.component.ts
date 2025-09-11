
import { Component, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../../service/api/api.service';
import { CommonModule } from '@angular/common';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { DataService } from 'src/app/service/data/data.service';

@Component({
  selector: 'app-add-etat-projet',
  standalone: true, // Composant autonome
  imports: [CommonModule, ReactiveFormsModule, NgSelectModule], // Dépendances importées
  templateUrl: './add-etat-projet.component.html',
  styleUrls: ['./add-etat-projet.component.css']
})
export class AddEtatProjetComponent {
  reactiveForm_add_etat_projet !: FormGroup;
  submitted: boolean = false
  loading_add_etat_projet: boolean = false
  form_details: any = {}
  loading_get_details_add_etat_projet_form = false
  constructor(private formBuilder: FormBuilder, public api: ApiService, public activeModal: NgbActiveModal,public data:DataService) { }

  ngOnInit(): void {
    this.get_details_add_etat_projet_form()
    this.init_form()
  }
  init_form() {
    this.reactiveForm_add_etat_projet = this.formBuilder.group({
      nom: ["", Validators.required],
      description: [""],
      couleur: [""],
      icone: [""],
      // updated_at: ["", ]
    });
  }

  // acces facile au champs de votre formulaire
  get f(): any { return this.reactiveForm_add_etat_projet.controls; }
  // validation du formulaire
  onSubmit_add_etat_projet() {
    this.submitted = true;
    console.log(this.reactiveForm_add_etat_projet.value)
    // stop here if form is invalid
    if (this.reactiveForm_add_etat_projet.invalid) {
      return;
    }
    var etat_projet = this.reactiveForm_add_etat_projet.value
    this.add_etat_projet(etat_projet)
  }
  // vider le formulaire
  onReset_add_etat_projet() {
    this.submitted = false;
    this.reactiveForm_add_etat_projet.reset();
  }
  add_etat_projet(etat_projet: any) {
    this.loading_add_etat_projet = true;
    this.api.taf_post("etat_projet/add", etat_projet, (reponse: any) => {
      this.loading_add_etat_projet = false;
      if (reponse.status) {
        console.log("Opération effectuée avec succés sur la table etat_projet. Réponse= ", reponse);
        this.onReset_add_etat_projet()
        this.api.Swal_success("Opération éffectuée avec succés")
        this.activeModal.close(reponse)
      } else {
        console.log("L'opération sur la table etat_projet a échoué. Réponse= ", reponse);
        this.api.Swal_error("L'opération a echoué")
      }
    }, (error: any) => {
      this.loading_add_etat_projet = false;
    })
  }

  get_details_add_etat_projet_form() {
    this.loading_get_details_add_etat_projet_form = true;
    this.api.taf_post("etat_projet/get_form_details", {}, (reponse: any) => {
      if (reponse.status) {
        this.form_details = reponse.data
        console.log("Opération effectuée avec succés sur la table etat_projet. Réponse= ", reponse);
      } else {
        console.log("L'opération sur la table etat_projet a échoué. Réponse= ", reponse);
        this.api.Swal_error("L'opération a echoué")
      }
      this.loading_get_details_add_etat_projet_form = false;
    }, (error: any) => {
      this.loading_get_details_add_etat_projet_form = false;
    })
  }
}
