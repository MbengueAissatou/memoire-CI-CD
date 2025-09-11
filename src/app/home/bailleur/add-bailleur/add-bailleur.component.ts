
import { Component, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../../service/api/api.service';
import { CommonModule } from '@angular/common';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-add-bailleur',
  standalone: true, // Composant autonome
  imports: [CommonModule, ReactiveFormsModule], // Dépendances importées
  templateUrl: './add-bailleur.component.html',
  styleUrls: ['./add-bailleur.component.css']
})
export class AddBailleurComponent {
  reactiveForm_add_bailleur !: FormGroup;
  submitted: boolean = false
  loading_add_bailleur: boolean = false
  form_details: any = {}
  loading_get_details_add_bailleur_form = false
  constructor(private formBuilder: FormBuilder, public api: ApiService, public activeModal: NgbActiveModal) { }

  ngOnInit(): void {
    this.get_details_add_bailleur_form()
    this.init_form()
  }
  init_form() {
    this.reactiveForm_add_bailleur = this.formBuilder.group({
      nom_bailleur: ["", Validators.required],
      abreviation: ["",Validators.required],
      description: [""],
      nom_point_focal: [""],
      numero_point_focal: [""],
    });
  }

  // acces facile au champs de votre formulaire
  get f(): any { return this.reactiveForm_add_bailleur.controls; }
  // validation du formulaire
  onSubmit_add_bailleur() {
    this.submitted = true;
    console.log(this.reactiveForm_add_bailleur.value)
    // stop here if form is invalid
    if (this.reactiveForm_add_bailleur.invalid) {
      return;
    }
    var bailleur = this.reactiveForm_add_bailleur.value
    this.add_bailleur(bailleur)
  }
  // vider le formulaire
  onReset_add_bailleur() {
    this.submitted = false;
    this.reactiveForm_add_bailleur.reset();
  }
  add_bailleur(bailleur: any) {
    this.loading_add_bailleur = true;
    this.api.taf_post("bailleur/add", bailleur, (reponse: any) => {
      this.loading_add_bailleur = false;
      if (reponse.status) {
        console.log("Opération effectuée avec succés sur la table bailleur. Réponse= ", reponse);
        this.onReset_add_bailleur()
        this.api.Swal_success("Opération éffectuée avec succés")
        this.activeModal.close(reponse)
      } else {
        console.log("L'opération sur la table bailleur a échoué. Réponse= ", reponse);
        this.api.Swal_error("L'opération a echoué")
      }
    }, (error: any) => {
      this.loading_add_bailleur = false;
    })
  }

  get_details_add_bailleur_form() {
    this.loading_get_details_add_bailleur_form = true;
    this.api.taf_post("bailleur/get_form_details", {}, (reponse: any) => {
      if (reponse.status) {
        this.form_details = reponse.data
        console.log("Opération effectuée avec succés sur la table bailleur. Réponse= ", reponse);
      } else {
        console.log("L'opération sur la table bailleur a échoué. Réponse= ", reponse);
        this.api.Swal_error("L'opération a echoué")
      }
      this.loading_get_details_add_bailleur_form = false;
    }, (error: any) => {
      this.loading_get_details_add_bailleur_form = false;
    })
  }
}
