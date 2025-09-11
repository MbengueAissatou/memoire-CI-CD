
import { Component, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../../service/api/api.service';
import { CommonModule } from '@angular/common';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-add-partie-prenante',
  standalone: true, // Composant autonome
  imports: [CommonModule, ReactiveFormsModule], // Dépendances importées
  templateUrl: './add-partie-prenante.component.html',
  styleUrls: ['./add-partie-prenante.component.css']
})
export class AddPartiePrenanteComponent {
  reactiveForm_add_partie_prenante !: FormGroup;
  submitted:boolean=false
  loading_add_partie_prenante :boolean=false
  form_details: any = {}
  loading_get_details_add_partie_prenante_form = false
  constructor(private formBuilder: FormBuilder,public api:ApiService, public activeModal: NgbActiveModal) { }

  ngOnInit(): void {
      this.get_details_add_partie_prenante_form()
      this.init_form()
  }
  init_form() {
      this.reactiveForm_add_partie_prenante  = this.formBuilder.group({
          nom: ["", Validators.required],
prenom: [""],
fonction: [""],
telephone: [""],
email: [""],
updated_at: ["", Validators.required]
      });
  }

  // acces facile au champs de votre formulaire
  get f(): any { return this.reactiveForm_add_partie_prenante .controls; }
  // validation du formulaire
  onSubmit_add_partie_prenante () {
      this.submitted = true;
      console.log(this.reactiveForm_add_partie_prenante .value)
      // stop here if form is invalid
      if (this.reactiveForm_add_partie_prenante .invalid) {
          return;
      }
      var partie_prenante =this.reactiveForm_add_partie_prenante .value
      this.add_partie_prenante (partie_prenante )
  }
  // vider le formulaire
  onReset_add_partie_prenante () {
      this.submitted = false;
      this.reactiveForm_add_partie_prenante .reset();
  }
  add_partie_prenante(partie_prenante: any) {
      this.loading_add_partie_prenante = true;
      this.api.taf_post("partie_prenante/add", partie_prenante, (reponse: any) => {
      this.loading_add_partie_prenante = false;
      if (reponse.status) {
          console.log("Opération effectuée avec succés sur la table partie_prenante. Réponse= ", reponse);
          this.onReset_add_partie_prenante()
          this.api.Swal_success("Opération éffectuée avec succés")
          this.activeModal.close(reponse)
      } else {
          console.log("L'opération sur la table partie_prenante a échoué. Réponse= ", reponse);
          this.api.Swal_error("L'opération a echoué")
      }
    }, (error: any) => {
        this.loading_add_partie_prenante = false;
    })
  }
  
  get_details_add_partie_prenante_form() {
      this.loading_get_details_add_partie_prenante_form = true;
      this.api.taf_post("partie_prenante/get_form_details", {}, (reponse: any) => {
        if (reponse.status) {
          this.form_details = reponse.data
          console.log("Opération effectuée avec succés sur la table partie_prenante. Réponse= ", reponse);
        } else {
          console.log("L'opération sur la table partie_prenante a échoué. Réponse= ", reponse);
          this.api.Swal_error("L'opération a echoué")
        }
        this.loading_get_details_add_partie_prenante_form = false;
      }, (error: any) => {
      this.loading_get_details_add_partie_prenante_form = false;
    })
  }
}
