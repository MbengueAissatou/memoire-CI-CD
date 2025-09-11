
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../../service/api/api.service';
import { CommonModule } from '@angular/common';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-edit-cellule',
  standalone: true, // Composant autonome
  imports: [CommonModule, ReactiveFormsModule], // Dépendances importées
  templateUrl: './edit-cellule.component.html',
  styleUrls: ['./edit-cellule.component.css']
})
export class EditCelluleComponent {
  reactiveForm_edit_cellule !: FormGroup;
  submitted: boolean = false
  loading_edit_cellule: boolean = false
  @Input()
  cellule_to_edit: any = {}
  form_details: any = {}
  loading_get_details_edit_cellule_form = false
  constructor(private formBuilder: FormBuilder, public api: ApiService, public activeModal: NgbActiveModal) {

  }
  ngOnInit(): void {
    this.get_details_edit_cellule_form()
    this.update_form(this.cellule_to_edit)
  }
  // mise à jour du formulaire
  update_form(cellule_to_edit: any) {
    this.reactiveForm_edit_cellule = this.formBuilder.group({
      nom_cellule: [cellule_to_edit.nom_cellule, Validators.required],
      description: [cellule_to_edit.description],
    });
  }

  // acces facile au champs de votre formulaire
  get f(): any { return this.reactiveForm_edit_cellule.controls; }
  // validation du formulaire
  onSubmit_edit_cellule() {
    this.submitted = true;
    console.log(this.reactiveForm_edit_cellule.value)
    // stop here if form is invalid
    if (this.reactiveForm_edit_cellule.invalid) {
      return;
    }
    var cellule = this.reactiveForm_edit_cellule.value
    this.edit_cellule({
      condition: JSON.stringify({ id_cellule: this.cellule_to_edit.id_cellule }),
      data: JSON.stringify(cellule)
    })
  }
  // vider le formulaire
  onReset_edit_cellule() {
    this.submitted = false;
    this.reactiveForm_edit_cellule.reset();
  }
  edit_cellule(cellule: any) {
    this.loading_edit_cellule = true;
    this.api.taf_post("cellule/edit", cellule, (reponse: any) => {
      if (reponse.status) {
        this.activeModal.close(reponse)
        console.log("Opération effectuée avec succés sur la table cellule. Réponse= ", reponse);
        //this.onReset_edit_cellule()
        this.api.Swal_success("Opération éffectuée avec succés")
      } else {
        console.log("L'opération sur la table cellule a échoué. Réponse= ", reponse);
        this.api.Swal_error("L'opération a echoué")
      }
      this.loading_edit_cellule = false;
    }, (error: any) => {
      this.loading_edit_cellule = false;
    })
  }
  get_details_edit_cellule_form() {
    this.loading_get_details_edit_cellule_form = true;
    this.api.taf_post("cellule/get_form_details", {}, (reponse: any) => {
      if (reponse.status) {
        this.form_details = reponse.data
        console.log("Opération effectuée avec succés sur la table cellule. Réponse= ", reponse);
      } else {
        console.log("L'opération sur la table cellule a échoué. Réponse= ", reponse);
        this.api.Swal_error("L'opération a echoué")
      }
      this.loading_get_details_edit_cellule_form = false;
    }, (error: any) => {
      this.loading_get_details_edit_cellule_form = false;
    })
  }
}
