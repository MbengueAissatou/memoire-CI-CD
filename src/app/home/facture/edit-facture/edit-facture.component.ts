
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../../service/api/api.service';
import { CommonModule } from '@angular/common';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-edit-facture',
  standalone: true, // Composant autonome
  imports: [CommonModule, ReactiveFormsModule], // Dépendances importées
  templateUrl: './edit-facture.component.html',
  styleUrls: ['./edit-facture.component.css']
})
export class EditFactureComponent {
  reactiveForm_edit_facture !: FormGroup;
  submitted: boolean = false
  loading_edit_facture: boolean = false
  @Input()
  facture_to_edit: any = {}
  form_details: any = {}
  loading_get_details_edit_facture_form = false
  les_avenants: any
  constructor(private formBuilder: FormBuilder, public api: ApiService, public activeModal: NgbActiveModal) {

  }
  ngOnInit(): void {
    this.get_details_edit_facture_form()
    this.update_form(this.facture_to_edit)
    this.les_avenants = this.api.les_avenants();
  }
  // mise à jour du formulaire
  update_form(facture_to_edit: any) {
    this.reactiveForm_edit_facture = this.formBuilder.group({
      id_projet: [{ disabled: true, value: facture_to_edit.id_projet }, Validators.required],
      id_avenant: [facture_to_edit.id_avenant, Validators.required],
      objet: [facture_to_edit.objet],
      numero_facture: [facture_to_edit.numero_facture, Validators.required],
      montant_decompte: [facture_to_edit.montant_decompte, Validators.required],
      montant_encaisse: [facture_to_edit.montant_encaisse],
      date_emission: [facture_to_edit.date_emission, Validators.required],
      id_statut_facture: [facture_to_edit.id_statut_facture, Validators.required],
    });
  }

  // acces facile au champs de votre formulaire
  get f(): any { return this.reactiveForm_edit_facture.controls; }
  // validation du formulaire
  onSubmit_edit_facture() {
    this.submitted = true;
    console.log(this.reactiveForm_edit_facture.value)
    // stop here if form is invalid
    if (this.reactiveForm_edit_facture.invalid) {
      return;
    }
    var facture = this.reactiveForm_edit_facture.value
    this.edit_facture({
      condition: { id_facture: this.facture_to_edit.id_facture },
      data: facture
    })
  }
  // vider le formulaire
  onReset_edit_facture() {
    this.submitted = false;
    this.reactiveForm_edit_facture.reset();
  }
  edit_facture(facture: any) {
    this.loading_edit_facture = true;
    this.api.taf_post("facture/edit", facture, (reponse: any) => {
      if (reponse.status) {
        this.activeModal.close(reponse)
        console.log("Opération effectuée avec succés sur la table facture. Réponse= ", reponse);
        //this.onReset_edit_facture()
        this.api.Swal_success("Opération éffectuée avec succés")
      } else {
        console.log("L'opération sur la table facture a échoué. Réponse= ", reponse);
        this.api.Swal_error("L'opération a echoué")
      }
      this.loading_edit_facture = false;
    }, (error: any) => {
      this.loading_edit_facture = false;
    })
  }
  get_details_edit_facture_form() {
    this.loading_get_details_edit_facture_form = true;
    this.api.taf_post("facture/get_form_details", {}, (reponse: any) => {
      if (reponse.status) {
        this.form_details = reponse.data
        console.log("Opération effectuée avec succés sur la table facture. Réponse= ", reponse);
      } else {
        console.log("L'opération sur la table facture a échoué. Réponse= ", reponse);
        this.api.Swal_error("L'opération a echoué")
      }
      this.loading_get_details_edit_facture_form = false;
    }, (error: any) => {
      this.loading_get_details_edit_facture_form = false;
    })
  }
  onInputMontant(field: string, event: Event): void {
  const input = event.target as HTMLInputElement;
  this.updateMontant(field, input.value);
}

  formatNumber(value: any): string {
    if (!value) return '';
    const numericValue = value.toString().replace(/\s+/g, ''); // remove spaces
    return Number(numericValue).toLocaleString('fr-FR'); // add space as thousand separator
  }

 updateMontant(field: string, inputValue: string): void {
  const numericValue = inputValue.replace(/\s+/g, ''); // Enlève les espaces
  if (!/^\d*$/.test(numericValue)) return; // Ignore les caractères non numériques
  const number = parseInt(numericValue, 10);
  if (!isNaN(number)) {
    this.reactiveForm_edit_facture.get(field)?.setValue(number);
  }
}
}
