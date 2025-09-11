
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../../service/api/api.service';
import { CommonModule } from '@angular/common';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-edit-pays',
  standalone: true, // Composant autonome
  imports: [CommonModule, ReactiveFormsModule], // Dépendances importées
  templateUrl: './edit-pays.component.html',
  styleUrls: ['./edit-pays.component.css']
})
export class EditPaysComponent {
  reactiveForm_edit_pays !: FormGroup;
  submitted: boolean = false
  loading_edit_pays: boolean = false
  @Input()
  pays_to_edit: any = {}
  form_details: any = {}
  loading_get_details_edit_pays_form = false
  constructor(private formBuilder: FormBuilder, public api: ApiService, public activeModal: NgbActiveModal) {

  }
  ngOnInit(): void {
    this.get_details_edit_pays_form()
    this.update_form(this.pays_to_edit)
  }
  // mise à jour du formulaire
  update_form(pays_to_edit: any) {
    this.reactiveForm_edit_pays = this.formBuilder.group({
      nom_pays: [pays_to_edit.nom_pays, Validators.required],
      // drapeau: [pays_to_edit.drapeau],
    });
  }

  // acces facile au champs de votre formulaire
  get f(): any { return this.reactiveForm_edit_pays.controls; }
  // validation du formulaire
  onSubmit_edit_pays() {
    this.submitted = true;
    console.log(this.reactiveForm_edit_pays.value)
    // stop here if form is invalid
    if (this.reactiveForm_edit_pays.invalid) {
      return;
    }
    var pays = this.reactiveForm_edit_pays.value
    this.edit_pays({
      condition: JSON.stringify({ id_pays: this.pays_to_edit.id_pays }),
      data: JSON.stringify(pays)
    })
  }
  // vider le formulaire
  onReset_edit_pays() {
    this.submitted = false;
    this.reactiveForm_edit_pays.reset();
  }
  edit_pays(pays: any) {
    this.loading_edit_pays = true;
    this.api.taf_post("pays/edit", pays, (reponse: any) => {
      if (reponse.status) {
        this.activeModal.close(reponse)
        console.log("Opération effectuée avec succés sur la table pays. Réponse= ", reponse);
        //this.onReset_edit_pays()
        this.api.Swal_success("Opération éffectuée avec succés")
      } else {
        console.log("L'opération sur la table pays a échoué. Réponse= ", reponse);
        this.api.Swal_error("L'opération a echoué")
      }
      this.loading_edit_pays = false;
    }, (error: any) => {
      this.loading_edit_pays = false;
    })
  }
  get_details_edit_pays_form() {
    this.loading_get_details_edit_pays_form = true;
    this.api.taf_post("pays/get_form_details", {}, (reponse: any) => {
      if (reponse.status) {
        this.form_details = reponse.data
        console.log("Opération effectuée avec succés sur la table pays. Réponse= ", reponse);
      } else {
        console.log("L'opération sur la table pays a échoué. Réponse= ", reponse);
        this.api.Swal_error("L'opération a echoué")
      }
      this.loading_get_details_edit_pays_form = false;
    }, (error: any) => {
      this.loading_get_details_edit_pays_form = false;
    })
  }
}
