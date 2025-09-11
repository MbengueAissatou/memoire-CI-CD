
import { Component, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../../service/api/api.service';
import { CommonModule } from '@angular/common';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-add-fichier',
  standalone: true, // Composant autonome
  imports: [CommonModule, ReactiveFormsModule], // Dépendances importées
  templateUrl: './add-fichier.component.html',
  styleUrls: ['./add-fichier.component.css']
})
export class AddFichierComponent {
  reactiveForm_add_fichier !: FormGroup;
  submitted:boolean=false
  loading_add_fichier :boolean=false
  form_details: any = {}
  loading_get_details_add_fichier_form = false
  constructor(private formBuilder: FormBuilder,public api:ApiService, public activeModal: NgbActiveModal) { }

  ngOnInit(): void {
      this.get_details_add_fichier_form()
      this.init_form()
  }
  init_form() {
      this.reactiveForm_add_fichier  = this.formBuilder.group({
          id_projet: ["", Validators.required],
piece_jointe: [""],
updated_at: ["", Validators.required]
      });
  }

  // acces facile au champs de votre formulaire
  get f(): any { return this.reactiveForm_add_fichier .controls; }
  // validation du formulaire
  onSubmit_add_fichier () {
      this.submitted = true;
      console.log(this.reactiveForm_add_fichier .value)
      // stop here if form is invalid
      if (this.reactiveForm_add_fichier .invalid) {
          return;
      }
      var fichier =this.reactiveForm_add_fichier .value
      this.add_fichier (fichier )
  }
  // vider le formulaire
  onReset_add_fichier () {
      this.submitted = false;
      this.reactiveForm_add_fichier .reset();
  }
  add_fichier(fichier: any) {
      this.loading_add_fichier = true;
      this.api.taf_post("fichier/add", fichier, (reponse: any) => {
      this.loading_add_fichier = false;
      if (reponse.status) {
          console.log("Opération effectuée avec succés sur la table fichier. Réponse= ", reponse);
          this.onReset_add_fichier()
          this.api.Swal_success("Opération éffectuée avec succés")
          this.activeModal.close(reponse)
      } else {
          console.log("L'opération sur la table fichier a échoué. Réponse= ", reponse);
          this.api.Swal_error("L'opération a echoué")
      }
    }, (error: any) => {
        this.loading_add_fichier = false;
    })
  }
  
  get_details_add_fichier_form() {
      this.loading_get_details_add_fichier_form = true;
      this.api.taf_post("fichier/get_form_details", {}, (reponse: any) => {
        if (reponse.status) {
          this.form_details = reponse.data
          console.log("Opération effectuée avec succés sur la table fichier. Réponse= ", reponse);
        } else {
          console.log("L'opération sur la table fichier a échoué. Réponse= ", reponse);
          this.api.Swal_error("L'opération a echoué")
        }
        this.loading_get_details_add_fichier_form = false;
      }, (error: any) => {
      this.loading_get_details_add_fichier_form = false;
    })
  }
}
