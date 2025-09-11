
import { Component, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../../service/api/api.service';
import { CommonModule } from '@angular/common';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-add-avenant-projet',
  standalone: true, // Composant autonome
  imports: [CommonModule, ReactiveFormsModule], // Dépendances importées
  templateUrl: './add-avenant-projet.component.html',
  styleUrls: ['./add-avenant-projet.component.css']
})
export class AddAvenantProjetComponent {
  reactiveForm_add_avenant !: FormGroup;
  submitted: boolean = false
  loading_add_avenant: boolean = false
  @Output()
cb_after_add_avenant = new EventEmitter()
  form_details: any = {}
  loading_get_details_add_avenant_form = false
  is_partenaire = false;
  les_fichier_contrat: any[] = [];
  constructor(private formBuilder: FormBuilder, public api: ApiService, public activeModal: NgbActiveModal) { }

  ngOnInit(): void {
    this.get_details_add_avenant_form()
    this.init_form()
  }
  init_form() {
    this.reactiveForm_add_avenant = this.formBuilder.group({
      id_projet: [this.api.id_projet(), Validators.required],
      ordre_service: [this.api.format_current_date().jma3, Validators.required],
      date_fin: ["", Validators.required],
      // id_bailleur: ["", Validators.required],
      montant: ["", Validators.required],
      numero_contrat: ["", Validators.required],
      // pourcentage_avd: ["", Validators.required],
      // date_expiration_avd: ["", Validators.required],
      // numero_caution: ["", Validators.required],
      fichier_contrat: [""],
      id_etat_avenant: ["2", Validators.required],
      motif: [""],
    });
  }

  // acces facile au champs de votre formulaire
  get f(): any { return this.reactiveForm_add_avenant.controls; }
  // validation du formulaire
  onSubmit_add_avenant() {
    this.submitted = true;
    console.log(this.reactiveForm_add_avenant.value)
    // stop here if form is invalid
    if (this.reactiveForm_add_avenant.invalid) {
      return;
    }
    // var avenant = this.reactiveForm_add_avenant.value
    var avenant = this.format_with_form_data();
    // return;
    this.add_avenant(avenant)
  }
  // vider le formulaire
  onReset_add_avenant() {
    this.submitted = false;
    this.reactiveForm_add_avenant.reset();
  }
  add_avenant(avenant: any) {
    this.loading_add_avenant = true;
    this.api.taf_post("avenant/add_plus", avenant, (reponse: any) => {
      this.loading_add_avenant = false;
      if (reponse.status) {
         this.cb_after_add_avenant.emit({
          status: true,
          avenant: reponse.data
        })
        console.log("Opération effectuée avec succés sur la table avenant. Réponse= ", reponse);
        this.onReset_add_avenant()
        this.api.Swal_success("Opération éffectuée avec succés")
        this.activeModal.close(reponse)
      } else {
        console.log("L'opération sur la table avenant a échoué. Réponse= ", reponse);
        this.api.Swal_error("L'opération a echoué")
      }
    }, (error: any) => {
      this.loading_add_avenant = false;
    })
  }

  get_details_add_avenant_form() {
    this.loading_get_details_add_avenant_form = true;
    this.api.taf_post("avenant/get_form_details", {}, (reponse: any) => {
      if (reponse.status) {
        this.form_details = reponse.data
        console.log("Opération effectuée avec succés sur la table avenant. Réponse= ", reponse);
      } else {
        console.log("L'opération sur la table avenant a échoué. Réponse= ", reponse);
        this.api.Swal_error("L'opération a echoué")
      }
      this.loading_get_details_add_avenant_form = false;
    }, (error: any) => {
      this.loading_get_details_add_avenant_form = false;
    })
  }


  switch_is_partenaire() {
    this.is_partenaire = !this.is_partenaire;
    const id_partenaire = this.reactiveForm_add_avenant.get('id_partenaire');
    const pourcentage_partenaire = this.reactiveForm_add_avenant.get('pourcentage_partenaire');
    if (this.is_partenaire) {
      id_partenaire?.setValidators(Validators.required);
      pourcentage_partenaire?.setValidators(Validators.required);
    } else {
      id_partenaire?.removeValidators(Validators.required);
      pourcentage_partenaire?.removeValidators(Validators.required);
    }
    this.reactiveForm_add_avenant.updateValueAndValidity()
  }

  on_file_selected(event: any) {
    const files = event.target.files
    this.les_fichier_contrat = [];
    for (let i = 0; i < files.length; i++) {
      this.les_fichier_contrat.push(files[i]);
    }
    console.warn(this.les_fichier_contrat);
  }

  format_with_form_data() {
    let form_data = new FormData;
    const form_group = this.reactiveForm_add_avenant.value;

    for(let key in form_group){
      form_data.append(key,form_group[key]);
    }

    for(let one_fichier_contrat of this.les_fichier_contrat){
      form_data.append('les_fichier_contrat[]',one_fichier_contrat);
    }

    console.warn(form_data);
    return form_data;
  }
}
