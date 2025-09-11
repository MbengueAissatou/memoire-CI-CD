
import { Component, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../../service/api/api.service';
import { CommonModule } from '@angular/common';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-add-utilisateur',
  standalone: true, // Composant autonome
  imports: [CommonModule, ReactiveFormsModule], // Dépendances importées
  templateUrl: './add-utilisateur.component.html',
  styleUrls: ['./add-utilisateur.component.css']
})
export class AddUtilisateurComponent {
  reactiveForm_add_utilisateur !: FormGroup;
  submitted:boolean=false
  loading_add_utilisateur :boolean=false
  form_details: any = {}
  loading_get_details_add_utilisateur_form = false
  constructor(private formBuilder: FormBuilder,public api:ApiService, public activeModal: NgbActiveModal) { }

  ngOnInit(): void {
      this.get_details_add_utilisateur_form()
      this.init_form()
  }
  init_form() {
      this.reactiveForm_add_utilisateur  = this.formBuilder.group({
          id_privilege: ["", Validators.required],
nom: ["", Validators.required],
prenom: [""],
email: [""],
telephone: [""],
logo: [""],
password: ["", Validators.required],
profil: [""],
statut: [""],
updated_at: ["", Validators.required]
      });
  }

  // acces facile au champs de votre formulaire
  get f(): any { return this.reactiveForm_add_utilisateur .controls; }
  // validation du formulaire
  onSubmit_add_utilisateur () {
      this.submitted = true;
      console.log(this.reactiveForm_add_utilisateur .value)
      // stop here if form is invalid
      if (this.reactiveForm_add_utilisateur .invalid) {
          return;
      }
      var utilisateur =this.reactiveForm_add_utilisateur .value
      this.add_utilisateur (utilisateur )
  }
  // vider le formulaire
  onReset_add_utilisateur () {
      this.submitted = false;
      this.reactiveForm_add_utilisateur .reset();
  }
  add_utilisateur(utilisateur: any) {
      this.loading_add_utilisateur = true;
      this.api.taf_post("utilisateur/add", utilisateur, (reponse: any) => {
      this.loading_add_utilisateur = false;
      if (reponse.status) {
          console.log("Opération effectuée avec succés sur la table utilisateur. Réponse= ", reponse);
          this.onReset_add_utilisateur()
          this.api.Swal_success("Opération éffectuée avec succés")
          this.activeModal.close(reponse)
      } else {
          console.log("L'opération sur la table utilisateur a échoué. Réponse= ", reponse);
          this.api.Swal_error("L'opération a echoué")
      }
    }, (error: any) => {
        this.loading_add_utilisateur = false;
    })
  }
  
  get_details_add_utilisateur_form() {
      this.loading_get_details_add_utilisateur_form = true;
      this.api.taf_post("utilisateur/get_form_details", {}, (reponse: any) => {
        if (reponse.status) {
          this.form_details = reponse.data
          console.log("Opération effectuée avec succés sur la table utilisateur. Réponse= ", reponse);
        } else {
          console.log("L'opération sur la table utilisateur a échoué. Réponse= ", reponse);
          this.api.Swal_error("L'opération a echoué")
        }
        this.loading_get_details_add_utilisateur_form = false;
      }, (error: any) => {
      this.loading_get_details_add_utilisateur_form = false;
    })
  }
}
