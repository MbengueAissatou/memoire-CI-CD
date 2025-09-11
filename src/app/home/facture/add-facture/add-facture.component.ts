
import { Component, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../../service/api/api.service';
import { CommonModule } from '@angular/common';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-add-facture',
  standalone: true, // Composant autonome
  imports: [CommonModule, ReactiveFormsModule], // Dépendances importées
  templateUrl: './add-facture.component.html',
  styleUrls: ['./add-facture.component.css']
})
export class AddFactureComponent {
  reactiveForm_add_facture !: FormGroup;
  submitted: boolean = false
  loading_add_facture: boolean = false
  form_details: any = {}
  loading_get_details_add_facture_form = false
  les_avenants: any;
  montant_a_facturer:any;
  constructor(private formBuilder: FormBuilder, public api: ApiService, public activeModal: NgbActiveModal) { }

  ngOnInit(): void {
    this.get_details_add_facture_form()
    this.init_form()
    this.les_avenants = this.api.les_avenants();
  }
  init_form() {
    this.reactiveForm_add_facture = this.formBuilder.group({
      id_projet: [{ disabled: true, value: this.api.id_projet() }, Validators.required],
      id_avenant: ["", Validators.required],
      objet: [""],
      numero_facture: ["", Validators.required],
      montant_decompte: ["", Validators.required],
      date_emission: [this.api.format_current_date().jma3, Validators.required],
      id_statut_facture: ["", Validators.required],
      montant_encaisse: [""],
      // date_previsionnelle_prochaine_facture: [""],
      // montant_encaisse: [""],
      // action_recouvrement: [""],
      // commentaire: [""],
    });
  }

  // acces facile au champs de votre formulaire
  get f(): any { return this.reactiveForm_add_facture.controls; }
  // validation du formulaire
  onSubmit_add_facture() {
    this.submitted = true;
    console.log(this.reactiveForm_add_facture.value)
    // stop here if form is invalid
    if (this.reactiveForm_add_facture.invalid) {
      return;
    }
    var facture = this.reactiveForm_add_facture.getRawValue()
    this.add_facture(facture)
  }
  // vider le formulaire
  onReset_add_facture() {
    this.submitted = false;
    this.reactiveForm_add_facture.reset();
  }
  add_facture(facture: any) {
    this.loading_add_facture = true;
    this.api.taf_post("facture/add", facture, (reponse: any) => {
      this.loading_add_facture = false;
      if (reponse.status) {
        console.log("Opération effectuée avec succés sur la table facture. Réponse= ", reponse);
        this.onReset_add_facture()
        this.api.Swal_success("Opération éffectuée avec succés")
        this.activeModal.close(reponse)
      } else {
        console.log("L'opération sur la table facture a échoué. Réponse= ", reponse);
        this.api.Swal_error("L'opération a echoué")
      }
    }, (error: any) => {
      this.loading_add_facture = false;
    })
  }

  get_details_add_facture_form() {
    this.loading_get_details_add_facture_form = true;
    this.api.taf_post("facture/get_form_details", {}, (reponse: any) => {
      if (reponse.status) {
        this.form_details = reponse.data
        console.log("Opération effectuée avec succés sur la table facture. Réponse= ", reponse);
      } else {
        console.log("L'opération sur la table facture a échoué. Réponse= ", reponse);
        this.api.Swal_error("L'opération a echoué")
      }
      this.loading_get_details_add_facture_form = false;
    }, (error: any) => {
      this.loading_get_details_add_facture_form = false;
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
      this.reactiveForm_add_facture.get(field)?.setValue(number);
    }
  }

  selected_avenant(id: any) {
    let data = this.api.les_avenant_factures().filter((one: any) => one.id_avenant == id && one.id_statut_facture==5);
    let deja_vu: any = [];
    let montant={
      cumul_montant:0,
      montant_total:0
    }
    data.map((one: any) => {
      montant.cumul_montant += +one.montant_decompte;
      montant.montant_total += (deja_vu.find((one_deja: any) => one_deja.id_avenant == one.id_avenant)) ? 0 : +one.montant;
      deja_vu.push(one);
    });
    this.montant_a_facturer= +montant.montant_total- +montant.cumul_montant;
    console.warn(this.montant_a_facturer);

  }

}
