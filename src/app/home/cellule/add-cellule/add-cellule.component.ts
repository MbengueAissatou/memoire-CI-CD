
import { Component, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../../service/api/api.service';
import { CommonModule } from '@angular/common';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-add-cellule',
  standalone: true, // Composant autonome
  imports: [CommonModule, ReactiveFormsModule], // Dépendances importées
  templateUrl: './add-cellule.component.html',
  styleUrls: ['./add-cellule.component.css']
})
export class AddCelluleComponent {
  reactiveForm_add_cellule !: FormGroup;
  submitted: boolean = false
  loading_add_cellule: boolean = false
  form_details: any = {}
  loading_get_details_add_cellule_form = false
  constructor(private formBuilder: FormBuilder, public api: ApiService, public activeModal: NgbActiveModal) { }

  ngOnInit(): void {
    this.get_details_add_cellule_form()
    this.init_form()
  }
  init_form() {
    this.reactiveForm_add_cellule = this.formBuilder.group({
      nom_cellule: ["", Validators.required],
      description: [""],
    });
  }

  // acces facile au champs de votre formulaire
  get f(): any { return this.reactiveForm_add_cellule.controls; }
  // validation du formulaire
  onSubmit_add_cellule() {
    this.submitted = true;
    console.log(this.reactiveForm_add_cellule.value)
    // stop here if form is invalid
    if (this.reactiveForm_add_cellule.invalid) {
      return;
    }
    var cellule = this.reactiveForm_add_cellule.value
    this.add_cellule(cellule)
  }
  // vider le formulaire
  onReset_add_cellule() {
    this.submitted = false;
    this.reactiveForm_add_cellule.reset();
  }
  add_cellule(cellule: any) {
    this.loading_add_cellule = true;
    this.api.taf_post("cellule/add", cellule, (reponse: any) => {
      this.loading_add_cellule = false;
      if (reponse.status) {
        console.log("Opération effectuée avec succés sur la table cellule. Réponse= ", reponse);
        this.onReset_add_cellule()
        this.api.Swal_success("Opération éffectuée avec succés")
        this.activeModal.close(reponse)
      } else {
        console.log("L'opération sur la table cellule a échoué. Réponse= ", reponse);
        this.api.Swal_error("L'opération a echoué")
      }
    }, (error: any) => {
      this.loading_add_cellule = false;
    })
  }

  get_details_add_cellule_form() {
    this.loading_get_details_add_cellule_form = true;
    this.api.taf_post("cellule/get_form_details", {}, (reponse: any) => {
      if (reponse.status) {
        this.form_details = reponse.data
        console.log("Opération effectuée avec succés sur la table cellule. Réponse= ", reponse);
      } else {
        console.log("L'opération sur la table cellule a échoué. Réponse= ", reponse);
        this.api.Swal_error("L'opération a echoué")
      }
      this.loading_get_details_add_cellule_form = false;
    }, (error: any) => {
      this.loading_get_details_add_cellule_form = false;
    })
  }
}
