
import { Component, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../../service/api/api.service';
import { CommonModule } from '@angular/common';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-add-client',
  standalone: true, // Composant autonome
  imports: [CommonModule, ReactiveFormsModule], // Dépendances importées
  templateUrl: './add-client.component.html',
  styleUrls: ['./add-client.component.css']
})
export class AddClientComponent {
  reactiveForm_add_client !: FormGroup;
  submitted: boolean = false
  loading_add_client: boolean = false
  form_details: any = {}
  loading_get_details_add_client_form = false
  constructor(private formBuilder: FormBuilder, public api: ApiService, public activeModal: NgbActiveModal) { }

  ngOnInit(): void {
    this.get_details_add_client_form()
    this.init_form()
  }
  init_form() {
    this.reactiveForm_add_client = this.formBuilder.group({
      id_pays: ["", Validators.required],
      nom: ["", Validators.required],
      telephone: [""],
      email: [""],
      description: [""],
      logo: [""],
    });
  }

  // acces facile au champs de votre formulaire
  get f(): any { return this.reactiveForm_add_client.controls; }
  // validation du formulaire
  onSubmit_add_client() {
    this.submitted = true;
    console.log(this.reactiveForm_add_client.value)
    // stop here if form is invalid
    if (this.reactiveForm_add_client.invalid) {
      return;
    }
    var client = this.reactiveForm_add_client.value
    this.add_client(client)
  }
  // vider le formulaire
  onReset_add_client() {
    this.submitted = false;
    this.reactiveForm_add_client.reset();
  }
  add_client(client: any) {
    this.loading_add_client = true;
    this.api.taf_post("client/add", client, (reponse: any) => {
      this.loading_add_client = false;
      if (reponse.status) {
        console.log("Opération effectuée avec succés sur la table client. Réponse= ", reponse);
        this.onReset_add_client()
        this.api.Swal_success("Opération éffectuée avec succés")
        this.activeModal.close(reponse)
      } else {
        console.log("L'opération sur la table client a échoué. Réponse= ", reponse);
        this.api.Swal_error("L'opération a echoué")
      }
    }, (error: any) => {
      this.loading_add_client = false;
    })
  }

  get_details_add_client_form() {
    this.loading_get_details_add_client_form = true;
    this.api.taf_post("client/get_form_details", {}, (reponse: any) => {
      if (reponse.status) {
        this.form_details = reponse.data
        console.log("Opération effectuée avec succés sur la table client. Réponse= ", reponse);
      } else {
        console.log("L'opération sur la table client a échoué. Réponse= ", reponse);
        this.api.Swal_error("L'opération a echoué")
      }
      this.loading_get_details_add_client_form = false;
    }, (error: any) => {
      this.loading_get_details_add_client_form = false;
    })
  }
}
