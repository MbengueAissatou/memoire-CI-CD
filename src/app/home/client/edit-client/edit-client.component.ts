
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../../service/api/api.service';
import { CommonModule } from '@angular/common';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-edit-client',
  standalone: true, // Composant autonome
  imports: [CommonModule, ReactiveFormsModule], // Dépendances importées
  templateUrl: './edit-client.component.html',
  styleUrls: ['./edit-client.component.css']
})
export class EditClientComponent {
  reactiveForm_edit_client !: FormGroup;
  submitted: boolean = false
  loading_edit_client: boolean = false
  @Input()
  client_to_edit: any = {}
  form_details: any = {}
  loading_get_details_edit_client_form = false
  constructor(private formBuilder: FormBuilder, public api: ApiService, public activeModal: NgbActiveModal) {

  }
  ngOnInit(): void {
    this.get_details_edit_client_form()
    this.update_form(this.client_to_edit)
  }
  // mise à jour du formulaire
  update_form(client_to_edit: any) {
    this.reactiveForm_edit_client = this.formBuilder.group({
      id_pays: [client_to_edit.id_pays, Validators.required],
      nom: [client_to_edit.nom, Validators.required],
      telephone: [client_to_edit.telephone],
      email: [client_to_edit.email],
      description: [client_to_edit.description],
      logo: [client_to_edit.logo],
    });
  }

  // acces facile au champs de votre formulaire
  get f(): any { return this.reactiveForm_edit_client.controls; }
  // validation du formulaire
  onSubmit_edit_client() {
    this.submitted = true;
    console.log(this.reactiveForm_edit_client.value)
    // stop here if form is invalid
    if (this.reactiveForm_edit_client.invalid) {
      return;
    }
    var client = this.reactiveForm_edit_client.value
    this.edit_client({
      condition: JSON.stringify({ id_client: this.client_to_edit.id_client }),
      data: JSON.stringify(client)
    })
  }
  // vider le formulaire
  onReset_edit_client() {
    this.submitted = false;
    this.reactiveForm_edit_client.reset();
  }
  edit_client(client: any) {
    this.loading_edit_client = true;
    this.api.taf_post("client/edit", client, (reponse: any) => {
      if (reponse.status) {
        this.activeModal.close(reponse)
        console.log("Opération effectuée avec succés sur la table client. Réponse= ", reponse);
        //this.onReset_edit_client()
        this.api.Swal_success("Opération éffectuée avec succés")
      } else {
        console.log("L'opération sur la table client a échoué. Réponse= ", reponse);
        this.api.Swal_error("L'opération a echoué")
      }
      this.loading_edit_client = false;
    }, (error: any) => {
      this.loading_edit_client = false;
    })
  }
  get_details_edit_client_form() {
    this.loading_get_details_edit_client_form = true;
    this.api.taf_post("client/get_form_details", {}, (reponse: any) => {
      if (reponse.status) {
        this.form_details = reponse.data
        console.log("Opération effectuée avec succés sur la table client. Réponse= ", reponse);
      } else {
        console.log("L'opération sur la table client a échoué. Réponse= ", reponse);
        this.api.Swal_error("L'opération a echoué")
      }
      this.loading_get_details_edit_client_form = false;
    }, (error: any) => {
      this.loading_get_details_edit_client_form = false;
    })
  }
}
