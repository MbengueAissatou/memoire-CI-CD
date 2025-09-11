
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule, FormArray } from '@angular/forms';
import { ApiService } from '../../../service/api/api.service';
import { CommonModule } from '@angular/common';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-edit-projet',
  standalone: true, // Composant autonome
  imports: [CommonModule, ReactiveFormsModule], // Dépendances importées
  templateUrl: './edit-projet.component.html',
  styleUrls: ['./edit-projet.component.css']
})
export class EditProjetComponent {
  reactiveForm_edit_projet !: FormGroup;
  submitted: boolean = false
  loading_edit_projet: boolean = false
  @Input()
  projet_to_edit: any = {}
  form_details: any = {}
  loading_get_details_edit_projet_form = false
  les_types_remuneration: any = ['forfaitaire', 'au temps passé'];
  constructor(private formBuilder: FormBuilder, public api: ApiService, public activeModal: NgbActiveModal) {

  }
  ngOnInit(): void {
    this.get_details_edit_projet_form()
    this.update_form(this.projet_to_edit)
  }
  // mise à jour du formulaire
  update_form(projet_to_edit: any) {
    this.reactiveForm_edit_projet = this.formBuilder.group({
      id_utilisateur: [projet_to_edit.id_utilisateur, Validators.required],
      id_cellule: [projet_to_edit.id_cellule, Validators.required],
      id_client: [projet_to_edit.id_client, Validators.required],
      id_etat_projet: [projet_to_edit.id_etat_projet, Validators.required],
      nom: [projet_to_edit.nom, Validators.required],
      code_projet: [projet_to_edit.code_projet, Validators.required],
      delais_reglement_facture: [projet_to_edit.delais_reglement_facture, Validators.required],
      condition_facture: [projet_to_edit.condition_facture, Validators.required],
      type_remuneration: [projet_to_edit.type_remuneration, Validators.required],


      // partenaire
      les_partenaires: this.formBuilder.array(
        this.projet_to_edit.les_partenaires.map((one: any) => {
          return this.createForm(one);
        })
      ),
    });
  }

  createForm(one_partenaire?:any): FormGroup {
    return this.formBuilder.group({
      id_partenaire: [one_partenaire?.id_partenaire||"", Validators.required],
      pourcentage_partenaire: [one_partenaire?.pourcentage_partenaire||"", [Validators.required, Validators.pattern(/^\d+$/)]],
    });
  }

  // Ajouter un nouveau formulaire de matière première au tableau
  onAddForm() {
    (this.f.les_partenaires as FormArray).push(this.createForm());
  }

  // Supprimer un formulaire de matière première du tableau
  onRemoveForm(index: number) {
    (this.f.les_partenaires as FormArray).removeAt(index);
    this.reactiveForm_edit_projet.markAsDirty();
  }

  // acces facile au champs de votre formulaire
  get f(): any { return this.reactiveForm_edit_projet.controls; }
  // validation du formulaire
  onSubmit_edit_projet() {
    this.submitted = true;
    console.log(this.reactiveForm_edit_projet.value)
    // stop here if form is invalid
    if (this.reactiveForm_edit_projet.invalid) {
      return;
    }
    var projet = this.reactiveForm_edit_projet.value
    this.edit_projet({
      condition: { id_projet: this.projet_to_edit.id_projet },
      data: projet
    })
  }
  // vider le formulaire
  onReset_edit_projet() {
    this.submitted = false;
    this.reactiveForm_edit_projet.reset();
  }
  edit_projet(projet: any) {
    this.loading_edit_projet = true;
    this.api.taf_post("projet/edit", projet, (reponse: any) => {
      if (reponse.status) {
        this.activeModal.close(reponse)
        console.log("Opération effectuée avec succés sur la table projet. Réponse= ", reponse);
        //this.onReset_edit_projet()
        this.api.Swal_success("Opération éffectuée avec succés")
      } else {
        console.log("L'opération sur la table projet a échoué. Réponse= ", reponse);
        this.api.Swal_error("L'opération a echoué")
      }
      this.loading_edit_projet = false;
    }, (error: any) => {
      this.loading_edit_projet = false;
    })
  }
  get_details_edit_projet_form() {
    this.loading_get_details_edit_projet_form = true;
    this.api.taf_post("projet/get_form_details", {}, (reponse: any) => {
      if (reponse.status) {
        this.form_details = reponse.data
        console.log("Opération effectuée avec succés sur la table projet. Réponse= ", reponse);
      } else {
        console.log("L'opération sur la table projet a échoué. Réponse= ", reponse);
        this.api.Swal_error("L'opération a echoué")
      }
      this.loading_get_details_edit_projet_form = false;
    }, (error: any) => {
      this.loading_get_details_edit_projet_form = false;
    })
  }
}
